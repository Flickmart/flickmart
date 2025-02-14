
import { Heart, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const ProductDetail = () => {
  return (
    <div className="bg-white py-6 rounded-lg shadow-sm">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src="/airpods-demo.png"
          alt="Apple Airpod Pro"
          className="object-cover w-full h-full"
        />
        <span className="absolute bottom-4 right-4 text-sm text-white bg-black/60 px-2 py-1 rounded">
          1/2
        </span>
      </div>
    
      <div className="mt-6">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="secondary" className="mb-2">High Tech Store</Badge>
            <h1 className="text-2xl font-semibold">Apple Airpod Pro 2nd Gen</h1>
            <p className="text-primary text-xl font-semibold mt-2">₦ 53,000</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-gray-600">
            Get the best sound from Airpod pro 2nd Gen. It is loud and is very durable and noiseless. Get the best sound from Airpod pro 2nd Gen. Get it loud long and is very durable and noiseless. Get the best sound from Airpod pro 2nd Gen.
          </p>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Used</p>
              <p className="font-medium">No</p>
            </div>
            <div>
              <p className="text-gray-600">Category</p>
              <p className="font-medium">Electronics</p>
            </div>
            <div>
              <p className="text-gray-600">Condition</p>
              <p className="font-medium">Exchange possible</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 border-t pt-4">
          <Button variant="ghost" className="flex flex-col items-center">
            <ThumbsUp className="h-5 w-5" />
            <span className="text-sm mt-1">Likes</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center">
            <ThumbsDown className="h-5 w-5" />
            <span className="text-sm mt-1">Dislikes</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm mt-1">Comments</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center">
            <Heart className="h-5 w-5" />
            <span className="text-sm mt-1">Wishlist</span>
          </Button>
        </div>

        <div className="flex gap-4 mt-6">
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-white">
            Chat vendor
          </Button>
          <Button variant="outline" className="flex-1">
            Call vendor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
