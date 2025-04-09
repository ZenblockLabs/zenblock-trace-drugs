
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface StatusAlertProps {
  status: {
    isRecalled: boolean;
    message: string;
  };
}

export function StatusAlert({ status }: StatusAlertProps) {
  return (
    <Alert 
      variant={status.isRecalled ? "destructive" : "default"}
      className={`mb-6 ${status.isRecalled ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
    >
      {status.isRecalled ? (
        <AlertTriangle className="h-5 w-5 text-red-600" />
      ) : (
        <CheckCircle className="h-5 w-5 text-green-600" />
      )}
      <AlertTitle className={status.isRecalled ? 'text-red-800' : 'text-green-800'}>
        {status.isRecalled ? 'Recall Alert' : 'Verification Successful'}
      </AlertTitle>
      <AlertDescription className={status.isRecalled ? 'text-red-600' : 'text-green-600'}>
        {status.message}
      </AlertDescription>
    </Alert>
  );
}
