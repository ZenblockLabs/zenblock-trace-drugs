
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle, Flag, Info } from "lucide-react";
import { formatDistance } from "date-fns";

interface TrackingEvent {
  step: string;
  timestamp: string;
  location: string;
  handler: string;
  notes: string;
}

interface DrugTraceability {
  drug: {
    name: string;
    manufacturer: string;
    batchId: string;
    expiry: string;
    license: string;
    sgtin: string;
  };
  events: TrackingEvent[];
  status: {
    isRecalled: boolean;
    message: string;
    verifiedBy: string;
  };
}

export function TrackPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [data, setData] = useState<DrugTraceability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!code) {
        setError("No tracking code provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: responseData, error: responseError } = await supabase.functions.invoke('track-drug', {
          method: 'GET',
          query: { code }
        });

        if (responseError) {
          throw new Error(responseError.message);
        }

        setData(responseData);
      } catch (err) {
        console.error("Error fetching drug traceability data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch drug data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/7f80b1a9-32ff-4729-bd56-1245ed723387.png" 
            alt="Zenblock Labs Logo" 
            className="h-16 w-16 mb-4" 
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Loading Drug Information...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <div className="pt-4">
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
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

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/7f80b1a9-32ff-4729-bd56-1245ed723387.png" 
          alt="Zenblock Labs Logo" 
          className="h-16 w-16 mb-4" 
        />
      </div>
      
      {/* Status Banner */}
      <Alert 
        variant={data.status.isRecalled ? "destructive" : "default"}
        className={`mb-6 ${data.status.isRecalled ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
      >
        {data.status.isRecalled ? (
          <AlertTriangle className="h-5 w-5 text-red-600" />
        ) : (
          <CheckCircle className="h-5 w-5 text-green-600" />
        )}
        <AlertTitle className={data.status.isRecalled ? 'text-red-800' : 'text-green-800'}>
          {data.status.isRecalled ? 'Recall Alert' : 'Verification Successful'}
        </AlertTitle>
        <AlertDescription className={data.status.isRecalled ? 'text-red-600' : 'text-green-600'}>
          {data.status.message}
        </AlertDescription>
      </Alert>

      {/* Drug Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Drug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Product Name</p>
              <p className="font-medium">{data.drug.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Manufacturer</p>
              <p className="font-medium">{data.drug.manufacturer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Batch ID</p>
              <p className="font-medium">{data.drug.batchId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="font-medium">{data.drug.expiry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">License</p>
              <p className="font-medium">{data.drug.license}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">SGTIN</p>
              <p className="font-medium">{data.drug.sgtin}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supply Chain Journey */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Supply Chain Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {data.events.map((event, index) => (
              <li key={index} className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white">
                  <span className="text-white text-xs">{index + 1}</span>
                </span>
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.step}</h3>
                    <time className="text-xs font-normal text-gray-500">
                      {formatDate(event.timestamp)}
                    </time>
                  </div>
                  <p className="mb-2 text-gray-700">
                    <span className="font-semibold">Handler:</span> {event.handler}
                  </p>
                  <p className="mb-2 text-gray-700">
                    <span className="font-semibold">Location:</span> {event.location}
                  </p>
                  {event.notes && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Notes:</span> {event.notes}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" className="flex gap-2">
          <Flag className="h-4 w-4" />
          Report Issue
        </Button>
        <Button variant="outline" className="flex gap-2">
          <Info className="h-4 w-4" />
          Learn About Traceability
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Verified by {data.status.verifiedBy} on {new Date().toLocaleDateString()}</p>
        <p className="mt-1">© 2025 Zenblock Labs. All rights reserved.</p>
      </div>
    </div>
  );
}
