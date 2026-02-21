using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class TaskItem
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid LeadId { get; set; }

        [ForeignKey(nameof(LeadId))]
        public Lead? Lead { get; set; }

        [Required, MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool Completed { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}