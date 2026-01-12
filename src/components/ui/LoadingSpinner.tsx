import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8 text-neutral-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
