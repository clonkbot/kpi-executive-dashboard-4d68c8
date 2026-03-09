interface KPICardProps {
  label: string;
  value: number;
  format?: "currency" | "percentage" | "number";
  trend?: number;
  variant?: "primary" | "secondary" | "info" | "danger" | "success";
  subtext?: string;
}

export function KPICard({
  label,
  value,
  format = "number",
  trend,
  variant = "secondary",
  subtext,
}: KPICardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        if (val >= 1000000) {
          return `€${(val / 1000000).toFixed(2)}M`;
        }
        if (val >= 1000) {
          return `€${(val / 1000).toFixed(1)}K`;
        }
        return `€${val.toFixed(0)}`;
      case "percentage":
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString("de-DE");
    }
  };

  const variantStyles = {
    primary: {
      border: "border-[#C9A227]",
      accent: "bg-[#C9A227]",
      value: "text-[#1A1A1A]",
    },
    secondary: {
      border: "border-[#1A1A1A]",
      accent: "bg-[#1A1A1A]",
      value: "text-[#1A1A1A]",
    },
    info: {
      border: "border-[#1A1A1A]",
      accent: "bg-[#666]",
      value: "text-[#666]",
    },
    danger: {
      border: "border-[#8B0000]",
      accent: "bg-[#8B0000]",
      value: "text-[#8B0000]",
    },
    success: {
      border: "border-[#2D5016]",
      accent: "bg-[#2D5016]",
      value: "text-[#2D5016]",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`bg-white border-2 ${styles.border} p-3 md:p-4 lg:p-5 relative overflow-hidden group
                    hover:shadow-[4px_4px_0_#1A1A1A] transition-shadow duration-200`}>
      {/* Accent corner */}
      <div className={`absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 ${styles.accent}`}>
        <div className="absolute inset-0 bg-white" style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
      </div>

      {/* Label */}
      <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#666] mb-1 md:mb-2">
        {label}
      </p>

      {/* Value */}
      <p className={`font-mono text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold ${styles.value} leading-none`}>
        {formatValue(value)}
      </p>

      {/* Trend indicator */}
      {trend !== undefined && (
        <div className="mt-2 md:mt-3 flex items-center gap-1 md:gap-2">
          <span
            className={`font-mono text-xs md:text-sm font-bold
                       ${trend >= 0 ? "text-[#2D5016]" : "text-[#8B0000]"}`}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%
          </span>
          <span className="font-mono text-[10px] md:text-xs text-[#999]">vs letzter Monat</span>
        </div>
      )}

      {/* Subtext */}
      {subtext && (
        <p className="mt-2 font-serif text-xs md:text-sm text-[#666] italic">{subtext}</p>
      )}

      {/* Hover effect line */}
      <div className={`absolute bottom-0 left-0 h-1 ${styles.accent} w-0 group-hover:w-full transition-all duration-300`} />
    </div>
  );
}
