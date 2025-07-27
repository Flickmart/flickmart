"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import BusinessSettings from "@/components/settings/business";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
const businessFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  description: z
    .string()
    .min(10, "You must type a minimum of 10 characters")
    .max(250, "You can only type a maximum of 250 characters"),
  location: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  businessProfile: z.string().min(1, "Add a business logo"),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

export default function BusinessDetailsPage() {
  const [hasBusiness, setHasBusiness] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: "",
      location: "",
      contactNumber: "",
      businessProfile: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("businessProfile", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BusinessFormValues) => {
    // TODO: Implement update logic
    console.log("Form submitted:", data);
    setHasBusiness(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <header className=" flex items-center">
        {!isMobile ? (
          <SidebarTrigger className="-ml-1" />
        ) : (
          <>
            <ArrowLeft
              className="cursor-pointer -ml-1"
              onClick={() => setOpenMobile(!openMobile)}
            />
          </>
        )}
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Business</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {hasBusiness ? (
        <BusinessSettings />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <h2 className="text-2xl font-semibold">
            You have not created a business yet
          </h2>
          <p className="text-muted-foreground">
            Create your business to get started
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Business Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Business Profile</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4 py-4"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-dashed border-gray-300">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Business profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-50">
                          <svg
                            className="h-8 w-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name="businessProfile"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              id="profileImage"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("profileImage")?.click()
                            }
                          >
                            {imagePreview ? "Change Image" : "Upload Image"}
                          </Button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="mt-4">
                    Create Business
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
