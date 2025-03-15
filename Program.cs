using System.Net;
using System.Web;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddControllers();
//builder.Services.AddRazorPages();

builder.WebHost.ConfigureKestrel((context, serverOptions) =>
{
    serverOptions.Listen(new IPAddress(0), 7071);
});

var app = builder.Build();
//app.MapGet("/", () => "Hello World!");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
