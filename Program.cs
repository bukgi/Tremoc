using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TreMoc.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// 1. Database Context
builder.Services.AddDbContext<TreMocDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. JWT Settings (hỗ trợ override bằng biến môi trường)
var jwtKey = builder.Configuration["JwtSettings:Key"] ?? "ThisIsASecretKeyForTreMocApplicationWhichNeedsToBeAtLeast32BytesLong!";
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "TreMocApp";
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "TreMocUsers";

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// 3. Authentication & Authorization
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

// 4. CORS (cấu hình qua appsettings.json hoặc biến môi trường Cors__Origins)
var corsOrigins = builder.Configuration["Cors:Origins"] ?? "http://localhost:5173";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactFrontend",
        policy =>
        {
            policy.WithOrigins(corsOrigins.Split(';', StringSplitOptions.RemoveEmptyEntries))
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // Chỉ redirect HTTPS ở production (development dùng Vite proxy qua HTTP)
    app.UseHttpsRedirection();
}

// Serve uploaded images from wwwroot
app.UseStaticFiles();

// Serve the React frontend from client/dist
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "client", "dist")),
    RequestPath = ""
});

// Enable CORS
app.UseCors("AllowReactFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html", new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "client", "dist"))
});

// Seed Manager User on Startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TreMocDbContext>();
    if (!context.Users.Any(u => u.Email == "manager@tremoc.vn"))
    {
        context.Users.Add(new TreMoc.Models.User
        {
            Name = "Manager Tre Mộc",
            Email = "manager@tremoc.vn",
            Phone = "0979845596",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            Role = "Manager",
            CreatedAt = DateTime.UtcNow
        });
        context.SaveChanges();
    }

    // Cập nhật sản phẩm có sẵn trong Database với hình ảnh mới
    var cupProduct = context.Products.FirstOrDefault(p => p.Id == 2);
    if (cupProduct != null)
    {
        cupProduct.Image = "/images/products/cup_logo.jpg";
        cupProduct.ImagesJson = System.Text.Json.JsonSerializer.Serialize(new[] {
            "/images/products/cup_logo.jpg",
            "/images/products/cup_plain.jpg",
            "/images/products/cup_bottom.jpg",
            "/images/products/cup_close.jpg",
            "/images/products/cup_logo_2.jpg"
        });
        context.SaveChanges();
    }
}

app.Run();
