
export function ProductIdentifiers({ 
  gtin, 
  sgtin, 
  batchNumber 
}: { 
  gtin: string; 
  sgtin: string; 
  batchNumber: string;
}) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Product Identifiers</h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">GTIN</p>
          <p className="font-medium">{gtin}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">SGTIN</p>
          <p className="font-medium">{sgtin}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Batch Number</p>
          <p className="font-medium">{batchNumber}</p>
        </div>
      </div>
    </div>
  );
}
