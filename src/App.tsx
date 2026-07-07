import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EmergencyProvider } from "@/context/EmergencyContext";
import AppLayout from "@/components/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import EmergencyTriagePage from "@/pages/EmergencyTriagePage";
import ICUBedsPage from "@/pages/ICUBedsPage";
import PatientsPage from "@/pages/PatientsPage";
import ResourcesPage from "@/pages/ResourcesPage";
import AIPredictionsPage from "@/pages/AIPredictionsPage";
import AlertsCenterPage from "@/pages/AlertsCenterPage";
import SpecialEmergencyPage from "@/pages/SpecialEmergencyPage";
import NotFound from "./pages/NotFound.tsx";
import LoginPage from "@/pages/LoginPage";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <EmergencyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/emergency-triage" element={<EmergencyTriagePage />} />
                  <Route path="/icu-beds" element={<ICUBedsPage />} />
                  <Route path="/patients" element={<PatientsPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/ai-predictions" element={<AIPredictionsPage />} />
                  <Route path="/alerts" element={<AlertsCenterPage />} />
                  <Route path="/special-emergency" element={<SpecialEmergencyPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </EmergencyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
