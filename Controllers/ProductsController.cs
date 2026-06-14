using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TreMoc.Data;
using TreMoc.Models;

namespace TreMoc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly TreMocDbContext _context;

        public ProductsController(TreMocDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            
            var result = products.Select(p => new
            {
                id = p.Id,
                name = p.Name,
                category = p.Category,
                price = p.Price,
                description = p.Description,
                image = p.Image,
                images = p.Images,
                impact = new { plastic = p.ImpactPlastic, co2 = p.ImpactCo2, water = p.ImpactWater },
                stockQuantity = p.StockQuantity,
                inStock = p.InStock
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var p = await _context.Products.FindAsync(id);
            if (p == null) return NotFound();

            var result = new
            {
                id = p.Id,
                name = p.Name,
                category = p.Category,
                price = p.Price,
                description = p.Description,
                image = p.Image,
                images = p.Images,
                impact = new { plastic = p.ImpactPlastic, co2 = p.ImpactCo2, water = p.ImpactWater },
                stockQuantity = p.StockQuantity,
                inStock = p.InStock
            };

            return Ok(result);
        }

        public class UpdateStockRequest
        {
            public int StockQuantity { get; set; }
        }

        [HttpPut("{id}/stock")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] UpdateStockRequest request)
        {
            var p = await _context.Products.FindAsync(id);
            if (p == null) return NotFound();

            p.StockQuantity = request.StockQuantity;
            _context.Entry(p).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật kho hàng thành công.", stockQuantity = p.StockQuantity });
        }

        public class CreateProductRequest
        {
            public string Name { get; set; } = string.Empty;
            public string Category { get; set; } = string.Empty;
            public decimal Price { get; set; }
            public string Description { get; set; } = string.Empty;
            public string Image { get; set; } = string.Empty;
            public string ImpactPlastic { get; set; } = string.Empty;
            public string ImpactCo2 { get; set; } = string.Empty;
            public string ImpactWater { get; set; } = string.Empty;
            public int StockQuantity { get; set; }
        }

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Manager")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name)) return BadRequest(new { message = "Tên sản phẩm không được trống." });

            var p = new Product
            {
                Name = request.Name,
                Category = request.Category,
                Price = request.Price,
                Description = request.Description,
                Image = string.IsNullOrWhiteSpace(request.Image) ? "/images/bamboo_cups.png" : request.Image,
                ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { string.IsNullOrWhiteSpace(request.Image) ? "/images/bamboo_cups.png" : request.Image }),
                ImpactPlastic = request.ImpactPlastic,
                ImpactCo2 = request.ImpactCo2,
                ImpactWater = request.ImpactWater,
                StockQuantity = request.StockQuantity
            };

            _context.Products.Add(p);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = p.Id }, p);
        }

        [HttpPut("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] CreateProductRequest request)
        {
            var p = await _context.Products.FindAsync(id);
            if (p == null) return NotFound();

            if (string.IsNullOrWhiteSpace(request.Name)) return BadRequest(new { message = "Tên sản phẩm không được trống." });

            p.Name = request.Name;
            p.Category = request.Category;
            p.Price = request.Price;
            p.Description = request.Description;
            if (!string.IsNullOrWhiteSpace(request.Image))
            {
                p.Image = request.Image;
                p.ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { request.Image });
            }
            p.ImpactPlastic = request.ImpactPlastic;
            p.ImpactCo2 = request.ImpactCo2;
            p.ImpactWater = request.ImpactWater;
            p.StockQuantity = request.StockQuantity;

            _context.Entry(p).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật sản phẩm thành công.", product = p });
        }

        [HttpDelete("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var p = await _context.Products.FindAsync(id);
            if (p == null) return NotFound();

            _context.Products.Remove(p);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa sản phẩm thành công." });
        }
    }
}
