import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  QrCode, 
  BarChart3, 
  Share2,
  Calendar
} from 'lucide-react';
import { useKadhaCapsules, useKadhaMutations } from '@/hooks/useKadha';
import { KadhaCapsuleBuilder } from '@/components/kadha/KadhaCapsuleBuilder';
import { KadhaCapsuleViewer } from '@/components/kadha/KadhaCapsuleViewer';
import { KadhaCapsule } from '@/services/kadha/KadhaService';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

export function KadhaCapsulesPage() {
  const { user } = useAuth();
  const { data: capsules = [], isLoading } = useKadhaCapsules();
  const { deleteCapsule } = useKadhaMutations();
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCapsule, setSelectedCapsule] = useState<KadhaCapsule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter capsules based on search term
  const filteredCapsules = capsules.filter(capsule =>
    capsule.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    capsule.batch_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedCapsule(null);
    setViewMode('create');
  };

  const handleEdit = (capsule: KadhaCapsule) => {
    setSelectedCapsule(capsule);
    setViewMode('edit');
  };

  const handleView = (capsule: KadhaCapsule) => {
    setSelectedCapsule(capsule);
    setViewMode('view');
  };

  const handleDelete = async (capsule: KadhaCapsule) => {
    if (window.confirm('Are you sure you want to delete this Kadha capsule?')) {
      try {
        await deleteCapsule.mutateAsync(capsule.id);
      } catch (error) {
        console.error('Failed to delete capsule:', error);
      }
    }
  };

  const handleSave = (capsule: KadhaCapsule) => {
    setViewMode('list');
    setSelectedCapsule(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedCapsule(null);
  };

  const generateQRCode = (capsule: KadhaCapsule) => {
    // This would open a QR code modal or generate QR code
    const qrUrl = `${window.location.origin}/kadha/${capsule.short_link}`;
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}`, '_blank');
  };

  const shareKadha = async (capsule: KadhaCapsule) => {
    const shareUrl = `${window.location.origin}/kadha/${capsule.short_link}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${capsule.product_name} - Verified by Zenblock Labs`,
          text: capsule.origin_story.substring(0, 100) + '...',
          url: shareUrl
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  // Check if user has permission (brand_manager or admin)
  const hasKadhaPermission = user?.role === 'brand_manager' || user?.role === 'admin';

  if (!hasKadhaPermission) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground">
            You need Brand Manager or Admin role to access Kadha Capsules.
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <KadhaCapsuleBuilder
        capsule={selectedCapsule || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  if (viewMode === 'view' && selectedCapsule) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            ← Back to List
          </Button>
          <h1 className="text-2xl font-bold">Kadha Capsule Preview</h1>
        </div>
        <KadhaCapsuleViewer capsule={selectedCapsule} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kadha Capsules</h1>
          <p className="text-muted-foreground">
            Create and manage story capsules for your verified product batches
          </p>
        </div>
        
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Kadha Capsule
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search capsules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Kadha capsules...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCapsules.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No Kadha Capsules Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No capsules match your search.' : 'Create your first Kadha capsule to get started.'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Kadha Capsule
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Capsules Grid */}
      {!isLoading && filteredCapsules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule) => (
            <Card key={capsule.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {capsule.product_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Batch: {capsule.batch_id.substring(0, 8)}...
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={capsule.is_published ? "default" : "secondary"}>
                      {capsule.is_published ? "Published" : "Draft"}
                    </Badge>
                    {capsule.is_active && (
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Preview Image */}
                {capsule.supporting_images && capsule.supporting_images.length > 0 && (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={capsule.supporting_images[0]?.url}
                      alt={capsule.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}

                {/* Story Preview */}
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {capsule.origin_story}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(capsule.created_at), 'MMM dd, yyyy')}
                  </div>
                  {capsule.scan_count > 0 && (
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {capsule.scan_count} scans
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(capsule)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(capsule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(capsule)}
                      disabled={deleteCapsule.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex gap-1">
                    {capsule.is_published && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateQRCode(capsule)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareKadha(capsule)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}