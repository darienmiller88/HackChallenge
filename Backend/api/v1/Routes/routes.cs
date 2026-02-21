using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

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
    // ----------------------------
   

    // ----------------------------
    // DEALS / PIPELINE (CRUD + stage transitions + value)
    // ----------------------------
    public static void MapDealRoutes(this IEndpointRouteBuilder app)
    {
        var deals = app.MapGroup("/api/v1/deals");

        // GET
        deals.MapGet("", GetDealsHandler);                          // list deals (filter by stage, leadId, date range)
        deals.MapGet("/{id:guid}", GetDealByIdHandler);             // deal details
        deals.MapGet("/by-lead/{leadId:guid}", GetDealsByLeadHandler);

        // POST
        deals.MapPost("", CreateDealHandler);                       // create deal for a lead

        // PATCH
        deals.MapPatch("/{id:guid}", UpdateDealHandler);            // update stage/value/probability/nextActionDate
        deals.MapPatch("/{id:guid}/stage", UpdateDealStageHandler); // stage transition (triggers automation rules)
        deals.MapPatch("/{id:guid}/next-action", UpdateNextActionDateHandler);

        // DELETE
        deals.MapDelete("/{id:guid}", DeleteDealHandler);
    }

    // ----------------------------
    // INTERACTIONS (email/call/meeting logging + transcripts)
    // ----------------------------
    public static void MapInteractionRoutes(this IEndpointRouteBuilder app)
    {
        var interactions = app.MapGroup("/api/v1/interactions");

        // GET
        interactions.MapGet("", GetInteractionsHandler);                                // list (filter by leadId, type, date)
        interactions.MapGet("/{id:guid}", GetInteractionByIdHandler);
        interactions.MapGet("/by-lead/{leadId:guid}", GetInteractionsByLeadHandler);

        // POST
        interactions.MapPost("", CreateInteractionHandler);                             // create interaction (summary/transcript optional)
        interactions.MapPost("/{id:guid}/attach-transcript", AttachTranscriptHandler); // attach transcript text

        // PATCH
        interactions.MapPatch("/{id:guid}", UpdateInteractionHandler);                  // update summary/sentiment/transcript

        // DELETE
        interactions.MapDelete("/{id:guid}", DeleteInteractionHandler);
    }

    // ----------------------------
    // TASKS (follow-ups, alerts, automation)
    // ----------------------------
    public static void MapTaskRoutes(this IEndpointRouteBuilder app)
    {
        var tasks = app.MapGroup("/api/v1/tasks");

        // GET
        tasks.MapGet("", GetTasksHandler);                              // list tasks (filter: leadId, dueBefore, completed)
        tasks.MapGet("/{id:guid}", GetTaskByIdHandler);
        tasks.MapGet("/by-lead/{leadId:guid}", GetTasksByLeadHandler);
        tasks.MapGet("/due-today", GetTasksDueTodayHandler);            // dashboard widget
        tasks.MapGet("/overdue", GetOverdueTasksHandler);

        // POST
        tasks.MapPost("", CreateTaskHandler);                           // create task
        tasks.MapPost("/auto/after-demo/{leadId:guid}", ScheduleAfterDemoFollowUpsHandler); // schedules 3 follow-ups

        // PATCH
        tasks.MapPatch("/{id:guid}", UpdateTaskHandler);                // update description/dueDate
        tasks.MapPatch("/{id:guid}/complete", MarkTaskCompleteHandler); // toggle complete
        tasks.MapPatch("/{id:guid}/reopen", ReopenTaskHandler);

        // DELETE
        tasks.MapDelete("/{id:guid}", DeleteTaskHandler);
    }

    // ----------------------------
    // AI ROUTES (research + drafting + analysis)
    // ----------------------------
    public static void MapAiRoutes(this IEndpointRouteBuilder app)
    {
        var ai = app.MapGroup("/api/v1/ai");

        // Lead discovery / research
        ai.MapPost("/research/lead", ResearchLeadHandler);           // input: company/linkedin/url -> output: research summary + fit score
        ai.MapPost("/discover/leads", DiscoverLeadsHandler);         // input: ICP -> output: list of leads (optional)

        // Outreach drafting
        ai.MapPost("/draft/cold-email", DraftColdEmailHandler);      // input: leadId + context -> output: subject/body
        ai.MapPost("/draft/linkedin", DraftLinkedInMessageHandler);  // input: leadId -> output: DM text
        ai.MapPost("/draft/follow-up", DraftFollowUpHandler);        // input: leadId + last interaction -> output follow-up

        // Call / meeting analysis
        ai.MapPost("/analyze/transcript", AnalyzeTranscriptHandler); // input: interactionId/transcript -> output: sentiment, objections, next steps
        ai.MapPost("/estimate/deal-value", EstimateDealValueHandler);// input: leadId + transcript/history -> output: value_estimate + probability

        // Recommendations
        ai.MapGet("/recommend/next-actions/{leadId:guid}", RecommendNextActionsHandler);
    }

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

    // ============================================================
    // HANDLER PLACEHOLDERS (add your actual implementations)
    // ============================================================   

   // Deals
    private static IResult GetDealsHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult GetDealByIdHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult GetDealsByLeadHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult CreateDealHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult UpdateDealHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult UpdateDealStageHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult UpdateNextActionDateHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult DeleteDealHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    // Interactions
    private static IResult GetInteractionsHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult GetInteractionByIdHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult GetInteractionsByLeadHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult CreateInteractionHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult AttachTranscriptHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult UpdateInteractionHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult DeleteInteractionHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    // Tasks
    private static IResult GetTasksHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult GetTaskByIdHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult GetTasksByLeadHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult GetTasksDueTodayHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult GetOverdueTasksHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult CreateTaskHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult ScheduleAfterDemoFollowUpsHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult UpdateTaskHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult MarkTaskCompleteHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult ReopenTaskHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult DeleteTaskHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    // AI
    private static IResult ResearchLeadHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult DiscoverLeadsHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult DraftColdEmailHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult DraftLinkedInMessageHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult DraftFollowUpHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult AnalyzeTranscriptHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult EstimateDealValueHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult RecommendNextActionsHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    // Integrations
    private static IResult CalendlyWebhookHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult TwilioVoiceStatusWebhookHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult TwilioRecordingWebhookHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult TriggerReminderCallHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult TriggerVoicemailDropHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult EmailWebhookHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }
}