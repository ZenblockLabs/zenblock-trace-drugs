import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DrugsPage } from "@/pages/DrugsPage";
import { DrugDetailsPage } from "@/pages/DrugDetailsPage";
import { RegisterDrugPage } from "@/pages/RegisterDrugPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { ExplorerPage } from "@/pages/ExplorerPage";
import { CompliancePage } from "@/pages/CompliancePage";
import { VerifyDrugPage } from "@/pages/VerifyDrugPage";
import { BatchProcessingPage } from "@/pages/BatchProcessingPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RecallReportsPage } from "./pages/RecallReportsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/drugs" element={<DrugsPage />} />
              <Route path="/drugs/:id" element={<DrugDetailsPage />} />
              <Route path="/register-drug" element={<RegisterDrugPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/explorer" element={<ExplorerPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/verify" element={<VerifyDrugPage />} />
              <Route path="/batch-processing" element={<BatchProcessingPage />} />
              <Route path="/recalls" element={<RecallReportsPage />} />
            </Route>
            
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
