
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';
import { pharmaTraceabilityService, Alert as PharmaAlert } from '@/services/PharmaTraceabilityService';

export function AlertsAndRecalls() {
  const [alerts, setAlerts] = useState<PharmaAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('manufacturer');

  useEffect(() => {
    loadAlerts();
  }, [selectedRole]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const alertsData = await pharmaTraceabilityService.getAlerts(selectedRole);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Bell className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'recalled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'under investigation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'under evaluation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const filterAlertsByType = (type: string) => {
    return alerts.filter(alert => alert.type === type);
  };

  const AlertCard = ({ alert }: { alert: PharmaAlert }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getSeverityIcon(alert.severity)}
            {alert.product.name}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={getSeverityColor(alert.severity)}>
              {alert.severity.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(alert.status)}>
              {alert.status}
            </Badge>
          </div>
        </div>
        <CardDescription>
          GTIN: {alert.product.gtin} | Lot: {alert.product.lotNumber || 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Issued: {new Date(alert.timestamp).toLocaleString()}</span>
          {alert.affectedUnits && (
            <span>Affected Units: {alert.affectedUnits.toLocaleString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Alerts & Recalls</h2>
          <p className="text-muted-foreground">
            Monitor product alerts and recall notifications
          </p>
        </div>
        <div className="flex gap-2">
          {['manufacturer', 'distributor', 'dispenser', 'regulator'].map((role) => (
            <Button
              key={role}
              variant={selectedRole === role ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRoleChange(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Real-time alerts powered by Hyperledger Fabric blockchain. 
          Viewing as: <strong>{selectedRole}</strong>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Alerts ({alerts.length})</TabsTrigger>
          <TabsTrigger value="recall">Recalls ({filterAlertsByType('recall').length})</TabsTrigger>
          <TabsTrigger value="investigation">Investigations ({filterAlertsByType('investigation').length})</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluations ({filterAlertsByType('evaluation').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">No Active Alerts</p>
                <p className="text-muted-foreground">All products are currently in good standing</p>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>

        <TabsContent value="recall" className="space-y-4">
          {filterAlertsByType('recall').map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>

        <TabsContent value="investigation" className="space-y-4">
          {filterAlertsByType('investigation').map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-4">
          {filterAlertsByType('evaluation').map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
