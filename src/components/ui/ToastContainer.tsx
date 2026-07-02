/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { useEffect } from "react";
import type { ToastMessage } from "./models";
import { useToastStore } from "./useToastStore";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const removeToast = useToastStore((state) => state.removeToast);
  const duration = toast.duration !== undefined ? toast.duration : 5000;

  useEffect(() => {
    if (duration <= 0 || duration === Infinity) return;

    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, removeToast]);

  const bgStyles =
    {
      success: "bg-emerald-50 border-emerald-500 text-emerald-800",
      error: "bg-red-50 border-red-500 text-red-800",
      warning: "bg-amber-50 border-amber-500 text-amber-800",
      info: "bg-blue-50 border-blue-500 text-blue-800",
    }[toast.type] || "bg-slate-50 border-slate-500 text-slate-800";

  const Icon =
    {
      success: CheckCircle2,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
    }[toast.type] || Info;

  return (
    <div
      className={`p-4 rounded-xl border shadow-xl flex items-start gap-3 pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300 relative group ${bgStyles}`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 mr-4">
        <p className="text-sm font-semibold leading-snug">{toast.message}</p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              removeToast(toast.id);
            }}
            className="mt-2 text-xs font-bold underline cursor-pointer hover:opacity-85 block text-left"
          >
            {toast.action?.label}
          </button>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 text-slate-400 hover:text-slate-700 transition-opacity p-0.5 rounded-md hover:bg-slate-200/50"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
