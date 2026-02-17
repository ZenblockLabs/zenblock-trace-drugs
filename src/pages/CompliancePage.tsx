
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { useAuth } from "@/context/AuthContext";
import { AuditReportsList } from "@/components/compliance/AuditReportsList";
import { ComplianceReport } from "@/services/types";
import { CompliancePageHeader } from "@/components/compliance/CompliancePageHeader";
import { ComplianceOverview } from "@/components/compliance/ComplianceOverview";
import { CustomReportSection } from "@/components/compliance/CustomReportSection";
import { LoadingState } from "@/components/compliance/LoadingState";
import { InteroperabilityPanel } from "@/components/compliance/InteroperabilityPanel";
import { ComplianceConfigPanel } from "@/components/compliance/ComplianceConfigPanel";
import { ProductTraceability } from "@/components/compliance/ProductTraceability";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Settings, FileText, Activity, AlertTriangle, ShieldAlert, History, Gavel, Clock } from "lucide-react";
import { RecallReportsTab } from "@/components/compliance/RecallReportsTab";
import { RiskAlertsDashboard } from "@/components/compliance/RiskAlertsDashboard";
import { ViolationTracker } from "@/components/compliance/ViolationTracker";
import { AuditTrailPanel } from "@/components/compliance/AuditTrailPanel";
import { ExpiryAlertsDashboard } from "@/components/compliance/ExpiryAlertsDashboard";
import { downloadAuditReport } from "@/utils/compliance/auditReportGenerator";

export function CompliancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("quarter");
  const [auditFilter, setAuditFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isComplianceUser = user?.role === 'regulator' || 
                          user?.email?.includes('compliance') ||
                          user?.email?.includes('regulator');

  useEffect(() => {
    const fetchComplianceReport = async () => {
      setIsReportLoading(true);
      try {
        const service = await getBlockchainService(user?.email);
        const report = await service.getLatestComplianceReport();
        setComplianceReport(report);
      } catch (error) {
        console.error("Error fetching compliance report:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch compliance report data",
        });
      } finally {
        setIsReportLoading(false);
      }
    };

    fetchComplianceReport();
  }, [user?.email, toast]);

  const complianceData = {
    dscsa: {
      status: complianceReport ? (complianceReport.complianceScore > 95 ? "Compliant" : "Non-Compliant") : "Compliant",
      lastUpdated: complianceReport ? new Date(complianceReport.timestamp) : new Date(),
      complianceRatio: complianceReport ? complianceReport.complianceScore : 98.2,
      violations: complianceReport ? complianceReport.violations : 2,
      pendingResolutions: complianceReport ? Math.ceil(complianceReport.violations / 2) : 1
    },
    traceability: {
      totalDrugs: 103,
      trackedDrugs: 100,
      traceabilityScore: 97.1,
      lastAudit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
    }
  };

  const auditReports = [
    {
      id: "audit-1",
      name: complianceReport ? complianceReport.title : "DSCSA Compliance Audit - Q1 2025",
      date: complianceReport ? new Date(complianceReport.timestamp) : new Date(2025, 0, 15),
      type: "DSCSA",
      status: "Passed",
      findings: complianceReport ? complianceReport.violations : 0
    },
    {
      id: "audit-2",
      name: "Supply Chain Integrity Audit - Q1 2025",
      date: new Date(2025, 0, 28),
      type: "Supply Chain",
      status: "Passed",
      findings: 2
    },
    {
      id: "audit-3",
      name: "Product Verification Audit - Q4 2024",
      date: new Date(2024, 10, 10),
      type: "Verification",
      status: "Passed",
      findings: 1
    },
    {
      id: "audit-4",
      name: "Transaction History Audit - Q3 2024",
      date: new Date(2024, 8, 12),
      type: "History",
      status: "Failed",
      findings: 5
    }
  ];

  const filteredReports = auditReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        report.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = auditFilter === "all" || report.type.toLowerCase() === auditFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const service = await getBlockchainService(user?.email);
      const report = await service.getLatestComplianceReport();
      setComplianceReport(report);
      
      const generatedReport = {
        id: `report-${Date.now()}`,
        name: report ? report.title : `DSCSA Compliance Report - ${selectedPeriod}`,
        date: report ? new Date(report.timestamp) : new Date(),
        type: "DSCSA",
        status: report && report.complianceScore > 95 ? "Passed" : "Failed",
        findings: report ? report.violations : 0,
      };
      downloadAuditReport(generatedReport, complianceData);
      
      toast({
        title: "Report Downloaded",
        description: `DSCSA Compliance report for ${selectedPeriod} has been generated and downloaded`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate compliance report"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = (reportId: string) => {
    const report = auditReports.find((r) => r.id === reportId);
    if (!report) return;
    try {
      downloadAuditReport(report, complianceData);
      toast({ title: "Report Downloaded", description: "PDF has been saved to your device" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate PDF" });
    }
  };

  if (isReportLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <CompliancePageHeader isComplianceUser={isComplianceUser} />
      
      <Tabs defaultValue="overview" className="w-full">
        <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex w-full md:grid md:grid-cols-10 min-w-max md:min-w-0">
            <TabsTrigger value="overview" className="flex items-center gap-2 whitespace-nowrap">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="violations" className="flex items-center gap-2 whitespace-nowrap">
              <Gavel className="h-4 w-4" />
              <span className="hidden sm:inline">Violations</span>
            </TabsTrigger>
            <TabsTrigger value="risk-alerts" className="flex items-center gap-2 whitespace-nowrap">
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">Risk & Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="audit-trail" className="flex items-center gap-2 whitespace-nowrap">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Audit Trail</span>
            </TabsTrigger>
            <TabsTrigger value="expiry-alerts" className="flex items-center gap-2 whitespace-nowrap">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Expiry Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 whitespace-nowrap">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="traceability" className="flex items-center gap-2 whitespace-nowrap">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Traceability</span>
            </TabsTrigger>
            <TabsTrigger value="recalls" className="flex items-center gap-2 whitespace-nowrap">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Recall Reports</span>
            </TabsTrigger>
            <TabsTrigger value="configuration" className="flex items-center gap-2 whitespace-nowrap">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 whitespace-nowrap">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Custom Reports</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <ComplianceOverview 
            complianceData={complianceData}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            onGenerateReport={handleGenerateReport}
            isLoading={isLoading}
          />
          
          <AuditReportsList 
            reports={filteredReports}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            auditFilter={auditFilter}
            onFilterChange={setAuditFilter}
            onDownload={handleDownloadReport}
          />
        </TabsContent>
        
        <TabsContent value="violations" className="mt-6">
          <ViolationTracker />
        </TabsContent>
        
        <TabsContent value="risk-alerts" className="mt-6">
          <RiskAlertsDashboard />
        </TabsContent>
        
        <TabsContent value="audit-trail" className="mt-6">
          <AuditTrailPanel />
        </TabsContent>
        
        <TabsContent value="expiry-alerts" className="mt-6">
          <ExpiryAlertsDashboard />
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-6">
          <InteroperabilityPanel userRole={user?.role || 'user'} />
        </TabsContent>
        
        <TabsContent value="traceability" className="mt-6">
          <ProductTraceability traceabilityData={complianceData.traceability} />
        </TabsContent>
        
        <TabsContent value="recalls" className="mt-6">
          <RecallReportsTab />
        </TabsContent>
        
        <TabsContent value="configuration" className="mt-6">
          <ComplianceConfigPanel />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <CustomReportSection isComplianceUser={isComplianceUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
