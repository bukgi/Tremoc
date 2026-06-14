using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TreMoc.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Image = table.Column<string>(type: "TEXT", nullable: false),
                    ImagesJson = table.Column<string>(type: "TEXT", nullable: false),
                    ImpactPlastic = table.Column<string>(type: "TEXT", nullable: false),
                    ImpactCo2 = table.Column<string>(type: "TEXT", nullable: false),
                    ImpactWater = table.Column<string>(type: "TEXT", nullable: false),
                    InStock = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Phone = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "TEXT", nullable: false),
                    ShippingFee = table.Column<decimal>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    ShippingProvince = table.Column<string>(type: "TEXT", nullable: false),
                    ShippingAddress = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "Description", "Image", "ImagesJson", "ImpactCo2", "ImpactPlastic", "ImpactWater", "InStock", "Name", "Price" },
                values: new object[,]
                {
                    { 1, "Đồ gia dụng", "Khay trà tre tự nhiên, thiết kế tối giản, chế tác thủ công từ tre già 5 năm tuổi. Kích thước 30x20x3cm, phù hợp cho bàn trà gia đình.", "/images/bamboo_tea_tray.png", "[\"/images/bamboo_tea_tray.png\",\"/images/bamboo_cups.png\",\"/images/bamboo_organizer.png\"]", "25g", "50g", "100ml", true, "Khay Trà Tre", 280000m },
                    { 2, "Đồ gia dụng", "Bộ 4 cốc tre thủ công, mỗi chiếc đều là tác phẩm độc đáo. Dung tích 250ml, an toàn cho sức khỏe.", "/images/bamboo_cups.png", "[\"/images/bamboo_cups.png\",\"/images/bamboo_tea_tray.png\",\"/images/bamboo_cutting_board.png\"]", "40g", "80g", "200ml", true, "Bộ Cốc Tre", 195000m },
                    { 3, "Trang trí", "Hộp đựng bút và văn phòng phẩm từ tre, thiết kế gọn gàng nhiều ngăn, phù hợp bàn làm việc hiện đại.", "/images/bamboo_organizer.png", "[\"/images/bamboo_organizer.png\",\"/images/bamboo_lamp.png\",\"/images/bamboo_tea_tray.png\"]", "15g", "30g", "50ml", true, "Hộp Đựng Bút Tre", 150000m },
                    { 4, "Trang trí", "Đèn trang trí đan từ tre thủ công, tạo ánh sáng ấm áp và không gian thư giãn. Đường kính 25cm.", "/images/bamboo_lamp.png", "[\"/images/bamboo_lamp.png\",\"/images/bamboo_organizer.png\",\"/images/bamboo_tea_tray.png\"]", "60g", "120g", "300ml", true, "Đèn Tre Trang Trí", 420000m },
                    { 5, "Nhà bếp", "Thớt tre dày 2cm, vân gỗ tự nhiên đẹp mắt, kháng khuẩn tự nhiên. Kích thước 35x25cm.", "/images/bamboo_cutting_board.png", "[\"/images/bamboo_cutting_board.png\",\"/images/bamboo_cups.png\",\"/images/bamboo_tea_tray.png\"]", "100g", "200g", "500ml", true, "Thớt Tre Cao Cấp", 220000m },
                    { 6, "Phòng tắm", "Bàn chải đánh răng từ tre tự nhiên, lông chải mềm mại, phân hủy sinh học 100%. Bộ 4 chiếc.", "/images/bamboo_toothbrush.png", "[\"/images/bamboo_toothbrush.png\",\"/images/bamboo_cups.png\",\"/images/bamboo_organizer.png\"]", "8g", "15g", "30ml", true, "Bàn Chải Tre", 45000m },
                    { 7, "Trang trí", "Giỏ tre đan thủ công hoa văn tinh xảo, dùng để trang trí hoặc đựng đồ. Đường kính 30cm.", "/images/bamboo_lamp.png", "[\"/images/bamboo_lamp.png\",\"/images/bamboo_organizer.png\",\"/images/bamboo_cups.png\"]", "45g", "90g", "150ml", true, "Giỏ Tre Đan", 350000m },
                    { 8, "Nhà bếp", "Bộ 10 đôi đũa tre tự nhiên, đầu nhọn chống trượt, an toàn vệ sinh thực phẩm.", "/images/bamboo_cutting_board.png", "[\"/images/bamboo_cutting_board.png\",\"/images/bamboo_tea_tray.png\",\"/images/bamboo_cups.png\"]", "12g", "25g", "40ml", true, "Bộ Đũa Tre", 85000m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
