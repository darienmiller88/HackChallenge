"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  Sparkles,
  Send,
  CalendarPlus,
  Globe,
  Copy,
  Check,
  MessageSquare,
  Video,
  AlertTriangle,
  ArrowRight,
  Linkedin,
  PhoneCall,
  FileText,
  Brain,
  ListTodo,
  StickyNote,
  Zap,
  ChevronDown,
  MessageCircle,
  Mic,
  Users,
  ThumbsUp,
  ThumbsDown,
  Minus,
  TrendingDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import type { Lead, TimelineEvent, Sentiment } from "@/lib/mock-data"

interface LeadDrawerProps {
  lead: Lead | null
  open: boolean
  onClose: () => void
}

function getScoreGrade(score: number) {
  if (score >= 90) return { label: "Excellent", color: "text-primary" }
  if (score >= 75) return { label: "Good", color: "text-chart-3" }
  if (score >= 60) return { label: "Fair", color: "text-chart-3" }
  return { label: "Low", color: "text-muted-foreground" }
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

function getSentimentIcon(sentiment: Sentiment) {
  switch (sentiment) {
    case "positive":
      return <span className="text-primary" aria-label="Positive">+</span>
    case "negative":
      return <span className="text-destructive" aria-label="Negative">!</span>
    default:
      return <span className="text-muted-foreground" aria-label="Neutral">~</span>
  }
}

function getSentimentBadgeStyle(sentiment: Sentiment) {
  switch (sentiment) {
    case "positive":
      return "bg-primary/10 text-primary border-primary/20"
    case "negative":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

function getEventIcon(type: TimelineEvent["type"]) {
  switch (type) {
    case "email_sent":
      return <Send className="h-3.5 w-3.5" />
    case "email_received":
      return <Mail className="h-3.5 w-3.5" />
    case "call":
      return <PhoneCall className="h-3.5 w-3.5" />
    case "meeting":
      return <Video className="h-3.5 w-3.5" />
    case "task_created":
      return <ListTodo className="h-3.5 w-3.5" />
    case "ai_insight":
      return <Brain className="h-3.5 w-3.5" />
    case "note":
      return <StickyNote className="h-3.5 w-3.5" />
  }
}

function getEventColor(type: TimelineEvent["type"]) {
  switch (type) {
    case "email_sent":
      return "bg-chart-2/15 text-chart-2"
    case "email_received":
      return "bg-primary/15 text-primary"
    case "call":
      return "bg-chart-3/15 text-chart-3"
    case "meeting":
      return "bg-chart-5/15 text-chart-5"
    case "task_created":
      return "bg-muted text-muted-foreground"
    case "ai_insight":
      return "bg-primary/15 text-primary"
    case "note":
      return "bg-chart-3/10 text-chart-3"
  }
}

function getChannelIcon(channel: string) {
  switch (channel) {
    case "Email":
      return <Mail className="h-4 w-4" />
    case "LinkedIn":
      return <Linkedin className="h-4 w-4" />
    case "Call":
      return <PhoneCall className="h-4 w-4" />
    default:
      return <MessageSquare className="h-4 w-4" />
  }
}

// ---- Sub-components for each tab ----

function OverviewTab({ lead }: { lead: Lead }) {
  const grade = getScoreGrade(lead.aiFitScore)

  return (
    <div className="space-y-5">
      {/* Quick Facts */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/20 px-3 py-2.5">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Company</p>
            <p className="text-sm font-medium text-foreground truncate">{lead.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/20 px-3 py-2.5">
          <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Role</p>
            <p className="text-sm font-medium text-foreground truncate">{lead.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/20 px-3 py-2.5">
          <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Source</p>
            <p className="text-sm font-medium text-foreground truncate">{lead.source}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/20 px-3 py-2.5">
          <DollarSign className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Deal Value</p>
            <p className="text-sm font-bold text-foreground">${(lead.estimatedValue / 1000).toFixed(0)}k / {lead.contractTerm}</p>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">What they care about</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{lead.aiSummary}</p>
      </div>

      {/* AI Score Card */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">AI Scoring</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-card border border-border p-3 text-center">
            <p className="text-2xl font-bold text-primary">{lead.aiFitScore}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Fit Score</p>
            <p className={`text-[10px] font-medium ${grade.color}`}>{grade.label}</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-3 text-center">
            <Badge variant="outline" className={`text-xs ${getLikelihoodStyle(lead.convertLikelihood)}`}>
              {lead.convertLikelihood}
            </Badge>
            <p className="text-[10px] text-muted-foreground mt-1.5">Likelihood</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-3 text-center">
            <p className="text-lg font-bold text-foreground">{lead.stage}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Stage</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {lead.aiReasons.map((reason) => (
            <Badge key={reason} variant="outline" className="text-[10px] px-2 py-0.5 bg-primary/5 text-primary border-primary/20">
              {reason}
            </Badge>
          ))}
        </div>
      </div>

      {/* Objections */}
      {lead.objections.length > 0 && (
        <div className="rounded-xl border border-chart-3/20 bg-chart-3/5 p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <AlertTriangle className="h-4 w-4 text-chart-3" />
            <h3 className="text-sm font-semibold text-foreground">Known Objections</h3>
          </div>
          <ul className="space-y-2">
            {lead.objections.map((objection, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-chart-3 shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">{objection}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contact */}
      <div>
        <h3 className="text-xs font-semibold text-foreground mb-2.5 uppercase tracking-wider">Contact</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/20 px-3 py-2.5">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{lead.email}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/20 px-3 py-2.5">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{lead.phone}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Notes</h3>
        <div className="rounded-lg border border-border bg-secondary/20 p-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{lead.notes}</p>
        </div>
      </div>

      {/* Next Best Action */}
      <Button size="lg" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold">
        <ArrowRight className="h-5 w-5" />
        {lead.nextAction}
      </Button>
    </div>
  )
}

function TimelineTab({ lead }: { lead: Lead }) {
  return (
    <div className="space-y-1">
      {lead.timeline.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No timeline events yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />

          <div className="space-y-0.5">
            {lead.timeline.map((event, index) => (
              <div key={event.id} className="relative flex gap-3 py-2.5 px-1">
                {/* Icon node */}
                <div className={`relative z-10 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-secondary/20 p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground leading-snug">{event.summary}</p>
                  </div>

                  {event.details && (
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{event.details}</p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-muted-foreground">{event.date}</span>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${getSentimentBadgeStyle(event.sentiment)}`}>
                      {getSentimentIcon(event.sentiment)}
                      <span className="ml-1">{event.sentimentLabel}</span>
                    </Badge>
                  </div>

                  {/* Generate follow-up button for non-AI events */}
                  {event.type !== "ai_insight" && event.type !== "task_created" && index < 3 && (
                    <Button variant="ghost" size="sm" className="mt-2 h-7 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 px-2">
                      <Sparkles className="h-3 w-3" />
                      Generate follow-up
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AIRecommendationsTab({ lead }: { lead: Lead }) {
  const [copied, setCopied] = useState(false)
  const rec = lead.aiRecommendation

  const handleCopy = () => {
    navigator.clipboard.writeText(rec.suggestedMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Best Channel */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Best Channel</p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {getChannelIcon(rec.bestChannel)}
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{rec.bestChannel}</p>
            <p className="text-xs text-muted-foreground">Recommended outreach channel</p>
          </div>
        </div>
      </div>

      {/* Best Timing */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Best Timing</p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/15 text-chart-3">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{rec.bestTiming}</p>
            <p className="text-xs text-muted-foreground">Optimal time to reach out</p>
          </div>
        </div>
      </div>

      {/* Suggested Message */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Suggested Message</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="rounded-lg bg-card border border-border p-3">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{rec.suggestedMessage}</p>
        </div>
      </div>

      {/* Confidence */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">AI Confidence</p>
          <span className="text-lg font-bold text-primary">{rec.confidence}%</span>
        </div>
        <Progress value={rec.confidence} className="h-2" />
        <p className="text-xs text-muted-foreground leading-relaxed mt-3">{rec.reasoning}</p>
      </div>
    </div>
  )
}

function MeetingTranscriptTab({ lead }: { lead: Lead }) {
  // Generate contextual meeting transcript from lead data
  const transcript = [
    {
      speaker: "You",
      time: "0:00",
      text: `Thanks for joining, ${lead.name.split(" ")[0]}. I wanted to walk you through how our platform can help ${lead.company} with some of the challenges you mentioned.`,
    },
    {
      speaker: lead.name.split(" ")[0],
      time: "0:32",
      text: `Absolutely. We've been evaluating a few solutions. The main thing for us is ${lead.aiSummary.toLowerCase().slice(0, 80)}...`,
    },
    {
      speaker: "You",
      time: "1:15",
      text: "That makes a lot of sense. Let me show you how we handle that specifically. We've seen similar patterns with teams at your scale.",
    },
    {
      speaker: lead.name.split(" ")[0],
      time: "2:40",
      text: `One concern I have is ${lead.objections.length > 0 ? lead.objections[0].toLowerCase() : "making sure the onboarding is smooth for our team"}. That's been an issue with tools we've tried before.`,
    },
    {
      speaker: "You",
      time: "3:22",
      text: "Totally understandable. We actually have a dedicated onboarding team and most customers are fully ramped within two weeks. I can connect you with a reference if that helps.",
    },
    {
      speaker: lead.name.split(" ")[0],
      time: "4:05",
      text: "That would be great. Also, can you go over the pricing tiers? We're looking at somewhere between 50 to 100 seats initially.",
    },
    {
      speaker: "You",
      time: "4:45",
      text: `For that range, I'd recommend our Growth plan. Given ${lead.company}'s needs, I think the ${lead.contractTerm} option gives you the best per-seat rate. That would come out to around $${(lead.estimatedValue / 1000).toFixed(0)}k.`,
    },
    {
      speaker: lead.name.split(" ")[0],
      time: "5:30",
      text: "That's within our budget range. Let me bring this back to the team and we can set up a follow-up to discuss next steps.",
    },
    {
      speaker: "You",
      time: "6:10",
      text: "Perfect. I'll send over a summary and the proposal doc after this call. Looking forward to it.",
    },
  ]

  const keyMoments = [
    { time: "0:32", label: "Pain point mentioned", sentiment: "neutral" as const },
    { time: "2:40", label: "Objection raised", sentiment: "negative" as const },
    { time: "4:05", label: "Budget discussion", sentiment: "positive" as const },
    { time: "5:30", label: "Buying signal", sentiment: "positive" as const },
  ]

  return (
    <div className="space-y-4">
      {/* Meeting header */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/15 text-chart-5">
            <Video className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Discovery Call</p>
            <p className="text-xs text-muted-foreground">
              {lead.lastTouch} &middot; 12 min &middot; 2 participants
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">2</span>
          </div>
        </div>
      </div>

      {/* AI key moments */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Key Moments</h3>
        </div>
        <div className="space-y-2">
          {keyMoments.map((moment) => (
            <div key={moment.time} className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-muted-foreground w-8 shrink-0">
                {moment.time}
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${moment.sentiment === "positive"
                    ? "bg-primary"
                    : moment.sentiment === "negative"
                      ? "bg-destructive"
                      : "bg-muted-foreground"
                  }`}
              />
              <span className="text-xs text-foreground">{moment.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Intelligence Sentiment Panel */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-4 w-4 text-chart-5" />
          <h3 className="text-sm font-semibold text-foreground">Meeting Sentiment</h3>
        </div>

        {/* Overall score + tone */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <span className="text-2xl font-bold text-primary">
              {lead.sentiment === "positive" ? 82 : lead.sentiment === "neutral" ? 58 : 35}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              {lead.sentiment === "positive"
                ? "Highly Positive"
                : lead.sentiment === "neutral"
                  ? "Mixed Signals"
                  : "Needs Attention"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lead.sentiment === "positive"
                ? "Prospect showed strong interest and buying signals throughout"
                : lead.sentiment === "neutral"
                  ? "Some interest expressed but objections remain unresolved"
                  : "Significant objections raised with low engagement signals"}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              {lead.sentiment === "positive" ? (
                <ThumbsUp className="h-3.5 w-3.5 text-primary" />
              ) : lead.sentiment === "negative" ? (
                <ThumbsDown className="h-3.5 w-3.5 text-destructive" />
              ) : (
                <Minus className="h-3.5 w-3.5 text-chart-3" />
              )}
              <span className={`text-xs font-medium ${lead.sentiment === "positive"
                  ? "text-primary"
                  : lead.sentiment === "negative"
                    ? "text-destructive"
                    : "text-chart-3"
                }`}>
                {lead.sentiment === "positive"
                  ? "Optimistic"
                  : lead.sentiment === "neutral"
                    ? "Cautious"
                    : "Guarded"}
              </span>
            </div>
          </div>
        </div>

        <Separator className="mb-3" />

        {/* Positive signals */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">Positive Signals</span>
          </div>
          <div className="space-y-1.5">
            {[
              "Asked about pricing and seat counts",
              "Mentioned budget is available",
              "Agreed to schedule a follow-up",
            ].map((signal) => (
              <div key={signal} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-xs text-muted-foreground">{signal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Negative signals */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-semibold text-foreground">Negative Signals</span>
          </div>
          <div className="space-y-1.5">
            {[
              "Raised objection about past onboarding issues",
              "Mentioned evaluating competitor tools",
            ].map((signal) => (
              <div key={signal} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                <span className="text-xs text-muted-foreground">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div>
        <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
          Full Transcript
        </h3>
        <div className="space-y-3">
          {transcript.map((line, i) => {
            const isYou = line.speaker === "You"
            return (
              <div key={i} className="flex gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 ${isYou
                      ? "bg-primary/15 text-primary"
                      : "bg-chart-5/15 text-chart-5"
                    }`}
                >
                  {isYou ? "You" : lead.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-foreground">
                      {line.speaker}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {line.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {line.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---- Main Drawer ----

export function LeadDrawer({ lead, open, onClose }: LeadDrawerProps) {
  if (!lead) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl p-0 border-border bg-card">
        {/* Header */}
          <div className="flex flex-col h-full">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-base font-bold text-primary">
              {lead.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-lg text-foreground">{lead.name}</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                {lead.title} at {lead.company}
              </SheetDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={`text-[10px] ${getLikelihoodStyle(lead.convertLikelihood)}`}>
                  {lead.convertLikelihood} Likelihood
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-chart-2/10 text-chart-2 border-chart-2/20">
                  {lead.stage}
                </Badge>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lead.lastTouch}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-3 shrink-0">
            <TabsList className="w-full bg-secondary h-9">
              <TabsTrigger value="overview" className="flex-1 gap-1.5 text-xs">
                <FileText className="h-3.5 w-3.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex-1 gap-1.5 text-xs">
                <Clock className="h-3.5 w-3.5" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex-1 gap-1.5 text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                AI Recs
              </TabsTrigger>
              <TabsTrigger value="transcript" className="flex-1 gap-1.5 text-xs">
                <Mic className="h-3.5 w-3.5" />
                Transcript
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 h-full">
            <div className="px-6 py-4">
              <TabsContent value="overview" className="mt-0">
                <OverviewTab lead={lead} />
              </TabsContent>
              <TabsContent value="timeline" className="mt-0">
                <TimelineTab lead={lead} />
              </TabsContent>
              <TabsContent value="ai" className="mt-0">
                <AIRecommendationsTab lead={lead} />
              </TabsContent>
              <TabsContent value="transcript" className="mt-0">
                <MeetingTranscriptTab lead={lead} />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
        </div>

        {/* Sticky action bar */}
        <div className="shrink-0 border-t border-border bg-card px-6 py-3">
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 h-9">
              <Zap className="h-3.5 w-3.5" />
              Generate cold email
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-foreground h-9">
                  <Send className="h-3.5 w-3.5" />
                  Follow-up
                  <ChevronDown className="h-3 w-3 ml-auto opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem className="gap-2">
                  <PhoneCall className="h-4 w-4" />
                  Call
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Text
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-foreground h-9">
              <ListTodo className="h-3.5 w-3.5" />
              Create task
            </Button>
            <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-foreground h-9">
              <CalendarPlus className="h-3.5 w-3.5" />
              Book meeting
            </Button>
          </div>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
