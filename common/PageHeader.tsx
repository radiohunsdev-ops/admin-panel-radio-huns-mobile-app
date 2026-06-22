 
import Link from "next/link";
import { ArrowLeft  } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { ReactNode } from "react";
 

interface PageHeaderProps {
  title: string;
  subtitle: string;
  backHref: string;
  actions?: ReactNode;
}
 
export function PageHeader({ title, subtitle, backHref, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <ArrowLeft size={20} color={COLORS.text} />
        </Link>
 
        <div>
          <h1 className="text-4xl font-bold" style={{ color: COLORS.text }}>
            {title}
          </h1>
          <p className="mt-2" style={{ color: COLORS.muted }}>
            {subtitle}
          </p>
        </div>
      </div>
 
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}