import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { Drug } from "@/services/mockBlockchainService";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { QRCodeModal } from "@/components/QRCodeModal";
import { useAuth } from "@/context/AuthContext";

export function DrugDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  if (loading) {
    return <div>Loading drug details...</div>;
  }

  if (!data) {
    return <div>Drug not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{data.productName}</h1>
        <p className="text-gray-500">Drug ID: {data.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Drug Information</CardTitle>
          <CardDescription>Details about this specific drug.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">GTIN</p>
              <p>{data.gtin}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">SGTIN</p>
              <p>{data.sgtin}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Batch Number</p>
              <p>{data.batchNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Expiry Date</p>
              <p>{data.expiryDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Manufacturer</p>
              <p>{data.manufacturerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Owner</p>
              <p>{data.currentOwnerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge>{data.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drug actions */}
      {data && (
        <div className="flex flex-wrap gap-2 mt-4">
          {/* Add QR code generator for manufacturers */}
          {user?.role === "manufacturer" && (
            <QRCodeModal 
              drugId={data.id} 
              sgtin={data.sgtin} 
              productName={data.productName} 
            />
          )}
        </div>
      )}
    </div>
  );
}
