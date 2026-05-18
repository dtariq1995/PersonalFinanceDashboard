using Microsoft.EntityFrameworkCore;
using FinanceDashboard.Data;
using FinanceDashboard.Models;

namespace FinanceDashboard.Services
{
    public class RuleService
    {
        private readonly AppDbContext _context;

        public RuleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Rule>> GetAllRulesAsync()
        {
            return await _context.Rules
                .Include(r => r.Category) // Include related category data
                .ToListAsync();
            
        }   

        public async Task<Rule?> GetRuleByIdAsync(int id)
        {
            return await _context.Rules
                .Include(r => r.Category)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
        public async Task<Rule> CreateRuleAsync(Rule rule)
        {
            _context.Rules.Add(rule);
            await _context.SaveChangesAsync();
            return rule;
        }
        public async Task<bool> UpdateRuleAsync(int id, Rule updatedRule)
        {
            var rule = await _context.Rules.FindAsync(id);
            if (rule == null) return false;

            _context.Entry(rule).CurrentValues.SetValues(updatedRule);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteRuleAsync(int id)
        {
            var rule = await _context.Rules.FindAsync(id);
            if (rule == null) return false;
            _context.Rules.Remove(rule);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}