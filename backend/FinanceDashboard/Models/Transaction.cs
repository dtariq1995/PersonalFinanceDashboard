using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceDashboard.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public required string Merchant { get; set; } 
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}