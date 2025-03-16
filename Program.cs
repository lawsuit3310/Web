using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using Microsoft.AspNetCore.Mvc;

using SqlTasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
//builder.Services.Add( new ServiceDescriptor(typeof(SqlConnector), new SqlConnector(builder.Configuration.GetConnectionString("DefaultConnetion"))));
builder.Services.Add( new ServiceDescriptor(typeof(SqlConnector), new SqlConnector("Server = localhost; Database=stock; User Id=asp; Password=041008;")));

Console.WriteLine(builder.Configuration.GetConnectionString("DefaultConnetion"));

builder.WebHost.ConfigureKestrel((context, serverOptions) =>
{
    serverOptions.Listen(new IPAddress(0), 7071);
});

var app = builder.Build();
//app.MapGet("/", () => "Hello World!");

app.UseStaticFiles();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/");

app.Run();
