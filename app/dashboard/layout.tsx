import SidebarNav from '@/components/dashboard/sidebar-nav';
import { DateRangeProvider } from '@/lib/hooks/use-date-range';
import { RoleProvider } from '@/lib/hooks/use-role';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <div className="flex min-h-screen">
        <SidebarNav />
        <DateRangeProvider>
          <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-8 md:pt-8">
            <DashboardHeader />
            {children}
          </main>
        </DateRangeProvider>
      </div>
    </RoleProvider>
  );
}
