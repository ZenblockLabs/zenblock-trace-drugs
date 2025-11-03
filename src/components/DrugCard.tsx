
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
      <CardHeader className="p-4 sm:p-6">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base sm:text-lg leading-tight">{drug.productName}</CardTitle>
          <StatusBadge status={drug.status || 'manufactured'} />
        </div>
        <CardDescription className="text-xs sm:text-sm break-all">SGTIN: {drug.sgtin}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4 sm:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center text-xs sm:text-sm">
            <Pill className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-zenblue-500 flex-shrink-0" />
            <span className="truncate">{drug.dosage}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-zenblue-500 flex-shrink-0" />
            <span className="truncate">Expires: {drug.expiryDate}</span>
          </div>
          <div className="text-xs sm:text-sm mt-2 border-t pt-2">
            <div className="text-muted-foreground">Current Owner:</div>
            <div className="font-medium truncate">{drug.currentOwnerName || drug.ownerName}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0">
        <Button asChild variant="outline" className="w-full text-sm">
          <Link to={`/drugs/${drug.id}`}>
            View Details
            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
