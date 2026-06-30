/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import React, { useEffect } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { useAlertLifecycle } from "./useAlertLifecycle";

interface AlertProps {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
  duration?: number;
}

export function Alert({ message, type, onDismiss, duration = 5000 }: AlertProps) {
  useAlertLifecycle(message, onDismiss, duration);

  if (!message) return null;

  const bgStyles = type === "success" 
    ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
    : "bg-red-50 border-red-500 text-red-700";

  return (
    <div className={`mb-6 border-l-4 p-4 rounded-md flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${bgStyles}`}>
      {type === "success" ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      )}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
