import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user profile with role
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

// Create or update user profile
export const upsertProfile = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("founder"),
      v.literal("setter"),
      v.literal("closer"),
      v.literal("coach"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        role: args.role,
      });
      return existing._id;
    }

    return await ctx.db.insert("profiles", {
      userId,
      name: args.name,
      email: args.email,
      role: args.role,
      createdAt: Date.now(),
    });
  },
});

// Get revenue overview
export const getRevenueOverview = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const allRevenue = await ctx.db.query("revenue").collect();

    const collected = allRevenue
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + r.amount, 0);

    const booked = allRevenue
      .filter((r) => r.type === "booked")
      .reduce((sum, r) => sum + r.amount, 0);

    const futureInstallments = allRevenue
      .filter((r) => r.type === "installment" && r.status === "pending")
      .reduce((sum, r) => sum + r.amount, 0);

    const overdue = allRevenue
      .filter((r) => r.status === "overdue")
      .reduce((sum, r) => sum + r.amount, 0);

    const atRisk = allRevenue
      .filter((r) => r.status === "pending" && r.dueDate && r.dueDate < Date.now() + 7 * 24 * 60 * 60 * 1000)
      .reduce((sum, r) => sum + r.amount, 0);

    // Calculate monthly trend
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

    const thisMonth = allRevenue
      .filter((r) => r.status === "paid" && r.collectedDate && r.collectedDate > thirtyDaysAgo)
      .reduce((sum, r) => sum + r.amount, 0);

    const lastMonth = allRevenue
      .filter((r) => r.status === "paid" && r.collectedDate && r.collectedDate > sixtyDaysAgo && r.collectedDate <= thirtyDaysAgo)
      .reduce((sum, r) => sum + r.amount, 0);

    const trend = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    return {
      collected,
      booked,
      futureInstallments,
      overdue,
      atRisk,
      thisMonth,
      lastMonth,
      trend,
    };
  },
});

// Get client overview
export const getClientOverview = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const allClients = await ctx.db.query("clients").collect();

    const leads = allClients.filter((c) => c.status === "lead").length;
    const booked = allClients.filter((c) => c.status === "booked").length;
    const active = allClients.filter((c) => c.status === "active").length;
    const churned = allClients.filter((c) => c.status === "churned").length;
    const atRisk = allClients.filter((c) => c.status === "at_risk").length;

    // Calculate churn rate (last 30 days)
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const recentChurned = allClients.filter(
      (c) => c.status === "churned" && c.createdAt > thirtyDaysAgo
    ).length;

    const churnRate = active > 0 ? (recentChurned / active) * 100 : 0;

    // Source breakdown
    const sourceMap = new Map<string, number>();
    allClients.forEach((c) => {
      sourceMap.set(c.source, (sourceMap.get(c.source) || 0) + 1);
    });

    const sources = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      count,
      percentage: (count / allClients.length) * 100,
    }));

    // Cohort breakdown
    const cohortMap = new Map<string, { active: number; churned: number }>();
    allClients.forEach((c) => {
      const existing = cohortMap.get(c.cohort) || { active: 0, churned: 0 };
      if (c.status === "active") existing.active++;
      if (c.status === "churned") existing.churned++;
      cohortMap.set(c.cohort, existing);
    });

    const cohorts = Array.from(cohortMap.entries()).map(([cohort, data]) => ({
      cohort,
      ...data,
      retention: data.active + data.churned > 0
        ? (data.active / (data.active + data.churned)) * 100
        : 100,
    }));

    return {
      leads,
      booked,
      active,
      churned,
      atRisk,
      churnRate,
      sources,
      cohorts,
      total: allClients.length,
    };
  },
});

// Get appointments overview
export const getAppointmentsOverview = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const allAppointments = await ctx.db.query("appointments").collect();

    const scheduled = allAppointments.filter((a) => a.status === "scheduled").length;
    const completed = allAppointments.filter((a) => a.status === "completed").length;
    const noShows = allAppointments.filter((a) => a.status === "noshow").length;
    const cancelled = allAppointments.filter((a) => a.status === "cancelled").length;

    const showRate = scheduled + completed + noShows > 0
      ? (completed / (completed + noShows)) * 100
      : 0;

    // Upcoming appointments (next 7 days)
    const now = Date.now();
    const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;

    const upcoming = allAppointments.filter(
      (a) => a.status === "scheduled" && a.scheduledAt > now && a.scheduledAt < sevenDaysFromNow
    );

    // Today's appointments
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const today = allAppointments.filter(
      (a) => a.scheduledAt >= todayStart.getTime() && a.scheduledAt <= todayEnd.getTime()
    );

    return {
      scheduled,
      completed,
      noShows,
      cancelled,
      showRate,
      upcoming: upcoming.length,
      today: today.length,
      total: allAppointments.length,
    };
  },
});

// Get sales performance
export const getSalesPerformance = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const allSales = await ctx.db.query("sales").collect();
    const allClients = await ctx.db.query("clients").collect();
    const allAppointments = await ctx.db.query("appointments").collect();

    const totalCalls = allSales.filter((s) => s.type === "call").length;
    const totalDemos = allSales.filter((s) => s.type === "demo").length;
    const totalCloses = allSales.filter((s) => s.type === "close" && s.outcome === "success").length;
    const totalRevenue = allSales
      .filter((s) => s.type === "close" && s.outcome === "success")
      .reduce((sum, s) => sum + (s.amount || 0), 0);

    // Close rate
    const closeRate = totalDemos > 0 ? (totalCloses / totalDemos) * 100 : 0;

    // Lead to close
    const totalLeads = allClients.filter((c) => c.status === "lead").length;
    const leadToClose = totalLeads > 0 ? (totalCloses / totalLeads) * 100 : 0;

    // Show rate
    const completedAppts = allAppointments.filter((a) => a.status === "completed").length;
    const scheduledAppts = allAppointments.filter((a) =>
      a.status === "completed" || a.status === "noshow"
    ).length;
    const showRate = scheduledAppts > 0 ? (completedAppts / scheduledAppts) * 100 : 0;

    // Rep performance
    const profiles = await ctx.db.query("profiles").collect();
    const repPerformance = profiles
      .filter((p) => p.role === "setter" || p.role === "closer")
      .map((p) => {
        const repSales = allSales.filter((s) => s.repId === p._id);
        const closes = repSales.filter((s) => s.type === "close" && s.outcome === "success").length;
        const demos = repSales.filter((s) => s.type === "demo").length;
        const revenue = repSales
          .filter((s) => s.type === "close" && s.outcome === "success")
          .reduce((sum, s) => sum + (s.amount || 0), 0);

        return {
          id: p._id,
          name: p.name,
          role: p.role,
          closes,
          demos,
          closeRate: demos > 0 ? (closes / demos) * 100 : 0,
          revenue,
        };
      });

    return {
      totalCalls,
      totalDemos,
      totalCloses,
      totalRevenue,
      closeRate,
      leadToClose,
      showRate,
      repPerformance,
    };
  },
});

// Get AI insights
export const getInsights = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("insights")
      .withIndex("by_acknowledged", (q) => q.eq("acknowledged", false))
      .order("desc")
      .take(10);
  },
});

// Acknowledge insight
export const acknowledgeInsight = mutation({
  args: { id: v.id("insights") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, { acknowledged: true });
  },
});

// Get forecast data
export const getForecast = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const revenue = await ctx.db.query("revenue").collect();
    const clients = await ctx.db.query("clients").collect();

    // Calculate expected cashflow for next 3 months
    const now = Date.now();
    const months = [1, 2, 3].map((m) => {
      const startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() + m - 1);
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + m);

      // Expected installments
      const expectedInstallments = revenue
        .filter((r) =>
          r.type === "installment" &&
          r.status === "pending" &&
          r.dueDate &&
          r.dueDate >= startDate.getTime() &&
          r.dueDate < endDate.getTime()
        )
        .reduce((sum, r) => sum + r.amount, 0);

      // Historical average collections
      const historicalAvg = revenue
        .filter((r) => r.status === "paid")
        .reduce((sum, r) => sum + r.amount, 0) / 6; // 6 month average

      return {
        month: startDate.toLocaleString("de-DE", { month: "short", year: "numeric" }),
        expectedInstallments,
        projectedNew: historicalAvg * 0.8, // Conservative estimate
        total: expectedInstallments + historicalAvg * 0.8,
      };
    });

    // Cash at risk
    const atRiskClients = clients.filter((c) => c.status === "at_risk");
    const atRiskRevenue = atRiskClients.reduce((sum, c) => sum + c.totalOwed, 0);

    // Recovery rate
    const overdueCollected = revenue.filter(
      (r) => r.status === "paid" && r.type === "overdue"
    ).length;
    const totalOverdue = revenue.filter((r) => r.type === "overdue").length;
    const recoveryRate = totalOverdue > 0 ? (overdueCollected / totalOverdue) * 100 : 100;

    return {
      months,
      atRiskRevenue,
      recoveryRate,
      atRiskClientCount: atRiskClients.length,
    };
  },
});

// Get KPI summary for cards
export const getKPISummary = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const revenue = await ctx.db.query("revenue").collect();
    const clients = await ctx.db.query("clients").collect();
    const appointments = await ctx.db.query("appointments").collect();
    const sales = await ctx.db.query("sales").collect();

    // Revenue metrics
    const collected = revenue
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + r.amount, 0);

    const booked = revenue
      .filter((r) => r.type === "booked")
      .reduce((sum, r) => sum + r.amount, 0);

    const futureInstallments = revenue
      .filter((r) => r.type === "installment" && r.status === "pending")
      .reduce((sum, r) => sum + r.amount, 0);

    const overdue = revenue
      .filter((r) => r.status === "overdue")
      .reduce((sum, r) => sum + r.amount, 0);

    // Client metrics
    const activeClients = clients.filter((c) => c.status === "active").length;
    const atRiskClients = clients.filter((c) => c.status === "at_risk").length;
    const leads = clients.filter((c) => c.status === "lead").length;

    // Sales metrics
    const closes = sales.filter((s) => s.type === "close" && s.outcome === "success").length;
    const demos = sales.filter((s) => s.type === "demo").length;
    const closeRate = demos > 0 ? (closes / demos) * 100 : 0;

    // Appointment metrics
    const completedAppts = appointments.filter((a) => a.status === "completed").length;
    const noShows = appointments.filter((a) => a.status === "noshow").length;
    const showRate = completedAppts + noShows > 0
      ? (completedAppts / (completedAppts + noShows)) * 100
      : 0;

    // CAC (simplified - would need ad spend data)
    const totalSpend = 50000; // Placeholder
    const newClients = clients.filter((c) => c.status === "active").length;
    const cac = newClients > 0 ? totalSpend / newClients : 0;

    // Cash conversion
    const cashConversion = booked > 0 ? (collected / booked) * 100 : 0;

    return {
      collected,
      booked,
      futureInstallments,
      overdue,
      activeClients,
      atRiskClients,
      leads,
      closeRate,
      showRate,
      cac,
      cashConversion,
    };
  },
});
