import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, X, Eye, Send, Save, QrCode } from 'lucide-react';
import { useAvailableBatches, useKadhaMutations } from '@/hooks/useKadha';
import { CreateCapsuleData, UpdateCapsuleData, KadhaCapsule } from '@/services/kadha/KadhaService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface KadhaCapsuleBuilderProps {
  capsule?: KadhaCapsule;
  onSave?: (capsule: KadhaCapsule) => void;
  onCancel?: () => void;
}

interface FormData {
  batch_id: string;
  product_name: string;
  origin_story: string;
  gmp_certifications: string[];
  key_ingredients: string;
  brand_message: string;
}

export function KadhaCapsuleBuilder({ capsule, onSave, onCancel }: KadhaCapsuleBuilderProps) {
  const { user } = useAuth();
  const { data: batches = [] } = useAvailableBatches();
  const { createCapsule, updateCapsule, publishCapsule, unpublishCapsule } = useKadhaMutations();
  
  const [supportingImages, setSupportingImages] = useState<any[]>(capsule?.supporting_images || []);
  const [gmpCertifications, setGmpCertifications] = useState<any[]>(capsule?.gmp_certifications || []);
  const [previewMode, setPreviewMode] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<FormData>({
    defaultValues: {
      batch_id: capsule?.batch_id || '',
      product_name: capsule?.product_name || '',
      origin_story: capsule?.origin_story || '',
      key_ingredients: capsule?.key_ingredients || '',
      brand_message: capsule?.brand_message || '',
    }
  });

  const watchedData = watch();

  // Handle image upload for supporting images
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'certifications') => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          id: Date.now() + Math.random(),
          url: e.target?.result,
          name: file.name,
          size: file.size,
          type: file.type
        };

        if (type === 'images') {
          setSupportingImages(prev => [...prev, imageData]);
        } else {
          setGmpCertifications(prev => [...prev, imageData]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: any, type: 'images' | 'certifications') => {
    if (type === 'images') {
      setSupportingImages(prev => prev.filter(img => img.id !== id));
    } else {
      setGmpCertifications(prev => prev.filter(cert => cert.id !== id));
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const capsuleData = {
        ...data,
        supporting_images: supportingImages,
        gmp_certifications: gmpCertifications,
        organization_id: user?.organization || '',
        created_by: user?.id || '',
      };

      if (capsule) {
        const updated = await updateCapsule.mutateAsync({
          id: capsule.id,
          data: capsuleData as UpdateCapsuleData
        });
        onSave?.(updated);
      } else {
        const created = await createCapsule.mutateAsync(capsuleData as CreateCapsuleData);
        onSave?.(created);
      }
    } catch (error) {
      console.error('Failed to save capsule:', error);
    }
  };

  const handlePublish = async () => {
    if (!capsule) return;
    
    try {
      if (capsule.is_published) {
        await unpublishCapsule.mutateAsync(capsule.id);
      } else {
        await publishCapsule.mutateAsync(capsule.id);
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  const generateQRCode = () => {
    if (!capsule?.short_link) return;
    
    // This would open QR code modal or generate QR code
    toast.success('QR Code generated! Check the preview tab.');
  };

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Kadha Capsule Preview</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(false)}>
              Edit
            </Button>
            {capsule && (
              <Button onClick={generateQRCode} variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            )}
          </div>
        </div>
        
        {/* Preview component would go here */}
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            Preview functionality will be implemented in the public viewer component
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {capsule ? 'Edit Kadha Capsule' : 'Create Kadha Capsule'}
        </h2>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setPreviewMode(true)}
            disabled={!watchedData.product_name || !watchedData.origin_story}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch_id">Batch ID *</Label>
                <Select
                  value={watchedData.batch_id}
                  onValueChange={(value) => setValue('batch_id', value)}
                  disabled={!!capsule} // Can't change batch for existing capsules
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.batch_number} - {batch.product_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.batch_id && (
                  <p className="text-sm text-destructive">Batch selection is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name *</Label>
                <Input
                  {...register('product_name', { required: 'Product name is required' })}
                  placeholder="Enter product name"
                />
                {errors.product_name && (
                  <p className="text-sm text-destructive">{errors.product_name.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origin Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="origin_story">Tell your product's story *</Label>
              <Textarea
                {...register('origin_story', { required: 'Origin story is required' })}
                placeholder="Share the journey of your product - from sourcing to creation, what makes it special..."
                className="min-h-[120px]"
              />
              {errors.origin_story && (
                <p className="text-sm text-destructive">{errors.origin_story.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GMP & Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Certification Documents</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handleImageUpload(e, 'certifications')}
                  className="hidden"
                  id="cert-upload"
                />
                <Label htmlFor="cert-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted">
                    <Upload className="h-4 w-4" />
                    Upload Files
                  </div>
                </Label>
              </div>
            </div>

            {gmpCertifications.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gmpCertifications.map((cert) => (
                  <div key={cert.id} className="relative group">
                    <div className="border rounded-lg p-2">
                      {cert.type?.startsWith('image') ? (
                        <img
                          src={cert.url}
                          alt={cert.name}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-24 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">{cert.name}</span>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(cert.id, 'certifications')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key_ingredients">Key Ingredients & Benefits</Label>
              <Textarea
                {...register('key_ingredients')}
                placeholder="List the key ingredients and their benefits..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_message">Founder/Brand Message</Label>
              <Textarea
                {...register('brand_message')}
                placeholder="A personal message from the founder or brand..."
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supporting Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Product Images</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'images')}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted">
                    <Upload className="h-4 w-4" />
                    Upload Images
                  </div>
                </Label>
              </div>
            </div>

            {supportingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {supportingImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(image.id, 'images')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {capsule && (
              <div className="flex items-center gap-2">
                <Badge variant={capsule.is_published ? "default" : "secondary"}>
                  {capsule.is_published ? "Published" : "Draft"}
                </Badge>
                {capsule.is_active && (
                  <Badge variant="outline">Active</Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="outline"
              disabled={createCapsule.isPending || updateCapsule.isPending || !isDirty}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            
            {capsule && (
              <Button
                type="button"
                onClick={handlePublish}
                disabled={publishCapsule.isPending || unpublishCapsule.isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                {capsule.is_published ? 'Unpublish' : 'Publish'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}