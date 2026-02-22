using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Deal
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LeadId { get; set; }

        [ForeignKey(nameof(LeadId))]
        public Lead? Lead { get; set; }

        // You can swap this to an enum later
        [Required, MaxLength(50)]
        public string Stage { get; set; } = "New";

        // Estimated deal value (e.g., dollars)
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValueEstimate { get; set; }

        // 0.0 to 1.0
        [Range(0, 1)]
        public double Probability { get; set; }

        public DateTime? NextActionDate { get; set; }
    }
}