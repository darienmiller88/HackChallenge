"use client"

import { useState, useMemo } from "react"
import { TopBar } from "@/components/top-bar"
import { PipelineBoard } from "@/components/pipeline-board"
import { AIPriorities } from "@/components/ai-priorities"
import { LeadDrawer } from "@/components/lead-drawer"
import { TaskCenter } from "@/components/task-center"
import {
  leads as allLeads,
  topPriorities,
  tasks,
  automationRules,
} from "@/lib/mock-data"
import type { Lead } from "@/lib/mock-data"
import type { AppView } from "@/components/top-bar"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeView, setActiveView] = useState<AppView>("pipeline")

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return allLeads
    const q = searchQuery.toLowerCase()
    return allLeads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.title.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
    setDrawerOpen(true)
  }

  const handleLeadClickById = (leadId: string) => {
    const lead = allLeads.find((l) => l.id === leadId)
    if (lead) {
      setSelectedLead(lead)
      setDrawerOpen(true)
    }
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => setSelectedLead(null), 300)
  }

  const totalPipeline = allLeads.reduce((sum, l) => sum + l.estimatedValue, 0)
  const highCount = allLeads.filter(
    (l) => l.convertLikelihood === "High"
  ).length

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Stats strip */}
      <div className="flex items-center gap-6 border-b border-border bg-card/50 px-6 py-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Total Leads</span>
          <span className="font-semibold text-foreground">
            {allLeads.length}
          </span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Pipeline Value</span>
          <span className="font-semibold text-primary">
            ${(totalPipeline / 1000).toFixed(0)}k
          </span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">High Likelihood</span>
          <span className="font-semibold text-foreground">{highCount}</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Avg Fit Score</span>
          <span className="font-semibold text-foreground">
            {Math.round(
              allLeads.reduce((sum, l) => sum + l.aiFitScore, 0) /
                allLeads.length
            )}
          </span>
        </div>
      </div>

      {/* Main content */}
      {activeView === "pipeline" ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <PipelineBoard leads={filteredLeads} onLeadClick={handleLeadClick} />
          </div>
          <div className="hidden w-[340px] shrink-0 lg:block">
            <AIPriorities
              priorities={topPriorities}
              onLeadClick={handleLeadClick}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <TaskCenter
            tasks={tasks}
            automationRules={automationRules}
            onLeadClick={handleLeadClickById}
          />
        </div>
      )}

      <LeadDrawer
        lead={selectedLead}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  )
}
