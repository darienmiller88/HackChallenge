namespace api.v1.Routes;

using System.Text.Json;
using Npgsql;
public static class IntegrationsRoutes
{
     // ----------------------------
    // INTEGRATIONS (Calendly, Twilio, ElevenLabs triggers)
    // ----------------------------
    public static void MapIntegrationRoutes(this IEndpointRouteBuilder app)
    {
        var integrations = app.MapGroup("/api/v1/integrations");
    
        // Calendly webhooks: meeting booked/cancelled
        integrations.MapPost("/calendly/webhook", CalendlyWebhookHandler);

        // Twilio: call status + recording callback (store recording URL, create interaction, kick off transcription)
        integrations.MapPost("/twilio/voice/status", TwilioVoiceStatusWebhookHandler);
        integrations.MapPost("/twilio/voice/recording", TwilioRecordingWebhookHandler);

        // Trigger outbound reminders/calls (your app calls Twilio + ElevenLabs)
        integrations.MapPost("/voice/reminder/{leadId:guid}", TriggerReminderCallHandler); // input: meeting/time/message
        integrations.MapPost("/voice/voicemail-drop/{leadId:guid}", TriggerVoicemailDropHandler);

        // Email provider webhook (optional)
        integrations.MapPost("/email/webhook", EmailWebhookHandler); // open/click/bounce -> update interaction/deal signals
    }

    // Calendly webhooks
  private static async Task<IResult> CalendlyWebhookHandler(HttpRequest request){

    using var reader = new StreamReader(request.Body);
    var body = await reader.ReadToEndAsync();

    if (string.IsNullOrWhiteSpace(body))
        return Results.BadRequest("Empty body");

    using var doc = JsonDocument.Parse(body);
    var root = doc.RootElement;

    var eventType = root.GetProperty("event").GetString();

    // Safely navigate payload
    var payload = root.GetProperty("payload");

    string? email = null;
    string? name = null;
    DateTime? start = null;

    if (payload.TryGetProperty("invitee", out var invitee))
    {
        if (invitee.TryGetProperty("email", out var e)) email = e.GetString();
        if (invitee.TryGetProperty("name", out var n)) name = n.GetString();
    }

    if (payload.TryGetProperty("event", out var ev))
    {
        if (ev.TryGetProperty("start_time", out var s))
            start = s.GetDateTime();
    }

    var config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

    var connString = config.GetConnectionString("Db");

    await using var conn = new NpgsqlConnection(connString);
    await conn.OpenAsync();

    // ⭐ example behavior:
    // create timeline entry when meeting booked
    if (eventType == "invitee.created" && email != null)
    {
        const string sql = @"
            INSERT INTO lead_timeline (id, lead_email, event_type, note, created_at)
            VALUES (gen_random_uuid(), @email, 'meeting_booked', @note, now())";

        await using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("email", email);
        cmd.Parameters.AddWithValue("note", $"Calendly booking for {name} at {start}");

        await cmd.ExecuteNonQueryAsync();
    }

    // ⭐ ALWAYS return 200 fast
    return Results.Ok();
    }

    // Twilio webhooks
    private static IResult TwilioVoiceStatusWebhookHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult TwilioRecordingWebhookHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    // Trigger outbound calls / reminders
    private static IResult TriggerReminderCallHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult TriggerVoicemailDropHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    // Email provider webhook
    private static IResult EmailWebhookHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }
}
