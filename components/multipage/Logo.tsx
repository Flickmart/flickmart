import Image from 'next/image';

export default function Logo() {
  return (
    <>
      <Image
        alt=""
        className="h-12 w-12"
        height={500}
        src="/flickmart-logo.svg"
        width={500}
      />
      <h1 className="pt-1 font-bold text-xl">
        Flick<span className="text-flickmart">Mart</span>
      </h1>
    </>
  );
}
