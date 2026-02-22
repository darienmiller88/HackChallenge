using Backend.Models;
using GenerativeAI;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

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
    private static async Task<IResult> AnalyzeTranscriptHandler(TranscriptRequest req){
        if (string.IsNullOrWhiteSpace(req.Transcript))
            return Results.BadRequest("Transcript required");

        // config
        var config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

        var apiKey = config["Gemini:ApiKey"];

        var prompt = $$"""
    You are a sales conversation analyzer.

    Return ONLY valid JSON:

    {
    "sentiment": "positive | neutral | negative",
    "objections": [],
    "next_steps": []
    }

    Transcript:
    {{req.Transcript}}
    """;

        var payload = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(payload);

        using var http = new HttpClient();

        var response = await http.PostAsync(
            $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={apiKey}",
            new StringContent(json, Encoding.UTF8, "application/json"));

        var respText = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            return Results.Problem(respText);

        using var doc = JsonDocument.Parse(respText);

        // extract text from Gemini response
        var text = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        if (string.IsNullOrWhiteSpace(text))
            return Results.Problem("Empty Gemini response");

        // ⭐ remove markdown fences
        text = text
            .Replace("```json", "", StringComparison.OrdinalIgnoreCase)
            .Replace("```", "")
            .Trim();

        // ⭐ extract JSON object if extra commentary exists
        var match = Regex.Match(text, @"\{[\s\S]*\}");
        if (match.Success)
            text = match.Value;

        try
        {
            var parsed = JsonSerializer.Deserialize<object>(text);
            return Results.Ok(parsed);
        }
        catch (Exception ex)
        {
            return Results.Ok(new
            {
                parseError = ex.Message,
                raw = text
            });
        }
    }
    private static async Task<IResult> EstimateDealValueHandler(TranscriptRequest req){
        if (string.IsNullOrWhiteSpace(req.Transcript))
            return Results.BadRequest("Transcript required");

        var config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

        var apiKey = config["Gemini:ApiKey"];

        var prompt = $$"""
    You are a B2B SaaS deal valuation expert.

    Based ONLY on the transcript, estimate potential deal value.

    If price signals are weak, infer a reasonable range from company size, urgency, and pain.

    Return ONLY raw JSON:

    {
    "estimated_value_usd": number,
    "value_range": "low-high",
    "confidence": 0-1,
    "signals_used": []
    }

    Transcript:
    {{req.Transcript}}
    """;

        var payload = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(payload);

        using var http = new HttpClient();

        var response = await http.PostAsync(
            $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={apiKey}",
            new StringContent(json, Encoding.UTF8, "application/json"));

        var respText = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            return Results.Problem(respText);

        using var doc = JsonDocument.Parse(respText);

        var text = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        // ⭐ clean LLM output (same as transcript handler)
        text = text?
            .Replace("```json", "", StringComparison.OrdinalIgnoreCase)
            .Replace("```", "")
            .Trim();

        var match = Regex.Match(text ?? "", @"\{[\s\S]*\}");
        if (match.Success)
            text = match.Value;

        try
        {
            var parsed = JsonSerializer.Deserialize<object>(text!);
            return Results.Ok(parsed);
        }
        catch
        {
            return Results.Ok(new { raw = text });
        }
    }

    // Recommendations
    private static IResult RecommendNextActionsHandler(Guid leadId)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }
}

