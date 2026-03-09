import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { KPICard } from "./KPICard";
import { RevenueSection } from "./RevenueSection";
import { SalesSection } from "./SalesSection";
import { ClientSection } from "./ClientSection";
import { InsightsSection } from "./InsightsSection";
import { ForecastSection } from "./ForecastSection";

type TabType = "overview" | "sales" | "finance" | "fulfillment" | "forecast";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const profile = useQuery(api.dashboard.getProfile);
  const kpiSummary = useQuery(api.dashboard.getKPISummary);
  const revenue = useQuery(api.dashboard.getRevenueOverview);
  const clients = useQuery(api.dashboard.getClientOverview);
  const appointments = useQuery(api.dashboard.getAppointmentsOverview);
  const sales = useQuery(api.dashboard.getSalesPerformance);
  const insights = useQuery(api.dashboard.getInsights);
  const forecast = useQuery(api.dashboard.getForecast);

  const seedData = useMutation(api.seed.seedDemoData);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedData();
    } catch (error) {
      console.error("Failed to seed data:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = today.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const edition = `Ausgabe ${today.getDate()}.${today.getMonth() + 1}`;

  // Check if we have data
  const hasData = kpiSummary && (kpiSummary.collected > 0 || kpiSummary.activeClients > 0);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "overview", label: "CEO Brief", icon: "◆" },
    { id: "sales", label: "Sales", icon: "◇" },
    { id: "finance", label: "Finance", icon: "□" },
    { id: "fulfillment", label: "Fulfillment", icon: "○" },
    { id: "forecast", label: "Forecast", icon: "△" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] relative">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Masthead */}
        <header className="border-b-4 border-double border-[#1A1A1A] bg-[#FAF9F6]">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
            {/* Top meta row */}
            <div className="flex items-center justify-between text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-[#888] mb-3 md:mb-4">
              <span>{edition}</span>
              <span className="hidden md:inline">Echtzeit-Aktualisierung · {timeStr}</span>
              <div className="flex items-center gap-4">
                <span className="w-2 h-2 bg-[#2D5016] rounded-full animate-pulse" title="Live"></span>
                <button
                  onClick={() => signOut()}
                  className="text-[#666] hover:text-[#C9A227] transition-colors"
                >
                  Abmelden
                </button>
              </div>
            </div>

            {/* Main masthead */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-4 border-y-2 border-[#1A1A1A] py-3 md:py-4">
              <div>
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-[#1A1A1A] tracking-tighter leading-none">
                  EXECUTIVE BRIEF
                </h1>
                <p className="font-serif text-sm md:text-lg text-[#666] mt-1 italic">
                  Premium Fitness Coaching · KPI-Intelligence
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-serif text-sm md:text-base text-[#1A1A1A]">{dateStr}</p>
                <p className="font-mono text-[10px] md:text-xs text-[#C9A227] mt-1">
                  {profile?.role ? `${profile.role.toUpperCase()} VIEW` : "LOADING..."}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden w-full py-3 border-2 border-[#1A1A1A] font-mono text-sm uppercase tracking-wider flex items-center justify-between px-4"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span>{tabs.find(t => t.id === activeTab)?.label}</span>
                <span className={`transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Mobile menu dropdown */}
              <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} border-x-2 border-b-2 border-[#1A1A1A]`}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full py-3 px-4 font-mono text-sm uppercase tracking-wider text-left
                              transition-colors border-b border-[#DDD] last:border-b-0
                              ${activeTab === tab.id
                                ? "bg-[#1A1A1A] text-[#FAF9F6]"
                                : "text-[#666] hover:bg-[#1A1A1A]/5"
                              }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Desktop tabs */}
              <div className="hidden md:flex items-center gap-1 border-2 border-[#1A1A1A] p-1 bg-white">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 lg:px-6 py-2.5 font-mono text-xs lg:text-sm uppercase tracking-wider
                              transition-all duration-200
                              ${activeTab === tab.id
                                ? "bg-[#1A1A1A] text-[#FAF9F6]"
                                : "text-[#666] hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A]"
                              }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {!hasData ? (
            /* Empty state - Seed data prompt */
            <div className="flex flex-col items-center justify-center py-16 md:py-24">
              <div className="bg-white border-2 border-[#1A1A1A] shadow-[8px_8px_0_#1A1A1A] p-6 md:p-10 max-w-lg text-center">
                <div className="w-16 h-16 border-2 border-[#C9A227] flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📊</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
                  Keine Daten vorhanden
                </h2>
                <p className="font-serif text-[#666] mb-8">
                  Laden Sie Demo-Daten, um das Dashboard in Aktion zu sehen.
                  Dies simuliert Umsatz, Kunden und Verkaufsdaten.
                </p>
                <button
                  onClick={handleSeedData}
                  disabled={isSeeding}
                  className="px-8 py-4 bg-[#C9A227] text-[#1A1A1A] font-display font-bold text-lg uppercase
                           tracking-wider hover:bg-[#1A1A1A] hover:text-[#FAF9F6] transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSeeding ? "Wird geladen..." : "Demo-Daten laden"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Breaking news banner for critical insights */}
              {insights && insights.filter((i: any) => i.severity === "critical").length > 0 && (
                <div className="bg-[#8B0000] text-white px-4 py-3 mb-6 animate-pulse">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-wider font-bold bg-white text-[#8B0000] px-2 py-1">
                      Eilmeldung
                    </span>
                    <span className="font-serif">
                      {insights.filter((i: any) => i.severity === "critical")[0]?.title}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab content */}
              {activeTab === "overview" && (
                <OverviewTab
                  kpiSummary={kpiSummary}
                  revenue={revenue}
                  clients={clients}
                  appointments={appointments}
                  sales={sales}
                  insights={insights}
                  forecast={forecast}
                />
              )}

              {activeTab === "sales" && (
                <SalesSection sales={sales} appointments={appointments} />
              )}

              {activeTab === "finance" && (
                <RevenueSection revenue={revenue} kpiSummary={kpiSummary} />
              )}

              {activeTab === "fulfillment" && (
                <ClientSection clients={clients} appointments={appointments} />
              )}

              {activeTab === "forecast" && (
                <ForecastSection forecast={forecast} kpiSummary={kpiSummary} />
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#DDD] py-4 md:py-6 px-4 md:px-8 mt-8">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
            <p className="font-mono text-[10px] text-[#999] uppercase tracking-wider">
              KPI Dashboard · Convex Real-time · GoHighLevel + Stripe + PayPal
            </p>
            <p className="font-mono text-[10px] text-[#BBB]">
              Requested by @michaeloneth · Built by @clonkbot
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

interface OverviewTabProps {
  kpiSummary: any;
  revenue: any;
  clients: any;
  appointments: any;
  sales: any;
  insights: any;
  forecast: any;
}

function OverviewTab({ kpiSummary, revenue, clients, appointments, sales, insights, forecast }: OverviewTabProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Headline KPIs - 2 column grid on mobile, 4 on desktop */}
      <section>
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#C9A227] flex items-center justify-center">
            <span className="text-white font-bold text-lg md:text-xl">€</span>
          </div>
          <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
            Finanzübersicht
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            label="Eingenommen"
            value={kpiSummary?.collected || 0}
            format="currency"
            trend={revenue?.trend}
            variant="primary"
          />
          <KPICard
            label="Gebucht"
            value={kpiSummary?.booked || 0}
            format="currency"
            variant="secondary"
          />
          <KPICard
            label="Zukünftige Raten"
            value={kpiSummary?.futureInstallments || 0}
            format="currency"
            variant="info"
          />
          <KPICard
            label="Überfällig"
            value={kpiSummary?.overdue || 0}
            format="currency"
            variant="danger"
          />
        </div>
      </section>

      {/* Two column layout: Insights + Sales Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* AI Insights */}
        <InsightsSection insights={insights} />

        {/* Sales Quick Stats */}
        <section className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
              Vertrieb
            </span>
            <h3 className="font-display text-xl md:text-2xl font-bold text-[#1A1A1A] mt-1">
              Performance Metriken
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="text-center p-3 md:p-4 bg-[#FAF9F6] border border-[#DDD]">
              <p className="font-mono text-3xl md:text-4xl font-bold text-[#1A1A1A]">
                {sales?.closeRate?.toFixed(1) || 0}%
              </p>
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] mt-2">
                Close Rate
              </p>
            </div>
            <div className="text-center p-3 md:p-4 bg-[#FAF9F6] border border-[#DDD]">
              <p className="font-mono text-3xl md:text-4xl font-bold text-[#1A1A1A]">
                {sales?.showRate?.toFixed(1) || 0}%
              </p>
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] mt-2">
                Show Rate
              </p>
            </div>
            <div className="text-center p-3 md:p-4 bg-[#FAF9F6] border border-[#DDD]">
              <p className="font-mono text-3xl md:text-4xl font-bold text-[#1A1A1A]">
                {sales?.totalCloses || 0}
              </p>
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] mt-2">
                Abschlüsse
              </p>
            </div>
            <div className="text-center p-3 md:p-4 bg-[#FAF9F6] border border-[#DDD]">
              <p className="font-mono text-3xl md:text-4xl font-bold text-[#C9A227]">
                €{((sales?.totalRevenue || 0) / 1000).toFixed(0)}K
              </p>
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] mt-2">
                Umsatz
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Client & Appointments row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Client Status */}
        <section className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4">
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
              Kunden
            </span>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A] mt-1">
              Status Übersicht
            </h3>
          </div>

          <div className="space-y-3">
            <StatusBar label="Aktiv" value={clients?.active || 0} total={clients?.total || 1} color="bg-[#2D5016]" />
            <StatusBar label="Leads" value={clients?.leads || 0} total={clients?.total || 1} color="bg-[#C9A227]" />
            <StatusBar label="Gefährdet" value={clients?.atRisk || 0} total={clients?.total || 1} color="bg-[#A0522D]" />
            <StatusBar label="Abgewandert" value={clients?.churned || 0} total={clients?.total || 1} color="bg-[#8B0000]" />
          </div>
        </section>

        {/* Appointments */}
        <section className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4">
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
              Termine
            </span>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A] mt-1">
              Diese Woche
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="text-center p-3 bg-[#FAF9F6] border border-[#DDD]">
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                {appointments?.today || 0}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#666] mt-1">
                Heute
              </p>
            </div>
            <div className="text-center p-3 bg-[#FAF9F6] border border-[#DDD]">
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                {appointments?.upcoming || 0}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#666] mt-1">
                Kommend
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#DDD]">
            <div className="flex justify-between items-center font-mono text-sm">
              <span className="text-[#666]">Show Rate</span>
              <span className="font-bold text-[#1A1A1A]">{appointments?.showRate?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex justify-between items-center font-mono text-sm mt-2">
              <span className="text-[#666]">No-Shows</span>
              <span className="font-bold text-[#8B0000]">{appointments?.noShows || 0}</span>
            </div>
          </div>
        </section>

        {/* Forecast Preview */}
        <section className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4">
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
              Prognose
            </span>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A] mt-1">
              Cash Flow
            </h3>
          </div>

          {forecast?.months?.slice(0, 2).map((month: any, i: number) => (
            <div key={i} className={`py-3 ${i > 0 ? "border-t border-[#DDD]" : ""}`}>
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-[#666]">{month.month}</span>
                <span className="font-mono text-lg font-bold text-[#1A1A1A]">
                  €{(month.total / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="h-2 bg-[#DDD] mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#C9A227]"
                  style={{ width: `${Math.min((month.total / 100000) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-[#DDD]">
            <div className="flex justify-between items-center font-mono text-sm">
              <span className="text-[#666]">At-Risk Revenue</span>
              <span className="font-bold text-[#8B0000]">€{((forecast?.atRiskRevenue || 0) / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </section>
      </div>

      {/* Source Quality Table */}
      {clients?.sources && clients.sources.length > 0 && (
        <section className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
              Marketing
            </span>
            <h3 className="font-display text-xl md:text-2xl font-bold text-[#1A1A1A] mt-1">
              Lead-Quellen Qualität
            </h3>
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b-2 border-[#1A1A1A]">
                  <th className="text-left font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Quelle
                  </th>
                  <th className="text-right font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Leads
                  </th>
                  <th className="text-right font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Anteil
                  </th>
                  <th className="text-left font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 pl-4 md:pl-6 pr-4 md:pr-0">
                    Verteilung
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.sources.map((source: any, i: number) => (
                  <tr key={i} className="border-b border-[#DDD]">
                    <td className="py-3 font-serif text-sm md:text-base text-[#1A1A1A] px-4 md:px-0">{source.source}</td>
                    <td className="py-3 text-right font-mono text-sm md:text-base text-[#1A1A1A] px-4 md:px-0">
                      {source.count}
                    </td>
                    <td className="py-3 text-right font-mono text-sm md:text-base text-[#666] px-4 md:px-0">
                      {source.percentage.toFixed(1)}%
                    </td>
                    <td className="py-3 pl-4 md:pl-6 pr-4 md:pr-0">
                      <div className="h-3 bg-[#DDD] w-full max-w-[120px] md:max-w-[150px] overflow-hidden">
                        <div
                          className="h-full bg-[#C9A227]"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

interface StatusBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

function StatusBar({ label, value, total, color }: StatusBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-xs text-[#666]">{label}</span>
        <span className="font-mono text-sm font-bold text-[#1A1A1A]">{value}</span>
      </div>
      <div className="h-2 bg-[#DDD] overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
