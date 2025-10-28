import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { SidebarTrigger } from './ui/sidebar';

const filterObject = [
  {
    label: 'category',
    options: [
      'all',
      'vehicles',
      'homes',
      'food',
      'mobiles',
      'appliances',
      'fashion',
      'electronics',
      'pets',
      'beauty',
      'services',
    ],
  },
  {
    label: 'location',
    options: ['all', 'nsukka', 'enugu'],
  },
  {
    label: 'price',
    options: ['all', 'below 100k', '100k - 500k', '500k - 1.5m', '1.5m - 3.5m'],
  },
];
export default function Filters({
  isMobile,
  handleFilterState,
  category,
  resetQuery,
}: {
  isMobile?: boolean;
  handleFilterState: (
    value: string,
    label: string,
    resetQuery?: () => void
  ) => void;
  category?: string;
  resetQuery?: () => void;
}) {
  return (
    <div className="my-2 flex items-center gap-2 text-[12px] lg:hidden">
      {isMobile && <SidebarTrigger />}
      {filterObject.map((item) => {
        return (
          <Select
            key={item.label}
            onValueChange={(value) =>
              handleFilterState(value, item.label, resetQuery)
            }
            value={item.label === 'category' ? category : undefined} // Default to "all" if no category is selected
          >
            <SelectTrigger className="min-w-20 capitalize">
              <SelectValue placeholder={item.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="capitalize">
                <SelectLabel>{item.label}</SelectLabel>
                {item.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      })}
    </div>
  );
}
