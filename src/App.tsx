
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import { TrackPage } from "./pages/TrackPage";
import { DrugsPage } from "./pages/DrugsPage";
import { RegisterDrugPage } from "./pages/RegisterDrugPage";
import { HistoryPage } from "./pages/HistoryPage";
import { CompliancePage } from "./pages/CompliancePage";
import { RecallReportsPage } from "./pages/RecallReportsPage";
import { BatchProcessingPage } from "./pages/BatchProcessingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExplorerPage } from "./pages/ExplorerPage";
import { VerifyDrugPage } from "./pages/VerifyDrugPage";
import { DrugDetailsPage } from "./pages/DrugDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ERPIntegrationPage } from "./pages/ERPIntegrationPage";
import ApiTestPage from "./pages/ApiTestPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="track" element={<TrackPage />} />
              <Route path="drugs" element={<DrugsPage />} />
              <Route path="register-drug" element={<RegisterDrugPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="compliance" element={<CompliancePage />} />
              <Route path="recall-reports" element={<RecallReportsPage />} />
              <Route path="batch-processing" element={<BatchProcessingPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="explorer" element={<ExplorerPage />} />
              <Route path="verify" element={<VerifyDrugPage />} />
              <Route path="drug/:id" element={<DrugDetailsPage />} />
              <Route path="erp-integration" element={<ERPIntegrationPage />} />
              <Route path="api-test" element={<ApiTestPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
