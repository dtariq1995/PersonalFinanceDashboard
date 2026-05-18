using Microsoft.EntityFrameworkCore;
using FinanceDashboard.Data;
using FinanceDashboard.Models;

namespace FinanceDashboard.Services
{
    public class TransactionService
    {
        private readonly AppDbContext _context;

        public TransactionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Transaction>> GetAllTransactionsAsync()
        {
            return await _context.Transactions
                .Include(t => t.Category) // Include related category data
                .ToListAsync();
        }

        public async Task<Transaction?> GetTransactionByIdAsync(int id)
        {
            return await _context.Transactions
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Transaction> CreateTransactionAsync(Transaction transaction)
        {
            var matchingRule = await _context.Rules
                .FirstOrDefaultAsync(r => r.Merchant.ToLower() == transaction.Merchant.ToLower());
            if (matchingRule != null)
            {
                transaction.CategoryId = matchingRule.CategoryId;
            }
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<bool> UpdateTransactionAsync(int id, Transaction updatedTransaction)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null) return false;

            transaction.Merchant = updatedTransaction.Merchant;
            transaction.Amount = updatedTransaction.Amount;
            transaction.Date = updatedTransaction.Date;
            transaction.CategoryId = updatedTransaction.CategoryId;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTransactionAsync(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null) return false;

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}