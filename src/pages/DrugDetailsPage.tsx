
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { Drug } from "@/services/types";
import { DrugDetailsContent } from "@/components/drug-details/DrugDetailsContent";
import { DrugNotFound } from "@/components/drug-details/DrugNotFound";

export function DrugDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error("No drug ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const blockchainService = await getBlockchainService();
        const drugData = await blockchainService.getDrugById(id);
        setData(drugData);
      } catch (error) {
        console.error("Error fetching drug details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!data) {
    return <DrugNotFound />;
  }

  return <DrugDetailsContent data={data} formatDate={formatDate} />;
}
