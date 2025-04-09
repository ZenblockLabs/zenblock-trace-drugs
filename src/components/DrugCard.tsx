
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Drug } from "@/services/types";
import { Pill, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DrugCardProps {
  drug: Drug;
}

export const DrugCard = ({ drug }: DrugCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{drug.productName}</CardTitle>
          <StatusBadge status={drug.status || 'manufactured'} />
        </div>
        <CardDescription>SGTIN: {drug.sgtin}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Pill className="h-4 w-4 mr-2 text-zenblue-500" />
            <span>{drug.dosage}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-zenblue-500" />
            <span>Expires: {drug.expiryDate}</span>
          </div>
          <div className="text-sm mt-2 border-t pt-2">
            <div className="text-muted-foreground">Current Owner:</div>
            <div className="font-medium">{drug.currentOwnerName || drug.ownerName}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/drugs/${drug.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
