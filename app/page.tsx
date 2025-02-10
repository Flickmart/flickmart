import BestSellers from "@/components/home/BestSellers";
import Categories from "@/components/home/Categories";
import NewArrivals from "@/components/home/NewArrivals";
import Slider from "@/components/home/Slider";

export default async function Home() {
  return (
    <div className="p-10 min-h-screen text-white space-y-10 ">
      <Slider />
      <Categories />
      <BestSellers />
      <NewArrivals />
    </div>
  );
}
