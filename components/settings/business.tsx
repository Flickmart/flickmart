"use client";

import { useState, type ChangeEvent } from "react";
import { MapPin, Edit2, Check, Phone, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { MultipleSelect } from "@/components/ui/multiple-select";
import Link from "next/link";

export default function BusinessSettings() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    name: "TechGadgets Inc.",
    logo: `${process.env.NEXT_PUBLIC_ASSETS_URL}/placeholder.svg`,
    description:
      "We specialize in selling high-quality tech gadgets and accessories.",
    email: "contact@techgadgets.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Silicon Valley, CA 94000",
  });

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusinessInfo({ ...businessInfo, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditMode(false);
    // Here you would typically save the changes to your backend
    console.log("Saving business info:", businessInfo);
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Business Details</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            className="w-full sm:w-auto"
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
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/business">View Public Page</Link>
          </Button>
        </div>
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
                <div className="relative w-full sm:w-auto flex justify-center sm:justify-start">
                  <img
                    src={businessInfo.logo || "/placeholder.svg"}
                    alt="Business Logo"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                  />
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
                <div className=" w-full">
                  <Label htmlFor="business-name" className="block mb-1">
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
                    <p className="font-medium">{businessInfo.name}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="business-description">Description</Label>
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
                  <p>{businessInfo.description}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
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
                  <span>{businessInfo.phone}</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              {isEditMode ? (
                <Input
                  value={businessInfo.address}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      address: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{businessInfo.address}</p>
              )}
            </div>
          </div>

          <Separator />
        </div>
      </Card>
    </div>
  );
}
