using System.Data;
using System.Diagnostics;
using api.v1.Routes;
using Npgsql;

//Load .env as early as possible
DotNetEnv.Env.Load();

Console.WriteLine("Started!");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IDbConnection>(sp =>
{
    // Get the environment variable
    var connString = Environment.GetEnvironmentVariable("SUPA_BASE_URI");

    // Throw early if missing
    if (string.IsNullOrWhiteSpace(connString))
    {
        throw new InvalidOperationException("Environment variable 'SUPA_BASE_URI' is not set.");
    }

    // Return a new PostgreSQL connection
    return new NpgsqlConnection(connString);
});

var app = builder.Build();

app.Use(async (context, next) =>
{
    Stopwatch stopwatch = Stopwatch.StartNew();
    await next();
    stopwatch.Stop();

    Console.WriteLine($"Request: {context.Request.Method} {context.Response.StatusCode} {context.Request.Path} {stopwatch.ElapsedMilliseconds}ms");
});


app.MapAiRoutes();
app.MapIntegrationRoutes();
app.MapLeadRoutes();
app.MapInteractionRoutes();
app.MapDealRoutes();
app.MapTasksRoutes();

app.Run();