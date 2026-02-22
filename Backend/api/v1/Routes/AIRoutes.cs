using Backend.Models;
using GenerativeAI;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace api.v1.Routes;

public static class AiRoutes{

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

    // Lead discovery / research
    private static IResult ResearchLeadHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult DiscoverLeadsHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    // Outreach drafting
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

    // Call / meeting analysis
    private static async Task<IResult> AnalyzeTranscriptHandler(TranscriptRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Transcript))
            return Results.BadRequest("Transcript required");

        // config
        var config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

        var apiKey = config["Gemini:ApiKey"];

        var model = new GenerativeModel(apiKey, "gemini-1.5-flash");
        
        var prompt = $$"""
    You are a sales conversation analyzer.

    Analyze this transcript and return ONLY valid JSON with this schema:

    {"sentiment": "positive | neutral | negative",
    "objections": ["list of objections"],
    "next_steps": ["recommended next steps"]
    }

    Transcript:
    {{req.Transcript}}
    """;

        var response = await model.GenerateContentAsync(prompt);

        var text = response.Text();

        // try parse JSON safely
        try
        {
            var parsed = JsonSerializer.Deserialize<object>(text);
            return Results.Ok(parsed);
        }
        catch
        {
            // fallback if Gemini adds extra text
            return Results.Ok(new
            {
                raw = text
            });
        }
    }

    private static IResult EstimateDealValueHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    // Recommendations
    private static IResult RecommendNextActionsHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }
}

