using FinanceDashboard.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceDashboard.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(AppDbContext context)
        {
            if (await context.Categories.AnyAsync()) return;

            var categories = new List<Category>
            {
                new Category { Name = "Paychecks", Type = "Income" },
                new Category { Name = "Other Income", Type = "Income" },
                new Category { Name = "Groceries", Type = "Expense" },
                new Category { Name = "Restaurants", Type = "Expense" },
                new Category { Name = "Shopping", Type = "Expense" },
                new Category { Name = "Miscellaneous", Type = "Expense" }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();

            var rules = new List<Rule>
            {
                new Rule { Name = "Walmart Rule", Merchant = "walmart", CategoryId = categories[2].Id },
                new Rule { Name = "Whole Foods Rule", Merchant = "whole foods", CategoryId = categories[2].Id },
                new Rule { Name = "Trader Joes Rule", Merchant = "trader joes", CategoryId = categories[2].Id },
                new Rule { Name = "Work Rule", Merchant = "work", CategoryId = categories[0].Id },
                new Rule { Name = "Employer Direct Rule", Merchant = "employer direct", CategoryId = categories[0].Id },
                new Rule { Name = "McDonalds Rule", Merchant = "mcdonalds", CategoryId = categories[3].Id },
                new Rule { Name = "Chipotle Rule", Merchant = "chipotle", CategoryId = categories[3].Id },
                new Rule { Name = "Starbucks Rule", Merchant = "starbucks", CategoryId = categories[3].Id },
                new Rule { Name = "Amazon Rule", Merchant = "amazon", CategoryId = categories[4].Id },
                new Rule { Name = "Target Rule", Merchant = "target", CategoryId = categories[4].Id },
                new Rule { Name = "Venmo Rule", Merchant = "venmo", CategoryId = categories[1].Id }
            };

            await context.Rules.AddRangeAsync(rules);
            await context.SaveChangesAsync();

            var transactions = new List<Transaction>
            {
                // Matched transactions
                new Transaction { Merchant = "Walmart", Amount = 87.43m, Date = DateTime.Now.AddDays(-30) },
                new Transaction { Merchant = "Walmart", Amount = 112.67m, Date = DateTime.Now.AddDays(-16) },
                new Transaction { Merchant = "Whole Foods", Amount = 54.21m, Date = DateTime.Now.AddDays(-25) },
                new Transaction { Merchant = "Work", Amount = 2400.00m, Date = DateTime.Now.AddDays(-28) },
                new Transaction { Merchant = "Work", Amount = 2400.00m, Date = DateTime.Now.AddDays(-14) },
                new Transaction { Merchant = "McDonalds", Amount = 12.87m, Date = DateTime.Now.AddDays(-22) },
                new Transaction { Merchant = "Chipotle", Amount = 18.43m, Date = DateTime.Now.AddDays(-10) },
                new Transaction { Merchant = "Starbucks", Amount = 6.75m, Date = DateTime.Now.AddDays(-5) },
                new Transaction { Merchant = "Amazon", Amount = 43.99m, Date = DateTime.Now.AddDays(-18) },
                new Transaction { Merchant = "Target", Amount = 67.32m, Date = DateTime.Now.AddDays(-8) },
                new Transaction { Merchant = "Venmo", Amount = 50.00m, Date = DateTime.Now.AddDays(-3) },

                // Unmatched transactions (no rule, CategoryId stays null)
                new Transaction { Merchant = "Netflix", Amount = 15.99m, Date = DateTime.Now.AddDays(-20) },
                new Transaction { Merchant = "Shell Gas Station", Amount = 54.00m, Date = DateTime.Now.AddDays(-12) },
                new Transaction { Merchant = "Planet Fitness", Amount = 24.99m, Date = DateTime.Now.AddDays(-7) }
            };

            await context.Transactions.AddRangeAsync(transactions);
            await context.SaveChangesAsync();
        }
    }
}