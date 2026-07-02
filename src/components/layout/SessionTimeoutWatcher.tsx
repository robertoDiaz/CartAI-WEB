/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useIdentityStore } from "../../features/identity/identityStore";
import { useToastStore } from "../ui/useToastStore";

const MS_IN_A_SECOND = 1000;
const WARNING_THRESHOLD_SECONDS = 60; // 1 minute warning
const TICK_INTERVAL_MS = 1000;         // 1 second tick

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function SessionTimeoutWatcher() {
  const { t: translate } = useTranslation();
  const token = useIdentityStore((state) => state.token);
  const logout = useIdentityStore((state) => state.logout);
  const refreshToken = useIdentityStore((state) => state.refreshToken);

  const countdownIntervalRef = useRef<any | null>(null);
  const activeToastIdRef = useRef<string | null>(null);
  const translateRef = useRef(translate);

  // Keep translate ref up to date
  useEffect(() => {
    translateRef.current = translate;
  }, [translate]);

  useEffect(() => {
    const cleanup = () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      if (activeToastIdRef.current) {
        useToastStore.getState().removeToast(activeToastIdRef.current);
        activeToastIdRef.current = null;
      }
    };

    cleanup();

    if (!token) return cleanup;

    const payload = parseJwt(token);
    if (!payload || !payload.exp) return cleanup;

    const expMs = payload.exp * MS_IN_A_SECOND;

    const updateToastMessage = (secs: number) => {
      return translateRef.current("auth.sessionWarning", { seconds: secs });
    };

    const tick = () => {
      const remainingMs = expMs - Date.now();
      const remainingSeconds = Math.ceil(remainingMs / MS_IN_A_SECOND);

      if (remainingSeconds <= 0) {
        cleanup();
        logout();
        useToastStore.getState().addToast(
          translateRef.current("auth.sessionExpired"),
          "error"
        );
        return;
      }

      // Warning Toast behavior
      if (remainingSeconds <= WARNING_THRESHOLD_SECONDS) {
        if (activeToastIdRef.current) {
          useToastStore.getState().updateToast(activeToastIdRef.current, updateToastMessage(remainingSeconds));
        } else {
          const id = useToastStore.getState().addToast(
            updateToastMessage(remainingSeconds),
            "warning",
            0, // 0 prevents auto-close
            {
              label: translateRef.current("auth.extendSession"),
              onClick: () => {
                refreshToken().catch(() => {});
              },
            }
          );
          activeToastIdRef.current = id;
        }
      } else {
        // If session was extended, dismiss warning toast
        if (activeToastIdRef.current) {
          useToastStore.getState().removeToast(activeToastIdRef.current);
          activeToastIdRef.current = null;
        }
      }
    };

    // Immediate execution and start interval
    tick();
    countdownIntervalRef.current = setInterval(tick, TICK_INTERVAL_MS);

    return cleanup;
  }, [token, logout, refreshToken]);

  return null;
}
