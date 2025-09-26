import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600 font-medium">Loading job data...</p>
      </div>
    </div>
  );
}
