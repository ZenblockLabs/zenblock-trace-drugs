import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { format } from "date-fns";
import { Download, FileCheck, ShieldCheck, FileText, AlertTriangle, Search, Loader } from "lucide-react";
import { ComplianceReport } from "@/services/types/TrackingTypes";
import { useAuth } from "@/context/AuthContext";

export function CompliancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("quarter");
  const [auditFilter, setAuditFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

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

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
              DSCSA Compliance Status
            </CardTitle>
            <CardDescription>
              Current compliance with Drug Supply Chain Security Act requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Overall Status:</span>
                <Badge variant={complianceData.dscsa.status === "Compliant" ? "success" : "destructive"}>
                  {complianceData.dscsa.status}
                </Badge>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${complianceData.dscsa.complianceRatio}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{complianceData.dscsa.complianceRatio}% Compliant</span>
                <span className="text-muted-foreground">
                  Last updated: {format(complianceData.dscsa.lastUpdated, 'MMM d, yyyy')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-semibold">{complianceData.dscsa.violations}</div>
                  <div className="text-sm text-muted-foreground">Compliance Violations</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-semibold">{complianceData.dscsa.pendingResolutions}</div>
                  <div className="text-sm text-muted-foreground">Pending Resolutions</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex items-center space-x-2">
              <Select 
                value={selectedPeriod} 
                onValueChange={setSelectedPeriod}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Monthly Report</SelectItem>
                  <SelectItem value="quarter">Quarterly Report</SelectItem>
                  <SelectItem value="year">Annual Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateReport} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-blue-500" />
              Product Traceability
            </CardTitle>
            <CardDescription>
              End-to-end visibility of products in the supply chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Traceability Score:</span>
                <Badge variant="outline" className="bg-blue-50">
                  {complianceData.traceability.traceabilityScore}%
                </Badge>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ width: `${complianceData.traceability.traceabilityScore}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{complianceData.traceability.trackedDrugs} / {complianceData.traceability.totalDrugs} Products Tracked</span>
                <span className="text-muted-foreground">
                  Last audit: {format(complianceData.traceability.lastAudit, 'MMM d, yyyy')}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4">
                <div className="border rounded-md p-3">
                  <div className="text-sm font-medium">T3 Transaction Requirements</div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Transaction Information</span>
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Transaction History</span>
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Transaction Statement</span>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t pt-4">
            <Button variant="outline">View Full Traceability Report</Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Reports</CardTitle>
          <CardDescription>
            View and download compliance and audit documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={auditFilter} onValueChange={setAuditFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="dscsa">DSCSA</SelectItem>
                  <SelectItem value="supply chain">Supply Chain</SelectItem>
                  <SelectItem value="verification">Verification</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Findings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        {report.name}
                      </div>
                    </TableCell>
                    <TableCell>{format(report.date, 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={report.status === "Passed" ? "success" : "destructive"}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.findings}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
