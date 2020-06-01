using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<User>
        { }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
            {
                this._jwtGenerator = jwtGenerator;
                this._userManager = userManager;
                this._userAccessor = userAccessor;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var username = this._userAccessor.GetCurrentUsername();
                var appUser = await this._userManager.FindByNameAsync(username);
                return new User
                {
                    Username = appUser.UserName,
                    DisplayName = appUser.DisplayName,
                    Token = _jwtGenerator.CreateToken(appUser),
                    Image = null
                };
            }
        }
    }
}