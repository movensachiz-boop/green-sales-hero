import { Home, TrendingUp, MapPin, PlusCircle, BarChart3, LogOut, Package, Truck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "Record Sale", url: "/dashboard/sales", icon: PlusCircle },
  { title: "Stock", url: "/dashboard/stock", icon: Package },
  { title: "Leaderboard", url: "/dashboard/leaderboard", icon: TrendingUp },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Cities", url: "/dashboard/cities", icon: MapPin },
  { title: "Distribute", url: "/dashboard/city-stock", icon: Truck },
];

export function DashboardSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error", description: "Failed to sign out. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Signed out", description: "You have been successfully signed out." });
      navigate("/auth");
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col">
        <div className="p-5 flex items-center justify-center border-b border-sidebar-border">
          <img src={logo} alt="Vision System" className={`transition-all duration-200 ${open ? "h-10" : "h-7"}`} />
        </div>
        <SidebarGroup className="flex-1 pt-4">
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[11px] tracking-widest font-medium px-4 mb-1">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={({ isActive }) =>
                        `rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      {open && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pb-4">
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="rounded-xl text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
                  <LogOut className="h-[18px] w-[18px]" />
                  {open && <span className="font-medium">Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
