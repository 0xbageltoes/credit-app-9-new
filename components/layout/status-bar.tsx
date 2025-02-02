import { Circle, Activity, Database } from 'lucide-react';
import { formatNumber } from '@/lib/utils/financial';

function ConnectionStatus() {
  return (
    <div className="flex items-center gap-1.5">
      <Circle className="h-2 w-2 fill-green-500 text-green-500" />
      <span>Connected</span>
    </div>
  );
}

function CalculationStatus({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Activity className="h-3 w-3" />
      <span>{status}</span>
    </div>
  );
}

function MemoryUsage() {
  return (
    <div className="flex items-center gap-1.5">
      <Database className="h-3 w-3" />
      <span>{formatNumber(performance.memory?.usedJSHeapSize || 0)} MB</span>
    </div>
  );
}

function LastSync() {
  return (
    <div>Last sync: 2 minutes ago</div>
  );
}

export function StatusBar() {
  return (
    <div className="h-6 border-t bg-muted/50 px-2 text-xs flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ConnectionStatus />
        <CalculationStatus status="Ready" />
      </div>
      <div className="flex items-center gap-2">
        <MemoryUsage />
        <LastSync />
      </div>
    </div>
  );
}