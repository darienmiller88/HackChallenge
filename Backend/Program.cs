using System.Diagnostics;
using api.v1.Routes;

//Load .env as early as possible
DotNetEnv.Env.Load();

Console.WriteLine("Started!");

var builder = WebApplication.CreateBuilder(args);

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