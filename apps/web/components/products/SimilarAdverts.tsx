import { useQuery } from 'convex/react';
import Link from 'next/link';
import { api } from 'backend/convex/_generated/api';
import type { Id } from 'backend/convex/_generated/dataModel';
import ProductCard from '../multipage/ProductCard';

export default function SimilarAdverts({
  productId,
}: {
  productId: Id<'product'>;
}) {
  const similarProd = useQuery(api.product.getSimilarProducts, {
    productId,
    limit: 10,
  });
  return (
    <div className="space-y-3 p-3 pt-5 lg:space-y-7 lg:px-10">
      <div>
        <h2 className="font-black text-xl lg:text-3xl">Similar Adverts</h2>
      </div>
      <div className="grid min-h-96 grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-10">
        {similarProd?.map((item, index) => {
          return (
            <div className="" key={index}>
              <Link href={`/product/${item._id}`}>
                <ProductCard
                  image={item.images[0]}
                  likes={item.likes || 0}
                  price={item.price}
                  productId={item._id}
                  title={item.title}
                  views={item.views || 0}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
