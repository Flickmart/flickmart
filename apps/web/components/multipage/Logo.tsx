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
    </div>
  );
}
