import { ServerCrash, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSystemErrorStore } from "../../services/systemErrorStore";
import { useState, useEffect } from "react";

export function SystemErrorScreen() {
  const { t: translate } = useTranslation();
  const setSystemError = useSystemErrorStore((state) => state.setSystemError);
  const pollingInterval = useSystemErrorStore((state) => state.pollingInterval);
  const [isRetrying, setIsRetrying] = useState(false);

  const checkConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/products`,
        {
          method: "GET",
          signal: AbortSignal.timeout(3000), // Timeout after 3 seconds
        }
      );
      // If response is successful or yields a client/auth error, server is up.
      return response.ok || response.status < 500;
    } catch (e) {
      return false;
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    const isOnline = await checkConnection();
    setIsRetrying(false);
    
    if (isOnline) {
      setSystemError(false);
    }
  };

  // Auto recovery polling connection checks
  useEffect(() => {
    const autoCheck = async () => {
      const isOnline = await checkConnection();
      if (isOnline) {
        setSystemError(false);
      }
    };

    const intervalId = setInterval(autoCheck, pollingInterval * 1000);
    return () => clearInterval(intervalId);
  }, [pollingInterval, setSystemError]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 z-50 animate-fade-in">
      {/* Background gradients for premium glassmorphism */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-(--color-brand-accent)/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      {/* Card container */}
      <div className="relative max-w-md w-full bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl text-center shadow-2xl flex flex-col items-center justify-center">
        {/* Animated icon container */}
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 mb-6 relative group">
          <ServerCrash size={40} className="stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white tracking-tight mb-3">
          {translate("system.errorTitle")}
        </h1>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          {translate("system.errorDescription")}
        </p>

        {/* Retry button */}
        <button
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-semibold shadow-lg hover:shadow-xl hover:shadow-white/5 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <RefreshCw size={18} className={`stroke-[2.5] ${isRetrying ? "animate-spin" : ""}`} />
          {translate("system.errorRetry")}
        </button>
      </div>
    </div>
  );
}
