import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles with roles
  profiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("founder"),
      v.literal("setter"),
      v.literal("closer"),
      v.literal("coach"),
      v.literal("admin")
    ),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Revenue records from Stripe/PayPal
  revenue: defineTable({
    source: v.union(v.literal("stripe"), v.literal("paypal")),
    type: v.union(
      v.literal("collected"),
      v.literal("booked"),
      v.literal("installment"),
      v.literal("overdue")
    ),
    amount: v.number(),
    currency: v.string(),
    clientId: v.optional(v.id("clients")),
    offerId: v.optional(v.id("offers")),
    dueDate: v.optional(v.number()),
    collectedDate: v.optional(v.number()),
    installmentNumber: v.optional(v.number()),
    totalInstallments: v.optional(v.number()),
    status: v.union(
      v.literal("paid"),
      v.literal("pending"),
      v.literal("overdue"),
      v.literal("failed")
    ),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_client", ["clientId"])
    .index("by_created", ["createdAt"]),

  // Clients from GoHighLevel
  clients: defineTable({
    ghlId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    status: v.union(
      v.literal("lead"),
      v.literal("booked"),
      v.literal("active"),
      v.literal("churned"),
      v.literal("at_risk")
    ),
    source: v.string(),
    assignedTo: v.optional(v.id("profiles")),
    offerId: v.optional(v.id("offers")),
    cohort: v.string(),
    totalPaid: v.number(),
    totalOwed: v.number(),
    lastContactDate: v.optional(v.number()),
    churnRiskScore: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_source", ["source"])
    .index("by_cohort", ["cohort"])
    .index("by_assigned", ["assignedTo"]),

  // Offers/Products
  offers: defineTable({
    name: v.string(),
    price: v.number(),
    paymentType: v.union(
      v.literal("full"),
      v.literal("installment")
    ),
    installments: v.optional(v.number()),
    active: v.boolean(),
    createdAt: v.number(),
  }),

  // Appointments from GoHighLevel
  appointments: defineTable({
    ghlId: v.string(),
    clientId: v.id("clients"),
    type: v.union(
      v.literal("discovery"),
      v.literal("strategy"),
      v.literal("coaching"),
      v.literal("followup")
    ),
    scheduledAt: v.number(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("noshow"),
      v.literal("cancelled"),
      v.literal("rescheduled")
    ),
    assignedTo: v.optional(v.id("profiles")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_scheduled", ["scheduledAt"])
    .index("by_assigned", ["assignedTo"]),

  // Sales activities
  sales: defineTable({
    clientId: v.id("clients"),
    repId: v.id("profiles"),
    type: v.union(
      v.literal("call"),
      v.literal("demo"),
      v.literal("close"),
      v.literal("followup")
    ),
    outcome: v.union(
      v.literal("success"),
      v.literal("pending"),
      v.literal("lost"),
      v.literal("noshow")
    ),
    amount: v.optional(v.number()),
    offerId: v.optional(v.id("offers")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_rep", ["repId"])
    .index("by_outcome", ["outcome"])
    .index("by_created", ["createdAt"]),

  // AI Insights
  insights: defineTable({
    type: v.union(
      v.literal("revenue"),
      v.literal("churn"),
      v.literal("sales"),
      v.literal("forecast"),
      v.literal("alert")
    ),
    title: v.string(),
    description: v.string(),
    severity: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("critical"),
      v.literal("positive")
    ),
    data: v.optional(v.any()),
    acknowledged: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_severity", ["severity"])
    .index("by_acknowledged", ["acknowledged"]),

  // KPI Snapshots for historical tracking
  kpiSnapshots: defineTable({
    date: v.string(),
    metrics: v.object({
      totalRevenue: v.number(),
      collectedCash: v.number(),
      bookedRevenue: v.number(),
      futureInstallments: v.number(),
      overduePayments: v.number(),
      atRiskReceivables: v.number(),
      totalLeads: v.number(),
      totalAppointments: v.number(),
      completedAppointments: v.number(),
      noShows: v.number(),
      activeClients: v.number(),
      churnedClients: v.number(),
      atRiskClients: v.number(),
      closeRate: v.number(),
      showRate: v.number(),
      leadToClose: v.number(),
      cac: v.number(),
      cashConversion: v.number(),
    }),
    createdAt: v.number(),
  }).index("by_date", ["date"]),
});
