'use client';

import imageCompression from 'browser-image-compression';
import { useMutation, useQuery } from 'convex/react';
import { Camera, Check, Edit2, MapPin, Phone, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type ChangeEvent, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { api } from 'backend/convex/_generated/api';
import type { Id } from 'backend/convex/_generated/dataModel';
import { useUpload } from '@/hooks/useUpload';

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
      toast.error('Image size should be less than 2MB');
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
      id: userStore?.data?._id as Id<'store'>,
      name: businessInfo.name,
      description: businessInfo.description,
      phone: businessInfo.phone,
      location: businessInfo.address,
      image: businessInfo.logo,
    });

    if (storeId) {
      toast.success('Store updated successfully');
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="font-bold text-2xl sm:text-3xl">Business Details</h1>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="mb-4 font-semibold text-lg sm:text-xl">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="relative flex w-full justify-center sm:w-auto sm:justify-start">
                  <div className="size-28 rounded-full bg-gray-100">
                    {isUploading ? (
                      <div className="grid size-full place-items-center">
                        <MoonLoader size={35} />
                      </div>
                    ) : userStore?.data?.image || fileURL ? (
                      <Image
                        alt="Business Logo"
                        className="size-full rounded-full object-cover"
                        height={400}
                        src={fileURL || userStore?.data?.image || ''}
                        width={400}
                      />
                    ) : (
                      <User className="size-full p-3 text-gray-700" />
                    )}
                  </div>
                  {isEditMode && (
                    <Label
                      className="absolute right-1/2 bottom-0 translate-x-10 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground transition-opacity hover:opacity-90 sm:right-0 sm:translate-x-0"
                      htmlFor="logo-upload"
                    >
                      <Camera className="h-4 w-4" />
                      <Input
                        accept="image/*"
                        className="sr-only"
                        id="logo-upload"
                        onChange={handleLogoChange}
                        type="file"
                      />
                    </Label>
                  )}
                </div>
                <div className="w-full space-y-2">
                  <Label
                    className="mb-1 block font-semibold"
                    htmlFor="business-name"
                  >
                    Business Name
                  </Label>
                  {isEditMode ? (
                    <Input
                      className="w-full"
                      id="business-name"
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          name: e.target.value,
                        })
                      }
                      value={businessInfo.name}
                    />
                  ) : (
                    <p className="font-medium">{userStore?.data?.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold" htmlFor="business-description">
                  Description
                </Label>
                {isEditMode ? (
                  <Textarea
                    id="business-description"
                    onChange={(e) =>
                      setBusinessInfo({
                        ...businessInfo,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    value={businessInfo.description}
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
            <h2 className="mb-4 font-semibold text-lg">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex w-full items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                {isEditMode ? (
                  <Input
                    className="w-full"
                    onChange={(e) =>
                      setBusinessInfo({
                        ...businessInfo,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                    value={businessInfo.phone}
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
            <h2 className="mb-4 font-semibold text-lg">Location</h2>
            <div className="flex items-start space-x-2">
              <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
              {isEditMode ? (
                <Input
                  className="capitalize"
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      address: e.target.value,
                    })
                  }
                  value={businessInfo.address}
                />
              ) : (
                <p className="capitalize">{userStore?.data?.location}</p>
              )}
            </div>
          </div>

          <Separator />
        </div>
        <div className="flex w-full flex-col gap-4 pt-8 pb-4 sm:w-auto sm:flex-row">
          <Button
            className="h-10 w-full sm:w-auto"
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
          <Button asChild className="h-10 w-full sm:w-auto" variant="outline">
            <Link href={`/business/${userStore?.data?._id}`}>
              View Public Page
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
