import {
  LayoutDashboard,
  Newspaper,
  Users,
  PlusCircle,
  MessageSquare,
  FilePlus2,
  Tags,
  UserCog,
  Home,
  ExternalLink
} from "lucide-react";

export const DASHBOARD_ROUTES = {
  ADMIN: [
    {
      group: "Overview",
      items: [
        { title: "Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
      ],
    },
    {
      group: "Content Management",
      items: [
        { title: "Create Category", url: "/admin-categories", icon: PlusCircle },
        { title: "Manage Categories", url: "/admin-manageCategory", icon: Tags },
        { title: "Create News", url: "/admin-createNews", icon: FilePlus2 },
        { title: "All News", url: "/admin-allNews", icon: Newspaper },
        { title: "All Comments", url: "/admin-comments", icon: MessageSquare },
      ],
    },
    {
      group: "Administration",
      items: [
        { title: "User Management", url: "/admin-allUsers", icon: Users },
      ],
    },
    {
      group: "Quick Links",
      items: [
        { title: "View Website", url: "/", icon: ExternalLink },
      ],
    },
  ],

  USER: [
    {
      group: "Personal Space",
      items: [
        { title: "My Profile", url: "/dashboard", icon: LayoutDashboard },
        { title: "Account Settings", url: "/dashboard/settings", icon: UserCog },
      ],
    },
    {
      group: "Navigation",
      items: [
        { title: "Back to Home", url: "/", icon: Home },
      ],
    },
  ],
};