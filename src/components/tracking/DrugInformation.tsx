
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DrugInfoProps {
  drug: {
    name: string;
    manufacturer: string;
    batchId: string;
    expiry: string;
    license: string;
    sgtin: string;
  };
}

export function DrugInformation({ drug }: DrugInfoProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Drug Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Product Name</p>
            <p className="font-medium">{drug.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Manufacturer</p>
            <p className="font-medium">{drug.manufacturer}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Batch ID</p>
            <p className="font-medium">{drug.batchId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expiry Date</p>
            <p className="font-medium">{drug.expiry}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">License</p>
            <p className="font-medium">{drug.license}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">SGTIN</p>
            <p className="font-medium">{drug.sgtin}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
