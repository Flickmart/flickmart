"use client";
import { useState } from "react";

import { useSidebar } from "@/components/ui/sidebar";
import MarketplaceProfile from "@/components/settings/profile";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PersonalDetailsPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
  });
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update logic
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex flex-col gap-4 p-5">
      <header className="text-gray-500">
        {isMobile && (
          <ArrowLeft
            className="cursor-pointer size-8 "
            onClick={() => router.push("/settings/personal")}
          />
        )}
      </header>
      <MarketplaceProfile />
    </div>
  );
}
