/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ToastContainer } from "./components/ui/ToastContainer";
import { useSystemErrorStore } from "./services/systemErrorStore";
import { SystemErrorScreen } from "./components/layout/SystemErrorScreen";
import { SessionTimeoutWatcher } from "./components/layout/SessionTimeoutWatcher";

function App() {
  const hasSystemError = useSystemErrorStore((state) => state.hasSystemError);

  if (hasSystemError) {
    return <SystemErrorScreen />;
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      <SessionTimeoutWatcher />
    </>
  );
}
export default App;
