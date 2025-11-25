'use client';
import { useMutation, useQuery } from 'convex/react';
import { IconMoodPuzzled } from "@tabler/icons-react"
import {
  ArrowLeft,
  ArrowUpRightIcon,
  Bookmark,
  ChevronRight,
  LayoutGrid,
  LayoutPanelLeft,
  SearchSlash,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { toast } from 'sonner';
import Filters from '@/components/Filters';
import SearchInput from '@/components/SearchInput';
import SearchOverlay from '@/components/SearchOverlay';
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
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { useFilters } from '@/hooks/useFilters';
import { SearchResponse } from 'recombee-api-client';
import { ValuesDto } from '@/types/recommendations';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';


type FilterObjectType = {
  min: number;
  max: number;
  location: string;
  priceRange: string;
};

const subCategories = {
  vehicles: ['car', 'motorcycle', 'tricycle', 'buses'],
  electronics: [
    'hp',
    'apple',
    'lenovo',
    'acer',
    'samsung',
    'xiaomi',
    'asus',
    'dell',
  ],
  beauty: ['make up', 'skin care', 'soaps', 'hair beauty', 'gym equipment'],
  fashion: [
    'bags',
    "men's clothing",
    "women's clothing",
    "men's shoe",
    "women's shoe",
    'watches',
  ],
  homes: ['single room', 'self contain', 'flat', 'duplex', 'bungalow'],
  mobiles: [
    'apple phones',
    'android phones',
    'tablet',
    'phones & tablets accessories',
  ],
  pets: ['dogs', 'cats', 'pets accessories'],
};

const _brandsOrSubCat = {
  fashion: [
    {
      label: "men's cloth",
    },
    {
      label: "women's wear",
    },
    {
      label: 'children cloth',
    },
  ],
  homes: [
    {
      label: 'single room',
    },
    {
      label: 'self contain',
    },
    {
      label: 'flat',
    },
  ],
  beauty: [
    {
      label: 'make up',
    },
    {
      label: 'skin care',
    },
    {
      label: 'soap',
    },
    {
      label: 'hair beauty',
    },
  ],
  computers: [
    {
      label: 'hp',
      image: '',
    },
    {
      label: 'asus',
    },
    {
      label: 'acer',
    },
    {
      label: 'dell',
    },
    {
      label: 'lenovo',
    },
    {
      label: 'dell',
    },
  ],
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
  const _subCatItems = subCategories[slug as keyof typeof subCategories]?.map(
    (title) => ({ title })
  );
  const saveProduct = useMutation(api.product.addBookmark);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { min, max, location, priceRange } = state;
  const [searchOpen, setSearchOpen] = useState(false);
  const { filterState, handleFilterState } = useFilters();
  const user = useQuery(api.users.current, {})

  // Get the search parameter
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const  [personalizedSearch, setPersonalizedSearch] = useState<SearchResponse| null>(null)
  // const search = useQuery(api.product.search, {
  //   ...filterState,
  //   query: query || '',
  //   type: 'search',
  // }) as Doc<'product'>[];
  const recommId = personalizedSearch?.recommId
  const search = personalizedSearch?.recomms as unknown as Array<{id: string; values: ValuesDto & {category: string}}>

  const router = useRouter();


  useEffect(()=>{
    setPersonalizedSearch(null)
    fetch(`/api/search?q=${query}&userId=${user?._id}`).then(res=> res.json().then(data => setPersonalizedSearch(data)))
  }, [query, user])


  const {
    isMobile,
  } = useSidebar();

  function openSearch(val: boolean) {
    setSearchOpen(val);
  }

  return (
    <main className="flex min-h-screen w-screen flex-col lg:flex-row">
      {isMobile && (
        <div className="fixed right-0 left-0 z-30 w-screen bg-white pb-2 shadow-sm">
          <div className="mt-7 mr-5 mb-3 ml-1 rounded-lg">
            <SearchOverlay
              open={searchOpen}
              openSearch={openSearch}
              query={query ?? ''}
            />
            <div className="flex items-center justify-between gap-1">
              <div className="cursor-pointer rounded-full p-2 text-gray-600 transition-all duration-300 ease-in-out hover:bg-gray-200">
                <ArrowLeft onClick={() => router.back()} size={29} />
              </div>
              <div className="w-full h-9 ">
                <SearchInput
                  isOverlayOpen={searchOpen}
                  openSearch={openSearch}
                  query={query ?? ''}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <Sidebar
        className={'relative h-[calc(100vh-5rem)] min-w-1/5 overflow-y-auto'}
      >
        <SidebarHeader>
          <div className="flex items-center justify-between px-2 pt-5">
            <h2 className="px-3 font-semibold text-flickmart-chat-orange text-xl">
              Filters
            </h2>
            {isMobile && <SidebarTrigger />}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
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
                    className="w-full border border-flickmart-chat-orange p-2"
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
                    className="w-full border border-flickmart-chat-orange p-2"
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
                      <>500k - 1.5m </>
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
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <section className="mx-auto mt-24 flex w-[95%] flex-col pt-3 text-sm lg:mt-0 lg:block lg:w-4/6">
        <h2 className="p-3 font-semibold text-lg capitalize lg:py-5 lg:text-2xl">
          {search && search?.[0]?.values.category !== undefined && `${search?.[0]?.values.category} in ${search?.[0]?.values.location}`}
        </h2>
        <Filters handleFilterState={handleFilterState} isMobile={isMobile} />
        <div className="mt-3 flex flex-col lg:h-[90vh]">
          <div className="mt-2 flex items-center justify-between px-3 lg:px-0">
            <span>Sort By:</span>
            <div className="flex gap-2">
              <button>
                <LayoutGrid className="h-5 w-5 text-flickmart-chat-orange" />
              </button>
              <button>
                <LayoutPanelLeft className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          <div
            className={`mt-2 ${search?.length && 'grid'} grid-cols-2 gap-5 py-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4`}
          >
            {!personalizedSearch ? (
              <div className="flex h-[45vh] items-center justify-center">
                <SyncLoader color="#FF8100" loading={true} />
              </div>
            ) : search?.length === 0 ? (
              <div className="flex h-[45vh] flex-col items-center justify-start px-5">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <IconMoodPuzzled />
                    </EmptyMedia>
                    <EmptyTitle>
                      No result for "{query}"
                    </EmptyTitle>
                    <EmptyDescription>
                      It seems we don&apos;t have a product that matches your search—try a different keyword.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <div className="flex gap-2">
                      <Button onClick={()=> router.push("/")}>Browse All Products</Button>
                    </div>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
              search?.map((product) => {
                return (
                  <div className="relative" key={product.id}>
                    <Link href={`/product/${product.id}?id=${recommId}`}>
                      <div className="border">
                        <div className="flex h-56 w-full items-center justify-center overflow-hidden">
                          {product.values.image && (
                            <Image
                              alt="category image"
                              height={500}
                              src={product.values.image}
                              width={500}
                            />
                          )}
                        </div>
                        <div className="mt-1 p-2 tracking-tight">
                          <h2 className="font-semibold">{product.values.title}</h2>
                          <span className="mt-1 font-semibold text-[12px] text-flickmart-chat-orange">
                            &#8358;{product.values.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div
                      className="absolute top-2 right-0 left-0 z-20 mx-auto flex w-[95%] items-center justify-between"
                      onClick={async () => {
                        const saved = await saveProduct({
                          productId: product.id as Id<"product">,
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
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
