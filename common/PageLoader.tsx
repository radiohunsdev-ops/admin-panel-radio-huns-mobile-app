import { COLORS } from "@/constants/colors";
import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin" size={40} color={COLORS.primary} />
    </div>
  );
}