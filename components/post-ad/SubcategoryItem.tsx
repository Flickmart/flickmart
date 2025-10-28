import Image from 'next/image';
import Link from 'next/link';
import { useProductsByCategoryOrSubCategory } from '@/hooks/useProdByCat';

export default function SubcategoryItem({
  category,
  subcategory,
}: {
  category: string;
  subcategory: string;
}) {
  const productsByCat = useProductsByCategoryOrSubCategory(subcategory ?? '');

  const imgSrc = subcategory.includes('-')
    ? subcategory.split(' ').slice(0, 2).join(' ')
    : subcategory;

  return (
    <Link
      href={`/categories/${category}?subcategory=${subcategory}`}
      key={subcategory}
    >
      <div className="flex items-center gap-3 border-b px-4 py-3 transition-all duration-400 hover:bg-gray-100">
        <div className="size-16">
          <Image
            alt={subcategory}
            className="size-full object-contain"
            height={200}
            src={`/categories/${imgSrc}.png`}
            width={200}
          />
        </div>
        <div className="flex flex-col gap-1 capitalize">
          <span className="font-bold text-base">{subcategory}</span>
          <span className="text-sm normal-case">
            {productsByCat?.length}{' '}
            {(productsByCat?.length ?? 0) === 1 ? 'ad' : 'ads'}
          </span>
        </div>
      </div>
    </Link>
  );
}
