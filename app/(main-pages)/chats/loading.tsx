import { ClimbingBoxLoader } from "react-spinners";

export default function loadingChat() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <ClimbingBoxLoader color="#f81" />
    </div>
  );
}
