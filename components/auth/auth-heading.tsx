import type { ReactNode } from "react";

type AuthHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
};

export function AuthHeading({ eyebrow, title, description }: AuthHeadingProps) {
  return (
    <div>
      <p className="text-xs sm:text-base font-medium uppercase tracking-normal text-black">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-[22px] font-satoshi font-semibold leading-tight tracking-normal text-black sm:text-[32px]">
        {title}
      </h1>
      <p className="mt-6 sm:mt-8 text-sm sm:text-lg leading-5 text-black">
        {description}
      </p>
    </div>
  );
}

export function BrandPill() {
  return (
    <span className="inline-flex text-[22px] rounded-[5px] mt-3 md:mt-0 bg-black px-3 py-1.5 font-semibold text-white">
      True High Collabs
    </span>
  );
}
