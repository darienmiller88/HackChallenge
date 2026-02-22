"use client"

import { Clock, ArrowRight, ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Lead, Sentiment } from "@/lib/mock-data"

interface LeadCardProps {
  lead: Lead
  onClick: (lead: Lead) => void
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-primary"
  if (score >= 70) return "text-chart-3"
  return "text-muted-foreground"
}

function getScoreBg(score: number) {
  if (score >= 85) return "bg-primary/10"
  if (score >= 70) return "bg-chart-3/10"
  return "bg-muted"
}

function getLikelihoodStyle(likelihood: string) {
  switch (likelihood) {
    case "High":
      return "bg-primary/15 text-primary border-primary/20"
    case "Medium":
      return "bg-chart-3/15 text-chart-3 border-chart-3/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

function getSentimentBadge(sentiment: Sentiment) {
  switch (sentiment) {
    case "positive":
      return {
        label: "Positive",
        icon: <ThumbsUp className="h-2.5 w-2.5" />,
        style: "bg-primary/15 text-primary border-primary/20",
      }
    case "negative":
      return {
        label: "Negative",
        icon: <ThumbsDown className="h-2.5 w-2.5" />,
        style: "bg-destructive/15 text-destructive border-destructive/20",
      }
    default:
      return {
        label: "Neutral",
        icon: <Minus className="h-2.5 w-2.5" />,
        style: "bg-muted text-muted-foreground border-border",
      }
  }
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const sentimentBadge = getSentimentBadge(lead.sentiment)

  return (
    <button
      onClick={() => onClick(lead)}
      className="group w-full rounded-lg border border-border bg-card p-3.5 text-left transition-all hover:border-primary/40 hover:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
            {lead.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {lead.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {lead.company}
            </p>
          </div>
        </div>
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${getScoreBg(lead.aiFitScore)} ${getScoreColor(lead.aiFitScore)}`}>
          {lead.aiFitScore}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0 h-5 ${getLikelihoodStyle(lead.convertLikelihood)}`}
        >
          {lead.convertLikelihood}
        </Badge>
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0 h-5 gap-0.5 ${sentimentBadge.style}`}
        >
          {sentimentBadge.icon}
          {sentimentBadge.label}
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 h-5 bg-chart-2/10 text-chart-2 border-chart-2/20"
        >
          <ArrowRight className="h-2.5 w-2.5 mr-0.5" />
          {lead.nextAction}
        </Badge>
      </div>

      <div className="mt-2.5 flex items-center gap-1 text-[10px] text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{lead.lastTouch}</span>
      </div>
    </button>
  )
}
