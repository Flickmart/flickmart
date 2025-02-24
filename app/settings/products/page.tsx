import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <header className="flex items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-muted/50 p-6">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-3xl font-bold mt-2">1,234</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-6">
          <h3 className="text-lg font-semibold">Out of Stock</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-6">
          <h3 className="text-lg font-semibold">Low Stock</h3>
          <p className="text-3xl font-bold mt-2">45</p>
        </div>
      </div>
      <div className="rounded-xl bg-muted/50 p-6">
        <h3 className="text-lg font-semibold mb-4">Product List</h3>
        <div className="grid gap-4">
          {/* Add product list table or grid here */}
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Product list will be implemented here
          </div>
        </div>
      </div>
    </div>
  );
}
