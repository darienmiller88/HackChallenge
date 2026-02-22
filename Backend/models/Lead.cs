using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Lead
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(200)]
        public string Company { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(320)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Phone { get; set; }

        [MaxLength(500)]
        public string? LinkedIn { get; set; }

        // 0-100 (or any scoring scale you want)
        public int FitScore { get; set; }

        // Navigation
        public ICollection<Deal> Deals { get; set; } = new List<Deal>();
        public ICollection<Interaction> Interactions { get; set; } = new List<Interaction>();
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}