import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function SheetItems({
  categoryName,
  imageUrl,
  type,
  closeSheet,
}: {
  closeSheet?: () => void;
  categoryName: string;
  imageUrl?: string;
  type: string;
}) {
  const imgSrc = categoryName.includes('-')
    ? categoryName.split(' ').slice(0, 2).join(' ')
    : categoryName;
  return (
    <div
      className={`flex cursor-pointer items-center justify-between border-t py-2 pr-5 ${type === 'categories' ? 'border-gray-300' : 'border-gray-200'} `}
      onClick={() => {
        if (type === 'subcategories' && closeSheet) {
          closeSheet();
          return;
        }
        return;
      }}
    >
      <div className="flex items-center gap-5 pl-4">
        <div className="size-14">
          <Image
            alt={categoryName}
            className="size-full object-contain"
            height={300}
            // src={imageUrl}
            src={
              type === 'categories'
                ? `/${categoryName}.png`
                : `/categories/${imgSrc}.png`
            }
            width={300}
          />
        </div>
        <span className="font-semibold text-gray-800">{categoryName}</span>
      </div>
      <div className="text-gray-600">
        {type === 'categories' ? <ChevronRight /> : null}
      </div>
    </div>
  );
}
