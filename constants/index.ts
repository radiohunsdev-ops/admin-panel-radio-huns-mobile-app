import { SidebarMenuItem } from "@/types/Siderbar";
import { Activity, Headphones, LayoutDashboard, Music2, Radio, Users } from "lucide-react";

export const menuItems: SidebarMenuItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Live Radio",
    href: "/live-radio",
    icon: Radio,
  },
  {
    title: "Shows",
    href: "/shows",
    icon: Music2,
  },
  {
    title: "Schedule",
    href: "/schedules",
    icon: Activity,
  },
  {
    title: "Hosts",
    href: "/hosts",
    icon: Headphones,
  },
  
  // {
  //   title: "Podcasts",
  //   href: "/podcasts",
  //   icon: PlayCircle,
  // },
  // {
  //   title: "Journal / Blogs",
  //   href: "/blogs",
  //   icon: Newspaper,
  // },
  // {
  //   title: "Contests & Giveaways",
  //   href: "/contests",
  //   icon: Gift,
  // },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  // {
  //   title: "Notifications",
  //   href: "/notifications",
  //   icon: Bell,
  // },
  // {
  //   title: "Analytics",
  //   href: "/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   title: "Media Library",
  //   href: "/media-library",
  //   icon: Video,
  // },
  // {
  //   title: "Advertisements",
  //   href: "/advertisements",
  //   icon: WalletCards,
  // },
  // {
  //   title: "Membership Plans",
  //   href: "/membership-plans",
  //   icon: BookOpen,
  // },
  // {
  //   title: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
  // {
  //   title: "Roles & Permissions",
  //   href: "/roles-permissions",
  //   icon: ShieldCheck,
  // },
  // {
  //   title: "Support Tickets",
  //   href: "/support-tickets",
  //   icon: Ticket,
  // },
  // {
  //   title: "Logs & Activity",
  //   href: "/logs-activity",
  //   icon: FileText,
  // },
];