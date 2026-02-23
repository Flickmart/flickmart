'use client';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MarketplaceProfile from '@/components/settings/profile';
import { useSidebar } from '@/components/ui/sidebar';

export default function PersonalDetailsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
  });
  const { isMobile } = useSidebar();
  const router = useRouter();

  const _handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update logic
    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex flex-col gap-4 p-5">
      <header className="text-gray-500">
        {isMobile && (
          <ChevronLeft
            className="size-7 cursor-pointer"
            onClick={() => router.back()}
          />
        )}
      </header>
      <MarketplaceProfile />
    </div>
  );
}
