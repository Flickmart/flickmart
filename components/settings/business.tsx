"use client";

import { useState, type ChangeEvent } from "react";
import { MapPin, Edit2, Check, Phone, Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import imageCompression from "browser-image-compression";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { toast } from "sonner";
import { useUpload } from "@/hooks/useUpload";
import { MoonLoader } from "react-spinners";
import { Id } from "@/convex/_generated/dataModel";

export default function BusinessSettings() {
  const [isEditMode, setIsEditMode] = useState(false);
  const userStore = useQuery(api.store.getStoresByUserId);
  const [fileURL, setFileURL] = useState<string | undefined>(undefined);
  const { startUpload, isUploading } = useUpload();
  const updateStore = useMutation(api.store.updateStore);

  const [businessInfo, setBusinessInfo] = useState({
    name: userStore?.data?.name,
    logo: userStore?.data?.image,
    description: userStore?.data?.description,
    phone: userStore?.data?.phone,
    address: userStore?.data?.location,
  });

  const handleLogoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Max image size allowed
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Image compression
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = file && (await imageCompression(file, options));

    // File Url for Preview
    const fileUrl = compressedFile
      ? URL.createObjectURL(compressedFile)
      : undefined;
    setFileURL(fileUrl);

    const storeImg = compressedFile && (await startUpload([compressedFile]));
    // Upload file to upload thing
    setBusinessInfo({
      ...businessInfo,
      logo: storeImg?.[0]?.ufsUrl || businessInfo.logo,
    });
  };

  const handleSave = async () => {
    setIsEditMode(false);
    // Here you would typically save the changes to your backend
    const storeId = await updateStore({
      id: userStore?.data?._id as Id<"store">,
      name: businessInfo.name,
      description: businessInfo.description,
      phone: businessInfo.phone,
      location: businessInfo.address,
      image: businessInfo.logo,
    });

    if (storeId) {
      toast.success("Store updated successfully");
    }
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Business Details</h1>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full  sm:w-auto flex justify-center sm:justify-start">
                  <div className="size-28 bg-gray-100  rounded-full">
                    {isUploading ? (
                      <div className="size-full grid place-items-center">
                        <MoonLoader size={35} />
                      </div>
                    ) : !userStore?.data?.image && !fileURL ? (
                      <User className="size-full p-3 text-gray-700" />
                    ) : (
                      <Image
                        src={fileURL || userStore?.data?.image || ""}
                        alt="Business Logo"
                        height={400}
                        width={400}
                        className="size-full object-cover rounded-full"
                      />
                    )}
                  </div>
                  {isEditMode && (
                    <Label
                      htmlFor="logo-upload"
                      className="absolute bottom-0 right-1/2 sm:right-0 translate-x-10 sm:translate-x-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <Camera className="h-4 w-4" />
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleLogoChange}
                      />
                    </Label>
                  )}
                </div>
                <div className=" w-full space-y-2">
                  <Label
                    htmlFor="business-name"
                    className="block font-semibold mb-1"
                  >
                    Business Name
                  </Label>
                  {isEditMode ? (
                    <Input
                      id="business-name"
                      value={businessInfo.name}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          name: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  ) : (
                    <p className="font-medium">{userStore?.data?.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-description" className="font-semibold">
                  Description
                </Label>
                {isEditMode ? (
                  <Textarea
                    id="business-description"
                    value={businessInfo.description}
                    onChange={(e) =>
                      setBusinessInfo({
                        ...businessInfo,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                  />
                ) : (
                  <p className="leading-relaxed">
                    {userStore?.data?.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 w-full">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {isEditMode ? (
                  <Input
                    value={businessInfo.phone}
                    onChange={(e) =>
                      setBusinessInfo({
                        ...businessInfo,
                        phone: e.target.value,
                      })
                    }
                    className="w-full"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <span>{userStore?.data?.phone}</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Location</h2>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              {isEditMode ? (
                <Input
                  className="capitalize"
                  value={businessInfo.address}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      address: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="capitalize">{userStore?.data?.location}</p>
              )}
            </div>
          </div>

          <Separator />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-8 pb-4 w-full sm:w-auto">
          <Button
            className="w-full sm:w-auto h-10"
            onClick={() => (isEditMode ? handleSave() : setIsEditMode(true))}
          >
            {isEditMode ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Details
              </>
            )}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto h-10">
            <Link href={`/business/${userStore?.data?._id}`}>
              View Public Page
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
