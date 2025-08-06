
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Starting React app...');
console.log('Root element:', document.getElementById("root"));

createRoot(document.getElementById("root")!).render(<App />);

console.log('React app should be rendered now');
