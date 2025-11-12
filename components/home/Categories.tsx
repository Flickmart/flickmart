import { categoryItems } from '@/utils/constants';
import CategoryItem from './CategoryItem';
import Container from './Container';

export default function Categories() {
  return (
    <section className="sm:mt-2 lg:fixed lg:top-[67px] lg:left-0 lg:w-[25%]">
      <h2 className="section-title mb-0 md:mb-4 lg:hidden">Categories</h2>
      <Container className={'!min-h-0'}>
        <div className="grid grid-cols-5 lg:flex lg:w-full lg:flex-col lg:pl-[30px]">
          {categoryItems.map((item) => (
            <CategoryItem
              categoryName={item.categoryName}
              key={item.categoryName}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
