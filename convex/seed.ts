import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Seed demo data for the dashboard
export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already seeded
    const existingRevenue = await ctx.db.query("revenue").first();
    if (existingRevenue) return { message: "Already seeded" };

    // Create demo profile
    const profileId = await ctx.db.insert("profiles", {
      userId,
      name: "Max Müller",
      email: "max@example.com",
      role: "founder",
      createdAt: Date.now(),
    });

    // Create team profiles
    const setterId = await ctx.db.insert("profiles", {
      userId,
      name: "Anna Schmidt",
      email: "anna@example.com",
      role: "setter",
      createdAt: Date.now(),
    });

    const closerId = await ctx.db.insert("profiles", {
      userId,
      name: "Thomas Weber",
      email: "thomas@example.com",
      role: "closer",
      createdAt: Date.now(),
    });

    const coachId = await ctx.db.insert("profiles", {
      userId,
      name: "Lisa Koch",
      email: "lisa@example.com",
      role: "coach",
      createdAt: Date.now(),
    });

    // Create offers
    const premiumOfferId = await ctx.db.insert("offers", {
      name: "Premium Transformation",
      price: 12000,
      paymentType: "installment",
      installments: 6,
      active: true,
      createdAt: Date.now(),
    });

    const eliteOfferId = await ctx.db.insert("offers", {
      name: "Elite Coaching",
      price: 24000,
      paymentType: "installment",
      installments: 12,
      active: true,
      createdAt: Date.now(),
    });

    const starterOfferId = await ctx.db.insert("offers", {
      name: "Starter Program",
      price: 4500,
      paymentType: "full",
      active: true,
      createdAt: Date.now(),
    });

    // Create clients with various statuses
    const clientNames = [
      "Michael Hoffmann", "Sandra Bauer", "Klaus Fischer", "Maria Wagner",
      "Peter Schneider", "Julia Mayer", "Stefan Zimmermann", "Claudia Braun",
      "Andreas Schäfer", "Sabine Richter", "Martin Hofmann", "Katrin Wolf",
      "Jürgen Berg", "Monika Lange", "Helmut Frank", "Eva Krause",
      "Wolfgang Meyer", "Petra Huber", "Frank Müller", "Silke Hansen"
    ];

    const sources = ["Facebook", "Instagram", "Google", "Referral", "YouTube", "TikTok"];
    const cohorts = ["2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1"];
    const statuses: Array<"lead" | "booked" | "active" | "churned" | "at_risk"> =
      ["lead", "booked", "active", "churned", "at_risk"];

    const clientIds: Array<{ id: string; status: string }> = [];

    for (let i = 0; i < clientNames.length; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const cohort = cohorts[Math.floor(Math.random() * cohorts.length)];
      const totalPaid = status === "active" ? Math.random() * 15000 + 3000 : 0;
      const totalOwed = status === "active" ? Math.random() * 10000 : 0;

      const clientId = await ctx.db.insert("clients", {
        ghlId: `ghl_${i + 1000}`,
        name: clientNames[i],
        email: `${clientNames[i].toLowerCase().replace(" ", ".")}@example.com`,
        phone: `+49 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
        status,
        source,
        assignedTo: [setterId, closerId, coachId][Math.floor(Math.random() * 3)],
        offerId: [premiumOfferId, eliteOfferId, starterOfferId][Math.floor(Math.random() * 3)],
        cohort,
        totalPaid,
        totalOwed,
        lastContactDate: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        churnRiskScore: status === "at_risk" ? Math.random() * 40 + 60 : Math.random() * 30,
        createdAt: Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000,
      });

      clientIds.push({ id: clientId, status });
    }

    // Create revenue records
    const revenueTypes: Array<"collected" | "booked" | "installment" | "overdue"> =
      ["collected", "booked", "installment", "overdue"];
    const paymentSources: Array<"stripe" | "paypal"> = ["stripe", "paypal"];

    for (let i = 0; i < 50; i++) {
      const type = revenueTypes[Math.floor(Math.random() * revenueTypes.length)];
      const status = type === "collected" ? "paid" :
        type === "overdue" ? "overdue" :
        Math.random() > 0.3 ? "pending" : "paid";

      await ctx.db.insert("revenue", {
        source: paymentSources[Math.floor(Math.random() * 2)],
        type,
        amount: Math.floor(Math.random() * 5000 + 500),
        currency: "EUR",
        clientId: clientIds[Math.floor(Math.random() * clientIds.length)].id as any,
        offerId: [premiumOfferId, eliteOfferId, starterOfferId][Math.floor(Math.random() * 3)],
        dueDate: type === "installment" || type === "overdue"
          ? Date.now() + (Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000
          : undefined,
        collectedDate: status === "paid" ? Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000 : undefined,
        installmentNumber: type === "installment" ? Math.floor(Math.random() * 6) + 1 : undefined,
        totalInstallments: type === "installment" ? 6 : undefined,
        status: status as any,
        createdAt: Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
      });
    }

    // Create appointments
    const appointmentTypes: Array<"discovery" | "strategy" | "coaching" | "followup"> =
      ["discovery", "strategy", "coaching", "followup"];
    const appointmentStatuses: Array<"scheduled" | "completed" | "noshow" | "cancelled" | "rescheduled"> =
      ["scheduled", "completed", "noshow", "cancelled", "rescheduled"];

    for (let i = 0; i < 40; i++) {
      const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
      const status = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];

      await ctx.db.insert("appointments", {
        ghlId: `appt_${i + 2000}`,
        clientId: clientIds[Math.floor(Math.random() * clientIds.length)].id as any,
        type,
        scheduledAt: Date.now() + (Math.random() - 0.3) * 14 * 24 * 60 * 60 * 1000,
        status,
        assignedTo: [setterId, closerId, coachId][Math.floor(Math.random() * 3)],
        notes: status === "completed" ? "Great call, client is motivated!" : undefined,
        createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      });
    }

    // Create sales records
    const salesTypes: Array<"call" | "demo" | "close" | "followup"> = ["call", "demo", "close", "followup"];
    const outcomes: Array<"success" | "pending" | "lost" | "noshow"> = ["success", "pending", "lost", "noshow"];

    for (let i = 0; i < 60; i++) {
      const type = salesTypes[Math.floor(Math.random() * salesTypes.length)];
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

      await ctx.db.insert("sales", {
        clientId: clientIds[Math.floor(Math.random() * clientIds.length)].id as any,
        repId: [setterId, closerId][Math.floor(Math.random() * 2)],
        type,
        outcome,
        amount: type === "close" && outcome === "success"
          ? [4500, 12000, 24000][Math.floor(Math.random() * 3)]
          : undefined,
        offerId: type === "close" && outcome === "success"
          ? [premiumOfferId, eliteOfferId, starterOfferId][Math.floor(Math.random() * 3)]
          : undefined,
        notes: outcome === "success" ? "Deal closed!" : undefined,
        createdAt: Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
      });
    }

    // Create AI insights
    const insightTypes: Array<"revenue" | "churn" | "sales" | "forecast" | "alert"> =
      ["revenue", "churn", "sales", "forecast", "alert"];
    const severities: Array<"info" | "warning" | "critical" | "positive"> =
      ["info", "warning", "critical", "positive"];

    const insightTemplates = [
      { type: "revenue", title: "Cash Flow Alert", description: "€8,500 in installments due this week. Follow-up recommended for 3 overdue accounts.", severity: "warning" },
      { type: "churn", title: "Churn Risk Detected", description: "Maria Wagner shows 78% churn probability. No contact in 14 days.", severity: "critical" },
      { type: "sales", title: "Close Rate Improving", description: "Thomas Weber's close rate increased 12% this month. Consider promoting best practices.", severity: "positive" },
      { type: "forecast", title: "Q2 Projection Update", description: "Based on current pipeline, Q2 revenue projected at €145,000 (+15% vs Q1).", severity: "info" },
      { type: "alert", title: "Payment Recovery", description: "2 overdue payments recovered totaling €4,200. Recovery rate at 85%.", severity: "positive" },
      { type: "churn", title: "Cohort Retention Drop", description: "2024-Q3 cohort showing 15% lower retention than average. Review onboarding.", severity: "warning" },
      { type: "sales", title: "Lead Quality Issue", description: "TikTok leads converting 40% below average. Consider reallocating budget.", severity: "warning" },
    ];

    for (const template of insightTemplates) {
      await ctx.db.insert("insights", {
        type: template.type as any,
        title: template.title,
        description: template.description,
        severity: template.severity as any,
        acknowledged: false,
        createdAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      });
    }

    return { message: "Demo data seeded successfully!" };
  },
});
