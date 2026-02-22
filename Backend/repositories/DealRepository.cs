using System.Data;
using Backend.Models;
using Dapper;

namespace Backend.Repositories;
public class DealRepository
{
    private readonly IDbConnection _db;

    public DealRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Deal>> GetAllDeals()
    {
        const string query = "SELECT * FROM Deals";
        return await _db.QueryAsync<Deal>(query);
    }

    public async Task<int> CreateDeal(Deal deal)
    {
        const string query = @"
            INSERT INTO Deals (Name, Description, Amount, Status) 
            VALUES (@Name, @Description, @Amount, @Status)";
        
        return await _db.QuerySingleAsync<int>(query, deal);
    }

    public async Task<bool> UpdateDeal(Deal deal)
    {
        const string query = @"
            UPDATE Deals 
            SET Name = @Name, Description = @Description, Amount = @Amount, Status = @Status 
            WHERE Id = @Id";
        
        var result = await _db.ExecuteAsync(query, deal);
        return result > 0;
    }

    public async Task<bool> DeleteDeal(int id)
    {
        const string query = "DELETE FROM Deals WHERE Id = @Id";
        var result = await _db.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }
}
