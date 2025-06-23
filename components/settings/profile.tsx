"use client";

import { useState, type ChangeEvent, useEffect, FormEvent } from "react";
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
  CircleUser,
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
import { useReverification, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { SessionVerificationLevel } from "@clerk/types";
import VerificationDialog from "./VerificationDialog";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/clerk-react/errors";
import { Dialog } from "../ui/dialog";
import { MoonLoader } from "react-spinners";

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
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useUser();
  const profile = useQuery(api.users.current);
  const updateOthers = useMutation(api.users.updateUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationState, setVerificationState] = useState<
    | {
        complete: () => void;
        cancel: () => void;
        level: SessionVerificationLevel | undefined;
        inProgress: boolean;
      }
    | undefined
  >(undefined);
  const updateUsername = useReverification(
    (username: string) => user?.update({ username }),
    {
      onNeedsReverification: ({ complete, cancel, level }) => {
        setOpen(true);
        setVerificationState({ complete, cancel, level, inProgress: true });
      },
    }
  );

  const handleProfilePictureChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        await user?.setProfileImage({ file });
        toast.success("Profile picture updated successfully");
      } catch (error) {
        toast.error("Failed to update profile picture");
        console.error("Error updating profile picture:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const [fields, setFields] = useState<ProfileField[]>([]);
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
    if (profile) {
      setFields([
        {
          icon: User,
          title: "Name",
          value: profile?.name ?? "",
        },
        {
          icon: CircleUser,
          title: "Username",
          value: profile?.username ?? "",
        },
        {
          icon: Info,
          title: "About",
          value: profile?.description ?? "",
        },
        {
          icon: Phone,
          title: "Phone",
          value: profile?.contact?.phone ?? "",
        },
        {
          icon: Mail,
          title: "Email",
          value: profile?.email ?? "",
        },
        {
          icon: MapPin,
          title: "Location",
          value: profile?.contact?.address ?? "",
        },
      ]);
    }
    // const handleResize = () => {
    //   if (window.innerWidth > 640 && typeof isEditMode === "string") {
    //     setIsEditMode(false);
    //   }
    //   if (window.innerWidth < 640 && typeof isEditMode === "boolean") {
    //     setIsEditMode(false);
    //   }
    // };
    // window.addEventListener("resize", handleResize);
    // return () => window.removeEventListener("resize", handleResize);
  }, [profile]);

  const [prevValue, setPrevValue] = useState<string | ProfileField[]>("");
  async function handleSubmit(
    e: FormEvent<HTMLFormElement>,
    field: ProfileField,
    index: number
  ) {
    e.preventDefault();
    if (field.title === "Name") {
      const value = fields[index].value.split(" ");
      const firstName = value[0];
      const lastName = value.slice(1).join(" ");

      await user?.update({ firstName, lastName });
    } else if (field.title === "Username") {
      try {
        await updateUsername(fields[index].value);
      } catch (err) {
        if (isClerkRuntimeError(err) && isReverificationCancelledError(err)) {
          toast.error(`User cancelled reverification... ${err.code}`, {
            style: {
              textAlign: "center",
            },
          });
        }
        return;
      }
    } else {
      updateOthers({ [field.title.toLowerCase()]: field.value });
    }
    toast.success("Profile updated successfully");
    setIsEditMode(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {verificationState?.inProgress && (
        <VerificationDialog
          onDialogClose={() => setOpen(false)}
          onCancel={verificationState.cancel}
          onComplete={verificationState.complete}
          level={verificationState.level}
        />
      )}
      <section className="min-h-screen bg-white p-4 lg:p-8">
        <div className="max-w-2xl space-y-6">
          <Card className="border-none shadow-none sm:p-6">
            <div className="mb-8 sm:flex sm:items-center sm:justify-between">
              <div className="justify-center flex items-center gap-4">
                <div className="relative">
                  <Avatar className="size-36 sm:size-20">
                    {isLoading ? (
                      <div className="grid place-items-center bg-gray-100 rounded-full h-full w-full">
                        <MoonLoader size={40} className="text-primary" />
                      </div>
                    ) : (
                      <>
                        <AvatarImage
                          src={profile?.imageUrl ?? undefined}
                          alt="Profile picture"
                        />
                        <AvatarFallback className="capitalize text-2xl">
                          {fields[0]?.value
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </>
                    )}
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
                  <h1 className="text-2xl font-semibold">{fields[0]?.value}</h1>
                  <p className="text-sm text-muted-foreground">
                    @{fields[1]?.value}
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
              {fields === undefined ? (
                <p>loading...</p>
              ) : (
                fields.map((field, index) => (
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
                        "text-gray-400 cursor-not-allowed":
                          field.title === "Email",
                        "cursor-auto hover:bg-white":
                          isEditMode && field.title !== isEditMode,
                        "hover:bg-gray-100 cursor-pointer":
                          field.title !== "Email",
                      }
                    )}
                  >
                    <field.icon />
                    <div>
                      <SectionHeader title={field.title} />
                      <div className="mt-1">
                        {(isEditMode == field.title || isEditMode === true) &&
                        field.title !== "Email" ? (
                          <form onSubmit={(e) => handleSubmit(e, field, index)}>
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
                                className="p-2 border rounded-sm capitalize"
                                type="text"
                                value={field.value}
                                onChange={(e) => {
                                  setFields((prev) => {
                                    const value = e.target.value;
                                    const newObject = {
                                      ...prev[index],
                                      value,
                                    }; // Create a shallow copy of the object
                                    prev[index] = newObject; // Update the specific index
                                    return [...prev];
                                  });
                                }}
                              />
                            )}
                            <div className="flex items-center gap-4 mt-3 sm:hidden">
                              <Button
                                type="submit"
                                className="p-2 h-8 rounded-sm"
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
                              "text-muted-foreground ": field.title !== "Email",
                            })}
                          >
                            {field.title === "Username" && "@"}
                            {field.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </section>
      )
    </Dialog>
  );
}
