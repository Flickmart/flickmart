import { categoryItems } from '@/utils/constants';
import CategoryItem from './CategoryItem';
import Container from './Container';

export default function Categories() {
  return (
    <Container className={'!min-h-[35vh] sm:!min-h-[50vh] pt-4 pb-4 sm:pt-8'}>
      <div className="grid w-full grid-cols-4 grid-rows-3 gap-x-[10px] gap-y-2 lg:w-4/6 lg:grid-cols-5 lg:grid-rows-2">
        {categoryItems.map((item) => (
          <CategoryItem
            categoryName={item.categoryName}
            key={item.categoryName}
          />
        ))}
      </div>
    </Container>
  );
}
