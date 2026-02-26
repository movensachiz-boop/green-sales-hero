import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import logo from "@/assets/logo.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/60 bg-card/80 backdrop-blur-xl px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <img src={logo} alt="Vision System" className="h-7" />
              <div className="h-5 w-px bg-border" />
              <h2 className="text-base font-display font-semibold text-card-foreground">Vision System</h2>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
