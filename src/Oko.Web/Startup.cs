using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Oko.IsOAuthProvider;
using Oko.Logic.Contract;
using Oko.Logic.Core;
using Oko.Web.Authorization;
using Oko.Web.Infrastructure;

namespace Oko.Web
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(options => {
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            });

            // Add framework services.
            services.AddMvc();

            // Add OKO web services         
            services.Configure<OkoConfiguration>(Configuration.GetSection("Oko"));
            services.AddSingleton<OkoConfiguration>(provider => provider.GetService<IOptions<OkoConfiguration>>().Value);

            services.AddSingleton<AclRepository>(provider => new AclRepository("./Data/acl.json"));

            // Add OKO logic services
            services.AddSingleton<ICameraRepository>(provider => new FileCameraRepository("./Data/cams.json"));

            services.AddSingleton<IImageRepository>(
                provider => new FileImageRepository(provider.GetService<OkoConfiguration>()?.StoragePath));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AutomaticAuthenticate = false,
                AutomaticChallenge = false,
                //AutomaticAuthenticate = true,
                //AutomaticChallenge = true,
                LoginPath = new PathString("/Account/Login"),
                LogoutPath = new PathString("/Account/Logout"),
                AccessDeniedPath = new PathString("/Account/Forbidden")
            });
            
            var acl = app.ApplicationServices.GetService<AclRepository>();

            /*
            app.UseIsAuthentication(new IsAuthenticationOptions
             {
                 ClientId = "XXX",
                 ClientSecret = "XXX",
                 Events = new OAuthEvents()
                 {
                     OnCreatingTicket = (context =>
                     {
                         // populate claims from ACL
                         var name = context.Identity.Name;

                         var roles = acl.GetRoles(name);

                         foreach (var role in roles)
                         {
                             context.Identity.AddOptionalClaim(ClaimTypes.Role, role, context.Options.ClaimsIssuer);
                         }

                         var zones = acl.GetZones(name);

                         foreach (var zone in zones)
                         {
                             context.Identity.AddOptionalClaim("oko:zone", zone, context.Options.ClaimsIssuer);
                         }

                         return Task.CompletedTask;
                     })
                 }

             });
             */
          

            app.UseFakeIsAuthentication();

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
