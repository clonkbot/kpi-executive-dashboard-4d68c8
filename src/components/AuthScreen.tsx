import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to continue as guest");
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] relative overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header masthead */}
        <header className="border-b-2 border-[#1A1A1A] py-4 md:py-6 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-0">
              <div>
                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] tracking-tight leading-none">
                  EXECUTIVE BRIEF
                </h1>
                <p className="font-serif text-sm md:text-base text-[#666] mt-1">
                  Premium Fitness Coaching Intelligence
                </p>
              </div>
              <p className="font-mono text-xs md:text-sm text-[#888] uppercase tracking-widest">
                {today}
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-md">
            {/* Login card with newspaper style */}
            <div className="bg-white border-2 border-[#1A1A1A] shadow-[8px_8px_0_#1A1A1A] p-6 md:p-8">
              {/* Section header */}
              <div className="border-b border-[#1A1A1A] pb-3 mb-6">
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
                  Secure Access
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1A1A1A] mt-1">
                  {flow === "signIn" ? "Welcome Back" : "Create Account"}
                </h2>
              </div>

              {error && (
                <div className="bg-[#8B0000]/10 border border-[#8B0000] text-[#8B0000] px-4 py-3 mb-6 font-serif text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-[#666] mb-2">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border-2 border-[#1A1A1A] bg-[#FAF9F6] font-serif text-[#1A1A1A]
                             focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20
                             transition-all placeholder:text-[#999]"
                    placeholder="name@company.de"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-[#666] mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border-2 border-[#1A1A1A] bg-[#FAF9F6] font-serif text-[#1A1A1A]
                             focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20
                             transition-all placeholder:text-[#999]"
                    placeholder="••••••••"
                  />
                </div>

                <input name="flow" type="hidden" value={flow} />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#1A1A1A] text-[#FAF9F6] font-display font-bold text-lg uppercase
                           tracking-wider hover:bg-[#C9A227] hover:text-[#1A1A1A] transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? "Processing..." : flow === "signIn" ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#DDD]">
                <button
                  type="button"
                  onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                  className="w-full text-center font-serif text-[#666] hover:text-[#C9A227] transition-colors"
                >
                  {flow === "signIn" ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#DDD]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 font-mono text-xs uppercase tracking-wider text-[#999]">
                    or
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAnonymous}
                disabled={isLoading}
                className="w-full py-3 border-2 border-[#1A1A1A] bg-transparent text-[#1A1A1A] font-serif
                         hover:bg-[#1A1A1A] hover:text-[#FAF9F6] transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue as Guest (Demo Mode)
              </button>
            </div>

            {/* Decorative quote */}
            <div className="mt-8 text-center px-4">
              <blockquote className="font-serif italic text-[#666] text-sm md:text-base">
                "Was gemessen wird, wird gemanagt."
              </blockquote>
              <cite className="font-mono text-xs text-[#999] mt-2 block">
                — Peter Drucker
              </cite>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#DDD] py-4 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
            <p className="font-mono text-[10px] text-[#999] uppercase tracking-wider">
              KPI Dashboard v1.0 · Real-time Analytics
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
