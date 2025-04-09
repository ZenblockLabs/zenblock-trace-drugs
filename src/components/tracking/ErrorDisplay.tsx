
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/7f80b1a9-32ff-4729-bd56-1245ed723387.png" 
          alt="Zenblock Labs Logo" 
          className="h-16 w-16 mb-4" 
        />
      </div>
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "Could not find drug information for the provided code"}
        </AlertDescription>
      </Alert>
      <div className="text-center">
        <p className="mb-4">Please check your QR code and try again.</p>
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
