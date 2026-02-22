"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { LeadCard } from "@/components/lead-card"
import type { Lead, PipelineStage } from "@/lib/mock-data"
import { PIPELINE_STAGES } from "@/lib/mock-data"
import {
  UserPlus,
  Send,
  CalendarCheck,
  Presentation,
  FileText,
  Handshake,
  Trophy,
} from "lucide-react"

const stageIcons: Record<PipelineStage, React.ReactNode> = {
  New: <UserPlus className="h-3.5 w-3.5" />,
  Contacted: <Send className="h-3.5 w-3.5" />,
  "Meeting Booked": <CalendarCheck className="h-3.5 w-3.5" />,
  "Demo Done": <Presentation className="h-3.5 w-3.5" />,
  "Proposal Sent": <FileText className="h-3.5 w-3.5" />,
  Negotiation: <Handshake className="h-3.5 w-3.5" />,
  Closed: <Trophy className="h-3.5 w-3.5" />,
}

const stageColors: Record<PipelineStage, string> = {
  New: "bg-chart-2",
  Contacted: "bg-chart-5",
  "Meeting Booked": "bg-chart-3",
  "Demo Done": "bg-primary",
  "Proposal Sent": "bg-chart-1",
  Negotiation: "bg-chart-4",
  Closed: "bg-primary",
}

interface PipelineBoardProps {
  leads: Lead[]
  onLeadClick: (lead: Lead) => void
}

export function PipelineBoard({ leads, onLeadClick }: PipelineBoardProps) {
  const groupedLeads = PIPELINE_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = leads.filter((l) => l.stage === stage)
      return acc
    },
    {} as Record<PipelineStage, Lead[]>
  )

  return (
    <ScrollArea className="h-full">
      <div className="flex gap-3 p-4 min-w-max">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = groupedLeads[stage]
          const totalValue = stageLeads.reduce(
            (sum, l) => sum + l.estimatedValue,
            0
          )
          return (
            <div
              key={stage}
              className="flex w-[240px] shrink-0 flex-col rounded-xl bg-secondary/30 border border-border/50"
            >
              <div className="flex items-center gap-2 px-3.5 pt-3.5 pb-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-md ${stageColors[stage]} text-background`}
                >
                  {stageIcons[stage]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-xs font-semibold text-foreground">
                      {stage}
                    </h3>
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-medium text-muted-foreground">
                      {stageLeads.length}
                    </span>
                  </div>
                  {totalValue > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      ${(totalValue / 1000).toFixed(0)}k pipeline
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 px-2 pb-2 pt-1 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/60 py-8">
                    <p className="text-xs text-muted-foreground">No leads</p>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onClick={onLeadClick}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
