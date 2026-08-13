using Microsoft.EntityFrameworkCore;
using VintyDev.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Add allowed origin for the client application. This is used for CORS configuration
var allowedOrigin = builder.Configuration["Client:Origin"]
    ?? throw new InvalidOperationException("Client: Origin is not configured.");

// Add CORS policy to allow requests from the client application
builder.Services.AddCors(options =>
{
    options.AddPolicy("Client", policy =>
        policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod());
});


// Add health checks to the service collection
// This allows the application to expose a health check endpoint that can be used for monitoring and diagnostics
builder.Services.AddHealthChecks();

builder.Services.AddSingleton<IContactQueueSender, AzureQueueContactSender>();

var app = builder.Build();

// Configure the HTTP request pipeline for
// the database migration and health checks. 
// This is done before the application starts processing requests
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

// If we're in dev, enable OpenAPI
if(app.Environment.IsDevelopment())
{
   app.MapOpenApi();
   
}

app.UseHttpsRedirection();

app.UseCors("Client");

app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/healthz");

app.Run();
