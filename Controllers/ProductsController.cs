using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TreMoc.Data;
using TreMoc.Models;

namespace TreMoc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly TreMocDbContext _context;
        private readonly IConfiguration _configuration;

        public ProductsController(TreMocDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
            public string[]? Images { get; set; }
            public string ImpactPlastic { get; set; } = string.Empty;
            public string ImpactCo2 { get; set; } = string.Empty;
            public string ImpactWater { get; set; } = string.Empty;
            public int StockQuantity { get; set; }
        }

        // Endpoint upload ảnh sản phẩm lên Supabase Storage
        [HttpPost("upload")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Manager")]
        public async Task<IActionResult> UploadImages([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest(new { message = "Vui lòng chọn ít nhất một ảnh." });

            var supabaseUrl = _configuration["Supabase:Url"] ?? "https://vinluzimbeiotfjypkuk.supabase.co";
            var supabaseApiKey = _configuration["Supabase:ApiKey"];

            if (string.IsNullOrEmpty(supabaseApiKey))
            {
                return BadRequest(new { message = "Chưa cấu hình API Key của Supabase (Supabase:ApiKey) trong appsettings.json." });
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var maxFileSize = 5 * 1024 * 1024; // 5MB
            var uploadedUrls = new List<string>();

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {supabaseApiKey}");
            client.DefaultRequestHeaders.Add("apikey", supabaseApiKey);

            foreach (var file in files)
            {
                if (file.Length == 0)
                    continue;

                if (file.Length > maxFileSize)
                    return BadRequest(new { message = $"Ảnh '{file.FileName}' vượt quá dung lượng cho phép (5MB)." });

                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(ext))
                    return BadRequest(new { message = $"Định dạng ảnh '{ext}' không được hỗ trợ. Chỉ chấp nhận: jpg, png, webp, gif." });

                // Tạo tên file unique để tránh trùng
                var uniqueFileName = $"{Guid.NewGuid():N}{ext}";

                // Endpoint upload của Supabase Storage: POST /storage/v1/object/{bucket}/{path}
                var requestUrl = $"{supabaseUrl}/storage/v1/object/products/{uniqueFileName}";

                try
                {
                    using var content = new StreamContent(file.OpenReadStream());
                    content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

                    var response = await client.PostAsync(requestUrl, content);
                    if (response.IsSuccessStatusCode)
                    {
                        // Link ảnh công khai để xem từ mọi nơi
                        var publicUrl = $"{supabaseUrl}/storage/v1/object/public/products/{uniqueFileName}";
                        uploadedUrls.Add(publicUrl);
                    }
                    else
                    {
                        var errorMsg = await response.Content.ReadAsStringAsync();
                        return StatusCode(500, new { message = $"Lỗi khi upload ảnh '{file.FileName}' lên Supabase.", details = errorMsg });
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = $"Lỗi kết nối khi upload ảnh '{file.FileName}' lên Supabase.", details = ex.Message });
                }
            }

            return Ok(new { urls = uploadedUrls });
        }

        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Manager")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name)) return BadRequest(new { message = "Tên sản phẩm không được trống." });

            var defaultImage = string.IsNullOrWhiteSpace(request.Image) ? "/images/bamboo_cups.png" : request.Image;
            var images = (request.Images != null && request.Images.Length > 0)
                ? request.Images
                : new[] { defaultImage };

            var p = new Product
            {
                Name = request.Name,
                Category = request.Category,
                Price = request.Price,
                Description = request.Description,
                Image = defaultImage,
                ImagesJson = System.Text.Json.JsonSerializer.Serialize(images),
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

            // Chỉ cập nhật ảnh khi có ảnh mới được gửi lên
            if (!string.IsNullOrWhiteSpace(request.Image))
            {
                p.Image = request.Image;
                // Nếu có gửi kèm danh sách ảnh phụ thì dùng, nếu không giữ nguyên ảnh chính
                if (request.Images != null && request.Images.Length > 0)
                {
                    p.ImagesJson = System.Text.Json.JsonSerializer.Serialize(request.Images);
                }
                else
                {
                    // Nếu không gửi ảnh phụ và ảnh chính khác ảnh cũ, cập nhật ảnh đầu tiên trong gallery
                    var existingImages = p.Images;
                    if (existingImages.Length > 0)
                    {
                        existingImages[0] = request.Image;
                        p.Images = existingImages;
                    }
                    else
                    {
                        p.ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { request.Image });
                    }
                }
            }

            p.ImpactPlastic = request.ImpactPlastic;
            p.ImpactCo2 = request.ImpactCo2;
            p.ImpactWater = request.ImpactWater;
            p.StockQuantity = request.StockQuantity;

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
