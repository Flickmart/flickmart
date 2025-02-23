import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-muted/50 p-6">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-3xl font-bold mt-2">$24,563</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-6">
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-3xl font-bold mt-2">1,234</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-6">
          <h3 className="text-lg font-semibold">New Orders</h3>
          <p className="text-3xl font-bold mt-2">56</p>
        </div>
      </div>
      <div className="rounded-xl bg-muted/50 p-6 min-h-[400px]">
        <h3 className="text-lg font-semibold mb-4">Sales Analytics</h3>
        {/* Add charts or graphs here */}
      </div>
    </div>
  );
}