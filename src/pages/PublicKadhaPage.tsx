import React from 'react';
import { useParams } from 'react-router-dom';
import { usePublishedCapsuleByShortLink } from '@/hooks/useKadha';
import { KadhaCapsuleViewer } from '@/components/kadha/KadhaCapsuleViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

export function PublicKadhaPage() {
  const { shortLink } = useParams<{ shortLink: string }>();
  const { data: capsule, isLoading, error, refetch } = usePublishedCapsuleByShortLink(shortLink);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading Kadha Story...</h2>
          <p className="text-muted-foreground">Please wait while we verify and load the product information.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Error Loading Kadha Story</h2>
            <p className="text-muted-foreground">
              There was an error loading the product story. This could be due to a network issue or an invalid link.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="ghost">
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">🔍</span>
            </div>
            <h2 className="text-xl font-semibold">Kadha Story Not Found</h2>
            <p className="text-muted-foreground">
              The requested product story could not be found. It may have been unpublished or the link may be invalid.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Looking for: <code className="bg-muted px-2 py-1 rounded text-xs">{shortLink}</code>
              </p>
              <Button onClick={() => window.location.href = '/'} variant="outline">
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <KadhaCapsuleViewer capsule={capsule} isPublicView={true} />;
}