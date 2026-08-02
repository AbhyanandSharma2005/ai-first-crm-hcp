import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import LogInteraction from "../pages/LogInteraction";
import InteractionHistory from "../components/InteractionHistory";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route
        path="/log-interaction"
        element={<LogInteraction />}
      />

      <Route
        path="/history"
        element={<InteractionHistory />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}