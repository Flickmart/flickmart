import Image from "next/image";
import Link from "next/link";

export default function CategoryItem({
  categoryName,
}: {
  categoryName: string;
}) {
  return (
    <Link href={`/categories/${categoryName}`}>
    
    <div className="bg-gray-200 lg:p-0  lg:h-80 h-52 rounded-xl capitalize flex flex-col items-center justify-center space-y-7 text-gray-700">
      <Image
        src={`/${categoryName}.png`}
        alt={categoryName}
        width={200}
        height={200}
        className="h-2/3 w-3/4 object-contain "
      />
      <span className="font-semibold text-sm lg:text-xl">{categoryName}</span>
    </div>
    </Link>
  );
}
