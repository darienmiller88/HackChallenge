using Backend.Repositories;
using Backend.Models;
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
        ai.MapPost("/draft/linkedin", DraftLinkedInMessageHandler);  // input: leadId -> output: DM text
        ai.MapPost("/draft/follow-up", DraftFollowUpHandler);        // input: leadId + last interaction -> output follow-up

        // Call / meeting analysis
        ai.MapPost("/analyze/transcript", AnalyzeTranscriptHandler); // input: interactionId/transcript -> output: sentiment, objections, next steps
        ai.MapPost("/estimate/deal-value", EstimateDealValueHandler);// input: leadId + transcript/history -> output: value_estimate + probability

        // Recommendations
        ai.MapGet("/draft/cold-email/{leadId:int}", DraftColdEmailHandler);      // input: leadId + context -> output: subject/body
        ai.MapGet("/recommend/next-actions/{leadId:int}", RecommendNextActionsHandler);
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
    private static async Task<object> CallGeminiAsync(string prompt){
        var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        var payload = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[] { new { text = prompt } }
                }
            }
        };

        using var http = new HttpClient();

        var response = await http.PostAsync(
            $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={apiKey}",
            new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"));

        var respText = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception(respText);

        using var doc = JsonDocument.Parse(respText);

        var text = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        text = text?
            .Replace("```json", "", StringComparison.OrdinalIgnoreCase)
            .Replace("```", "")
            .Trim();

        var match = Regex.Match(text ?? "", @"\{[\s\S]*\}");
        if (match.Success) text = match.Value;

        return JsonSerializer.Deserialize<object>(text!);
    }

    private static async Task<IResult> DraftColdEmailHandler(int leadId, LeadRepository leadRepo){
        var lead = await leadRepo.GetLeadById(leadId);
        if (lead == null) return Results.NotFound();

        var prompt = $$"""
            You are a B2B SDR.

            Write a short personalized cold email.

            Return ONLY JSON:

            {
            "subject": "",
            "body": ""
            }

            Lead:
            Name: {{lead.Name}}
            Company: {{lead.Company}}
        """;

        var result = await CallGeminiAsync(prompt);
        return Results.Ok(result);
    }

    private static async Task<IResult> DraftLinkedInMessageHandler(int leadId, LeadRepository leadRepo){
        var lead = await leadRepo.GetLeadById(leadId);
        if (lead == null) return Results.NotFound();

        var prompt = $$"""
            You are an SDR writing a concise LinkedIn DM.

            Return ONLY JSON:

            {
            "message": ""
            }

            Lead:
            Name: {{lead.Name}}
            Company: {{lead.Company}}
        """;

        var result = await CallGeminiAsync(prompt);
        return Results.Ok(result);
    }
    
    private static async Task<IResult> DraftFollowUpHandler(int interactionId, int leadId, InteractionRepository interactionRepo, LeadRepository leadRepo){
        var interaction = interactionRepo.GetById(interactionId);
        if (interaction == null) return Results.NotFound();

        var lead = await leadRepo.GetLeadById(leadId);
        if (lead == null) return Results.NotFound("Lead not found");

        var prompt = $$"""
    You are an SDR writing a follow-up message after a customer interaction.

    Return ONLY JSON:

    {
    "message": ""
    }

    Lead:
    Name: {{lead.Name}}
    Company: {{lead.Company}}

    Interaction:
    Summary: {{interaction.Summary}}
    Transcript: {{interaction.Transcript}}
    """;

        var result = await CallGeminiAsync(prompt);
        return Results.Ok(result);
    }
    
    // Call / meeting analysis
    private static async Task<IResult> AnalyzeTranscriptHandler(TranscriptRequest req){
        if (string.IsNullOrWhiteSpace(req.Transcript))
            return Results.BadRequest("Transcript required");

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
    private static async Task<IResult> RecommendNextActionsHandler(int leadId, LeadRepository leadRepo, InteractionRepository interactionRepo){
        var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        // ⭐ get lead
        var lead = await leadRepo.GetLeadById(leadId);
        if (lead is null)
            return Results.NotFound("Lead not found");

        // ⭐ get recent interactions
        var timeline = await interactionRepo.GetRecentByLeadId(leadId);

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
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}",
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

