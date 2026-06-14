using System.Security.Claims;

namespace TreMoc.Data
{
    public static class UserClaimsHelper
    {
        public static bool TryGetUserId(ClaimsPrincipal user, out int userId)
        {
            var candidates = user.FindAll(ClaimTypes.NameIdentifier)
                .Select(c => c.Value)
                .Concat(user.FindAll("userId").Select(c => c.Value));

            foreach (var candidate in candidates)
            {
                if (int.TryParse(candidate, out userId))
                {
                    return true;
                }
            }

            userId = 0;
            return false;
        }
    }
}
