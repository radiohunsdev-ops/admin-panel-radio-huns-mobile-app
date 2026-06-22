import { RecentShow, StatCard } from "@/types/dashboard";
import {
  DollarSign,
  Radio,
  TrendingUp,
  Users,
} from "lucide-react";


export const stats: StatCard[] = [
  {
    title: "Total Users",
    value: "24,590",
    change: "+12%",
    icon: Users,
  },
  {
    title: "Live Shows",
    value: "128",
    change: "+8%",
    icon: Radio,
  },
  {
    title: "Revenue",
    value: "$18,240",
    change: "+20%",
    icon: DollarSign,
  },
  {
    title: "Growth",
    value: "32%",
    change: "+4%",
    icon: TrendingUp,
  },
];

export const recentShows: RecentShow[] = [
  {
    title: "Morning Beats",
    host: "DJ Alex",
    listeners: "12.4K",
    status: "Live",
  },
  {
    title: "Night Vibes",
    host: "Sarah Lee",
    listeners: "8.1K",
    status: "Scheduled",
  },
  {
    title: "Hip Hop Hour",
    host: "Mike Ross",
    listeners: "5.7K",
    status: "Ended",
  },
  {
    title: "Indie Mix",
    host: "Emma Stone",
    listeners: "9.3K",
    status: "Live",
  },
];