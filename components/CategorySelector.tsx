import CategoryItem from "@/components/CategoryItem";
import CategoryNav from "./CategoryNav";

type Category = {
    id: number;
    title: string;
    noAds?: number;
    image: string;
    path: string;
};

type CategorySelectorProps = {
    togglePanel: () => void; // Accepting togglePanel
};

const categoryData: Category[] = [
    { id: 1, title: "Apple Phones", noAds: 202, image: "/mobiles.png", path: "/categories/applephones" },
    { id: 2, title: "Android Phones", noAds: 180, image: "/mobiles.png", path: "/categories/androidphones" },
    { id: 3, title: "Tablets", noAds: 600, image: "/mobiles.png", path: "/categories/tablets" },
    { id: 4, title: "Phones & Tablets Accessories", noAds: 452, image: "/mobiles.png", path: "/categories/accessories" },
];

export default function CategorySelector({ togglePanel }: CategorySelectorProps) {
    return (
        <section className="h-screen fixed inset-0 bg-white z-40 w-full  lg:hidden">
            <CategoryNav togglePanel={togglePanel} />
            <div className="w-[95%] mx-auto flex flex-col">
                {categoryData.map((item) => (
                    <CategoryItem key={item.id} item={item} />
                ))}
            </div>
            
        </section>
    );
}