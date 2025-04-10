
export function ProductDetails({ 
  dosage, 
  manufacturer, 
  expiryDate,
  formatDate
}: { 
  dosage?: string;
  manufacturer: string;
  expiryDate: string;
  formatDate: (date: string) => string;
}) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Product Details</h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Dosage</p>
          <p className="font-medium">{dosage || '50mg'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Manufacturer</p>
          <p className="font-medium">{manufacturer}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Expiry Date</p>
          <p className="font-medium">{formatDate(expiryDate)}</p>
        </div>
      </div>
    </div>
  );
}
