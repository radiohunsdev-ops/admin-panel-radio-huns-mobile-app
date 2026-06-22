import { LucideIcon } from "lucide-react";

export interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

export interface RecentShow {
  title: string;
  host: string;
  listeners: string;
  status: "Live" | "Scheduled" | "Ended";
}