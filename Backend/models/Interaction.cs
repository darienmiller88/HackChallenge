using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Interaction
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid LeadId { get; set; }

        [ForeignKey(nameof(LeadId))]
        public Lead? Lead { get; set; }

        // e.g., Email, Call, Meeting
        [Required]
        public InteractionType Type { get; set; }

        [MaxLength(2000)]
        public string? Summary { get; set; }

        // e.g., -1.0 (negative) to +1.0 (positive), or 0-100
        public double? Sentiment { get; set; }

        public string? Transcript { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum InteractionType
    {
        Email = 0,
        Call = 1,
        Meeting = 2
    }
}