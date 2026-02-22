namespace api.v1.Routes;

public static class DealRoutes
{
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

     // GET
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

    // POST
    private static IResult CreateDealHandler()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    // PATCH
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

    // DELETE
    private static IResult DeleteDealHandler(Guid id)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }
}