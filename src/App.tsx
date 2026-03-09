import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="font-serif text-[#1A1A1A] text-lg tracking-wide">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <Dashboard />;
}
