import { SyncLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <SyncLoader color="#f81" />
    </div>
  );
};
export default Loading;
