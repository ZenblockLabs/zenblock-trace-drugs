import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { RecallModal } from '@/components/RecallModal';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { QRCodeModal } from '@/components/QRCodeModal';
import { Drug } from '@/services/types';
import { getBlockchainService } from '@/services/blockchainServiceFactory';
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PackagePlus } from "lucide-react";

const formSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  dosage: z.string().min(1, "Dosage is required"),
  batchNumber: z.string().min(1, "Batch number is required"),
  gtin: z.string().min(8, "GTIN must be at least 8 characters"),
  expiryDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date format"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const RegisterDrugPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      dosage: "",
      batchNumber: "",
      gtin: "",
      expiryDate: new Date().toISOString().split('T')[0],
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to register a drug");
      return;
    }

    if (user.role !== "manufacturer") {
      toast.error("Only manufacturers can register new drugs");
      return;
    }

    setIsSubmitting(true);

    try {
      const drugData = {
        manufacturerId: user.id,
        manufacturerName: user.organization,
        productName: data.productName,
        dosage: data.dosage,
        batchNumber: data.batchNumber,
        gtin: data.gtin,
        expiryDate: data.expiryDate,
        description: data.description || "",
      };
      
      const service = await getBlockchainService();
      const newDrug = await service.registerDrug(drugData);

      toast.success("Drug registered successfully!");
      navigate(`/drugs/${newDrug.id}`);
    } catch (error) {
      console.error("Error registering drug:", error);
      toast.error("Failed to register drug. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user && user.role !== "manufacturer") {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          Only manufacturers can register new drugs in the system.
        </p>
        <Button asChild>
          <a href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Register New Drug</h1>
        <p className="text-muted-foreground">
          Add a new pharmaceutical product to the blockchain
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <PackagePlus className="h-6 w-6 text-primary" />
            <CardTitle>Product Registration Form</CardTitle>
          </div>
          <CardDescription>
            Enter the details of the new pharmaceutical product
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ZenRelief" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 50mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="batchNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. BATCH-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gtin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GTIN</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 05901234123457" {...field} />
                      </FormControl>
                      <FormDescription>
                        Global Trade Item Number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a description of the pharmaceutical product..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Manufacturer Information</h3>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Manufacturer:</span>
                    <span className="font-medium">{user?.organization || "Not logged in"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register Drug"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
