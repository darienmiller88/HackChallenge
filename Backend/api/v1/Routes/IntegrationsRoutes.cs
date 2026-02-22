namespace api.v1.Routes;

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
    private static IResult CalendlyWebhookHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
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
