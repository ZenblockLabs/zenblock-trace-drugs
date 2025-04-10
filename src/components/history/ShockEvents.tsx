
interface ShockEventsProps {
  shocks: Array<{
    timestamp: string;
    gForce: number;
    location: string;
  }>;
}

export function ShockEvents({ shocks }: ShockEventsProps) {
  return (
    <div className="mt-2 p-2 bg-yellow-50 rounded">
      <p className="text-sm font-medium mb-1 text-yellow-700">Shock Events Detected:</p>
      <ul className="text-xs space-y-1">
        {shocks.map((shock, i) => (
          <li key={i} className="text-yellow-800">
            {new Date(shock.timestamp).toLocaleString()}: {shock.gForce}g at {shock.location}
          </li>
        ))}
      </ul>
    </div>
  );
}
