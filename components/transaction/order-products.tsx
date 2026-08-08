import Image from "next/image";
import productImage from "@/assets/produk.png";
import { getProductImageUrl } from "@/lib/api/products-api";

export function CompactOrderProduct({
  name,
  price,
  quantity = 1,
  imageUrl,
  packSizeLabel,
}: {
  name: string;
  price: string;
  quantity?: number;
  imageUrl?: string | null;
  packSizeLabel?: string;
}) {
  const displayImage = imageUrl ? getProductImageUrl(imageUrl) : "";

  return (
    <div className="grid grid-cols-[48px_1fr_auto] sm:grid-cols-[72px_1fr_auto] items-center gap-3 sm:gap-4">
      <div className="relative h-10 w-12 sm:h-12 sm:w-18 bg-gray-50 rounded flex items-center justify-center">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-contain p-0.5"
          />
        ) : (
          <Image
            src={productImage}
            alt={name}
            fill
            className="object-contain p-0.5"
          />
        )}
      </div>
      <div>
        <p className="text-sm sm:text-lg font-medium leading-tight">{name}</p>
        {packSizeLabel && (
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{packSizeLabel}</p>
        )}
        <p className="mt-1 text-sm sm:text-lg">x{quantity}</p>
      </div>
      <p className="text-sm sm:text-lg font-semibold">{price}</p>
    </div>
  );
}
