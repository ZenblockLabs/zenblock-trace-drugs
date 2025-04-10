
export function ProductDescription({ name }: { name: string }) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Product Description</h3>
      <p className="text-gray-700">{name} is used to treat various conditions including...</p>
    </div>
  );
}
