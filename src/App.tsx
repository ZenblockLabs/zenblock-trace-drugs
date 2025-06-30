import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "./components/Layout";
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
import { ShipmentsPage } from "./pages/ShipmentsPage";
import { BlockchainStatusPage } from "./pages/BlockchainStatusPage";
import { ConfigurationPage } from "./pages/ConfigurationPage";
import { NetworkAdminPage } from "./pages/NetworkAdminPage";
import ApiTestPage from "./pages/ApiTestPage";
import { ComplianceIntegrationPage } from "./pages/ComplianceIntegrationPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p>You don't have permission to access this resource.</p>
                  </div>
                </div>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/drugs" element={
                <ProtectedRoute>
                  <Layout>
                    <DrugsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute requiredRole={['manufacturer']}>
                  <Layout>
                    <RegisterDrugPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/track" element={
                <ProtectedRoute>
                  <Layout>
                    <TrackPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/shipments" element={
                <ProtectedRoute requiredRole={['manufacturer', 'distributor', 'dispenser', 'regulator']}>
                  <Layout>
                    <ShipmentsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/compliance" element={
                <ProtectedRoute requiredRole={['regulator', 'compliance']}>
                  <Layout>
                    <CompliancePage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/drug/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <DrugDetailsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/history/:drugId" element={
                <ProtectedRoute>
                  <Layout>
                    <HistoryPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/verify" element={
                <ProtectedRoute>
                  <Layout>
                    <VerifyDrugPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/explorer" element={
                <ProtectedRoute requiredRole={['regulator']}>
                  <Layout>
                    <ExplorerPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/batch-processing" element={
                <ProtectedRoute requiredRole={['manufacturer']}>
                  <Layout>
                    <BatchProcessingPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/erp-integration" element={
                <ProtectedRoute requiredRole={['manufacturer', 'distributor']}>
                  <Layout>
                    <ERPIntegrationPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/compliance-integration" element={
                <ProtectedRoute requiredRole={['regulator', 'compliance']}>
                  <Layout>
                    <ComplianceIntegrationPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/network-admin" element={
                <ProtectedRoute requiredRole={['regulator']}>
                  <Layout>
                    <NetworkAdminPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/blockchain-status" element={
                <ProtectedRoute>
                  <Layout>
                    <BlockchainStatusPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/configuration" element={
                <ProtectedRoute requiredRole={['regulator']}>
                  <Layout>
                    <ConfigurationPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/recall-reports" element={
                <ProtectedRoute requiredRole={['regulator']}>
                  <Layout>
                    <RecallReportsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/api-test" element={
                <ProtectedRoute requiredRole={['regulator']}>
                  <Layout>
                    <ApiTestPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
