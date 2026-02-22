using System.Data;
using Backend.Models;
using Dapper;

namespace ADPHack.Backend.Repositories
{
    public class LeadRepository
    {
        private readonly IDbConnection _db;

        public LeadRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Lead>> GetAllLeads()
        {
            const string query = "SELECT * FROM Leads";
            return await _db.QueryAsync<Lead>(query);
        }

        public async Task<Lead> GetLeadById(int id)
        {
            const string query = "SELECT * FROM Leads WHERE Id = @Id";
            return await _db.QueryFirstOrDefaultAsync<Lead>(query, new { Id = id });
        }

        public async Task<int> CreateLead(Lead lead)
        {
            const string query = @"INSERT INTO Leads (Name, Email, Phone) 
                                   VALUES (@Name, @Email, @Phone);
                                   SELECT CAST(SCOPE_IDENTITY() as int)";
            return await _db.QuerySingleAsync<int>(query, lead);
        }

        public async Task<bool> UpdateLead(int id, Lead lead)
        {
            const string query = @"UPDATE Leads SET Name = @Name, Email = @Email, Phone = @Phone 
                                   WHERE Id = @Id";
            var result = await _db.ExecuteAsync(query, new { lead.Name, lead.Email, lead.Phone, Id = id });
            return result > 0;
        }

        public async Task<bool> DeleteLead(int id)
        {
            const string query = "DELETE FROM Leads WHERE Id = @Id";
            var result = await _db.ExecuteAsync(query, new { Id = id });
            return result > 0;
        }
    }
}