"use client"

import { Sparkles, TrendingUp, DollarSign, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Lead } from "@/lib/mock-data"

interface AIPrioritiesProps {
  priorities: Lead[]
  onLeadClick: (lead: Lead) => void
}

export function AIPriorities({ priorities, onLeadClick }: AIPrioritiesProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden border-l border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">AI Priorities</h2>
          <p className="text-[10px] text-muted-foreground">
            Top follow-ups for today
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-3">
          {priorities.map((lead, index) => (
            <button
              key={lead.id}
              onClick={() => onLeadClick(lead)}
              className="group w-full rounded-lg border border-border bg-secondary/30 p-3 text-left transition-all hover:border-primary/40 hover:bg-secondary/60 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {lead.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {lead.company} &middot; {lead.title}
                      </p>
                    </div>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                      {lead.aiFitScore}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {lead.aiReasons.map((reason) => (
                      <Badge
                        key={reason}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 h-5 bg-secondary border-border text-muted-foreground"
                      >
                        {reason}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-2.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-primary" />
                      <span className="text-foreground font-medium">
                        ${(lead.estimatedValue / 1000).toFixed(0)}k
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lead.contractTerm}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      {lead.convertLikelihood}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total pipeline</span>
          <span className="font-semibold text-foreground">
            $
            {(
              priorities.reduce((sum, l) => sum + l.estimatedValue, 0) / 1000
            ).toFixed(0)}
            k
          </span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${Math.min(
                (priorities.filter((l) => l.convertLikelihood === "High").length /
                  priorities.length) *
                  100,
                100
              )}%`,
            }}
          />
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {priorities.filter((l) => l.convertLikelihood === "High").length} of{" "}
          {priorities.length} high likelihood
        </p>
      </div>
    </div>
  )
}
