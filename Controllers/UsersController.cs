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
                    u.IsActive,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        public class UpdateStatusRequest
        {
            public bool IsActive { get; set; }
        }

        // PUT: api/users/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng." });
            }

            // Ngăn người dùng tự khóa tài khoản của chính mình
            if (UserClaimsHelper.TryGetUserId(User, out int currentUserId) && currentUserId == id)
            {
                return BadRequest(new { message = "Bạn không thể tự khóa tài khoản của chính mình." });
            }

            user.IsActive = request.IsActive;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật trạng thái tài khoản thành công.", isActive = user.IsActive });
        }
    }
}
