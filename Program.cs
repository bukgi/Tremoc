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
var hasClientDist = Directory.Exists(clientDist);

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

// API trước — không để SPA fallback nuốt request /api
app.MapControllers();

// Frontend React (chỉ phục vụ file tĩnh + fallback cho route SPA)
if (hasClientDist)
{
    var clientProvider = new PhysicalFileProvider(clientDist);

    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = clientProvider,
        RequestPath = ""
    });

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = clientProvider,
        RequestPath = ""
    });

    app.MapFallback(async context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            context.Response.ContentType = "application/json; charset=utf-8";
            await context.Response.WriteAsJsonAsync(new { message = "API endpoint không tồn tại." });
            return;
        }

        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.SendFileAsync(Path.Combine(clientDist, "index.html"));
    });
}

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
