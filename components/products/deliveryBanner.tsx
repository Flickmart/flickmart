
const DeliveryBanner = () => {
    return (
      <div className="w-full bg-black text-white mt-[60px]">
        <div className="container mx-auto max-w-7xl">
          <div className="relative aspect-[16/3] w-full overflow-hidden">
            <img
              src="/deliveryBanner.png"
              alt="Delivery Services"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default DeliveryBanner;
  