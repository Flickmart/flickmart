'use client';
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { initialChat, shareProduct } from "@/utils/helpers";
import { useMutation, useQuery } from "convex/react";
import { EllipsisVertical, MapPin, MessageSquareText, Share } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function BookedMarkedItem({product, type}: {product: Doc<"product">; type: "saved" | "wishlist"})  {
    const user = useQuery(api.users.current);
    const router = useRouter()
    const {title, description, _id}= product;
    const bookmarkProduct = useMutation(api.product.addBookmark)


    const [isDelOpen, setIsDelOpen] = useState(false);  

    const toggleDelete = () => {
        setIsDelOpen(prev => !prev);
    }

    return (
        <div className="w-full p-3 relative bg-white flex flex-col gap-3 text-sm">
            <div onClick={(e)=>{
                e.preventDefault()
                e.stopPropagation()
            }} className="z-20 absolute top-1.5 right-1">
                <button onClick={toggleDelete} className="text-flickmart hover:bg-orange-100 rounded-full p-1.5 relative" tabIndex={0} onBlur={() => setIsDelOpen(false)}><EllipsisVertical /></button>
                {isDelOpen && (
                    <button onClick={async ()=> {
                        const deleted = await bookmarkProduct({productId: product._id, type})
                        console.log(deleted)
                        typeof deleted === null && toast.success(`Item deleted from ${type}`)
                    } } 
                    className="z-30 absolute top-0 right-7 py-2 px-6 bg-white text-black border rounded-sm text-sm">Delete</button>
                )}
            </div>
            
            <div className="flex gap-3 capitalize">
                <div className="w-4/12 h-32 lg:w-5/12 lg:h-56 aspect-square overflow-hidden flex justify-center items-center">
                    <Image src={product.images[0]} className="h-full lg:h-auto w-full lg:w-auto rounded-md object-cover" alt={product.title} height={1000} width={1000} />
                </div>
                <div className="w-7/12 lg:w-6/12 flex flex-col justify-between pe-3">
                    <div className="flex flex-col gap-2 lg:gap-5">
                        <h1 className="text-sm lg:text-xl font-semibold tracking-tighter">{product.title}</h1>
                        <span className="font-semibold text-sm lg:text-sm">&#8358;{product.price.toLocaleString()}</span>
                        <span className="">
                            <span className="bg-flickmart text-white py-1.5 px-2 rounded-sm text-[10px] lg:text-sm">{product.condition}</span>
                        </span>
                    </div>
                    <div className="flex flex-col gap-4 mt-3">
                        <span className="flex gap-1 items-center text-flickmart-gray text-[10px] lg:text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{product.location}</span>
                        </span>
                        <div className="hidden lg:flex gap-3 items-center text-[8px] lg:text-sm">
                            <button onClick={(e)=> {
                                e.preventDefault()
                                e.stopPropagation()

                                initialChat({user: user ?? null, userId: product.userId,onNavigate: router.push })}
                                } 
                                className="bg-flickmart text-white rounded-sm w-1/4 flex justify-center items-center gap-2 px-2 py-2"><MessageSquareText className="h-4 w-4" /><span>Chat vendor</span></button>
                            <button onClick={()=> shareProduct({ title, description, productId: _id })} className="border border-flickmart flex items-center gap-2 py-2 px-2 rounded-sm w-1/4 text-flickmart justify-center"><Share className="h-4 w-4" /><span>Share</span></button>
                        </div>
                    </div>
                </div> 
            </div>
            <div className="lg:hidden border-t flex gap-3 pt-3">
                <button className="bg-flickmart text-white rounded-sm flex items-center gap-2 px-2 py-2"><MessageSquareText className="h-4 w-4" /><span>Chat vendor</span></button>
                <button className="border border-flickmart flex items-center gap-2 py-2 px-2 rounded-sm text-flickmart"><Share className="h-4 w-4" /><span>Share</span></button>
            </div>
        </div>
    );
}