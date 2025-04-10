
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { useAuth } from "@/context/AuthContext";
import { ComplianceStatus } from "@/components/compliance/ComplianceStatus";
import { ProductTraceability } from "@/components/compliance/ProductTraceability";
import { AuditReportsList } from "@/components/compliance/AuditReportsList";
import { ComplianceReportGenerator } from "@/components/compliance/ComplianceReportGenerator";
import { ComplianceReport } from "@/services/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function CompliancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("quarter");
  const [auditFilter, setAuditFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if user is a compliance or regulator user
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
      
      toast({
        title: "Report Generated",
        description: `DSCSA Compliance report for ${selectedPeriod} has been generated successfully`,
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
    toast({
      title: "Download Started",
      description: "Your report download will begin shortly",
    });
  };

  if (isReportLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading compliance data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance Management</h1>
        <p className="text-muted-foreground">
          Monitor DSCSA compliance and access audit reports
        </p>
      </div>
      
      {!isComplianceUser && (
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-800" />
          <AlertDescription className="text-amber-800">
            Some compliance features are only visible to compliance officers and regulators.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ComplianceStatus 
          complianceData={complianceData}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onGenerateReport={handleGenerateReport}
          isLoading={isLoading}
        />

        <ProductTraceability 
          traceabilityData={complianceData.traceability}
        />
      </div>

      <AuditReportsList 
        reports={filteredReports}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        auditFilter={auditFilter}
        onFilterChange={setAuditFilter}
        onDownload={handleDownloadReport}
      />
      
      {isComplianceUser && (
        <div className="mt-8 p-6 border rounded-lg bg-slate-50">
          <h2 className="text-xl font-semibold mb-4">Generate Custom Compliance Report</h2>
          <p className="text-gray-600 mb-6">
            Generate a detailed compliance report for any specific product by entering its SGTIN (Serialized Global Trade Item Number).
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="w-full sm:w-auto">
              <label htmlFor="sgtin" className="block text-sm font-medium text-gray-700 mb-1">
                Product SGTIN
              </label>
              <input
                type="text"
                id="sgtin"
                placeholder="Enter product SGTIN"
                className="px-3 py-2 border rounded-md w-full sm:w-80"
              />
            </div>
            
            <ComplianceReportGenerator 
              drugSgtin="10012345678903" // Example SGTIN - in a real app this would come from the input
            />
          </div>
        </div>
      )}
    </div>
  );
}
