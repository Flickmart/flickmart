'use client';

import { useReverification, useUser } from '@clerk/clerk-react';
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from '@clerk/clerk-react/errors';
import type { SessionVerificationLevel } from '@clerk/types';
import clsx from 'clsx';
import { useMutation } from 'convex/react';
import cloneDeep from 'lodash/cloneDeep';
import {
  Camera,
  Check,
  CircleUser,
  Edit2,
  Info,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from 'lucide-react';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { useAuthUser } from '@/hooks/useAuthUser';
import { Dialog } from '../ui/dialog';
import VerificationDialog from './VerificationDialog';

interface ProfileField {
  icon: React.ElementType;
  title: string;
  value: string;
}

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="font-semibold text-lg">{title}</h2>
);

export default function MarketplaceProfile() {
  const [isEditMode, setIsEditMode] = useState<boolean | string>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useUser();
  const { user: profile, isLoading: profileLoading } = useAuthUser({
    redirectOnUnauthenticated: false,
  });
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
        toast.success('Profile picture updated successfully');
      } catch (error) {
        toast.error('Failed to update profile picture');
        console.error('Error updating profile picture:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const [fields, setFields] = useState<ProfileField[]>([]);
  const [phoneError, setPhoneError] = useState(false);

  const validatePhoneNumber = (phoneNumber: string) => {
    const validation = /^(?:\+234|0)(?:70|80|81|90|91)\d{8}$/; //Only validates Nigerian phone numbers
    if (validation.test(phoneNumber)) {
      setPhoneError(false);
    } else {
      setPhoneError(true);
    }
  };

  useEffect(() => {
    if (profile) {
      setFields([
        {
          icon: User,
          title: 'Name',
          value: profile?.name ?? '',
        },
        {
          icon: CircleUser,
          title: 'Username',
          value: profile?.username ?? '',
        },
        {
          icon: Info,
          title: 'About',
          value: profile?.description ?? '',
        },
        {
          icon: Phone,
          title: 'Phone',
          value: profile?.contact?.phone ?? '',
        },
        {
          icon: Mail,
          title: 'Email',
          value: profile?.email ?? '',
        },
        {
          icon: MapPin,
          title: 'Location',
          value: profile?.contact?.address ?? '',
        },
      ]);
    }
  }, [profile]);

  const [prevValue, setPrevValue] = useState<string | ProfileField[]>('');
  async function handleSubmit(
    e: FormEvent<HTMLFormElement>,
    field: ProfileField,
    index: number
  ) {
    e.preventDefault();
    if (field.title === 'Name') {
      const value = fields[index].value.split(' ');
      const firstName = value[0];
      const lastName = value.slice(1).join(' ');

      await user?.update({ firstName, lastName });
    } else if (field.title === 'Username') {
      try {
        await updateUsername(fields[index].value);
      } catch (err) {
        if (isClerkRuntimeError(err) && isReverificationCancelledError(err)) {
          toast.error(`User cancelled reverification... ${err.code}`, {
            style: {
              textAlign: 'center',
            },
          });
        }
        return;
      }
    } else {
      updateOthers({ [field.title.toLowerCase()]: field.value });
    }
    toast.success('Profile updated successfully');
    setIsEditMode(false);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {verificationState?.inProgress && (
        <VerificationDialog
          level={verificationState.level}
          onCancel={verificationState.cancel}
          onComplete={verificationState.complete}
          onDialogClose={() => setOpen(false)}
        />
      )}
      <section className="min-h-screen p-4 lg:p-8">
        <div className="space-y-6">
          <Card className="border-none shadow-none sm:p-6">
            <div className="mb-8 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center justify-center gap-4">
                <div className="relative">
                  <Avatar className="size-36 sm:size-20 border">
                    {isLoading ? (
                      <div className="grid h-full w-full place-items-center rounded-full bg-gray-100">
                        <MoonLoader className="text-primary" size={40} />
                      </div>
                    ) : (
                      <>
                        <AvatarImage
                          alt="Profile picture"
                          src={profile?.imageUrl ?? undefined}
                        />
                        <AvatarFallback className="text-2xl capitalize">
                          {fields[0]?.value
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <Label
                    className={clsx(
                      'absolute right-0 bottom-0 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground sm:p-1',
                      { 'sm:block': isEditMode, 'sm:hidden': !isEditMode }
                    )}
                    htmlFor="profile-picture"
                  >
                    <Camera className="size-5 sm:size-4" />
                    <Input
                      accept="image/*"
                      className="sr-only"
                      id="profile-picture"
                      onChange={handleProfilePictureChange}
                      type="file"
                    />
                  </Label>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-semibold text-2xl">{fields[0]?.value}</h1>
                  <p className="text-muted-foreground text-sm">
                    @{fields[1]?.value}
                  </p>
                </div>
              </div>
              {isEditMode ? (
                <div className="hidden gap-4 sm:flex">
                  <Button
                    className="flex gap-0 pr-3 pl-2"
                    onClick={() => {
                      if (!phoneError) setIsEditMode(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    className="flex gap-0 bg-black/85 pr-4 pl-2 hover:bg-black/70"
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
              {profileLoading || fields === undefined ? (
                <p>loading...</p>
              ) : (
                fields.map((field, index) => (
                  <div
                    className={clsx(
                      'flex items-center gap-6 rounded-md px-2 py-2 transition-all duration-300 sm:cursor-auto sm:hover:bg-white',
                      {
                        'cursor-not-allowed text-gray-400':
                          field.title === 'Email',
                        'cursor-auto hover:bg-white':
                          isEditMode && field.title !== isEditMode,
                        'cursor-pointer hover:bg-gray-100':
                          field.title !== 'Email',
                      }
                    )}
                    key={index}
                    onClick={() => {
                      if (innerWidth > 640 || isEditMode) return;
                      setIsEditMode(field.title);
                      setPrevValue(field.value);
                    }}
                  >
                    <field.icon />
                    <div>
                      <SectionHeader title={field.title} />
                      <div className="mt-1">
                        {(isEditMode == field.title || isEditMode === true) &&
                        field.title !== 'Email' ? (
                          <form onSubmit={(e) => handleSubmit(e, field, index)}>
                            {field.title === 'About' ? (
                              <Textarea
                                onChange={(e) => {
                                  const newFields = [...fields];
                                  newFields[index].value = e.target.value;
                                  setFields(newFields);
                                }}
                                rows={4}
                                value={field.value}
                              />
                            ) : field.title === 'Phone' ? (
                              <>
                                <Input
                                  className="rounded-sm border p-2"
                                  onChange={(e) => {
                                    const newFields = [...fields];
                                    newFields[index].value = e.target.value;
                                    setFields(newFields);
                                    validatePhoneNumber(e.target.value);
                                  }}
                                  type="tel"
                                  value={field.value}
                                />
                                {phoneError && (
                                  <p className="mt-2 font-medium text-red-500 text-sm">
                                    Invalid phone number
                                  </p>
                                )}
                              </>
                            ) : (
                              <Input
                                className="rounded-sm border p-2 capitalize"
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
                                type="text"
                                value={field.value}
                              />
                            )}
                            <div className="mt-3 flex items-center gap-4 sm:hidden">
                              <Button
                                className="h-8 rounded-sm p-2 hover:bg-orange-600"
                                type="submit"
                              >
                                Save
                              </Button>
                              <Button
                                className="h-8 rounded-sm bg-black/85 p-2 hover:bg-black/70"
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
                              'text-gray-400': field.title === 'Email',
                              '!leading-normal text-muted-foreground':
                                field.title !== 'Email',
                            })}
                          >
                            {field.title === 'Username' && '@'}
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
    </Dialog>
  );
}
