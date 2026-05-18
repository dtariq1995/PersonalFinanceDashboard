namespace FinanceDashboard.Models
{
    public class Rule
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Merchant { get; set; } // e.g., "Merchant contains 'Amazon'"
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}