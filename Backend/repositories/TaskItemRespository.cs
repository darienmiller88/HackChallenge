using System.Data;
using Backend.Models;
using Dapper;

namespace Backend.Repositories;

public class TaskItemRepository
{
    private readonly IDbConnection _db;

    public TaskItemRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<TaskItem>> Get()
    {
            var sql = "SELECT * FROM Leads ORDER BY Name";
        return await _db.QueryAsync<TaskItem>(sql);
    }

    public async Task<int> Post(TaskItem taskItem)
    {
        const string query = @"INSERT INTO TaskItems (Title, Description, IsComplete) 
                                VALUES (@Title, @Description, @IsComplete);
                                SELECT CAST(SCOPE_IDENTITY() as int)";
        return await _db.QuerySingleAsync<int>(query, taskItem);
    }

    public async Task<bool> Delete(int id)
    {
        const string query = "DELETE FROM TaskItems WHERE Id = @Id";
        var result = await _db.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }
}
