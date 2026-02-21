// ----------------------------
    // LEADS (CRUD + search + scoring)
    // ----------------------------

namespace api.v1.Routes;

public static class LeadsRoutes
{
    public static void MapLeadRoutes(this IEndpointRouteBuilder app)
    {
        var leads = app.MapGroup("/api/v1/leads");

        // GET
        leads.MapGet("/", GetLeadsHandler);                          // list (support query params: search, company, minFitScore, page, pageSize)
        leads.MapGet("/{id:guid}", GetLeadByIdHandler);             // lead details
        leads.MapGet("/{id:guid}/timeline", GetLeadTimelineHandler);// lead’s interactions + tasks + deals
        leads.MapGet("/search", SearchLeadsHandler);                // quick search endpoint

        // POST
        leads.MapPost("", CreateLeadHandler);                       // create lead
        leads.MapPost("/bulk", BulkCreateLeadsHandler);             // optional: bulk import

        // PATCH/PUT
        leads.MapPatch("/{id:guid}", UpdateLeadHandler);            // update fields
        leads.MapPatch("/{id:guid}/fit-score", UpdateLeadFitScoreHandler); // update fit score

        // DELETE
        leads.MapDelete("/{id:guid}", DeleteLeadHandler);           // delete lead (or soft delete)
    }

    private static IResult GetLeadsHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult GetLeadByIdHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult GetLeadTimelineHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult SearchLeadsHandler(string q)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult CreateLeadHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult BulkCreateLeadsHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult UpdateLeadHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult UpdateLeadFitScoreHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    private static IResult DeleteLeadHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

}
