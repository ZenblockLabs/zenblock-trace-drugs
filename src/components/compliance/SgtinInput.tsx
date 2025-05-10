
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { ExampleSgtins } from "./ExampleSgtins";
import { useState, ChangeEvent } from "react";

interface SgtinInputProps {
  value: string;
  onChange: (value: string) => void;
  onValid: (isValid: boolean) => void;
}

export function SgtinInput({ value, onChange, onValid }: SgtinInputProps) {
  // Example SGTINs for testing
  const exampleSgtins = [
    "00614141777734", // Drug 1
    "00614141000127", // Drug 2
    "00978214500018"  // Drug 3
  ];
  
  const handleSgtinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    // Simple validation - at least 12 digits
    onValid(newValue.trim().length >= 12);
  };
  
  const handleUseExample = (example: string) => {
    onChange(example);
    onValid(true);
  };

  return (
    <div className="w-full sm:w-auto">
      <Label htmlFor="sgtin" className="block text-sm font-medium text-gray-700 mb-1">
        Product SGTIN
      </Label>
      <div className="relative">
        <Input
          type="text"
          id="sgtin"
          placeholder="Enter product SGTIN"
          className="pl-8 pr-3 py-2 w-full sm:w-80"
          value={value}
          onChange={handleSgtinChange}
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      <ExampleSgtins examples={exampleSgtins} onSelect={handleUseExample} />
    </div>
  );
}
