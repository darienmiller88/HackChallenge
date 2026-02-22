"use client"

import { Search, Plus, CalendarSync, Sparkles, LayoutGrid, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"

export type AppView = "pipeline" | "tasks"

interface TopBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeView: AppView
  onViewChange: (view: AppView) => void
}

const navItems: { key: AppView; label: string; icon: React.ReactNode }[] = [
  { key: "pipeline", label: "Pipeline", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { key: "tasks", label: "Tasks", icon: <ListChecks className="h-3.5 w-3.5" /> },
]

export function TopBar({ searchQuery, onSearchChange, activeView, onViewChange }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              NeuralCRM
            </h1>
          </div>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            AI-Powered
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 rounded-lg bg-secondary/50 p-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeView === item.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-64 rounded-lg border border-border bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <Button size="sm" variant="outline" className="gap-2 text-foreground">
          <CalendarSync className="h-4 w-4" />
          Sync Calendly
        </Button>
        <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>
    </header>
  )
}
