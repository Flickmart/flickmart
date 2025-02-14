
import { Bell, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="w-full bg-white border-b border-gray-100 fixed top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/lovable-uploads/73607e8d-d6c1-4c0b-bde9-9faa4ea1741f.png" alt="Logo" className="h-8" />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            SELL
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
