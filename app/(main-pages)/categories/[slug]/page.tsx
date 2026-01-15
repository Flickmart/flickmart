'use client';
import { useMutation, useQuery } from 'convex/react';
import { Bookmark, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { toast } from 'sonner';
import CategoryItem from '@/components/CategoryItem';
import Filters from '@/components/Filters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { api } from '@/convex/_generated/api';
import { useFilters } from '@/hooks/useFilters';
import { useProductsByCategoryOrSubCategory } from '@/hooks/useProdByCat';

type FilterObjectType = {
  min: number;
  max: number;
  location: string;
  priceRange: string;
};

const initialState: FilterObjectType = {
  min: 0,
  max: 0,
  location: '',
  priceRange: '',
};

function reducer(
  state: FilterObjectType,
  action: { type: string; payload: string | number }
) {
  switch (action.type) {
    case 'min':
      return { ...state, min: Number(action.payload) };
    case 'max':
      return { ...state, max: Number(action.payload) };
    case 'location':
      return { ...state, location: action.payload.toString() };
    case 'priceRange':
      return { ...state, priceRange: action.payload.toString() };
    default:
      return state;
  }
}

export default function DetailedCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const searchParams = useSearchParams();
  const query = searchParams.get('subcategory');
  const router = useRouter();
  const products = useProductsByCategoryOrSubCategory(slug);
  const [queryString, setQueryString] = useState(query);

  const saveProduct = useMutation(api.product.addBookmark);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { min, max, location, priceRange } = state;
  const {
    filterState: { category, minPrice, maxPrice, location: locationFilter },
    handleFilterState,
  } = useFilters();

  const subcategories = useQuery(api.categories.getCategory, {
    category: slug ?? category,
  });

  const filteredProds = useQuery(api.product.getProductsByFilters, {
    ...state,
    category: slug,
    subcategory: query ?? '',
    min: minPrice || min,
    max: maxPrice || max,
    location: locationFilter || location,
  });
  const {
    // state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  // Get the products to display based on filter state
  const _displayProducts = Object.values(state).some(
    (value) => value !== 0 && value !== ''
  )
    ? filteredProds
    : products;
  useEffect(() => {
    if (queryString) {
      router.push(`/categories/${category || slug}?subcategory=${queryString}`);
    }
  }, [category]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQueryString(query);
    if (filteredProds) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [filteredProds, query]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <SyncLoader color="#f81" />
      </div>
    );
  }
  return (
    <main className="flex min-h-screen w-screen">
      <Sidebar
        className={
          'fixed top-20 left-0 h-[calc(100vh-5rem)] w-1/5 overflow-y-auto bg-white'
        }
      >
        <SidebarHeader>
          <div className="flex items-center justify-between px-2 pt-5">
            <h2 className="font-semibold text-flickmart-orange-2">
              Subcategories
            </h2>
            {isMobile && <SidebarTrigger />}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold text-sm capitalize">
              {category || slug}
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col text-gray-800 text-sm">
              {subcategories?.items.map((item, index) => (
                <CategoryItem
                  category={slug || category}
                  item={item}
                  key={index}
                  toggleSidebar={toggleSidebar}
                />
              ))}
              {/* <div className="w-full flex justify-end text-[12px]">
                  <Link href={"#"} className="text-flickmart-orange-2 mt-2">
                    Show More
                  </Link>
                </div> */}
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold text-sm capitalize">
              Filters
            </SidebarGroupLabel>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center justify-between px-5 py-2 shadow-md">
                <div className="flex flex-col items-start space-y-1">
                  <h2 className="font-semibold text-sm capitalize">
                    {location || 'select location'}
                  </h2>
                  <span className="text-[10px] text-gray-500">All Nigeria</span>
                </div>
                <ChevronRight className="text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Locations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  onValueChange={(value) =>
                    dispatch({ type: 'location', payload: value })
                  }
                  value={location}
                >
                  <DropdownMenuRadioItem value="enugu">
                    Enugu
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="nsukka">
                    Nsukka
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-full p-5 text-sm">
              <h2 className="font-semibold">Add Price</h2>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex w-5/12 flex-col items-start">
                  <Label className="text-[10px] text-gray-700">Min</Label>
                  <Input
                    className="w-full border border-flickmart-orange-2 p-2"
                    onChange={(e) =>
                      dispatch({ type: 'min', payload: +e.target.value })
                    }
                    type="text"
                    value={min}
                  />
                </div>
                <div className="flex w-5/12 flex-col items-start">
                  <Label className="text-[10px] text-gray-700">Max</Label>
                  <Input
                    className="w-full border border-flickmart-orange-2 p-2"
                    onChange={(e) =>
                      dispatch({ type: 'max', payload: +e.target.value })
                    }
                    type="text"
                    value={max}
                  />
                </div>
              </div>
              <div className="mt-6 flex flex-col text-sm">
                <RadioGroup
                  onValueChange={(value) =>
                    dispatch({ type: 'priceRange', payload: value })
                  }
                  value={priceRange}
                >
                  <div className="flex items-center justify-between border-b py-1">
                    <div>
                      <h2>Below 100k</h2>
                      <span className="text-[10px]">452 ads</span>
                    </div>
                    <RadioGroupItem value="cheap" />
                  </div>
                  <div className="flex items-center justify-between border-b py-1">
                    <div>
                      <h2>100k - 500k</h2>
                      <span className="text-[10px]">452 ads</span>
                    </div>
                    <RadioGroupItem value="affordable" />
                  </div>
                  <div className="flex items-center justify-between border-b py-1">
                    <div>
                      <h2>500k - 1.5m</h2>
                      <span className="text-[10px]">452 ads</span>
                    </div>
                    <RadioGroupItem value="moderate" />
                  </div>
                  <div className="flex items-center justify-between border-b py-1">
                    <div>
                      <h2>1.5m - 3.5m</h2>
                      <span className="text-[10px]">452 ads</span>
                    </div>
                    <RadioGroupItem value="expensive" />
                  </div>
                </RadioGroup>
              </div>
              {/* <div className="flex justify-end pt-5">
                                        <Button>Apply Filters</Button>
                                    </div> */}
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <section className="mx-auto mt-3 w-[95%] space-y-7 pt-3 text-sm lg:block lg:w-4/6">
        <Filters
          category={category || slug}
          handleFilterState={handleFilterState}
          isMobile={isMobile}
          resetQuery={() => {
            setQueryString('');
          }}
        />
        <div className="mt-3 flex h-[90vh] flex-col">
          {/* <div className="flex justify-between items-center px-3"> */}
          <h3 className="font-semibold text-gray-800 text-lg capitalize">
            {queryString}
          </h3>
          {/* <div className="flex gap-2">
                <button>
                  <LayoutGrid className="text-flickmart-orange-2 h-5 w-5" />
                </button>
                <button>
                  <LayoutPanelLeft className="text-gray-500 h-5 w-5" />
                </button>
              </div> */}
          {/* </div> */}
          <div
            className={`mt-2 ${filteredProds?.length ? 'grid' : 'block'} flex-grow grid-cols-2 gap-5 py-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4`}
          >
            {
              typeof filteredProds === undefined ? (
                <p>loading...</p>
              ) : filteredProds?.length === 0 ? (
                <div className="grid h-[50vh] w-full place-items-center text-base text-gray-500 lg:text-xl">
                  <p>No product under this category</p>
                </div>
              ) : (
                filteredProds?.map((product) => {
                  return (
                    <div className="relative" key={product._id}>
                      <Link href={`/product/${product._id}`}>
                        <div className="border">
                          <div className="flex h-56 w-full items-center justify-center overflow-hidden">
                            {product.images.length && (
                              <Image
                                alt="category image"
                                height={500}
                                src={product.images[0]}
                                width={500}
                              />
                            )}
                          </div>
                          <div className="mt-1 p-2 tracking-tight">
                            <h2 className="font-semibold">{product.title}</h2>
                            <span className="mt-1 font-semibold text-[12px] text-flickmart-orange-2">
                              &#8358;{product.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <div
                        className="absolute top-2 right-0 left-0 z-20 mx-auto flex w-[95%] items-center justify-between"
                        onClick={async () => {
                          const saved = await saveProduct({
                            productId: product._id,
                            type: 'saved',
                          });
                          typeof saved === 'object' && saved?.added
                            ? toast.success('Item added to saved')
                            : toast.success('Item removed from saved');
                        }}
                      >
                        <span className="rounded-sm bg-white px-2 py-0.5 font-semibold text-[12px] uppercase">
                          Hot
                        </span>
                        <button className="flex items-center justify-center rounded-full bg-white p-1.5">
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )
              // : <div className="text-center !flex item-center justify-center py-10">
              //         <p>No product in this category yet</p>
              //     </div>
            }
          </div>
        </div>
      </section>
    </main>
  );
}
