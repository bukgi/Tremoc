using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TreMoc.Data;
using TreMoc.Models;

namespace TreMoc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Manager")]
    public class UsersController : ControllerBase
    {
        private readonly TreMocDbContext _context;

        public UsersController(TreMocDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Phone,
                    u.Role,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        public class UpdateRoleRequest
        {
            public string Role { get; set; } = string.Empty;
        }

        // PUT: api/users/{id}/role
        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateRoleRequest request)
        {
            if (request.Role != "Customer" && request.Role != "Manager")
            {
                return BadRequest(new { message = "Vai trò không hợp lệ. Chỉ chấp nhận Customer hoặc Manager." });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng." });
            }

            // Prevent self-role modification (safety check)
            if (UserClaimsHelper.TryGetUserId(User, out int currentUserId) && currentUserId == id)
            {
                return BadRequest(new { message = "Bạn không thể tự thay đổi vai trò của chính mình." });
            }

            user.Role = request.Role;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật vai trò thành công.", role = user.Role });
        }
    }
}
