using System.ComponentModel.DataAnnotations;

namespace TreMoc.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        public User? User { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public decimal TotalAmount { get; set; }

        public decimal ShippingFee { get; set; }

        public string Status { get; set; } = "Pending";

        public string ShippingProvince { get; set; } = string.Empty;
        
        public string ShippingAddress { get; set; } = string.Empty;

        public List<OrderItem> OrderItems { get; set; } = new();
    }
}
