
interface BatchProcessingHeaderProps {}

export const BatchProcessingHeader = ({}: BatchProcessingHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Batch Processing</h1>
      <p className="text-muted-foreground">
        Efficiently process multiple drugs in a single operation
      </p>
    </div>
  );
};
