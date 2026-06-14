using Microsoft.EntityFrameworkCore;
using TreMoc.Models;

namespace TreMoc.Data
{
    public class TreMocDbContext : DbContext
    {
        public TreMocDbContext(DbContextOptions<TreMocDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Order -> User relationship
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId);

            // Configure OrderItem -> Order, Product relationships
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId);

            // Seed Data for Products
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Name = "Khay Trà Tre",
                    Category = "Đồ gia dụng",
                    Price = 280000,
                    Description = "Khay trà tre tự nhiên, thiết kế tối giản, chế tác thủ công từ tre già 5 năm tuổi. Kích thước 30x20x3cm, phù hợp cho bàn trà gia đình.",
                    Image = "/images/bamboo_tea_tray.png",
                    ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { "/images/bamboo_tea_tray.png", "/images/bamboo_cups.png", "/images/bamboo_organizer.png" }),
                    ImpactPlastic = "50g",
                    ImpactCo2 = "25g",
                    ImpactWater = "100ml",
                    StockQuantity = 10
                },
                new Product
                {
                    Id = 2,
                    Name = "Bộ Cốc Tre",
                    Category = "Đồ gia dụng",
                    Price = 195000,
                    Description = "Bộ 4 cốc tre thủ công, mỗi chiếc đều là tác phẩm độc đáo. Dung tích 250ml, an toàn cho sức khỏe.",
                    Image = "/images/bamboo_cups.png",
                    ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { "/images/bamboo_cups.png", "/images/bamboo_tea_tray.png", "/images/bamboo_cutting_board.png" }),
                    ImpactPlastic = "80g",
                    ImpactCo2 = "40g",
                    ImpactWater = "200ml",
                    StockQuantity = 15
                },
                new Product
                {
                    Id = 3,
                    Name = "Hộp Đựng Bút Tre",
                    Category = "Trang trí",
                    Price = 150000,
                    Description = "Hộp đựng bút và văn phòng phẩm từ tre, thiết kế gọn gàng nhiều ngăn, phù hợp bàn làm việc hiện đại.",
                    Image = "/images/bamboo_organizer.png",
                    ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { "/images/bamboo_organizer.png", "/images/bamboo_lamp.png", "/images/bamboo_tea_tray.png" }),
                    ImpactPlastic = "30g",
                    ImpactCo2 = "15g",
                    ImpactWater = "50ml",
                    StockQuantity = 8
                },
                new Product
                {
                    Id = 4,
                    Name = "Đèn Tre Trang Trí",
                    Category = "Trang trí",
                    Price = 420000,
                    Description = "Đèn trang trí đan từ tre thủ công, tạo ánh sáng ấm áp và không gian thư giãn. Đường kính 25cm.",
                    Image = "/images/bamboo_lamp.png",
                    ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { "/images/bamboo_lamp.png", "/images/bamboo_organizer.png", "/images/bamboo_tea_tray.png" }),
                    ImpactPlastic = "120g",
                    ImpactCo2 = "60g",
                    ImpactWater = "300ml",
                    StockQuantity = 1
                },
                new Product
                {
                    Id = 5,
                    Name = "Thớt Tre Cao Cấp",
                    Category = "Nhà bếp",
                    Price = 220000,
                    Description = "Thớt tre dày 2cm, vân gỗ tự nhiên đẹp mắt, kháng khuẩn tự nhiên. Kích thước 35x25cm.",
                    Image = "/images/bamboo_cutting_board.png",
                    ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { "/images/bamboo_cutting_board.png", "/images/bamboo_cups.png", "/images/bamboo_tea_tray.png" }),
                    ImpactPlastic = "200g",
                    ImpactCo2 = "100g",
                    ImpactWater = "500ml",
                    StockQuantity = 12
                },
                new Product
                {
                    Id = 6,
                    Name = "Bàn Chải Tre",
                    Category = "Phòng tắm",
                    Price = 45000,
                    Description = "Bàn chải đánh răng từ tre tự nhiên, lông chải mềm mại, phân hủy sinh học 100%. Bộ 4 chiếc.",
                    Image = "/images/bamboo_toothbrush.png",
                    ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { "/images/bamboo_toothbrush.png", "/images/bamboo_cups.png", "/images/bamboo_organizer.png" }),
                    ImpactPlastic = "15g",
                    ImpactCo2 = "8g",
                    ImpactWater = "30ml",
                    StockQuantity = 25
                },
                new Product
                {
                    Id = 7,
                    Name = "Giỏ Tre Đan",
                    Category = "Trang trí",
                    Price = 350000,
                    Description = "Giỏ tre đan thủ công hoa văn tinh xảo, dùng để trang trí hoặc đựng đồ. Đường kính 30cm.",
                    Image = "/images/bamboo_lamp.png",
                    ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { "/images/bamboo_lamp.png", "/images/bamboo_organizer.png", "/images/bamboo_cups.png" }),
                    ImpactPlastic = "90g",
                    ImpactCo2 = "45g",
                    ImpactWater = "150ml",
                    StockQuantity = 5
                },
                new Product
                {
                    Id = 8,
                    Name = "Bộ Đũa Tre",
                    Category = "Nhà bếp",
                    Price = 85000,
                    Description = "Bộ 10 đôi đũa tre tự nhiên, đầu nhọn chống trượt, an toàn vệ sinh thực phẩm.",
                    Image = "/images/bamboo_cutting_board.png",
                    ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] { "/images/bamboo_cutting_board.png", "/images/bamboo_tea_tray.png", "/images/bamboo_cups.png" }),
                    ImpactPlastic = "25g",
                    ImpactCo2 = "12g",
                    ImpactWater = "40ml",
                    StockQuantity = 20
                }
            );
        }
    }
}
