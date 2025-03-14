"use client";

import { useState, type ChangeEvent } from "react";
import { Mail, MapPin, Phone, Edit2, Check, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-lg font-semibold">{title}</h2>
);

export default function MarketplaceProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Ebuka",
    username: "ebuka223",
    bio: "Flickmart building team",
    profilePicture: `/placeholder.svg`,
  });
  const [contactInfo, setContactInfo] = useState({
    phone: "+234-904-235-0500",
    email: "ebuka@gmail.com"
  });
  const [addressInfo, setAddressInfo] = useState({
    address: "Enugu, Nigeria",
  });
  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalInfo({
          ...personalInfo,
          profilePicture: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="min-h-screen bg-white p-4 lg:p-8">
      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={personalInfo.profilePicture}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="capitalize">
                    {personalInfo.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    {personalInfo.fullName
                      .split(" ")
                      .map((n) => n[1])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditMode && (
                  <Label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <Input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleProfilePictureChange}
                    />
                  </Label>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{personalInfo.fullName}</h1>
                <p className="text-sm text-muted-foreground">{personalInfo.username}</p>
              </div>
            </div>
            <Button onClick={() => setIsEditMode(!isEditMode)}>
              {isEditMode ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
          <Separator className="my-6" />
          <div className="space-y-6">
            <div>
              <SectionHeader title="About" />
              <div className="mt-4">
                {isEditMode ? (
                  <Textarea
                    value={personalInfo.bio}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        bio: e.target.value,
                      })
                    }
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{personalInfo.bio}</p>
                )}
              </div>
            </div>
            <div>
              <SectionHeader title="Contact Information" />
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {isEditMode ? (
                    <Input
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{contactInfo.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {isEditMode ? (
                    <Input
                      value={contactInfo.email}
                      disabled
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{contactInfo.email}</span>
                  )}
                </div>
              </div>
            </div>
            <div>
              <SectionHeader title="Location" />
              <div className="mt-4 flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                {isEditMode ? (
                  <Input
                    value={addressInfo.address}
                    onChange={(e) =>
                      setAddressInfo({
                        ...addressInfo,
                        address: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                ) : (
                  <p>{addressInfo.address}</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
