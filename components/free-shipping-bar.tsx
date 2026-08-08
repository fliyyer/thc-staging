import { cn } from "@/lib/utils";

interface FreeShippingBarProps {
  className?: string;
}

export function FreeShippingBar({ className }: FreeShippingBarProps) {
  return (
    <div
      className={cn(
        "w-full bg-black px-4 py-3 tracking-widest text-center text-xs uppercase text-white sm:py-4 sm:text-sm",
        className
      )}
    >
      Free Shipping Over £125
    </div>
  );
}
