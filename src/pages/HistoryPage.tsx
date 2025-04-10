
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrackingEvent, Drug } from "@/services/types";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { useAuth } from "@/context/AuthContext";
import { EventTimeline } from "@/components/history/EventTimeline";
import { EmptyState } from "@/components/history/EmptyState";
import { HistoryHeader } from "@/components/history/HistoryHeader";
import { FilterNotice } from "@/components/history/FilterNotice";
import { ErrorState } from "@/components/history/ErrorState";
import { LoadingState } from "@/components/history/LoadingState";

export function HistoryPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const drugId = searchParams.get("drugId");
  
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Determine user role based on email
    if (user?.email) {
      let role = null;
      if (user.email.includes('manufacturer')) {
        role = 'manufacturer';
      } else if (user.email.includes('distributor')) {
        role = 'distributor';
      } else if (user.email.includes('dispenser')) {
        role = 'dispenser';
      } else if (user.email.includes('regulator')) {
        role = 'regulator';
      }
      setUserRole(role);
      setIsFiltered(role !== null && role !== 'regulator');
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const service = await getBlockchainService(user?.email || null);
        
        if (drugId) {
          const drugData = await service.getDrugById(drugId);
          setDrug(drugData);
          
          if (drugData) {
            const drugEvents = await service.getEventsByDrug(drugId);
            setEvents(drugEvents);
          } else {
            setError("Drug not found with the specified ID.");
          }
        } else {
          const allEvents = await service.getAllEvents();
          setEvents(allEvents);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [drugId, user?.email]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="container mx-auto py-8">
      <HistoryHeader drug={drug} />
      <FilterNotice isFiltered={isFiltered} userRole={userRole} />
      
      {events.length === 0 ? (
        <EmptyState drugId={drugId} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Chain of Custody Timeline</CardTitle>
            <CardDescription>
              Chronological history of this product through the supply chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventTimeline 
              events={[...events].sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              )} 
              formatDate={formatDate} 
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
