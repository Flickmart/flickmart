"use client";

import { useState, type ChangeEvent, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Edit2,
  Check,
  Star,
  Facebook,
  Instagram,
  Twitter,
  Camera,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-lg font-semibold">{title}</h2>
);

export default function MarketplaceProfile() {
  const [isEditMode, setIsEditMode] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Panji Dwi",
    username: "@panjidwi",
    bio: "Passionate about vintage collectibles and tech gadgets. Always on the lookout for unique items!",
    joinDate: "Member since January 2020",
    itemsSold: 152,
    itemsForSale: 23,
    rating: 4.8,
    reviewCount: 98,
    isVerified: true,
    preferredPayments: ["PayPal", "Venmo", "Cash"],
    profilePicture: `${process.env.NEXT_PUBLIC_ASSETS_URL}/placeholder.svg`,
  });

  const [contactInfo, setContactInfo] = useState({
    phone: "+62-921-019-112",
    email: "dwipanji@gmail.com",
    facebook: "facebook.com/panjidwi",
    instagram: "instagram.com/panjidwi",
    twitter: "twitter.com/panjidwi",
  });

  const [addressInfo, setAddressInfo] = useState({
    address: "Manchester, Kentucky",
  });

  const [recentListings] = useState([
    {
      id: 1,
      title: "Vintage Camera",
      price: "$120",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Mechanical Keyboard",
      price: "$80",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Retro Game Console",
      price: "$150",
      image: "/placeholder.svg",
    },
  ]);

  const profileCompletionPercentage = 85;

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

  useEffect(() => {
    if (!isEditMode) {
      // Here you would typically save the changes to your backend
      console.log("Saving changes:", {
        personalInfo,
        contactInfo,
        addressInfo,
      });
    }
  }, [isEditMode, personalInfo, contactInfo, addressInfo]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <Card className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={personalInfo.profilePicture}
                    alt="Profile picture"
                  />
                  <AvatarFallback>
                    {personalInfo.fullName
                      .split(" ")
                      .map((n) => n[0])
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
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">
                    {personalInfo.fullName}
                  </h1>
                  {personalInfo.isVerified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {personalInfo.username}
                </p>
                <div className="mt-2 flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">
                    {personalInfo.rating}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({personalInfo.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setIsEditMode(!isEditMode)}>
                {isEditMode ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link
                  href={`/settings/personal/${personalInfo.username.replace("@", "")}`}
                >
                  <ChevronRight className="mr-2 h-4 w-4" />
                  View Public Profile
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                {personalInfo.joinDate}
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-medium">{personalInfo.itemsSold}</span>{" "}
              items sold
            </div>
            <div>
              <span className="font-medium">{personalInfo.itemsForSale}</span>{" "}
              items for sale
            </div>
            <div>
              Preferred payments: {personalInfo.preferredPayments.join(", ")}
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal Information */}
            <Card className="p-6">
              <SectionHeader title="Personal Information" />
              <Separator className="my-4" />
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  {isEditMode ? (
                    <Input
                      id="fullName"
                      value={personalInfo.fullName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          fullName: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p>{personalInfo.fullName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  {isEditMode ? (
                    <Input
                      id="username"
                      value={personalInfo.username}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          username: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p>{personalInfo.username}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bio">About Me</Label>
                  {isEditMode ? (
                    <Textarea
                      id="bio"
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
                    <p>{personalInfo.bio}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Recent Listings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Listings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <img
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <h3 className="font-medium">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {listing.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Profile Completion</h2>
              <Progress
                value={profileCompletionPercentage}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {profileCompletionPercentage}% complete
              </p>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <SectionHeader title="Contact Information" />
              <Separator className="my-4" />
              <div className="space-y-4">
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
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-muted-foreground" />
                  {isEditMode ? (
                    <Input
                      value={contactInfo.facebook}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          facebook: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <a
                      href={contactInfo.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {contactInfo.facebook}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                  {isEditMode ? (
                    <Input
                      value={contactInfo.instagram}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          instagram: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <a
                      href={contactInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {contactInfo.instagram}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                  {isEditMode ? (
                    <Input
                      value={contactInfo.twitter}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          twitter: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <a
                      href={contactInfo.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {contactInfo.twitter}
                    </a>
                  )}
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <SectionHeader title="Location" />
              <Separator className="my-4" />
              <div className="flex items-start gap-2">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
