import { TriangleAlert } from "lucide-react";

const Warning = () => {
  return (
    <div className="flex text-black/50 mt-9 justify-center gap-2 items-center bg-white py-2 w-9/12 mx-auto rounded-full border ">
      <TriangleAlert size={18}/>
      <p className="text-sm font-light">Do not pay directly to sellers</p>
    </div>
  );
};
export default Warning;
