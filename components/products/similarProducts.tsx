const products = [
  {
    id: 1,
    name: "Freestyle Crew Racer leather jacket",
    price: "$595.00",
    image: "/toaster.png",
    hot: true,
  },
  {
    id: 2,
    name: "1996 Retro Nuptse Cashmere Jacket in Gray",
    price: "$149.99",
    image: "/electronics.png",
    hot: true,
  },
  {
    id: 3,
    name: "Classic Black Leather Jacket",
    price: "$450.00",
    image: "/vehicles.png",
    hot: false,
  },
  {
    id: 4,
    name: "Stylish Denim Jacket",
    price: "$89.99",
    image: "/sofa.png",
    hot: false,
  },
  {
    id: 5,
    name: "Trendy Winter Coat",
    price: "$199.99",
    image: "/food.png",
    hot: true,
  },
  {
    id: 6,
    name: "Casual Summer Shirt",
    price: "$49.99",
    image: "/mobiles.png",
    hot: false,
  },
  // Add more products as needed
];

const SimilarProducts = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Similar Adverts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="group animate-fadeIn">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              {product.hot && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  HOT
                </span>
              )}
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-medium truncate">{product.name}</h3>
              <p className="text-primary font-semibold mt-1">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
