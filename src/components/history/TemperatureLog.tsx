
interface TemperatureLogProps {
  logs: Array<{
    timestamp: string;
    temperature: number;
    unit: string;
  }>;
}

export function TemperatureLog({ logs }: TemperatureLogProps) {
  return (
    <div className="mt-2 p-2 bg-gray-50 rounded">
      <p className="text-sm font-medium mb-1">Temperature Log:</p>
      <ul className="text-xs space-y-1">
        {logs.map((log, i) => (
          <li key={i} className="text-gray-600">
            {new Date(log.timestamp).toLocaleString()}: {log.temperature}°{log.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}
