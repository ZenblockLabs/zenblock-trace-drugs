// import React, { useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import { Share2, QrCode, Shield } from 'lucide-react';
// import { KadhaCapsule } from '@/services/kadha/KadhaService';
// import { useKadhaViewTracking, useKadhaAnalytics } from '@/hooks/useKadha';
// import { format } from 'date-fns';

// interface KadhaCapsuleViewerProps {
//   capsule: KadhaCapsule & {
//     batches?: {
//       id: string;
//       batch_number: string;
//       product_name: string;
//       product_type: string;
//       description?: string;
//       origin_location?: string;
//       harvest_date?: string;
//       status: string;
//     };
//   };
//   isPublicView?: boolean;
// }

// export function KadhaCapsuleViewer({ capsule, isPublicView = false }: KadhaCapsuleViewerProps) {
//   const { trackEvent } = useKadhaAnalytics();

//   // Track view analytics for public views
//   useKadhaViewTracking(isPublicView ? capsule.id : undefined);

//   const handleShare = async () => {
//     const shareData = {
//       title: `${capsule.product_name} - Verified by Zenblock Labs`,
//       text: capsule.origin_story.substring(0, 100) + '...',
//       url: window.location.href
//     };

//     if (navigator.share && isPublicView) {
//       try {
//         await navigator.share(shareData);
//         trackEvent(capsule.id, 'share');
//       } catch (error) {
//         console.log('Share failed:', error);
//       }
//     } else {
//       // Fallback: copy to clipboard
//       await navigator.clipboard.writeText(window.location.href);
//       if (isPublicView) {
//         trackEvent(capsule.id, 'share');
//       }
//     }
//   };

//   const handleQRScan = () => {
//     if (isPublicView) {
//       trackEvent(capsule.id, 'scan');
//     }
//   };

//   return (
//     <div className={`${isPublicView ? 'min-h-screen bg-gradient-to-br from-primary/5 to-accent/5' : ''}`}>
//       <div className="max-w-4xl mx-auto p-4 space-y-6">
//         {/* Header */}
//         <div className="text-center space-y-4">
//           {isPublicView && (
//             <div className="flex items-center justify-center gap-2 mb-4">
//               <Shield className="h-5 w-5 text-primary" />
//               <span className="text-sm font-medium text-primary">Verified by Zenblock Labs</span>
//             </div>
//           )}

//           <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
//             {capsule.product_name}
//           </h1>

//           {capsule.batches && (
//             <div className="flex flex-wrap justify-center gap-2">
//               <Badge variant="outline">
//                 Batch: {capsule.batches.batch_number}
//               </Badge>
//               <Badge variant="secondary">
//                 {capsule.batches.product_type}
//               </Badge>
//               {capsule.batches.harvest_date && (
//                 <Badge variant="outline">
//                   Harvested: {format(new Date(capsule.batches.harvest_date), 'MMM yyyy')}
//                 </Badge>
//               )}
//             </div>
//           )}

//           {isPublicView && (
//             <div className="flex justify-center gap-2 mt-4">
//               <Button variant="outline" size="sm" onClick={handleShare}>
//                 <Share2 className="h-4 w-4 mr-2" />
//                 Share
//               </Button>
//               <Button variant="outline" size="sm" onClick={handleQRScan}>
//                 <QrCode className="h-4 w-4 mr-2" />
//                 QR Code
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Hero Images */}
//         {capsule.supporting_images && capsule.supporting_images.length > 0 && (
//           <Card className="overflow-hidden">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
//               {capsule.supporting_images.slice(0, 3).map((image: any, index: number) => (
//                 <div key={index} className="aspect-square overflow-hidden rounded-lg">
//                   <img
//                     src={image.url}
//                     alt={`${capsule.product_name} image ${index + 1}`}
//                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>
//               ))}
//             </div>
//           </Card>
//         )}

//         {/* Origin Story */}
//         <Card>
//           <CardContent className="p-6">
//             <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
//             <div className="prose prose-gray max-w-none">
//               <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
//                 {capsule.origin_story}
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Key Ingredients */}
//         {capsule.key_ingredients && (
//           <Card>
//             <CardContent className="p-6">
//               <h2 className="text-2xl font-semibold mb-4">Key Ingredients & Benefits</h2>
//               <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
//                 {capsule.key_ingredients}
//               </p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Brand Message */}
//         {capsule.brand_message && (
//           <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
//             <CardContent className="p-6">
//               <h2 className="text-2xl font-semibold mb-4">From Our Founder</h2>
//               <div className="border-l-4 border-primary pl-4">
//                 <p className="text-muted-foreground leading-relaxed italic whitespace-pre-wrap">
//                   "{capsule.brand_message}"
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Certifications */}
//         {capsule.gmp_certifications && capsule.gmp_certifications.length > 0 && (
//           <Card>
//             <CardContent className="p-6">
//               <h2 className="text-2xl font-semibold mb-4">Certifications & Quality</h2>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {capsule.gmp_certifications.map((cert: any, index: number) => (
//                   <div key={index} className="aspect-square bg-muted rounded-lg p-4 flex items-center justify-center">
//                     {cert.type?.startsWith('image') ? (
//                       <img
//                         src={cert.url}
//                         alt={`Certification ${index + 1}`}
//                         className="w-full h-full object-contain rounded"
//                       />
//                     ) : (
//                       <div className="text-center">
//                         <div className="text-2xl mb-2">📋</div>
//                         <p className="text-xs text-muted-foreground">{cert.name}</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Batch Details */}
//         {capsule.batches && isPublicView && (
//           <Card>
//             <CardContent className="p-6">
//               <h2 className="text-2xl font-semibold mb-4">Verified Batch Details</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-3">
//                   <div>
//                     <label className="text-sm font-medium text-muted-foreground">Batch Number</label>
//                     <p className="font-mono">{capsule.batches.batch_number}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-muted-foreground">Product Type</label>
//                     <p>{capsule.batches.product_type}</p>
//                   </div>
//                   {capsule.batches.origin_location && (
//                     <div>
//                       <label className="text-sm font-medium text-muted-foreground">Origin</label>
//                       <p>{capsule.batches.origin_location}</p>
//                     </div>
//                   )}
//                 </div>
//                 <div className="space-y-3">
//                   {capsule.batches.harvest_date && (
//                     <div>
//                       <label className="text-sm font-medium text-muted-foreground">Harvest Date</label>
//                       <p>{format(new Date(capsule.batches.harvest_date), 'PPP')}</p>
//                     </div>
//                   )}
//                   <div>
//                     <label className="text-sm font-medium text-muted-foreground">Status</label>
//                     <Badge variant="outline" className="ml-2">
//                       {capsule.batches.status}
//                     </Badge>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-muted-foreground">Published</label>
//                     <p>{format(new Date(capsule.published_at || capsule.created_at), 'PPP')}</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Trust Footer */}
//         {isPublicView && (
//           <div className="text-center py-8 border-t">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <Shield className="h-4 w-4 text-primary" />
//               <span className="text-sm font-medium">Verified by Zenblock Labs</span>
//             </div>
//             <p className="text-xs text-muted-foreground">
//               This product information has been verified on the blockchain and is tamper-proof.
//             </p>
//             <p className="text-xs text-muted-foreground mt-1">
//               © 2024 Zenblock Labs. All rights reserved.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
