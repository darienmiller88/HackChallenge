using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Npgsql;
using Microsoft.AspNetCore.Http;

namespace api.v1.Routes;

public static class Routes
{
    public static void MapRoutes(this IEndpointRouteBuilder app){
        RouteGroupBuilder todoRoutes = app.MapGroup("/api/v1/backend");

        // AI “actions” (research, drafts, analysis)
        app.MapAiRoutes();

        // External integrations (Calendly/Twilio webhooks, voice reminders)
        app.MapIntegrationRoutes();
    }

    // ----------------------------
    // LEADS (CRUD + search + scoring)
    
   

    // ============================================================
    // HANDLER PLACEHOLDERS (add your actual implementations)
    // ============================================================   

    // Leads
    private static async Task<IResult> GetLeadsHandler(){

    var config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json", optional: false)
        .Build();

    var connString = config.GetConnectionString("Db");

    const string sql = "SELECT * FROM leads";

    await using var conn = new NpgsqlConnection(connString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(sql, conn);
    await using var reader = await cmd.ExecuteReaderAsync();

    var results = new List<Dictionary<string, object?>>();

    while (await reader.ReadAsync())
    {
        var row = new Dictionary<string, object?>();

        for (int i = 0; i < reader.FieldCount; i++)
        {
            row[reader.GetName(i)] =
                await reader.IsDBNullAsync(i) ? null : reader.GetValue(i);
        }

        results.Add(row);
    }

    return Results.Ok(results);
}

    
}