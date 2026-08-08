"use client";

import Image from "next/image";

import mushroomIcon from "@/assets/marque/mushroom.svg";
import plantIcon from "@/assets/marque/plant.svg";

const marqueeItems = [
  { label: "Ceremonial Mushrooms" },
  { label: "Plant Intelligence" },
  { label: "Modern Rituals" },
  { label: "Elevated Livings" },
  { label: "Ceremonial Mushrooms" },
  { label: "Plant Intelligence" },
  { label: "Modern Rituals" },
  { label: "Elevated Livings" },
];

export default function MarqueeStrip() {
  // Duplicate 4x to ensure seamless infinite scroll on all screen sizes
  const items = [
    ...marqueeItems,
    ...marqueeItems,
    ...marqueeItems,
    ...marqueeItems,
  ];

  return (
    <div className="overflow-hidden border-b bg-white">
      <div
        className="flex w-max"
        style={{
          animation: "marquee 30s linear infinite",
          willChange: "transform",
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex min-w-max items-center gap-4 px-8 py-4 text-xs sm:text-sm whitespace-nowrap"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="size-4 shrink-0"
              height={16}
              src={
                item.label === "Ceremonial Mushrooms" ? mushroomIcon : plantIcon
              }
              width={16}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
