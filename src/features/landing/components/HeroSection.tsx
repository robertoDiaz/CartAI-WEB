/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp, Sparkles, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { analyticsService, type LiveAnalytics } from "../../../services/analyticsService";

export function HeroSection() {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<LiveAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    analyticsService.getLiveAnalytics().then((data) => {
      if (active) {
        setAnalytics(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-16">
      <div className="flex-1 space-y-8">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-[#0a192f] leading-tight">
          {t("hero.titleMain")} <br />
          <span className="text-[#e85d04]">{t("hero.titleHighlight")}</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-lg">
          {t("hero.description")}
        </p>
        <div className="flex items-center gap-6">
          <Link
            to="/catalog"
            className="bg-[#e85d04] text-white px-6 py-3.5 rounded-lg font-bold shadow-lg hover:bg-[#cc5200] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            {t("hero.startFree")} <ArrowUpRight className="w-5 h-5" />
          </Link>
          <Link
            to="/catalog"
            className="text-[#0a192f] font-semibold underline decoration-2 underline-offset-4 hover:text-[#e85d04] transition-colors"
          >
            {t("hero.watchDemo")}
          </Link>
        </div>
      </div>

      <div className="flex-1 w-full relative lg:mt-0 mt-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#e85d04] to-blue-400 rounded-2xl blur-3xl opacity-20"></div>
        
        {/* Contenedor del Dashboard simulado */}
        <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 overflow-hidden h-[420px] flex flex-col justify-between">
          
          {/* Header de la ventana del navegador */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            </div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider">
              CART•AI LIVE ANALYTICS
            </span>
            <span className="w-4"></span>
          </div>

          {/* Gráfico y Métricas */}
          {loading || !analytics ? (
            <div className="flex-grow flex flex-col justify-between animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-3.5 w-24 bg-slate-200 rounded"></div>
                  <div className="h-8 w-36 bg-slate-200 rounded"></div>
                </div>
                <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-40 w-full bg-slate-100 rounded-lg mt-4 flex items-center justify-center">
                <span className="text-xs font-semibold text-slate-400 tracking-wider">Analizando transacciones...</span>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ventas por IA (Hoy)</p>
                  <h3 className="text-3xl font-extrabold text-[#0a192f] mt-1">
                    ${analytics.todaySales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" /> +{analytics.percentageGrowth}%
                </span>
              </div>

              {/* Gráfico Lineal SVG ondulado */}
              <div className="h-40 w-full mt-4 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e85d04" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#e85d04" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Línea del gráfico */}
                  <path
                    d="M 0 120 Q 50 60 100 90 T 200 40 T 300 110 T 400 30"
                    fill="none"
                    stroke="#e85d04"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Relleno bajo la línea */}
                  <path
                    d="M 0 120 Q 50 60 100 90 T 200 40 T 300 110 T 400 30 L 400 150 L 0 150 Z"
                    fill="url(#chartGradient)"
                  />
                  {/* Punto destacado */}
                  <circle cx="200" cy="40" r="6" fill="#0a192f" stroke="#e85d04" strokeWidth="3" />
                </svg>
              </div>
            </div>
          )}

          {/* Tarjeta Flotante 1: Producto */}
          {!loading && analytics && (
            <div className="absolute top-20 -right-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xl flex items-center gap-3 transition-transform hover:-translate-y-1.5 duration-300 cursor-pointer max-w-[220px]">
              <div className="p-2 bg-[#e85d04]/10 text-[#e85d04] rounded-lg">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0a192f]">{analytics.featuredProduct.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">${analytics.featuredProduct.price.toFixed(2)}</p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                  Sales +{analytics.featuredProduct.salesIncrease}%
                </span>
              </div>
            </div>
          )}

          {/* Tarjeta Flotante 2: Recomendación IA */}
          {!loading && analytics && (
            <div className="absolute bottom-6 -left-6 bg-[#0a192f] text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 transition-transform hover:-translate-y-1.5 duration-300 cursor-pointer max-w-[280px]">
              <div className="p-2.5 bg-[#e85d04] rounded-lg text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#e85d04]">Sugerido por IA</span>
                </div>
                <p className="text-xs text-slate-200 mt-1 font-medium leading-tight">
                  Venta cruzada exitosa: + ${analytics.aiSuggestion.amount.toFixed(2)}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
