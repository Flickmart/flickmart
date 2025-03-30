"use client";

import { useState, type ChangeEvent, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Edit2,
  Check,
  Camera,
  Info,
  User,
  X,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import cloneDeep from "lodash/cloneDeep";
import Link from "next/link";

interface ProfileField {
  icon: React.ElementType;
  title: string;
  value: string;
}

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-lg font-semibold">{title}</h2>
);

export default function MarketplaceProfile() {
  const [isEditMode, setIsEditMode] = useState<boolean | string>(false);
  const [personalInfo, setPersonalInfo] = useState({
    username: "ebuka223",
    profilePicture: `/placeholder.svg`,
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
  const profileFields: ProfileField[] = [
    {
      icon: User,
      title: "Name",
      value: "Ebuka",
    },
    {
      icon: Info,
      title: "About",
      value: "Flickmart building team",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+234-904-235-0500",
    },
    {
      icon: Mail,
      title: "Email",
      value: "ebuka@gmail.com",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Enugu, Nigeria",
    },
  ];
  const [fields, setFields] = useState(profileFields);
  const [phoneError, setPhoneError] = useState(false);

  const validatePhoneNumber = (phoneNumber: string) => {
    const validation = /^(?:\+234|0)(?:70|80|81|90|91)\d{8}$/; //Only validates Nigerian phone numbers
    if (!validation.test(phoneNumber)) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640 && typeof isEditMode === "string") {
        setIsEditMode(false);
      }
      if (window.innerWidth < 640 && typeof isEditMode === "boolean") {
        setIsEditMode(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  const [prevValue, setPrevValue] = useState<string | ProfileField[]>("");

  return (
    <section className="min-h-screen bg-white p-4 lg:p-8">
      <div className="max-w-2xl space-y-6">
        <Card className="border-none shadow-none sm:p-6">
          <div className="mb-8 sm:flex sm:items-center sm:justify-between">
            <div className="justify-center flex items-center gap-4">
              <div className="relative">
                <Avatar className="size-36 sm:size-20">
                  <AvatarImage
                    src={personalInfo.profilePicture}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="capitalize text-2xl">
                    {profileFields[0].value
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    {profileFields[0].value
                      .split(" ")
                      .map((n) => n[1])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="profile-picture"
                  className={clsx(
                    "absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer sm:p-1",
                    { "sm:block": isEditMode, "sm:hidden": !isEditMode }
                  )}
                >
                  <Camera className="size-5 sm:size-4" />
                  <Input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleProfilePictureChange}
                  />
                </Label>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-semibold">
                  {profileFields[0].value}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {personalInfo.username}
                </p>
              </div>
            </div>
            {isEditMode ? (
              <div className="hidden sm:flex gap-4">
                <Button
                  onClick={() => {
                    if (!phoneError) setIsEditMode(false);
                  }}
                  className="flex gap-0 pl-2 pr-3"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button
                  className="flex gap-0 bg-black/85 pl-2 pr-4 hover:bg-black/70"
                  onClick={() => {
                    setIsEditMode(false);
                    setFields(prevValue as ProfileField[]);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                className="hidden sm:flex"
                onClick={() => {
                  setIsEditMode(true);
                  setPrevValue(cloneDeep(fields));
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
          <Separator className="my-6 hidden sm:block" />
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                onClick={() => {
                  if (innerWidth > 640 || isEditMode) return;
                  setIsEditMode(field.title);
                  setPrevValue(field.value);
                }}
                key={index}
                className={clsx(
                  "flex items-center gap-6 transition-all duration-300 py-2 px-2 rounded-md sm:cursor-auto sm:hover:bg-white",
                  {
                    "text-gray-400 cursor-not-allowed": field.title === "Email",
                    "cursor-auto hover:bg-white":
                      isEditMode && field.title !== isEditMode,
                    "hover:bg-gray-100 cursor-pointer": field.title !== "Email",
                  }
                )}
              >
                <field.icon />
                <div>
                  <SectionHeader title={field.title} />
                  <div className="mt-1">
                    {(isEditMode == field.title || isEditMode === true) &&
                    field.title !== "Email" ? (
                      <form>
                        {field.title === "About" ? (
                          <Textarea
                            value={field.value}
                            onChange={(e) => {
                              const newFields = [...fields];
                              newFields[index].value = e.target.value;
                              setFields(newFields);
                            }}
                            rows={4}
                          />
                        ) : field.title === "Phone" ? (
                          <>
                            <Input
                              className="p-2 border rounded-sm"
                              type="tel"
                              value={field.value}
                              onChange={(e) => {
                                const newFields = [...fields];
                                newFields[index].value = e.target.value;
                                setFields(newFields);
                                validatePhoneNumber(e.target.value);
                              }}
                            />
                            {phoneError && (
                              <p className="text-red-500 text-sm mt-2 font-medium">
                                Invalid phone number
                              </p>
                            )}
                          </>
                        ) : (
                          <Input
                            className="p-2 border rounded-sm"
                            type="text"
                            value={field.value}
                            onChange={(e) => {
                              const newFields = [...fields];
                              newFields[index].value = e.target.value;
                              setFields(newFields);
                            }}
                          />
                        )}
                        <div className="flex items-center gap-4 mt-3 sm:hidden">
                          <Button
                            type="submit"
                            className="p-2 h-8 rounded-sm"
                            onClick={() => setIsEditMode(false)}
                          >
                            Save
                          </Button>
                          <Button
                            className="p-2 h-8 rounded-sm bg-black/85 hover:bg-black/70"
                            onClick={() => {
                              setIsEditMode(false);
                              const newFields = [...fields];
                              newFields[index].value = prevValue as string;
                              setFields(newFields);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <p
                        className={clsx({
                          "text-gray-400": field.title === "Email",
                          "text-muted-foreground": field.title !== "Email",
                        })}
                      >
                        {field.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Link
              href="#"
              className="flex items-center gap-6 transition-all duration-300 py-2 px-2 rounded-md cursor-pointer hover:bg-gray-100"
            >
              <Wallet />
              <span className="text-lg font-semibold">Wallet</span>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
