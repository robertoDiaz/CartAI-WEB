/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { useEffect, useRef } from "react";

/**
 * Hook to automatically clear alerts, messages or any local state trigger after a timeout (defaults to 5 seconds).
 * It also handles unmount cleanup.
 * 
 * @param trigger - The message or trigger state to monitor
 * @param onDismiss - Callback to clear the state
 * @param duration - Time in milliseconds before calling onDismiss
 */
export function useAlertLifecycle(
  trigger: any,
  onDismiss: () => void,
  duration: number = 5000
) {
  const onDismissRef = useRef(onDismiss);

  // Keep ref up to date
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  // Clear error/state on unmount
  useEffect(() => {
    return () => {
      onDismissRef.current();
    };
  }, []);

  // Handle auto-dismiss timeout
  useEffect(() => {
    if (!trigger || duration <= 0 || duration === Infinity) return;

    const timer = setTimeout(() => {
      onDismissRef.current();
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, duration]);
}
