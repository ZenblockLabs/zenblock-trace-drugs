
// Add AutoTable type definition for jsPDF
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => any;
    lastAutoTable: {
      finalY: number;
    };
  }
}

declare module 'jspdf-autotable';
