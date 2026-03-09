import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface InsightsSectionProps {
  insights: any[] | undefined;
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  const acknowledgeInsight = useMutation(api.dashboard.acknowledgeInsight);

  if (!insights) {
    return (
      <div className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const severityConfig = {
    critical: {
      bg: "bg-[#8B0000]/10",
      border: "border-[#8B0000]",
      badge: "bg-[#8B0000]",
      text: "text-[#8B0000]",
      icon: "🚨",
    },
    warning: {
      bg: "bg-[#A0522D]/10",
      border: "border-[#A0522D]",
      badge: "bg-[#A0522D]",
      text: "text-[#A0522D]",
      icon: "⚠️",
    },
    positive: {
      bg: "bg-[#2D5016]/10",
      border: "border-[#2D5016]",
      badge: "bg-[#2D5016]",
      text: "text-[#2D5016]",
      icon: "✓",
    },
    info: {
      bg: "bg-[#666]/10",
      border: "border-[#666]",
      badge: "bg-[#666]",
      text: "text-[#666]",
      icon: "ℹ",
    },
  };

  const handleAcknowledge = async (id: Id<"insights">) => {
    await acknowledgeInsight({ id });
  };

  return (
    <section className="bg-white border-2 border-[#1A1A1A] p-4 md:p-6">
      <div className="border-b border-[#1A1A1A] pb-3 mb-4 md:mb-6">
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
          KI-Analyse
        </span>
        <h3 className="font-display text-xl md:text-2xl font-bold text-[#1A1A1A] mt-1">
          Aktuelle Insights
        </h3>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-[#DDD] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl md:text-3xl">✓</span>
          </div>
          <p className="font-serif text-sm md:text-base text-[#666]">
            Keine neuen Insights. Alles läuft nach Plan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => {
            const config = severityConfig[insight.severity as keyof typeof severityConfig] || severityConfig.info;

            return (
              <div
                key={insight._id}
                className={`${config.bg} ${config.border} border p-3 md:p-4 relative group`}
              >
                <div className="flex items-start gap-3">
                  <div className={`${config.badge} w-6 h-6 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs md:text-sm">{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-display text-sm md:text-base font-bold ${config.text}`}>
                        {insight.title}
                      </h4>
                      <span className="font-mono text-[10px] text-[#999] whitespace-nowrap flex-shrink-0">
                        {new Date(insight.createdAt).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="font-serif text-xs md:text-sm text-[#666] mt-1 line-clamp-2">
                      {insight.description}
                    </p>
                  </div>
                </div>

                {/* Acknowledge button */}
                <button
                  onClick={() => handleAcknowledge(insight._id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-white border border-[#DDD] text-[#999]
                           opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#1A1A1A] hover:text-white
                           flex items-center justify-center text-xs"
                  title="Zur Kenntnis genommen"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {insights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#DDD] text-center">
          <p className="font-mono text-[10px] md:text-xs text-[#999]">
            {insights.length} ungelesene{insights.length === 1 ? "r" : ""} Insight{insights.length === 1 ? "" : "s"}
          </p>
        </div>
      )}
    </section>
  );
}
