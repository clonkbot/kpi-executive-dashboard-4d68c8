import { KPICard } from "./KPICard";

interface RevenueSectionProps {
  revenue: any;
  kpiSummary: any;
}

export function RevenueSection({ revenue, kpiSummary }: RevenueSectionProps) {
  if (!revenue || !kpiSummary) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate key metrics
  const collectionRate = kpiSummary.booked > 0
    ? (kpiSummary.collected / kpiSummary.booked) * 100
    : 0;

  const atRiskPercentage = (kpiSummary.collected + kpiSummary.futureInstallments) > 0
    ? (revenue.atRisk / (kpiSummary.collected + kpiSummary.futureInstallments)) * 100
    : 0;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Section header */}
      <div className="border-b-2 border-[#1A1A1A] pb-3 md:pb-4">
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
          Finanzabteilung
        </span>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mt-1">
          Umsatz & Cashflow
        </h2>
        <p className="font-serif text-sm md:text-base text-[#666] mt-2">
          Vollständige Übersicht über alle Zahlungsströme und Forderungen
        </p>
      </div>

      {/* Main revenue breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPICard
          label="Eingenommenes Geld"
          value={kpiSummary.collected}
          format="currency"
          trend={revenue.trend}
          variant="success"
          subtext="Tatsächlich erhaltene Zahlungen"
        />
        <KPICard
          label="Gebuchter Umsatz"
          value={kpiSummary.booked}
          format="currency"
          variant="primary"
          subtext="Vertraglich vereinbart"
        />
        <KPICard
          label="Erwartete Raten"
          value={kpiSummary.futureInstallments}
          format="currency"
          variant="info"
          subtext="Zukünftige Zahlungen"
        />
        <KPICard
          label="Überfällige Zahlungen"
          value={kpiSummary.overdue}
          format="currency"
          variant="danger"
          subtext="Sofortiger Handlungsbedarf"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Cash conversion */}
        <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]">
              Cash Conversion
            </h3>
            <p className="font-serif text-xs md:text-sm text-[#666] mt-1">
              Anteil des gebuchten Umsatzes, der tatsächlich eingegangen ist
            </p>
          </div>

          <div className="flex items-end gap-4 md:gap-6">
            <div className="flex-1">
              <p className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A]">
                {collectionRate.toFixed(1)}%
              </p>
              <p className="font-mono text-xs md:text-sm text-[#666] mt-2">
                €{(kpiSummary.collected / 1000).toFixed(0)}K von €{(kpiSummary.booked / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-24 md:w-32 h-32 md:h-40 relative">
              {/* Circular progress */}
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#DDD"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#C9A227"
                  strokeWidth="8"
                  strokeDasharray={`${collectionRate * 2.51} 251`}
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* At-risk receivables */}
        <div className="bg-white border-2 border-[#8B0000] p-4 md:p-6">
          <div className="border-b border-[#8B0000] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#8B0000]">
              Gefährdete Forderungen
            </h3>
            <p className="font-serif text-xs md:text-sm text-[#666] mt-1">
              Zahlungen mit erhöhtem Ausfallrisiko in den nächsten 7 Tagen
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-[#8B0000]">
                €{(revenue.atRisk / 1000).toFixed(1)}K
              </p>
              <p className="font-mono text-xs text-[#666] mt-1">Gefährdet</p>
            </div>
            <div>
              <p className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A]">
                {atRiskPercentage.toFixed(1)}%
              </p>
              <p className="font-mono text-xs text-[#666] mt-1">Anteil</p>
            </div>
          </div>

          <div className="mt-4 md:mt-6 pt-4 border-t border-[#DDD]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#8B0000]/10 flex items-center justify-center">
                <span className="text-xl md:text-2xl">⚠️</span>
              </div>
              <p className="font-serif text-xs md:text-sm text-[#666]">
                Empfehlung: Sofortige Kontaktaufnahme mit säumigen Kunden
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly comparison */}
      <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
        <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
          <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]">
            Monatlicher Vergleich
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="p-4 md:p-6 bg-[#FAF9F6] border border-[#DDD]">
            <p className="font-mono text-xs uppercase tracking-wider text-[#666] mb-2">
              Dieser Monat
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              €{(revenue.thisMonth / 1000).toFixed(1)}K
            </p>
            <div className="mt-4 h-3 bg-[#DDD]">
              <div
                className="h-full bg-[#C9A227]"
                style={{
                  width: `${Math.min((revenue.thisMonth / Math.max(revenue.thisMonth, revenue.lastMonth)) * 100, 100)}%`
                }}
              />
            </div>
          </div>

          <div className="p-4 md:p-6 bg-[#FAF9F6] border border-[#DDD]">
            <p className="font-mono text-xs uppercase tracking-wider text-[#666] mb-2">
              Letzter Monat
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-[#666]">
              €{(revenue.lastMonth / 1000).toFixed(1)}K
            </p>
            <div className="mt-4 h-3 bg-[#DDD]">
              <div
                className="h-full bg-[#999]"
                style={{
                  width: `${Math.min((revenue.lastMonth / Math.max(revenue.thisMonth, revenue.lastMonth)) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Trend indicator */}
        <div className="mt-4 md:mt-6 pt-4 border-t border-[#DDD] flex items-center justify-center">
          <div className={`px-4 md:px-6 py-2 md:py-3 ${revenue.trend >= 0 ? 'bg-[#2D5016]' : 'bg-[#8B0000]'}`}>
            <span className="font-mono text-sm md:text-base font-bold text-white">
              {revenue.trend >= 0 ? '▲' : '▼'} {Math.abs(revenue.trend).toFixed(1)}% vs Vormonat
            </span>
          </div>
        </div>
      </div>

      {/* Payment source breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#635BFF] flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">S</span>
            </div>
            <div>
              <h4 className="font-display text-base md:text-lg font-bold text-[#1A1A1A]">Stripe</h4>
              <p className="font-mono text-xs text-[#666]">Kreditkarte & SEPA</p>
            </div>
          </div>
          <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            €{((kpiSummary.collected * 0.65) / 1000).toFixed(1)}K
          </p>
          <div className="mt-3 h-2 bg-[#DDD]">
            <div className="h-full bg-[#635BFF]" style={{ width: '65%' }} />
          </div>
          <p className="font-mono text-xs text-[#666] mt-2">65% der Zahlungen</p>
        </div>

        <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#003087] flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">P</span>
            </div>
            <div>
              <h4 className="font-display text-base md:text-lg font-bold text-[#1A1A1A]">PayPal</h4>
              <p className="font-mono text-xs text-[#666]">PayPal & Ratenzahlung</p>
            </div>
          </div>
          <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            €{((kpiSummary.collected * 0.35) / 1000).toFixed(1)}K
          </p>
          <div className="mt-3 h-2 bg-[#DDD]">
            <div className="h-full bg-[#003087]" style={{ width: '35%' }} />
          </div>
          <p className="font-mono text-xs text-[#666] mt-2">35% der Zahlungen</p>
        </div>
      </div>
    </div>
  );
}
