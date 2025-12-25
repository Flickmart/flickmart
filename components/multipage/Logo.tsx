import Image from 'next/image';

export default function Logo() {
  return (
    <div className="relative flex items-center gap-1">
      <Image
        alt="Flickmart Logo"
        className="h-12 w-12"
        height={500}
        src="/flickmart-logo.svg"
        width={500}
      />
      <h1 className="pt-1 font-semibold text-2xl">
        Flick<span className="text-flickmart">Mart</span>
      </h1>
      {/* Santa Hat */}
      <svg className="absolute -top-3 -right-2 z-10 h-8 w-8 -rotate-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.686 2 6 4.686 6 8C6 11.314 12 22 12 22C12 22 18 11.314 18 8C18 4.686 15.314 2 12 2Z" fill="#C00"/>
        <circle cx="18" cy="6" r="3" fill="#FFF"/>
      </svg>
    </div>
  );
}
