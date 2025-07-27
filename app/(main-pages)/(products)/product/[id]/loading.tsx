import { SyncLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="bg-black/50 flex justify-center items-center z-50 fixed  inset-0">
      <SyncLoader color="#f81" />
    </div>
  );
};
export default Loading;
