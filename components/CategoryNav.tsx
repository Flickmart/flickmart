'use client';
import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

function getLastPathSegment(pathname: string): string {
  return pathname.substring(pathname.lastIndexOf('/') + 1);
}

type CategoryNavProps = {
  togglePanel?: () => void; // Accepting togglePanel
};

export default function CategoryNav({ togglePanel }: CategoryNavProps) {
  const router = useRouter();
  const cPath = usePathname();
  // an array of paths where the styles should be applied
  const activePaths = ['/'];

  // Check if the current pathname is in the array
  const isActive = activePaths.includes(cPath);
  return (
    <header className="w-full border-t py-3 shadow-lg">
      <div className="mx-auto w-[98%]">
        {isActive ? (
          <button
            className="flex items-center font-light text-flickmart-gray text-sm capitalize transition-colors duration-300 hover:text-flickmart"
            onClick={() => togglePanel?.()}
          >
            <ChevronLeft size={35} strokeWidth={1.5} />
            <span className="">Find&nbsp;Category</span>
          </button>
        ) : (
          <button
            className="flex items-center font-light text-flickmart-gray text-sm capitalize transition-colors duration-300 hover:text-flickmart"
            onClick={() => router.back()}
          >
            <ChevronLeft size={35} strokeWidth={1.5} />
            <span className="">Find&nbsp;{getLastPathSegment(cPath)}</span>
          </button>
        )}
      </div>
    </header>
  );
}
