"use client";
import CategoryItem, { useProductsByCategory } from "@/components/CategoryItem";
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  LayoutPanelLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useReducer, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Filters from "@/components/Filters";
import { useFilters } from "@/hooks/useFilters";

interface FilterObjectType {
  min: number;
  max: number;
  location: string;
  priceRange: string;
}

const subCategories = {
  vehicles: ["car", "motorcycle", "tricycle", "buses"],
  electronics: [
    "hp",
    "apple",
    "lenovo",
    "acer",
    "samsung",
    "xiaomi",
    "asus",
    "dell",
  ],
  beauty: ["make up", "skin care", "soaps", "hair beauty", "gym equipment"],
  fashion: [
    "bags",
    "men's clothing",
    "women's clothing",
    "men's shoe",
    "women's shoe",
    "watches",
  ],
  homes: ["single room", "self contain", "flat", "duplex", "bungalow"],
  mobiles: [
    "apple phones",
    "android phones",
    "tablet",
    "phones & tablets accessories",
  ],
  pets: ["dogs", "cats", "pets accessories"],
};

const initialState: FilterObjectType = {
  min: 0,
  max: 0,
  location: "",
  priceRange: "",
};

function reducer(
  state: FilterObjectType,
  action: { type: string; payload: string | number }
) {
  switch (action.type) {
    case "min":
      return { ...state, min: Number(action.payload) };
    case "max":
      return { ...state, max: Number(action.payload) };
    case "location":
      return { ...state, location: action.payload.toString() };
    case "priceRange":
      return { ...state, priceRange: action.payload.toString() };
    default:
      return state;
  }
}

export default function DetailedCategoryPage() {
  const params = useParams();
  let slug = params.slug as string;
  const subCatItems = subCategories[slug as keyof typeof subCategories]?.map(
    (title) => ({ title })
  );
  const router = useRouter();
  const products = useProductsByCategory(slug);
  const saveProduct = useMutation(api.product.addBookmark);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { min, max, location, priceRange } = state;
  const {
    filterState: { category, minPrice, maxPrice, location: locationFilter },
    handleFilterState,
  } = useFilters();
  const filteredProds = useQuery(api.product.getProductsByFilters, {
    ...state,
    category: slug,
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
  const displayProducts = Object.values(state).some(
    (value) => value !== 0 && value !== ""
  )
    ? filteredProds
    : products;
  useEffect(() => {
    router.push(`/categories/${category || slug}`);
  }, [category]);
  return (
    <>
      <main className=" min-h-screen flex w-screen">
        <Sidebar
          className={`w-1/5 fixed top-20 left-0 h-[calc(100vh-5rem)] bg-white overflow-y-auto`}
        >
          <SidebarHeader>
            <div className="flex items-center pt-5 px-2 justify-between">
              <h2 className="font-semibold text-flickmart-chat-orange">
                Subcategories
              </h2>
              {isMobile && <SidebarTrigger />}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="font-semibold text-sm capitalize">
                {slug}
              </SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col text-sm text-gray-800">
                {subCatItems?.map((item, index) => (
                  <CategoryItem key={index} item={item} />
                ))}
                <div className="w-full flex justify-end text-[12px]">
                  <Link href={"#"} className="text-flickmart-chat-orange mt-2">
                    Show More
                  </Link>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="font-semibold text-sm capitalize">
                Filters
              </SidebarGroupLabel>
              <DropdownMenu>
                <DropdownMenuTrigger className="px-5 w-full shadow-md py-2 flex justify-between items-center">
                  <div className="flex flex-col items-start space-y-1">
                    <h2 className="font-semibold text-sm capitalize">
                      {location || "select location"}
                    </h2>
                    <span className="text-[10px] text-gray-500">
                      All Nigeria
                    </span>
                  </div>
                  <ChevronRight className="text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Locations</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={location}
                    onValueChange={(value) =>
                      dispatch({ type: "location", payload: value })
                    }
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
              <div className="w-full text-sm p-5">
                <h2 className="font-semibold">Add Price</h2>
                <div className="mt-2 flex justify-between items-center">
                  <div className="w-5/12 flex flex-col items-start">
                    <Label className="text-[10px] text-gray-700">Min</Label>
                    <Input
                      value={min}
                      type="text"
                      className="w-full border border-flickmart-chat-orange p-2"
                      onChange={(e) =>
                        dispatch({ type: "min", payload: +e.target.value })
                      }
                    />
                  </div>
                  <div className="w-5/12 flex flex-col items-start">
                    <Label className="text-[10px] text-gray-700">Max</Label>
                    <Input
                      type="text"
                      className="w-full border border-flickmart-chat-orange p-2"
                      value={max}
                      onChange={(e) =>
                        dispatch({ type: "max", payload: +e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col text-sm mt-6">
                  <RadioGroup
                    value={priceRange}
                    onValueChange={(value) =>
                      dispatch({ type: "priceRange", payload: value })
                    }
                  >
                    <div className="flex justify-between items-center border-b py-1">
                      <div>
                        <h2>Below 100k</h2>
                        <span className="text-[10px]">452 ads</span>
                      </div>
                      <RadioGroupItem value="cheap" />
                    </div>
                    <div className="flex justify-between items-center border-b py-1">
                      <div>
                        <h2>100k - 500k</h2>
                        <span className="text-[10px]">452 ads</span>
                      </div>
                      <RadioGroupItem value="affordable" />
                    </div>
                    <div className="flex justify-between items-center border-b py-1">
                      <div>
                        <h2>500k - 1.5m</h2>
                        <span className="text-[10px]">452 ads</span>
                      </div>
                      <RadioGroupItem value="moderate" />
                    </div>
                    <div className="flex justify-between items-center border-b py-1">
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
        <section className="lg:block w-[95%] space-y-7 mt-3 mx-auto lg:w-4/6 text-sm pt-3">
          <Filters
            isMobile={isMobile}
            handleFilterState={handleFilterState}
            category={category || slug}
          />
          <div className="mt-3 flex flex-col h-[90vh]">
            <div className="flex justify-between items-center px-3">
              <span>Sort By:</span>
              <div className="flex gap-2">
                <button>
                  <LayoutGrid className="text-flickmart-chat-orange h-5 w-5" />
                </button>
                <button>
                  <LayoutPanelLeft className="text-gray-500 h-5 w-5" />
                </button>
              </div>
            </div>
            <div
              className={`mt-2 ${displayProducts?.length && "grid"} py-3 grid-cols-2 md:grid-cols-3 flex-grow  lg:grid-cols-3 xl:grid-cols-4 gap-5`}
            >
              {
                typeof filteredProds === undefined ? (
                  <p>loading...</p>
                ) : filteredProds?.length === 0 ? (
                  <div className=" h-[50vh] lg:text-xl text-base grid place-items-center text-gray-500">
                    <p>No product under this category</p>
                  </div>
                ) : (
                  filteredProds?.map((product) => {
                    return (
                      <div className="relative" key={product._id}>
                        <Link href={`/product/${product._id}`}>
                          <div className="border">
                            <div className="h-56 w-full overflow-hidden flex justify-center items-center">
                              {product.images.length && (
                                <Image
                                  src={product.images[0]}
                                  width={500}
                                  height={500}
                                  alt="category image"
                                />
                              )}
                            </div>
                            <div className="p-2 mt-1 tracking-tight">
                              <h2 className="font-semibold">{product.title}</h2>
                              <span className="text-flickmart-chat-orange font-semibold text-[12px] mt-1">
                                &#8358;{product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </Link>
                        <div
                          className="w-[95%] mx-auto right-0 left-0 absolute top-2 z-20 flex justify-between items-center"
                          onClick={async () => {
                            const saved = await saveProduct({
                              productId: product._id,
                              type: "saved",
                            });
                            typeof saved === "object" && saved?.added
                              ? toast.success("Item added to saved")
                              : toast.success("Item removed from saved");
                          }}
                        >
                          <span className="px-2 py-0.5 font-semibold bg-white rounded-sm text-[12px] uppercase">
                            Hot
                          </span>
                          <button className="bg-white rounded-full flex justify-center items-center p-1.5">
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
    </>
  );
}
