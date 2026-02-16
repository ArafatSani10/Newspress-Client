import {
  LayoutDashboard,
  Newspaper,
  Layers,
  Users,
  Settings,
  PlusCircle
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
        { title: "All News", url: "/admin-dashboard/news", icon: Newspaper },
        { title: "Create News", url: "/admin-dashboard/news/create", icon: PlusCircle },
        { title: "Categories", url: "/admin-dashboard/categories", icon: Layers },
      ],
    },
    {
      group: "Settings",
      items: [
        { title: "User Management", url: "/admin-dashboard/users", icon: Users },
        { title: "Site Settings", url: "/admin-dashboard/settings", icon: Settings },
      ],
    },
  ],

  
  USER: [
    {
      group: "User Menu",
      items: [
        { title: "My Profile", url: "/dashboard", icon: LayoutDashboard },
        { title: "Account Settings", url: "/dashboard/settings", icon: Settings },
      ],
    },
  ],
};