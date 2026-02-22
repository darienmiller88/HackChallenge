using Backend.Models;
using GenerativeAI;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Npgsql;
using System.Data;

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
        ai.MapGet("/recommend/next-actions/{leadId:long}", RecommendNextActionsHandler);
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

        var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

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

        var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

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
    private static async Task<IResult> RecommendNextActionsHandler(long leadId, IDbConnection db)
    {
        var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        // cast to NpgsqlConnection so we can use async APIs
        var conn = (NpgsqlConnection)db;

        if (conn.State != ConnectionState.Open)
            await conn.OpenAsync();

        // ⭐ get lead
        const string leadSql = "SELECT * FROM leads WHERE id = @id";
        await using var leadCmd = new NpgsqlCommand(leadSql, conn);
        leadCmd.Parameters.AddWithValue("id", leadId);

        await using var leadReader = await leadCmd.ExecuteReaderAsync();

        if (!await leadReader.ReadAsync())
            return Results.NotFound("Lead not found");

        var lead = new Dictionary<string, object?>();

        for (int i = 0; i < leadReader.FieldCount; i++)
            lead[leadReader.GetName(i)] =
                await leadReader.IsDBNullAsync(i) ? null : leadReader.GetValue(i);

        await leadReader.CloseAsync();

        // ⭐ get interactions (not lead_timeline — matches your schema)
        const string timelineSql =
            "SELECT * FROM interactions WHERE lead_id = @id ORDER BY created_at DESC LIMIT 10";

        await using var timelineCmd = new NpgsqlCommand(timelineSql, conn);
        timelineCmd.Parameters.AddWithValue("id", leadId);

        await using var timelineReader = await timelineCmd.ExecuteReaderAsync();

        var timeline = new List<Dictionary<string, object?>>();

        while (await timelineReader.ReadAsync())
        {
            var row = new Dictionary<string, object?>();

            for (int i = 0; i < timelineReader.FieldCount; i++)
                row[timelineReader.GetName(i)] =
                    await timelineReader.IsDBNullAsync(i) ? null : timelineReader.GetValue(i);

            timeline.Add(row);
        }

        await timelineReader.CloseAsync();

        // ⭐ AI prompt
        var prompt = $$"""
    You are an AI sales assistant.

    Based on the lead data and recent activity, recommend next actions to progress the deal.

    Return ONLY raw JSON:

    {
    "next_actions": [],
    "priority": "low | medium | high",
    "reasoning": ""
    }

    Lead:
    {{JsonSerializer.Serialize(lead)}}

    Recent Activity:
    {{JsonSerializer.Serialize(timeline)}}
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

        // ⭐ clean LLM output
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
    
}

