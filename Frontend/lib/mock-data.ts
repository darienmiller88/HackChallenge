export type ConvertLikelihood = "Low" | "Medium" | "High"

export type PipelineStage =
  | "New"
  | "Contacted"
  | "Meeting Booked"
  | "Demo Done"
  | "Proposal Sent"
  | "Negotiation"
  | "Closed"

export type TimelineEventType =
  | "email_sent"
  | "email_received"
  | "call"
  | "meeting"
  | "task_created"
  | "ai_insight"
  | "note"

export type Sentiment = "positive" | "neutral" | "negative"

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  date: string
  summary: string
  sentiment: Sentiment
  sentimentLabel: string
  details?: string
}

export interface AIRecommendation {
  bestChannel: string
  bestTiming: string
  suggestedMessage: string
  confidence: number
  reasoning: string
}

export type TaskPriority = "high" | "medium" | "low"
export type TaskStatus = "today" | "upcoming" | "overdue"

export interface Task {
  id: string
  title: string
  leadId: string
  leadName: string
  company: string
  stage: PipelineStage
  recommendedAction: string
  dueDate: string
  dueDateLabel: string
  status: TaskStatus
  priority: TaskPriority
  aiGenerated: boolean
}

export interface AutomationRule {
  id: string
  trigger: string
  action: string
  enabled: boolean
}

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  title: string
  aiFitScore: number
  convertLikelihood: ConvertLikelihood
  nextAction: string
  lastTouch: string
  stage: PipelineStage
  estimatedValue: number
  contractTerm: string
  aiReasons: string[]
  notes: string
  source: string
  avatarInitials: string
  aiSummary: string
  objections: string[]
  timeline: TimelineEvent[]
  aiRecommendation: AIRecommendation
  sentiment: Sentiment
}

export const PIPELINE_STAGES: PipelineStage[] = [
  "New",
  "Contacted",
  "Meeting Booked",
  "Demo Done",
  "Proposal Sent",
  "Negotiation",
  "Closed",
]

function generateTimeline(leadName: string, stage: string): TimelineEvent[] {
  const baseTimelines: Record<string, TimelineEvent[]> = {
    "Sarah Chen": [
      { id: "t1", type: "email_sent", date: "Feb 21, 2:30 PM", summary: "Sent revised enterprise proposal with custom pricing", sentiment: "neutral", sentimentLabel: "Informational", details: "Included volume discounts and multi-year options" },
      { id: "t2", type: "email_received", date: "Feb 21, 10:15 AM", summary: "Sarah replied asking for revised pricing on enterprise tier", sentiment: "positive", sentimentLabel: "Interested", details: "She mentioned budget was approved for Q1" },
      { id: "t3", type: "ai_insight", date: "Feb 20, 4:00 PM", summary: "AI detected Sarah opened proposal email 3 times in the last hour", sentiment: "positive", sentimentLabel: "High Interest" },
      { id: "t4", type: "meeting", date: "Feb 19, 2:00 PM", summary: "45-min product walkthrough with Sarah and her tech lead", sentiment: "positive", sentimentLabel: "Went Well", details: "They were particularly impressed with API integrations" },
      { id: "t5", type: "call", date: "Feb 17, 11:00 AM", summary: "Discovery call - discussed pain points with current tool", sentiment: "positive", sentimentLabel: "Engaged", details: "Main issues: lack of AI features, poor reporting" },
      { id: "t6", type: "email_sent", date: "Feb 15, 9:00 AM", summary: "Sent initial outreach with case study attachment", sentiment: "neutral", sentimentLabel: "Outreach" },
    ],
    "David Kim": [
      { id: "t1", type: "email_received", date: "Feb 21, 3:45 PM", summary: "David shared the contract with legal team for review", sentiment: "positive", sentimentLabel: "Progressing", details: "Expects legal review to complete by EOW" },
      { id: "t2", type: "ai_insight", date: "Feb 21, 1:00 PM", summary: "AI detected contract link opened by 3 different Vercel team members", sentiment: "positive", sentimentLabel: "Team Buy-in" },
      { id: "t3", type: "meeting", date: "Feb 20, 10:00 AM", summary: "Final pricing negotiation - agreed on 36-month terms", sentiment: "positive", sentimentLabel: "Agreed", details: "Negotiated 15% volume discount for 36-month commitment" },
      { id: "t4", type: "call", date: "Feb 18, 3:00 PM", summary: "Technical deep dive with Vercel engineering team", sentiment: "positive", sentimentLabel: "Impressed", details: "Covered API architecture and security compliance" },
      { id: "t5", type: "task_created", date: "Feb 17, 9:00 AM", summary: "Created: Send Vercel-specific security whitepaper", sentiment: "neutral", sentimentLabel: "Action Item" },
      { id: "t6", type: "meeting", date: "Feb 14, 2:00 PM", summary: "Initial demo with David and 4 team members", sentiment: "positive", sentimentLabel: "Strong Interest" },
      { id: "t7", type: "note", date: "Feb 12, 5:00 PM", summary: "Met David at SaaStr conference - strong product interest", sentiment: "positive", sentimentLabel: "Warm Lead" },
    ],
    "Elena Rodriguez": [
      { id: "t1", type: "ai_insight", date: "Feb 21, 9:00 AM", summary: "No contact in 2 days - risk of going cold. Immediate follow-up recommended", sentiment: "negative", sentimentLabel: "At Risk" },
      { id: "t2", type: "email_sent", date: "Feb 19, 11:00 AM", summary: "Sent Figma-specific case study as requested", sentiment: "neutral", sentimentLabel: "Follow-up" },
      { id: "t3", type: "meeting", date: "Feb 18, 1:00 PM", summary: "Full product demo for Elena and sales leadership team", sentiment: "positive", sentimentLabel: "Very Positive", details: "Team loved the AI recommendations engine" },
      { id: "t4", type: "call", date: "Feb 15, 4:00 PM", summary: "Discovery call - mapped out Figma's sales workflow", sentiment: "positive", sentimentLabel: "Detailed", details: "Currently using 3 different tools, looking to consolidate" },
      { id: "t5", type: "email_received", date: "Feb 14, 2:00 PM", summary: "Elena responded to LinkedIn outreach requesting more info", sentiment: "positive", sentimentLabel: "Interested" },
    ],
  }

  return baseTimelines[leadName] || [
    { id: "t1", type: "email_sent", date: "Feb 20, 10:00 AM", summary: "Sent initial outreach email with product overview", sentiment: "neutral", sentimentLabel: "Outreach" },
    { id: "t2", type: "ai_insight", date: "Feb 19, 3:00 PM", summary: `AI scored this lead based on company fit and engagement signals`, sentiment: "neutral", sentimentLabel: "Scored" },
  ]
}

function generateAIRecommendation(lead: Partial<Lead>): AIRecommendation {
  const recs: Record<string, AIRecommendation> = {
    "Sarah Chen": {
      bestChannel: "Email",
      bestTiming: "Today, 2-4 PM PST",
      suggestedMessage: "Hi Sarah, following up on the revised pricing we discussed. I've included the volume discount structure for the 24-month enterprise plan. Happy to jump on a quick call if you'd like to walk through the numbers together.",
      confidence: 89,
      reasoning: "Sarah has opened 3 emails in the last 24h and responds fastest to email between 2-4 PM. High engagement pattern suggests she's actively evaluating."
    },
    "David Kim": {
      bestChannel: "Email",
      bestTiming: "Tomorrow, 9-10 AM PST",
      suggestedMessage: "Hi David, just checking in on the contract review. Let me know if legal has any questions - happy to schedule a call with our compliance team to address anything directly.",
      confidence: 94,
      reasoning: "David's team is reviewing the contract. Follow up timing should allow legal review time. His response rate is highest in morning hours."
    },
    "Elena Rodriguez": {
      bestChannel: "LinkedIn",
      bestTiming: "Today, ASAP",
      suggestedMessage: "Hi Elena, hope you had a chance to review the case study I sent over. Would love to hear your team's thoughts on the demo - any questions I can help with?",
      confidence: 76,
      reasoning: "Elena initially responded via LinkedIn and has gone quiet for 2 days. A LinkedIn touchpoint may re-engage her more naturally than email."
    },
    "Marcus Johnson": {
      bestChannel: "Call",
      bestTiming: "Today, 11 AM - 12 PM PST",
      suggestedMessage: "Quick call to confirm demo logistics and pre-qualify specific use cases Marcus wants to see. Focus on CRM migration capabilities.",
      confidence: 82,
      reasoning: "Marcus responds to calls within 1 hour and prefers verbal communication. His replies to emails take 3-4 hours on average."
    },
    "Priya Patel": {
      bestChannel: "Email",
      bestTiming: "Tomorrow, 10 AM IST",
      suggestedMessage: "Hi Priya, wanted to share a case study from a similar growth team that switched to our platform. Their pipeline velocity increased 40% in the first quarter.",
      confidence: 65,
      reasoning: "Priya has low engagement so far. Sending a relevant case study may spark interest. Her timezone suggests morning delivery for best open rates."
    },
    "James Wright": {
      bestChannel: "Email",
      bestTiming: "Today, 3-5 PM PST",
      suggestedMessage: "Hi James, great to connect after your Product Hunt discovery. I'd love to give you a personalized walkthrough of how NeuralCRM can scale with Linear's growth. Would Thursday work?",
      confidence: 87,
      reasoning: "CEOs respond best to concise, value-driven emails. James initiated contact which signals strong intent."
    },
  }

  return recs[lead.name || ""] || {
    bestChannel: "Email",
    bestTiming: "Tomorrow, 10 AM",
    suggestedMessage: `Hi ${lead.name?.split(" ")[0]}, wanted to follow up on our previous conversation. Would love to schedule a time to discuss how we can help ${lead.company}.`,
    confidence: 60,
    reasoning: "Default recommendation based on general engagement patterns."
  }
}

export const leads: Lead[] = [
  {
    id: "1",
    name: "Sarah Chen",
    company: "Stripe",
    email: "sarah.chen@stripe.com",
    phone: "+1 (415) 555-0112",
    title: "VP of Engineering",
    aiFitScore: 94,
    convertLikelihood: "High",
    nextAction: "Send proposal",
    lastTouch: "2h ago",
    stage: "Proposal Sent",
    estimatedValue: 280000,
    contractTerm: "24 months",
    aiReasons: ["Opened email 3x", "Visited pricing page", "High engagement score"],
    notes: "Interested in enterprise plan. Budget approved for Q1.",
    source: "Inbound - Website",
    avatarInitials: "SC",
    aiSummary: "Sarah is a technical decision-maker focused on engineering efficiency and developer experience. She cares about API quality, integration depth, and time-to-value. Her team is frustrated with their current CRM's lack of AI capabilities and poor reporting. Budget is approved for Q1, making this a high-priority close opportunity.",
    objections: ["Wants to ensure API uptime SLA meets 99.99%", "Concerned about data migration complexity from current tool"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "positive",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    company: "Notion",
    email: "mjohnson@notion.so",
    phone: "+1 (628) 555-0198",
    title: "Head of Operations",
    aiFitScore: 87,
    convertLikelihood: "High",
    nextAction: "Schedule demo",
    lastTouch: "5h ago",
    stage: "Meeting Booked",
    estimatedValue: 150000,
    contractTerm: "12 months",
    aiReasons: ["Positive sentiment", "Replied within 1h", "Decision maker"],
    notes: "Looking to replace current CRM by end of quarter.",
    source: "Referral",
    avatarInitials: "MJ",
    aiSummary: "Marcus is operationally focused and cares about workflow automation, team adoption, and reducing tool sprawl. He's been referred by a happy customer and is actively looking to replace their CRM before quarter end. Quick decision-making style.",
    objections: ["Needs SSO support for Notion's security requirements", "Team of 50+ needs smooth onboarding path"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "positive",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    company: "Figma",
    email: "elena.r@figma.com",
    phone: "+1 (415) 555-0234",
    title: "Director of Sales",
    aiFitScore: 91,
    convertLikelihood: "High",
    nextAction: "Follow up call",
    lastTouch: "1d ago",
    stage: "Demo Done",
    estimatedValue: 220000,
    contractTerm: "18 months",
    aiReasons: ["No touch in 2 days", "High fit score", "Requested case study"],
    notes: "Very impressed with AI features during demo.",
    source: "LinkedIn Outbound",
    avatarInitials: "ER",
    aiSummary: "Elena leads Figma's sales org and is deeply invested in pipeline visibility and AI-driven prioritization. She loved the AI recommendations engine during the demo and is looking to consolidate from 3 tools to 1. The 2-day silence is unusual given her high engagement - follow up immediately.",
    objections: ["Evaluating vs. Salesforce Einstein", "Needs Figma workspace integration proof of concept"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "neutral",
  },
  {
    id: "4",
    name: "David Kim",
    company: "Vercel",
    email: "dkim@vercel.com",
    phone: "+1 (628) 555-0176",
    title: "CTO",
    aiFitScore: 96,
    convertLikelihood: "High",
    nextAction: "Send contract",
    lastTouch: "30m ago",
    stage: "Negotiation",
    estimatedValue: 350000,
    contractTerm: "36 months",
    aiReasons: ["Opened email 5x", "Shared with team", "Budget confirmed"],
    notes: "Final negotiations on pricing. Very strong fit.",
    source: "Conference - SaaStr",
    avatarInitials: "DK",
    aiSummary: "David is a technical C-level executive who values engineering-first products and developer experience. He met us at SaaStr and was immediately interested. His team has already reviewed the product, budget is confirmed, and legal is reviewing the contract. This is our highest probability close.",
    objections: ["Negotiating volume discount for 36-month term", "Requires SOC2 Type II compliance documentation"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "positive",
  },
  {
    id: "5",
    name: "Priya Patel",
    company: "Supabase",
    email: "priya@supabase.io",
    phone: "+1 (415) 555-0289",
    title: "Head of Growth",
    aiFitScore: 78,
    convertLikelihood: "Medium",
    nextAction: "Send case study",
    lastTouch: "3d ago",
    stage: "Contacted",
    estimatedValue: 95000,
    contractTerm: "12 months",
    aiReasons: ["No touch in 3 days", "Medium engagement", "Opened 1 email"],
    notes: "Interested but evaluating competitors.",
    source: "Cold Outbound",
    avatarInitials: "PP",
    aiSummary: "Priya is growth-oriented and evaluating multiple CRM solutions simultaneously. She opened one email but hasn't deeply engaged yet. A compelling case study from a similar growth team could differentiate us. Patience and value-driven nurture recommended.",
    objections: ["Comparing with HubSpot and Pipedrive", "Budget not yet approved - needs business case"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "neutral",
  },
  {
    id: "6",
    name: "James Wright",
    company: "Linear",
    email: "james@linear.app",
    phone: "+1 (628) 555-0145",
    title: "CEO",
    aiFitScore: 89,
    convertLikelihood: "High",
    nextAction: "Book meeting",
    lastTouch: "6h ago",
    stage: "New",
    estimatedValue: 175000,
    contractTerm: "24 months",
    aiReasons: ["Decision maker", "Rapid response", "Strong company fit"],
    notes: "Reached out after seeing our product hunt launch.",
    source: "Inbound - Product Hunt",
    avatarInitials: "JW",
    aiSummary: "James is a product-obsessed CEO who discovered us through Product Hunt. He values elegant, fast tools and has the authority to make purchasing decisions quickly. His company Linear is a strong product-fit match given their focus on developer tools. High urgency to capitalize on initial excitement.",
    objections: ["Wants to see how it handles Linear's specific workflow", "Small team - may not need enterprise features"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "positive",
  },
  {
    id: "7",
    name: "Ana Kowalski",
    company: "Loom",
    email: "ana.k@loom.com",
    phone: "+1 (415) 555-0321",
    title: "VP of Sales",
    aiFitScore: 72,
    convertLikelihood: "Medium",
    nextAction: "Send intro email",
    lastTouch: "4d ago",
    stage: "New",
    estimatedValue: 120000,
    contractTerm: "12 months",
    aiReasons: ["No touch in 4 days", "Visited blog 2x"],
    notes: "Showed interest at webinar last week.",
    source: "Webinar",
    avatarInitials: "AK",
    aiSummary: "Ana attended our webinar and showed interest in AI-driven sales coaching features. She leads a mid-size sales team at Loom and is looking for better pipeline visibility. Blog visits suggest she's doing research.",
    objections: ["Needs video integration for Loom-style async communication", "Current contract with competitor expires in Q3"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "neutral",
  },
  {
    id: "8",
    name: "Tom Harris",
    company: "Datadog",
    email: "tharris@datadoghq.com",
    phone: "+1 (212) 555-0198",
    title: "Director of Engineering",
    aiFitScore: 65,
    convertLikelihood: "Low",
    nextAction: "Nurture sequence",
    lastTouch: "6d ago",
    stage: "Contacted",
    estimatedValue: 85000,
    contractTerm: "12 months",
    aiReasons: ["No touch in 6 days", "Low engagement"],
    notes: "Early stage exploration. Long sales cycle expected.",
    source: "Cold Outbound",
    avatarInitials: "TH",
    aiSummary: "Tom is in early exploration mode. Datadog has a long enterprise sales cycle and Tom is not the final decision maker. Low priority but worth nurturing for a potential Q3 opportunity.",
    objections: ["Not the final decision maker", "Current vendor contract doesn't expire until Q3"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "negative",
  },
  {
    id: "9",
    name: "Lisa Chang",
    company: "Amplitude",
    email: "lchang@amplitude.com",
    phone: "+1 (415) 555-0412",
    title: "Head of Revenue Ops",
    aiFitScore: 83,
    convertLikelihood: "Medium",
    nextAction: "Schedule follow-up",
    lastTouch: "1d ago",
    stage: "Demo Done",
    estimatedValue: 160000,
    contractTerm: "18 months",
    aiReasons: ["Positive sentiment", "Asked about integrations", "Shared internally"],
    notes: "Wants to see Salesforce integration before committing.",
    source: "Referral",
    avatarInitials: "LC",
    aiSummary: "Lisa is focused on revenue operations and needs a CRM that integrates deeply with their existing Salesforce instance. She shared the demo internally which is a positive buying signal. The Salesforce integration concern is the primary blocker.",
    objections: ["Salesforce bi-directional sync is a hard requirement", "Team needs Slack integration for notifications"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "positive",
  },
  {
    id: "10",
    name: "Ryan O'Brien",
    company: "Cloudflare",
    email: "robrien@cloudflare.com",
    phone: "+1 (628) 555-0267",
    title: "VP of Business Dev",
    aiFitScore: 92,
    convertLikelihood: "High",
    nextAction: "Finalize terms",
    lastTouch: "4h ago",
    stage: "Closed",
    estimatedValue: 420000,
    contractTerm: "36 months",
    aiReasons: ["Contract signed", "Onboarding scheduled"],
    notes: "Closed! Onboarding starts next Monday.",
    source: "Inbound - Website",
    avatarInitials: "RO",
    aiSummary: "Ryan championed the deal internally at Cloudflare. He was impressed by the AI prioritization engine and the speed of implementation. Contract signed for 36 months. Onboarding scheduled for next Monday.",
    objections: [],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "positive",
  },
  {
    id: "11",
    name: "Michelle Tan",
    company: "Airtable",
    email: "mtan@airtable.com",
    phone: "+1 (415) 555-0533",
    title: "Sales Director",
    aiFitScore: 76,
    convertLikelihood: "Medium",
    nextAction: "Send pricing",
    lastTouch: "2d ago",
    stage: "Meeting Booked",
    estimatedValue: 110000,
    contractTerm: "12 months",
    aiReasons: ["Meeting confirmed", "Asked about pricing"],
    notes: "Meeting scheduled for Thursday. Prepare custom pricing.",
    source: "LinkedIn Outbound",
    avatarInitials: "MT",
    aiSummary: "Michelle is evaluating CRM solutions for her sales team at Airtable. She has a meeting confirmed for Thursday and specifically asked about pricing, which indicates she's in active buying mode. Prepare competitive pricing against their current tools.",
    objections: ["Needs custom field support similar to Airtable flexibility", "Wants to ensure mobile app quality"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "neutral",
  },
  {
    id: "12",
    name: "Alex Petrov",
    company: "GitLab",
    email: "apetrov@gitlab.com",
    phone: "+1 (415) 555-0644",
    title: "Engineering Manager",
    aiFitScore: 58,
    convertLikelihood: "Low",
    nextAction: "Add to nurture",
    lastTouch: "7d ago",
    stage: "Contacted",
    estimatedValue: 70000,
    contractTerm: "12 months",
    aiReasons: ["No touch in 7 days", "Low fit score"],
    notes: "Not a priority. Check back in Q2.",
    source: "Cold Outbound",
    avatarInitials: "AP",
    aiSummary: "Alex is an engineering manager with limited purchasing authority. GitLab's fit score is low due to their existing enterprise CRM investment. Add to long-term nurture and re-evaluate in Q2.",
    objections: ["No budget authority", "Already invested in enterprise CRM solution"],
    timeline: [],
    aiRecommendation: {} as AIRecommendation,
    sentiment: "negative",
  },
]

// Hydrate timelines and AI recommendations
leads.forEach((lead) => {
  lead.timeline = generateTimeline(lead.name, lead.stage)
  lead.aiRecommendation = generateAIRecommendation(lead)
})

export const topPriorities = [
  leads[3], // David Kim - Negotiation
  leads[0], // Sarah Chen - Proposal Sent
  leads[2], // Elena Rodriguez - Demo Done
  leads[5], // James Wright - New, high score
  leads[4], // Priya Patel - No touch in 3 days
]

export const tasks: Task[] = [
  // OVERDUE
  {
    id: "task-1",
    title: "Follow up on proposal",
    leadId: "1",
    leadName: "Sarah Chen",
    company: "Stripe",
    stage: "Proposal Sent",
    recommendedAction: "Send revised pricing with volume discounts",
    dueDate: "Feb 19",
    dueDateLabel: "2 days overdue",
    status: "overdue",
    priority: "high",
    aiGenerated: true,
  },
  {
    id: "task-2",
    title: "Re-engage after silence",
    leadId: "3",
    leadName: "Elena Rodriguez",
    company: "Figma",
    stage: "Demo Done",
    recommendedAction: "Send LinkedIn message with case study results",
    dueDate: "Feb 20",
    dueDateLabel: "1 day overdue",
    status: "overdue",
    priority: "high",
    aiGenerated: true,
  },
  {
    id: "task-3",
    title: "Send nurture content",
    leadId: "8",
    leadName: "Tom Harris",
    company: "Datadog",
    stage: "Contacted",
    recommendedAction: "Add to automated nurture sequence",
    dueDate: "Feb 18",
    dueDateLabel: "3 days overdue",
    status: "overdue",
    priority: "low",
    aiGenerated: false,
  },
  // TODAY
  {
    id: "task-4",
    title: "Send contract for signature",
    leadId: "4",
    leadName: "David Kim",
    company: "Vercel",
    stage: "Negotiation",
    recommendedAction: "Prepare final contract with 36-month terms",
    dueDate: "Feb 21",
    dueDateLabel: "Due today",
    status: "today",
    priority: "high",
    aiGenerated: true,
  },
  {
    id: "task-5",
    title: "Prepare demo environment",
    leadId: "2",
    leadName: "Marcus Johnson",
    company: "Notion",
    stage: "Meeting Booked",
    recommendedAction: "Set up Notion-specific demo workspace with sample data",
    dueDate: "Feb 21",
    dueDateLabel: "Due today",
    status: "today",
    priority: "high",
    aiGenerated: false,
  },
  {
    id: "task-6",
    title: "Send intro email",
    leadId: "7",
    leadName: "Ana Kowalski",
    company: "Loom",
    stage: "New",
    recommendedAction: "Personalized outreach referencing webinar attendance",
    dueDate: "Feb 21",
    dueDateLabel: "Due today",
    status: "today",
    priority: "medium",
    aiGenerated: true,
  },
  {
    id: "task-7",
    title: "Schedule follow-up call",
    leadId: "9",
    leadName: "Lisa Chang",
    company: "Amplitude",
    stage: "Demo Done",
    recommendedAction: "Discuss Salesforce integration requirements in detail",
    dueDate: "Feb 21",
    dueDateLabel: "Due today",
    status: "today",
    priority: "medium",
    aiGenerated: true,
  },
  // UPCOMING
  {
    id: "task-8",
    title: "Book initial meeting",
    leadId: "6",
    leadName: "James Wright",
    company: "Linear",
    stage: "New",
    recommendedAction: "Send calendar link with 30-min discovery call option",
    dueDate: "Feb 22",
    dueDateLabel: "Tomorrow",
    status: "upcoming",
    priority: "high",
    aiGenerated: true,
  },
  {
    id: "task-9",
    title: "Send case study",
    leadId: "5",
    leadName: "Priya Patel",
    company: "Supabase",
    stage: "Contacted",
    recommendedAction: "Share growth team case study with pipeline velocity stats",
    dueDate: "Feb 22",
    dueDateLabel: "Tomorrow",
    status: "upcoming",
    priority: "medium",
    aiGenerated: true,
  },
  {
    id: "task-10",
    title: "Prepare pricing proposal",
    leadId: "11",
    leadName: "Michelle Tan",
    company: "Airtable",
    stage: "Meeting Booked",
    recommendedAction: "Build custom pricing deck for Thursday meeting",
    dueDate: "Feb 23",
    dueDateLabel: "In 2 days",
    status: "upcoming",
    priority: "medium",
    aiGenerated: false,
  },
  {
    id: "task-11",
    title: "Post-close onboarding prep",
    leadId: "10",
    leadName: "Ryan O'Brien",
    company: "Cloudflare",
    stage: "Closed",
    recommendedAction: "Prepare onboarding materials and schedule kickoff call",
    dueDate: "Feb 24",
    dueDateLabel: "In 3 days",
    status: "upcoming",
    priority: "medium",
    aiGenerated: false,
  },
  {
    id: "task-12",
    title: "Check back with prospect",
    leadId: "12",
    leadName: "Alex Petrov",
    company: "GitLab",
    stage: "Contacted",
    recommendedAction: "Light touch email to gauge Q2 interest",
    dueDate: "Mar 1",
    dueDateLabel: "In 8 days",
    status: "upcoming",
    priority: "low",
    aiGenerated: false,
  },
]

export const automationRules: AutomationRule[] = [
  {
    id: "auto-1",
    trigger: "Proposal Sent",
    action: "Auto follow-up in 3 days",
    enabled: true,
  },
  {
    id: "auto-2",
    trigger: "Demo Completed",
    action: "Schedule 3 nurture touches",
    enabled: true,
  },
  {
    id: "auto-3",
    trigger: "Negative sentiment detected",
    action: "Route to manager review",
    enabled: true,
  },
  {
    id: "auto-4",
    trigger: "No contact in 5 days",
    action: "Create re-engagement task",
    enabled: false,
  },
  {
    id: "auto-5",
    trigger: "Contract signed",
    action: "Trigger onboarding workflow",
    enabled: true,
  },
]
