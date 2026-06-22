import { COLORS } from "@/constants/colors";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface SubmitButtonProps {
  loading: boolean;
  label: string;
  loadingLabel: string;
  icon: ReactNode;
  fullWidth?: boolean;
}
 
export function SubmitButton({
  loading,
  label,
  loadingLabel,
  icon,
  fullWidth = false,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`${
        fullWidth ? "w-full" : "w-full md:w-auto px-8"
      } mt-6 flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50`}
      style={{ backgroundColor: COLORS.primary, color: COLORS.background }}
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
}