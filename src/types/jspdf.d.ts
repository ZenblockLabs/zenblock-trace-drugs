
// Add AutoTable type definition for jsPDF
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => any;
    lastAutoTable: {
      finalY: number;
    };
    internal: {
      scaleFactor: number;
      pageSize: {
        width: number;
        getWidth: () => number;
        height: number;
        getHeight: () => number;
      };
      pages: number[];
      events: {
        publish: (eventName: string) => void;
        subscribe: (eventName: string, callback: Function) => void;
        unsubscribe: (eventName: string, callback: Function) => void;
      };
      getEncryptor: (objectId: number) => (data: string) => string;
      getNumberOfPages: () => number;
    };
  }
}

declare module 'jspdf-autotable';
