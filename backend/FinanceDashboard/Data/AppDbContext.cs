using Microsoft.EntityFrameworkCore;
using FinanceDashboard.Models;

namespace FinanceDashboard.Data
{
    public class AppDbContext : DbContext
    {   
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Rule> Rules { get; set; }
    }  
}
