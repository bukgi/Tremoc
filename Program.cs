using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TreMoc.Data;

var builder = WebApplication.CreateBuilder(args);

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

// 4. CORS
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
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
var clientDist = Path.Combine(builder.Environment.ContentRootPath, "client", "dist");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

// Ảnh upload trong wwwroot
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowReactFrontend");
app.UseAuthentication();
app.UseAuthorization();

// API endpoints
app.MapControllers();

// SPA: serve React frontend
if (Directory.Exists(clientDist))
{
    var clientProvider = new PhysicalFileProvider(clientDist);

    // Serve static assets (JS, CSS, images) from client/dist first
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = clientProvider,
        RequestPath = ""
    });
}

// SPA fallback: tất cả route không phải API, không phải file tĩnh → index.html
app.MapFallback(async context =>
{
    // API 404 trả JSON
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        context.Response.ContentType = "application/json; charset=utf-8";
        await context.Response.WriteAsJsonAsync(new { message = "API endpoint không tồn tại." });
        return;
    }

    // Nếu có file index.html thì trả SPA, nếu không thì trả thông báo
    var indexPath = Path.Combine(clientDist, "index.html");
    if (File.Exists(indexPath))
    {
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(indexPath);
    }
    else
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.WriteAsync("<!DOCTYPE html><html><head><meta charset='utf-8'><title>Tre Mộc</title></head><body style='font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f5f5f0;color:#2d5016'><div style='text-align:center'><h1>🌿 Tre Mộc</h1><p>Frontend chưa được build. Vui lòng chạy:</p><pre style='background:#e8e8e0;padding:12px;border-radius:8px'>cd client && npm run build</pre></div></body></html>");
    }
});

// Tự tạo DB + seed khi deploy lần đầu
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TreMocDbContext>();
    context.Database.Migrate();

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
