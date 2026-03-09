import { KPICard } from "./KPICard";

interface ClientSectionProps {
  clients: any;
  appointments: any;
}

export function ClientSection({ clients, appointments }: ClientSectionProps) {
  if (!clients || !appointments) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Section header */}
      <div className="border-b-2 border-[#1A1A1A] pb-3 md:pb-4">
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
          Fulfillment
        </span>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mt-1">
          Kunden & Coaching
        </h2>
        <p className="font-serif text-sm md:text-base text-[#666] mt-2">
          Kundenbetreuung, Churn-Risiko und Kohortenanalyse
        </p>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPICard
          label="Aktive Kunden"
          value={clients.active}
          variant="success"
        />
        <KPICard
          label="Leads"
          value={clients.leads}
          variant="primary"
        />
        <KPICard
          label="Gefährdete Kunden"
          value={clients.atRisk}
          variant="danger"
        />
        <KPICard
          label="Churn Rate"
          value={clients.churnRate}
          format="percentage"
          variant={clients.churnRate > 10 ? "danger" : "info"}
          subtext="Letzte 30 Tage"
        />
      </div>

      {/* Client status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Status distribution */}
        <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]">
              Kunden nach Status
            </h3>
          </div>

          <div className="space-y-4">
            <StatusRow
              label="Aktiv"
              value={clients.active}
              total={clients.total}
              color="bg-[#2D5016]"
              icon="✓"
            />
            <StatusRow
              label="Gebucht"
              value={clients.booked}
              total={clients.total}
              color="bg-[#C9A227]"
              icon="📅"
            />
            <StatusRow
              label="Leads"
              value={clients.leads}
              total={clients.total}
              color="bg-[#666]"
              icon="◎"
            />
            <StatusRow
              label="Gefährdet"
              value={clients.atRisk}
              total={clients.total}
              color="bg-[#A0522D]"
              icon="⚠"
            />
            <StatusRow
              label="Abgewandert"
              value={clients.churned}
              total={clients.total}
              color="bg-[#8B0000]"
              icon="✕"
            />
          </div>

          <div className="mt-4 md:mt-6 pt-4 border-t border-[#DDD]">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-[#666]">Gesamt</span>
              <span className="font-mono text-xl md:text-2xl font-bold text-[#1A1A1A]">{clients.total}</span>
            </div>
          </div>
        </div>

        {/* Churn risk analysis */}
        <div className="bg-white border-2 border-[#8B0000] p-4 md:p-6">
          <div className="border-b border-[#8B0000] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#8B0000]">
              Churn-Risiko Analyse
            </h3>
            <p className="font-serif text-xs md:text-sm text-[#666] mt-1">
              Kunden mit erhöhtem Abwanderungsrisiko
            </p>
          </div>

          <div className="flex items-center justify-center py-6 md:py-8">
            <div className="relative">
              {/* Risk gauge */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-[#DDD] relative">
                <div
                  className="absolute inset-0 rounded-full border-8 border-[#8B0000]"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((clients.churnRate / 100) * Math.PI)}% ${50 - 50 * Math.cos((clients.churnRate / 100) * Math.PI)}%, 50% 50%)`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="font-mono text-2xl md:text-3xl font-bold text-[#8B0000]">
                    {clients.churnRate.toFixed(1)}%
                  </span>
                  <span className="font-mono text-[10px] md:text-xs text-[#666]">Churn Rate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-3 bg-[#8B0000]/10 text-center">
              <p className="font-mono text-xl md:text-2xl font-bold text-[#8B0000]">{clients.atRisk}</p>
              <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Gefährdet</p>
            </div>
            <div className="p-3 bg-[#DDD] text-center">
              <p className="font-mono text-xl md:text-2xl font-bold text-[#1A1A1A]">{clients.churned}</p>
              <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Abgewandert</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort retention */}
      {clients.cohorts && clients.cohorts.length > 0 && (
        <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]">
              Kohorten-Retention
            </h3>
            <p className="font-serif text-xs md:text-sm text-[#666] mt-1">
              Kundenbindung nach Akquisitionszeitraum
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b-2 border-[#1A1A1A]">
                  <th className="text-left font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Kohorte
                  </th>
                  <th className="text-right font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Aktiv
                  </th>
                  <th className="text-right font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Churned
                  </th>
                  <th className="text-right font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Retention
                  </th>
                  <th className="text-left font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 pl-4 md:pl-6 pr-4 md:pr-0">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.cohorts.map((cohort: any, i: number) => (
                  <tr key={i} className="border-b border-[#DDD] hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3 font-mono text-sm md:text-base text-[#1A1A1A] px-4 md:px-0">
                      {cohort.cohort}
                    </td>
                    <td className="py-3 text-right font-mono text-sm md:text-base text-[#2D5016] px-4 md:px-0">
                      {cohort.active}
                    </td>
                    <td className="py-3 text-right font-mono text-sm md:text-base text-[#8B0000] px-4 md:px-0">
                      {cohort.churned}
                    </td>
                    <td className="py-3 text-right px-4 md:px-0">
                      <span className={`font-mono text-sm md:text-base font-bold
                                       ${cohort.retention >= 80 ? 'text-[#2D5016]' :
                                         cohort.retention >= 60 ? 'text-[#C9A227]' : 'text-[#8B0000]'}`}>
                        {cohort.retention.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 pl-4 md:pl-6 pr-4 md:pr-0">
                      <div className="h-3 bg-[#DDD] w-full max-w-[100px] md:max-w-[120px] overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            cohort.retention >= 80 ? 'bg-[#2D5016]' :
                            cohort.retention >= 60 ? 'bg-[#C9A227]' : 'bg-[#8B0000]'
                          }`}
                          style={{ width: `${cohort.retention}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Source quality */}
      {clients.sources && clients.sources.length > 0 && (
        <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]">
              Lead-Quellen Verteilung
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {clients.sources.map((source: any, i: number) => (
              <div key={i} className="p-3 md:p-4 bg-[#FAF9F6] border border-[#DDD]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs md:text-sm text-[#666]">{source.source}</span>
                  <span className="font-mono text-sm md:text-base font-bold text-[#1A1A1A]">
                    {source.count}
                  </span>
                </div>
                <div className="h-2 bg-[#DDD] overflow-hidden">
                  <div
                    className="h-full bg-[#C9A227]"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <p className="font-mono text-[10px] text-[#999] mt-1">{source.percentage.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coaching sessions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white border-2 border-[#1A1A1A] p-3 md:p-4 text-center">
          <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            {appointments.today}
          </p>
          <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Sessions heute</p>
        </div>
        <div className="bg-white border-2 border-[#1A1A1A] p-3 md:p-4 text-center">
          <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            {appointments.upcoming}
          </p>
          <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Diese Woche</p>
        </div>
        <div className="bg-white border-2 border-[#2D5016] p-3 md:p-4 text-center">
          <p className="font-mono text-2xl md:text-3xl font-bold text-[#2D5016]">
            {appointments.completed}
          </p>
          <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Abgeschlossen</p>
        </div>
        <div className="bg-white border-2 border-[#C9A227] p-3 md:p-4 text-center">
          <p className="font-mono text-2xl md:text-3xl font-bold text-[#C9A227]">
            {appointments.showRate.toFixed(0)}%
          </p>
          <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Erscheinungsrate</p>
        </div>
      </div>
    </div>
  );
}

interface StatusRowProps {
  label: string;
  value: number;
  total: number;
  color: string;
  icon: string;
}

function StatusRow({ label, value, total, color, icon }: StatusRowProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <div className={`w-8 h-8 md:w-10 md:h-10 ${color} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-sm md:text-base">{icon}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-mono text-xs md:text-sm text-[#666]">{label}</span>
          <span className="font-mono text-sm md:text-base font-bold text-[#1A1A1A]">{value}</span>
        </div>
        <div className="h-2 bg-[#DDD] overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
}
