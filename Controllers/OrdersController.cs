using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TreMoc.Data;
using TreMoc.Models;

namespace TreMoc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly TreMocDbContext _context;

        public OrdersController(TreMocDbContext context)
        {
            _context = context;
        }

        public class OrderItemRequest
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal Price { get; set; }
        }

        public class CreateOrderRequest
        {
            public decimal Subtotal { get; set; }
            public decimal ShippingFee { get; set; }
            public string Province { get; set; } = string.Empty;
            public List<OrderItemRequest> Items { get; set; } = new();
        }

        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            if (!UserClaimsHelper.TryGetUserId(User, out int userId))
            {
                return Unauthorized();
            }

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var result = orders.Select(o => new
            {
                id = o.Id,
                date = o.OrderDate,
                total = o.TotalAmount,
                status = o.Status,
                shippingProvince = o.ShippingProvince,
                items = o.OrderItems.Select(oi => new {
                    name = oi.Product?.Name,
                    image = oi.Product?.Image,
                    quantity = oi.Quantity,
                    price = oi.UnitPrice
                })
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            if (!UserClaimsHelper.TryGetUserId(User, out int userId))
            {
                return Unauthorized();
            }

            if (request.Items == null || request.Items.Count == 0)
            {
                return BadRequest(new { message = "Đơn hàng không có sản phẩm nào." });
            }

            // Dùng transaction để đảm bảo tính toàn vẹn dữ liệu
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Kiểm tra và trừ tồn kho từng sản phẩm một cách atomic
                // Tránh race condition: dùng UPDATE với WHERE StockQuantity >= quantity
                foreach (var item in request.Items)
                {
                    // Atomic update: chỉ trừ khi còn đủ hàng
                    var rowsAffected = await _context.Database.ExecuteSqlRawAsync(
                        "UPDATE Products SET StockQuantity = StockQuantity - {0} WHERE Id = {1} AND StockQuantity >= {0}",
                        item.Quantity, item.ProductId
                    );

                    if (rowsAffected == 0)
                    {
                        // Không đủ hàng hoặc sản phẩm không tồn tại
                        await transaction.RollbackAsync();
                        var product = await _context.Products.FindAsync(item.ProductId);
                        var productName = product?.Name ?? $"Sản phẩm #{item.ProductId}";
                        var currentStock = product?.StockQuantity ?? 0;

                        return Conflict(new
                        {
                            message = currentStock == 0
                                ? $"Sản phẩm \"{productName}\" đã hết hàng."
                                : $"Sản phẩm \"{productName}\" chỉ còn {currentStock} sản phẩm, không đủ số lượng yêu cầu ({item.Quantity}).",
                            productId = item.ProductId,
                            availableStock = currentStock
                        });
                    }
                }

                // Tạo đơn hàng sau khi đã trừ stock thành công
                var order = new Order
                {
                    UserId = userId,
                    TotalAmount = request.Subtotal + request.ShippingFee,
                    ShippingFee = request.ShippingFee,
                    ShippingProvince = request.Province,
                    Status = "Pending",
                    OrderDate = DateTime.UtcNow
                };

                foreach (var item in request.Items)
                {
                    order.OrderItems.Add(new OrderItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.Price
                    });
                }

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Đặt hàng thành công", orderId = order.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi server khi đặt hàng. Vui lòng thử lại.", detail = ex.Message });
            }
        }

        [HttpGet("all")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var result = orders.Select(o => new
            {
                id = o.Id,
                date = o.OrderDate,
                total = o.TotalAmount,
                status = o.Status,
                shippingProvince = o.ShippingProvince,
                customerName = o.User?.Name ?? "Khách vãng lai",
                customerEmail = o.User?.Email ?? "N/A",
                items = o.OrderItems.Select(oi => new {
                    name = oi.Product?.Name,
                    image = oi.Product?.Image,
                    quantity = oi.Quantity,
                    price = oi.UnitPrice
                })
            });

            return Ok(result);
        }

        public class UpdateStatusRequest
        {
            public string Status { get; set; } = string.Empty;
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng." });
            }

            var allowedStatuses = new List<string> { "Pending", "Processing", "Shipping", "Completed", "Cancelled" };
            if (!allowedStatuses.Contains(request.Status))
            {
                return BadRequest(new { message = "Trạng thái đơn hàng không hợp lệ." });
            }

            order.Status = request.Status;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật trạng thái đơn hàng thành công.", status = order.Status });
        }
    }
}
