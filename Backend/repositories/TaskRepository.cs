using System.Data;
using Backend.Models;
using Dapper;

namespace Backend.Repositories;

public class TaskRepository
{
    private readonly IDbConnection _db;

    public TaskRepository(IDbConnection db)
    {
        _db = db;
    }

    // GET
    public async Task<IEnumerable<TaskItem>> GetAllTasks()
    {
        const string query = "SELECT * FROM Tasks";
        return await _db.QueryAsync<TaskItem>(query);
    }

    // POST
    public async Task<int> CreateTask(TaskItem task)
    {
        const string query = @"INSERT INTO Tasks (Title, Description, IsCompleted, CreatedAt) 
                                VALUES (@Title, @Description, @IsCompleted, @CreatedAt);
                                SELECT CAST(SCOPE_IDENTITY() as int)";
        return await _db.QuerySingleAsync<int>(query, task);
    }

    // PUT
    // public async Task<bool> UpdateTask(int id, TaskItem task)
    // {
    //     const string query = @"UPDATE Tasks 
    //                            SET Title = @Title, Description = @Description, IsCompleted = @IsCompleted 
    //                            WHERE Id = @Id";
    //     return result > 0;
    // }

    // DELETE
    public async Task<bool> DeleteTask(int id)
    {
        const string query = "DELETE FROM Tasks WHERE Id = @Id";
        var result = await _db.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }
}
