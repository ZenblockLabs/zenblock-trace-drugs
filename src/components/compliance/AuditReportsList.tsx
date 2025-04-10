
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Search } from "lucide-react";
import { format } from "date-fns";

interface AuditReport {
  id: string;
  name: string;
  date: Date;
  type: string;
  status: string;
  findings: number;
}

interface AuditReportsListProps {
  reports: AuditReport[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  auditFilter: string;
  onFilterChange: (filter: string) => void;
  onDownload: (reportId: string) => void;
}

export function AuditReportsList({
  reports,
  searchQuery,
  onSearchChange,
  auditFilter,
  onFilterChange,
  onDownload
}: AuditReportsListProps) {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="w-full sm:w-[180px]">
            <Select value={auditFilter} onValueChange={onFilterChange}>
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
            {reports.length > 0 ? (
              reports.map((report) => (
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
                      onClick={() => onDownload(report.id)}
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
  );
}
