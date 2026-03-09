import { KPICard } from "./KPICard";

interface SalesSectionProps {
  sales: any;
  appointments: any;
}

export function SalesSection({ sales, appointments }: SalesSectionProps) {
  if (!sales || !appointments) {
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
          Vertriebsabteilung
        </span>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mt-1">
          Sales Performance
        </h2>
        <p className="font-serif text-sm md:text-base text-[#666] mt-2">
          Detaillierte Analyse der Verkaufsaktivitäten und Team-Performance
        </p>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPICard
          label="Close Rate"
          value={sales.closeRate}
          format="percentage"
          variant="primary"
          subtext="Demo → Abschluss"
        />
        <KPICard
          label="Show Rate"
          value={sales.showRate}
          format="percentage"
          variant="secondary"
          subtext="Erschienen zu Terminen"
        />
        <KPICard
          label="Lead → Close"
          value={sales.leadToClose}
          format="percentage"
          variant="info"
          subtext="Gesamte Pipeline"
        />
        <KPICard
          label="Umsatz gesamt"
          value={sales.totalRevenue}
          format="currency"
          variant="success"
        />
      </div>

      {/* Activity breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Sales funnel */}
        <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]">
              Sales Funnel
            </h3>
          </div>

          <div className="space-y-4">
            <FunnelStep
              label="Calls geführt"
              value={sales.totalCalls}
              percentage={100}
              color="bg-[#C9A227]"
            />
            <FunnelStep
              label="Demos gehalten"
              value={sales.totalDemos}
              percentage={(sales.totalDemos / sales.totalCalls) * 100}
              color="bg-[#1A1A1A]"
            />
            <FunnelStep
              label="Abschlüsse"
              value={sales.totalCloses}
              percentage={(sales.totalCloses / sales.totalCalls) * 100}
              color="bg-[#2D5016]"
            />
          </div>

          {/* Conversion indicators */}
          <div className="mt-4 md:mt-6 pt-4 border-t border-[#DDD] grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="font-mono text-lg md:text-xl font-bold text-[#1A1A1A]">
                {sales.totalCalls > 0 ? ((sales.totalDemos / sales.totalCalls) * 100).toFixed(0) : 0}%
              </p>
              <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Call → Demo</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-lg md:text-xl font-bold text-[#C9A227]">
                {sales.closeRate.toFixed(0)}%
              </p>
              <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Demo → Close</p>
            </div>
          </div>
        </div>

        {/* Appointments overview */}
        <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]">
              Termine Übersicht
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-3 md:p-4 bg-[#FAF9F6] border border-[#DDD] text-center">
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                {appointments.today}
              </p>
              <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Heute</p>
            </div>
            <div className="p-3 md:p-4 bg-[#FAF9F6] border border-[#DDD] text-center">
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                {appointments.upcoming}
              </p>
              <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Diese Woche</p>
            </div>
            <div className="p-3 md:p-4 bg-[#2D5016]/10 border border-[#2D5016] text-center">
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#2D5016]">
                {appointments.completed}
              </p>
              <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Abgeschlossen</p>
            </div>
            <div className="p-3 md:p-4 bg-[#8B0000]/10 border border-[#8B0000] text-center">
              <p className="font-mono text-2xl md:text-3xl font-bold text-[#8B0000]">
                {appointments.noShows}
              </p>
              <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">No-Shows</p>
            </div>
          </div>

          <div className="mt-4 md:mt-6 pt-4 border-t border-[#DDD]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-[#666]">Show Rate</span>
              <span className="font-mono text-xl md:text-2xl font-bold text-[#1A1A1A]">
                {appointments.showRate.toFixed(1)}%
              </span>
            </div>
            <div className="mt-3 h-3 bg-[#DDD]">
              <div
                className="h-full bg-[#C9A227]"
                style={{ width: `${appointments.showRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team performance */}
      {sales.repPerformance && sales.repPerformance.length > 0 && (
        <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
          <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A]">
              Team Performance
            </h3>
            <p className="font-serif text-xs md:text-sm text-[#666] mt-1">
              Individuelle Leistung der Setter und Closer
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-[#1A1A1A]">
                  <th className="text-left font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Name
                  </th>
                  <th className="text-left font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Rolle
                  </th>
                  <th className="text-right font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Demos
                  </th>
                  <th className="text-right font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Closes
                  </th>
                  <th className="text-right font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Close Rate
                  </th>
                  <th className="text-right font-mono text-[10px] md:text-xs uppercase tracking-wider text-[#666] pb-3 px-4 md:px-0">
                    Umsatz
                  </th>
                </tr>
              </thead>
              <tbody>
                {sales.repPerformance.map((rep: any, i: number) => (
                  <tr key={rep.id} className="border-b border-[#DDD] hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3 px-4 md:px-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#C9A227] flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {rep.name.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-serif text-sm md:text-base text-[#1A1A1A]">{rep.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 md:px-0">
                      <span className={`font-mono text-xs uppercase px-2 py-1
                                       ${rep.role === 'closer' ? 'bg-[#C9A227] text-[#1A1A1A]' : 'bg-[#1A1A1A] text-white'}`}>
                        {rep.role}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-sm md:text-base text-[#1A1A1A] px-4 md:px-0">
                      {rep.demos}
                    </td>
                    <td className="py-3 text-right font-mono text-sm md:text-base text-[#1A1A1A] px-4 md:px-0">
                      {rep.closes}
                    </td>
                    <td className="py-3 text-right px-4 md:px-0">
                      <span className={`font-mono text-sm md:text-base font-bold
                                       ${rep.closeRate >= 30 ? 'text-[#2D5016]' : rep.closeRate >= 15 ? 'text-[#C9A227]' : 'text-[#8B0000]'}`}>
                        {rep.closeRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-sm md:text-base font-bold text-[#1A1A1A] px-4 md:px-0">
                      €{(rep.revenue / 1000).toFixed(1)}K
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white border-2 border-[#1A1A1A] p-3 md:p-4 text-center">
          <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            €{(sales.totalRevenue / sales.totalCloses || 0).toFixed(0)}
          </p>
          <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Ø Deal-Größe</p>
        </div>
        <div className="bg-white border-2 border-[#1A1A1A] p-3 md:p-4 text-center">
          <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            {(sales.totalCalls / 30).toFixed(1)}
          </p>
          <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Calls/Tag (Ø)</p>
        </div>
        <div className="bg-white border-2 border-[#1A1A1A] p-3 md:p-4 text-center">
          <p className="font-mono text-2xl md:text-3xl font-bold text-[#C9A227]">
            {sales.totalCloses}
          </p>
          <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Abschlüsse</p>
        </div>
        <div className="bg-white border-2 border-[#1A1A1A] p-3 md:p-4 text-center">
          <p className="font-mono text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            {appointments.cancelled}
          </p>
          <p className="font-mono text-[10px] md:text-xs text-[#666] mt-1">Stornierungen</p>
        </div>
      </div>
    </div>
  );
}

interface FunnelStepProps {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

function FunnelStep({ label, value, percentage, color }: FunnelStepProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs md:text-sm text-[#666]">{label}</span>
        <span className="font-mono text-base md:text-lg font-bold text-[#1A1A1A]">{value}</span>
      </div>
      <div className="h-6 md:h-8 bg-[#DDD] overflow-hidden relative">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${Math.max(percentage, 5)}%` }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] md:text-xs text-[#666]">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
