import BestSellers from "@/components/home/BestSellers";
import Categories from "@/components/home/Categories";
import NewArrivals from "@/components/home/NewArrivals";
import Slider from "@/components/home/Slider";


export default async function Home() {
  return (
    <>
      <Slider />
      <div className="lg:p-10 p-5 min-h-screen text-white lg:space-y-10 space-y-5 ">
        <Categories />
        <BestSellers />
        <NewArrivals />
      </div>
    </>
  );
}
