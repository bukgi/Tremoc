using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreMoc.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Description { get; set; } = string.Empty;

        public string Image { get; set; } = string.Empty;

        // Store images array as JSON string
        public string ImagesJson { get; set; } = "[]";

        // Not mapped to DB directly, parsed from JSON
        [NotMapped]
        public string[] Images
        {
            get => string.IsNullOrEmpty(ImagesJson) ? new string[0] : System.Text.Json.JsonSerializer.Deserialize<string[]>(ImagesJson) ?? new string[0];
            set => ImagesJson = System.Text.Json.JsonSerializer.Serialize(value);
        }

        public string ImpactPlastic { get; set; } = string.Empty;
        public string ImpactCo2 { get; set; } = string.Empty;
        public string ImpactWater { get; set; } = string.Empty;

        // Số lượng tồn kho
        public int StockQuantity { get; set; } = 0;

        // InStock được tính tự động từ StockQuantity (không lưu DB)
        [NotMapped]
        public bool InStock => StockQuantity > 0;
    }
}
