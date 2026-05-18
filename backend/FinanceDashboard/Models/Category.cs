namespace FinanceDashboard.Models
{
    public class Category
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Type { get; set; } // "Income" or "Expense"
    }
}