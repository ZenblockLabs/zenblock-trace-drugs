
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Printer } from 'lucide-react';

interface QRCodeGeneratorProps {
  drugCode: string;
  trackingBaseUrl?: string;
}

export function QRCodeGenerator({ drugCode, trackingBaseUrl = 'https://trace.zenblocklabs.com/track' }: QRCodeGeneratorProps) {
  const [size, setSize] = useState(200);
  
  const trackingUrl = `${trackingBaseUrl}?code=${encodeURIComponent(drugCode)}`;
  
  const handleDownload = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLElement;
    const svg = canvas.querySelector('svg');
    
    if (!svg) return;
    
    // Create a canvas to convert SVG to image
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    // Set canvas dimensions to match QR code
    tempCanvas.width = size;
    tempCanvas.height = size;
    
    if (!ctx) return;
    
    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Create an Image object to draw the SVG to the canvas
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Draw the SVG image onto the canvas
      ctx.drawImage(img, 0, 0, size, size);
      
      // Create a link to download the canvas as an image
      const link = document.createElement('a');
      link.download = `zenblock-${drugCode}.png`;
      link.href = tempCanvas.toDataURL('image/png');
      link.click();
      
      // Clean up
      URL.revokeObjectURL(svgUrl);
    };
    
    img.src = svgUrl;
  };
  
  const handlePrint = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLElement;
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow pop-ups to print the QR code');
      return;
    }
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Zenblock Drug Traceability - ${drugCode}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: Arial, sans-serif;
            }
            .container {
              display: flex;
              flex-direction: column;
              align-items: center;
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 8px;
            }
            .code {
              margin-top: 15px;
              font-size: 16px;
              color: #333;
            }
            .url {
              margin-top: 5px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${canvas.innerHTML}
            <div class="code">Drug Code: ${drugCode}</div>
            <div class="url">Scan to verify at trace.zenblocklabs.com</div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.print();
    };
  };
  
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center">
        <div id="qr-code-canvas" className="bg-white p-4 rounded-lg mb-4">
          <QRCode 
            value={trackingUrl}
            size={size}
            level="H"
          />
        </div>
        <div className="text-sm text-center mb-4 text-gray-500">
          <p>Scan to verify the authenticity of this drug</p>
          <p className="text-xs mt-1 break-all">{trackingUrl}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleDownload} className="flex gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button size="sm" variant="outline" onClick={handlePrint} className="flex gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
