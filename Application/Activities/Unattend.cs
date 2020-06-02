using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Unattend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._dataContext = dataContext;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.Id);
                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Could not find activity" });
                var user = await _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUsername());
                var attendance = await _dataContext.UserActivities.SingleOrDefaultAsync(a => a.ActivityId == activity.Id && a.AppUserId == user.Id);

                if (attendance == null)
                {
                    return Unit.Value;
                }

                if (attendance.IsHost)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new {attendance = "You can not remove yourself as host"});
                }

                _dataContext.UserActivities.Remove(attendance);
                var success = await _dataContext.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Error occurred when saving changes");
            }
        }
    }
}