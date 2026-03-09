import { KPICard } from "./KPICard";

interface ForecastSectionProps {
  forecast: any;
  kpiSummary: any;
}

export function ForecastSection({ forecast, kpiSummary }: ForecastSectionProps) {
  if (!forecast || !kpiSummary) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate total forecast
  const totalForecast = forecast.months?.reduce((sum: number, m: any) => sum + m.total, 0) || 0;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Section header */}
      <div className="border-b-2 border-[#1A1A1A] pb-3 md:pb-4">
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
          Prognose
        </span>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mt-1">
          Finanzprognose & Cashflow
        </h2>
        <p className="font-serif text-sm md:text-base text-[#666] mt-2">
          Erwartete Einnahmen und Risikoanalyse für die kommenden Monate
        </p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPICard
          label="3-Monats-Prognose"
          value={totalForecast}
          format="currency"
          variant="primary"
        />
        <KPICard
          label="Erwartete Raten"
          value={kpiSummary.futureInstallments}
          format="currency"
          variant="secondary"
        />
        <KPICard
          label="Gefährdeter Umsatz"
          value={forecast.atRiskRevenue}
          format="currency"
          variant="danger"
        />
        <KPICard
          label="Recovery Rate"
          value={forecast.recoveryRate}
          format="percentage"
          variant={forecast.recoveryRate >= 80 ? "success" : "info"}
        />
      </div>

      {/* Monthly forecast chart */}
      <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
        <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
          <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]">
            Monatliche Cashflow-Prognose
          </h3>
          <p className="font-serif text-xs md:text-sm text-[#666] mt-1">
            Basierend auf ausstehenden Raten und historischen Trends
          </p>
        </div>

        <div className="space-y-6">
          {forecast.months?.map((month: any, i: number) => {
            const maxValue = Math.max(...forecast.months.map((m: any) => m.total));
            const percentage = maxValue > 0 ? (month.total / maxValue) * 100 : 0;

            return (
              <div key={i} className="group">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] flex items-center justify-center">
                      <span className="text-[#C9A227] font-mono text-sm md:text-base font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-mono text-sm md:text-base font-bold text-[#1A1A1A]">
                        {month.month}
                      </p>
                      <p className="font-mono text-[10px] md:text-xs text-[#666]">
                        Monat {i + 1} der Prognose
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-xl md:text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
                    €{(month.total / 1000).toFixed(1)}K
                  </p>
                </div>

                {/* Stacked bar */}
                <div className="h-8 md:h-10 bg-[#DDD] overflow-hidden flex">
                  <div
                    className="h-full bg-[#C9A227] transition-all duration-500"
                    style={{ width: `${(month.expectedInstallments / month.total) * percentage}%` }}
                    title={`Erwartete Raten: €${(month.expectedInstallments / 1000).toFixed(1)}K`}
                  />
                  <div
                    className="h-full bg-[#1A1A1A] transition-all duration-500"
                    style={{ width: `${(month.projectedNew / month.total) * percentage}%` }}
                    title={`Projektierte Neuabschlüsse: €${(month.projectedNew / 1000).toFixed(1)}K`}
                  />
                </div>

                {/* Legend for this bar */}
                <div className="flex gap-4 md:gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#C9A227]" />
                    <span className="font-mono text-[10px] md:text-xs text-[#666]">
                      Raten: €{(month.expectedInstallments / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#1A1A1A]" />
                    <span className="font-mono text-[10px] md:text-xs text-[#666]">
                      Neu: €{(month.projectedNew / 1000).toFixed(1)}K
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* At-risk revenue */}
        <div className="bg-white border-2 border-[#8B0000] p-4 md:p-6">
          <div className="border-b border-[#8B0000] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#8B0000]">
              Gefährdeter Umsatz
            </h3>
            <p className="font-serif text-xs md:text-sm text-[#666] mt-1">
              Potenzieller Umsatzverlust durch Churn und Zahlungsausfälle
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B0000]">
                €{(forecast.atRiskRevenue / 1000).toFixed(1)}K
              </p>
              <p className="font-mono text-xs md:text-sm text-[#666] mt-1">
                von {forecast.atRiskClientCount} gefährdeten Kunden
              </p>
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#8B0000]/10 flex items-center justify-center">
              <span className="text-3xl md:text-4xl">⚠️</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[#DDD]">
              <span className="font-mono text-xs md:text-sm text-[#666]">Churn-Risiko Kunden</span>
              <span className="font-mono text-sm md:text-base font-bold text-[#1A1A1A]">
                {forecast.atRiskClientCount}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#DDD]">
              <span className="font-mono text-xs md:text-sm text-[#666]">Ø Wert pro Kunde</span>
              <span className="font-mono text-sm md:text-base font-bold text-[#1A1A1A]">
                €{forecast.atRiskClientCount > 0
                  ? ((forecast.atRiskRevenue / forecast.atRiskClientCount) / 1000).toFixed(1)
                  : 0}K
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-mono text-xs md:text-sm text-[#666]">% des Gesamtumsatzes</span>
              <span className="font-mono text-sm md:text-base font-bold text-[#8B0000]">
                {kpiSummary.collected > 0
                  ? ((forecast.atRiskRevenue / kpiSummary.collected) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Recovery rate */}
        <div className="bg-white border-2 border-[#2D5016] p-4 md:p-6">
          <div className="border-b border-[#2D5016] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#2D5016]">
              Payment Recovery
            </h3>
            <p className="font-serif text-xs md:text-sm text-[#666] mt-1">
              Erfolgsquote bei der Eintreibung überfälliger Zahlungen
            </p>
          </div>

          <div className="flex items-center justify-center py-4 md:py-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              {/* Circular progress */}
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#DDD"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#2D5016"
                  strokeWidth="10"
                  strokeDasharray={`${forecast.recoveryRate * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="font-mono text-2xl md:text-3xl font-bold text-[#2D5016]">
                  {forecast.recoveryRate.toFixed(0)}%
                </span>
                <span className="font-mono text-[10px] md:text-xs text-[#666]">Recovery</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
            <div className="p-3 bg-[#2D5016]/10 text-center">
              <p className="font-mono text-lg md:text-xl font-bold text-[#2D5016]">
                €{((kpiSummary.overdue * (forecast.recoveryRate / 100)) / 1000).toFixed(1)}K
              </p>
              <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Erwartet zurück</p>
            </div>
            <div className="p-3 bg-[#DDD] text-center">
              <p className="font-mono text-lg md:text-xl font-bold text-[#1A1A1A]">
                €{(kpiSummary.overdue / 1000).toFixed(1)}K
              </p>
              <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Gesamt überfällig</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario analysis */}
      <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
        <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
          <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]">
            Szenario-Analyse
          </h3>
          <p className="font-serif text-xs md:text-sm text-[#666] mt-1">
            Cashflow-Szenarien für die nächsten 3 Monate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Pessimistic */}
          <div className="p-4 md:p-6 bg-[#8B0000]/5 border-2 border-[#8B0000]">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📉</span>
              <h4 className="font-display text-base md:text-lg font-bold text-[#8B0000]">
                Pessimistisch
              </h4>
            </div>
            <p className="font-mono text-2xl md:text-3xl font-bold text-[#8B0000] mb-2">
              €{((totalForecast * 0.7) / 1000).toFixed(0)}K
            </p>
            <p className="font-serif text-xs md:text-sm text-[#666]">
              30% Ausfall durch Churn und Zahlungsausfälle
            </p>
          </div>

          {/* Realistic */}
          <div className="p-4 md:p-6 bg-[#C9A227]/5 border-2 border-[#C9A227]">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📊</span>
              <h4 className="font-display text-base md:text-lg font-bold text-[#C9A227]">
                Realistisch
              </h4>
            </div>
            <p className="font-mono text-2xl md:text-3xl font-bold text-[#C9A227] mb-2">
              €{(totalForecast / 1000).toFixed(0)}K
            </p>
            <p className="font-serif text-xs md:text-sm text-[#666]">
              Basierend auf aktuellen Trends und Pipeline
            </p>
          </div>

          {/* Optimistic */}
          <div className="p-4 md:p-6 bg-[#2D5016]/5 border-2 border-[#2D5016]">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📈</span>
              <h4 className="font-display text-base md:text-lg font-bold text-[#2D5016]">
                Optimistisch
              </h4>
            </div>
            <p className="font-mono text-2xl md:text-3xl font-bold text-[#2D5016] mb-2">
              €{((totalForecast * 1.2) / 1000).toFixed(0)}K
            </p>
            <p className="font-serif text-xs md:text-sm text-[#666]">
              +20% durch verbesserte Conversion und Upsells
            </p>
          </div>
        </div>
      </div>

      {/* Action items */}
      <div className="bg-[#1A1A1A] text-white p-4 md:p-6">
        <div className="border-b border-[#333] pb-3 mb-4 md:mb-6">
          <h3 className="font-display text-lg md:text-xl font-bold text-[#C9A227]">
            Empfohlene Maßnahmen
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-[#C9A227] flex items-center justify-center flex-shrink-0">
              <span className="text-[#1A1A1A] font-bold text-sm md:text-base">1</span>
            </div>
            <p className="font-serif text-xs md:text-sm text-[#CCC]">
              Sofortige Kontaktaufnahme mit {forecast.atRiskClientCount} gefährdeten Kunden zur Churn-Prävention
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-[#C9A227] flex items-center justify-center flex-shrink-0">
              <span className="text-[#1A1A1A] font-bold text-sm md:text-base">2</span>
            </div>
            <p className="font-serif text-xs md:text-sm text-[#CCC]">
              Zahlungserinnerungen für €{(kpiSummary.overdue / 1000).toFixed(1)}K überfällige Raten versenden
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-[#C9A227] flex items-center justify-center flex-shrink-0">
              <span className="text-[#1A1A1A] font-bold text-sm md:text-base">3</span>
            </div>
            <p className="font-serif text-xs md:text-sm text-[#CCC]">
              Upsell-Kampagne für aktive Kunden zur Umsatzsteigerung planen
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-[#C9A227] flex items-center justify-center flex-shrink-0">
              <span className="text-[#1A1A1A] font-bold text-sm md:text-base">4</span>
            </div>
            <p className="font-serif text-xs md:text-sm text-[#CCC]">
              Lead-Qualität der Marketing-Kanäle analysieren und Budget optimieren
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
