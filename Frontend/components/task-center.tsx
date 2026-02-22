"use client"

import { useState, useMemo } from "react"
import {
  Clock,
  CalendarClock,
  AlertTriangle,
  Sparkles,
  Zap,
  Check,
  ChevronRight,
  ArrowRight,
  CircleCheck,
  Bot,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Task, AutomationRule } from "@/lib/mock-data"

interface TaskCenterProps {
  tasks: Task[]
  automationRules: AutomationRule[]
  onLeadClick: (leadId: string) => void
}

type TaskTab = "today" | "upcoming" | "overdue"

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/15 text-destructive border-destructive/20",
  medium: "bg-chart-3/15 text-chart-3 border-chart-3/20",
  low: "bg-muted text-muted-foreground border-border",
}

const priorityLabels: Record<string, string> = {
  high: "High",
  medium: "Med",
  low: "Low",
}

const stageColors: Record<PipelineStage, string> = {
  New: "bg-chart-2/15 text-chart-2 border-chart-2/20",
  Contacted: "bg-chart-5/15 text-chart-5 border-chart-5/20",
  "Meeting Booked": "bg-chart-3/15 text-chart-3 border-chart-3/20",
  "Demo Done": "bg-primary/15 text-primary border-primary/20",
  "Proposal Sent": "bg-chart-1/15 text-chart-1 border-chart-1/20",
  Negotiation: "bg-chart-4/15 text-chart-4 border-chart-4/20",
  Closed: "bg-primary/15 text-primary border-primary/20",
}

function TaskCard({
  task,
  onLeadClick,
}: {
  task: Task
  onLeadClick: (leadId: string) => void
}) {
  return (
    <button
      onClick={() => onLeadClick(task.leadId)}
      className="group w-full rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground mt-0.5">
            {task.leadName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">
                {task.title}
              </p>
              {task.aiGenerated && (
                <Bot className="h-3.5 w-3.5 shrink-0 text-primary" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {task.leadName} &middot; {task.company}
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
      </div>

      <div className="mt-3 flex items-center gap-1.5 rounded-md bg-secondary/60 px-2.5 py-1.5">
        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
        <p className="text-xs text-secondary-foreground truncate">
          {task.recommendedAction}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0 h-5 ${priorityStyles[task.priority]}`}
        >
          {priorityLabels[task.priority]}
        </Badge>
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0 h-5 ${stageColors[task.stage]}`}
        >
          {task.stage}
        </Badge>
        <span
          className={`ml-auto flex items-center gap-1 text-[10px] ${
            task.status === "overdue"
              ? "text-destructive"
              : task.status === "today"
                ? "text-chart-3"
                : "text-muted-foreground"
          }`}
        >
          <Clock className="h-3 w-3" />
          {task.dueDateLabel}
        </span>
      </div>
    </button>
  )
}

function AutomationCard({ rules }: { rules: AutomationRule[] }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
          <Zap className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Automation Rules
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {rules.filter((r) => r.enabled).length} of {rules.length} active
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        {rules.map((rule, i) => (
          <div
            key={rule.id}
            className={`flex items-center gap-3 px-4 py-3 ${
              i < rules.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                rule.enabled
                  ? "bg-primary/15"
                  : "bg-muted"
              }`}
            >
              {rule.enabled ? (
                <Check className="h-3 w-3 text-primary" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-medium truncate ${
                  rule.enabled ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {rule.trigger}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {rule.action}
              </p>
            </div>
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                rule.enabled
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {rule.enabled ? "Active" : "Off"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TaskCenter({ tasks, automationRules, onLeadClick }: TaskCenterProps) {
  const [activeTab, setActiveTab] = useState<TaskTab>("today")

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => t.status === activeTab)
  }, [tasks, activeTab])

  const todayCount = tasks.filter((t) => t.status === "today").length
  const upcomingCount = tasks.filter((t) => t.status === "upcoming").length
  const overdueCount = tasks.filter((t) => t.status === "overdue").length

  const tabs: { key: TaskTab; label: string; count: number; icon: React.ReactNode }[] = [
    {
      key: "today",
      label: "Today",
      count: todayCount,
      icon: <Clock className="h-3.5 w-3.5" />,
    },
    {
      key: "upcoming",
      label: "Upcoming",
      count: upcomingCount,
      icon: <CalendarClock className="h-3.5 w-3.5" />,
    },
    {
      key: "overdue",
      label: "Overdue",
      count: overdueCount,
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
    },
  ]

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main task list */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Tab header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-1 rounded-lg bg-secondary/50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                    activeTab === tab.key
                      ? tab.key === "overdue"
                        ? "bg-destructive/15 text-destructive"
                        : "bg-primary/15 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2 p-4">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <CircleCheck className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">
                  All clear
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {`No ${activeTab} tasks to show`}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onLeadClick={onLeadClick} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right sidebar: Automation Rules */}
      <div className="hidden w-[340px] shrink-0 overflow-hidden border-l border-border lg:flex lg:flex-col">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            {/* Summary stats */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Task Summary
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-lg font-bold text-chart-3">{todayCount}</p>
                  <p className="text-[10px] text-muted-foreground">Today</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {upcomingCount}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Upcoming</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-lg font-bold text-destructive">
                    {overdueCount}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Overdue</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden flex">
                {overdueCount > 0 && (
                  <div
                    className="h-full bg-destructive"
                    style={{
                      width: `${(overdueCount / tasks.length) * 100}%`,
                    }}
                  />
                )}
                <div
                  className="h-full bg-chart-3"
                  style={{
                    width: `${(todayCount / tasks.length) * 100}%`,
                  }}
                />
                <div
                  className="h-full bg-muted-foreground/30"
                  style={{
                    width: `${(upcomingCount / tasks.length) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>
                  {tasks.filter((t) => t.aiGenerated).length} AI-generated tasks
                </span>
                <span>{tasks.length} total</span>
              </div>
            </div>

            {/* Automation rules */}
            <AutomationCard rules={automationRules} />
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
