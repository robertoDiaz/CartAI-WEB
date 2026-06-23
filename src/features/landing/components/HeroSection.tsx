import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-1 space-y-8">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-[#0a192f] leading-tight">
          {t("hero.titleMain")} <br />
          <span className="text-[#e85d04]">{t("hero.titleHighlight")}</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-lg">
          {t("hero.description")}
        </p>
        <div className="flex items-center gap-6">
          <button className="bg-[#e85d04] text-white px-6 py-3.5 rounded-lg font-bold shadow-lg hover:bg-[#cc5200] transition-all flex items-center gap-2">
            {t("hero.startFree")} <ArrowUpRight className="w-5 h-5" />
          </button>
          <button className="text-[#0a192f] font-semibold underline decoration-2 underline-offset-4 hover:text-[#e85d04] transition-colors">
            {t("hero.watchDemo")}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#e85d04] to-blue-400 rounded-2xl blur-3xl opacity-20"></div>
        <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 h-80 lg:h-[450px] flex items-center justify-center">
          <span className="text-slate-400 font-medium">
            [Mockup Dashboard Cart•AI]
          </span>
        </div>
      </div>
    </section>
  );
}
