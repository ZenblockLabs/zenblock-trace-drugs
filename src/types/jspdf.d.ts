
// Add AutoTable type definition for jsPDF
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => any;
    lastAutoTable: {
      finalY: number;
    };
    internal: {
      getNumberOfPages: () => number;
      pageSize: {
        width: number;
        getWidth: () => number;
        height: number;
        getHeight: () => number;
      };
      pages: number[];
      events: any;
      scaleFactor: number;
      getEncryptor: (objectId: number) => (data: string) => string;
    };
  }
}

declare module 'jspdf-autotable';
