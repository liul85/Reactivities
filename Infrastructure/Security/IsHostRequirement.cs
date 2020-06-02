using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement { }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _dataContext;
        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext dataContext)
        {
            this._dataContext = dataContext;
            this._httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var currentUsername = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            var activityId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(r => r.Key == "id").Value.ToString());

            var activity = _dataContext.Activities.Find(activityId);
            var userActivity = activity.UserActivities.FirstOrDefault(x => x.IsHost);
            if (userActivity?.AppUser?.UserName == currentUsername)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}