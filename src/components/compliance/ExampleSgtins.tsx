
import { Button } from "@/components/ui/button";

interface ExampleSgtinsProps {
  examples: string[];
  onSelect: (sgtin: string) => void;
}

export function ExampleSgtins({ examples, onSelect }: ExampleSgtinsProps) {
  if (!examples.length) return null;
  
  return (
    <div className="mt-2 text-xs text-muted-foreground">
      <span>Try one of these example SGTINs: </span>
      {examples.map((example, index) => (
        <Button 
          key={example} 
          variant="link" 
          className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800" 
          onClick={() => onSelect(example)}
        >
          {example}{index < examples.length - 1 ? ", " : ""}
        </Button>
      ))}
    </div>
  );
}
