'use client';
import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

function getLastPathSegment(pathname: string): string {
  return pathname.substring(pathname.lastIndexOf('/') + 1);
}

const NavigationBar = () => {
  const router = useRouter();
  const cPath = usePathname();
  // an array of paths where the styles should be applied
  const activePaths = ['/saved'];
  const pagesWithoutTitle = ['/saves', '/categories'];
  // Check if the current pathname is in the array
  const isActive = activePaths.includes(cPath);
  const isPage = pagesWithoutTitle.includes(cPath);
  return (
    <header
      className={
        isActive ? 'w-full py-3 shadow-lg' : 'mt-14 w-full py-3 shadow-lg'
      }
    >
      <div className="mx-auto w-[98%]">
        <button
          className="flex items-center font-light text-flickmart-gray-1 text-sm capitalize transition-colors duration-300 hover:text-flickmart"
          onClick={() => router.back()}
        >
          <ChevronLeft size={35} strokeWidth={1.5} />
          <span className={isPage ? 'block' : 'hidden'}>Find&nbsp;</span>{' '}
          {getLastPathSegment(cPath)}
          <span className="hidden lg:block">&nbsp;In Nigeria.</span>
        </button>
      </div>
    </header>
  );
};
export default NavigationBar;
