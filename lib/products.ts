import type { StaticImageData } from "next/image";

import productImage from "@/assets/produk.png";
import promoProduct1 from "@/assets/promo/pro-1.png";
import promoProduct2 from "@/assets/promo/pro-2.png";
import promoProduct3 from "@/assets/promo/pro-3.png";
import promoProduct4 from "@/assets/promo/pro-4.png";

export type Product = {
  badge: string;
  category: string;
  description: {
    bullets: string[];
    heading: string;
    keyFeatures: string[];
  };
  details: Array<{
    label: string;
    value: string;
  }>;
  gallery: Array<{
    alt: string;
    image: StaticImageData;
  }>;
  howToUse: {
    heading: string;
    steps: string[];
    text: string[];
  };
  id: string;
  image: StaticImageData;
  longDescription: string[];
  name: string;
  price: string;
  slug: string;
};

const sharedDescription = {
  heading: "Premium Live Resin 420 Vape Device",
  bullets: [
    "Each vape contains cannabis derived 90% extract manufactured to regulated quality standards.",
    "Crafted with organic Live Resin, our vapes deliver powerful, flavourful vapour.",
    "Suitable for adult consumers, this 420 vape provides a convenient and discreet 420 format.",
  ],
  keyFeatures: [
    "420 Formula: Contains cannabis derived 90% extract.",
    "Organic Live Resin: Made with Live Resin for a consistent powerful flavour profile.",
    "Premium Quality: manufactured using regulated ingredient suppliers.",
    "Flavour Variety: Available in an array of delicious flavours.",
    "Vape Cart: 2ml and adjustable power settings.",
    "Convenient Use: Easy and discreet, suitable for portable use.",
    "Rechargeable Battery: Micro USB",
  ],
};

const sharedHowToUse = {
  heading: "Pre-heat function",
  text: [
    "Turn on the vape by pressing the button 5 times quickly.",
    "To adjust the power setting, press the button 3 times to cycle through the available strengths: Low, Medium, and High.",
    "To power off, press the button 5 times quickly again.",
  ],
  steps: [
    "Power on: Press the button 5 times quickly.",
    "Adjust power setting: Press the button 3 times to cycle through Low, Medium, and High.",
    "Select your preferred setting: Keep pressing until you reach the strength you want.",
    "Power off: Press the button 5 times quickly again.",
  ],
};

export const products: Product[] = [
  {
    id: "prod_alien_og_v3",
    slug: "alien-og-v3-live-resin-vape",
    name: "Alien OG V3 Live Resin Vape",
    category: "420",
    price: "£89.00",
    badge: "New",
    image: productImage,
    gallery: [
      { image: productImage, alt: "Alien OG V3 Live Resin Vape" },
      { image: promoProduct1, alt: "Alien OG V3 Live Resin Vape package" },
    ],
    details: [
      { label: "Flavour and Aroma", value: "Funky, Kush, Pine" },
      { label: "Effect Profile", value: "Floaty, Blissful, Euphoric" },
      { label: "Strain Type", value: "Hybrid" },
    ],
    longDescription: [
      "Packed with a classic sweet canna aroma, Alien OG delivers a fresh take on a legendary OG strain profile. Bright notes of citrus and pine sit at the front, followed by a creamy lemon meringue edge over a herbaceous green base.",
      "Made with live resin, this extract captures the natural terpenes from freshly frozen flower, helping preserve the plant's true flavour, aroma, and character.",
      "Now in a 2ml cart, it is twice the size of our V2 vape, delivering more flavour, more depth, and twice the puffs.",
      "A serious upgrade to a standout OG profile crafted for those who know the difference, and easily sitting among the very best vapes on the market.",
    ],
    description: sharedDescription,
    howToUse: sharedHowToUse,
  },
  {
    id: "prod_grandaddy_purple_v3",
    slug: "grandaddy-purple-v3-live-resin-vape",
    name: "Grandaddy Purple V3 Live Resin Vape",
    category: "420",
    price: "£89.00",
    badge: "New",
    image: promoProduct2,
    gallery: [
      { image: promoProduct2, alt: "Grandaddy Purple V3 Live Resin Vape" },
      { image: productImage, alt: "Grandaddy Purple V3 Live Resin Vape device" },
    ],
    details: [
      { label: "Flavour and Aroma", value: "Berry, Grape, Earthy" },
      { label: "Effect Profile", value: "Calm, Smooth, Heavy" },
      { label: "Strain Type", value: "Indica" },
    ],
    longDescription: [
      "Grandaddy Purple V3 brings a deep berry-forward profile with a rounded finish and a fuller live resin expression.",
      "Built for a smoother draw and a richer terpene character, this vape is designed for customers who prefer a more grounded profile.",
    ],
    description: sharedDescription,
    howToUse: sharedHowToUse,
  },
  {
    id: "prod_laughing_buddha_v3",
    slug: "laughing-buddha-v3-live-resin-vape",
    name: "Laughing Buddha V3 Live Resin Vape",
    category: "420",
    price: "£89.00",
    badge: "New",
    image: promoProduct3,
    gallery: [
      { image: promoProduct3, alt: "Laughing Buddha V3 Live Resin Vape" },
      { image: productImage, alt: "Laughing Buddha V3 Live Resin Vape device" },
    ],
    details: [
      { label: "Flavour and Aroma", value: "Citrus, Spice, Sweet" },
      { label: "Effect Profile", value: "Bright, Uplifted, Clean" },
      { label: "Strain Type", value: "Sativa" },
    ],
    longDescription: [
      "Laughing Buddha V3 is a brighter live resin profile with expressive citrus and spice notes.",
      "The upgraded V3 format gives the flavour more room to open up while keeping the hardware compact and discreet.",
    ],
    description: sharedDescription,
    howToUse: sharedHowToUse,
  },
  {
    id: "prod_og_kush_v3",
    slug: "og-kush-v3-live-resin-vape",
    name: "OG Kush V3 Live Resin Vape",
    category: "420",
    price: "£89.00",
    badge: "New",
    image: promoProduct4,
    gallery: [
      { image: promoProduct4, alt: "OG Kush V3 Live Resin Vape" },
      { image: productImage, alt: "OG Kush V3 Live Resin Vape device" },
    ],
    details: [
      { label: "Flavour and Aroma", value: "Kush, Pine, Gas" },
      { label: "Effect Profile", value: "Classic, Smooth, Balanced" },
      { label: "Strain Type", value: "Hybrid" },
    ],
    longDescription: [
      "OG Kush V3 keeps the familiar kush profile sharp and full, with a cleaner format and a stronger sense of consistency.",
      "It is a classic profile built for customers who want a familiar favourite in a more polished device.",
    ],
    description: sharedDescription,
    howToUse: sharedHowToUse,
  },
  {
    id: "prod_amnesia_v2",
    slug: "amnesia-v2-vape",
    name: "Amnesia V2 Vape",
    category: "420",
    price: "£49.00",
    badge: "New",
    image: productImage,
    gallery: [
      { image: productImage, alt: "Amnesia V2 Vape" },
      { image: promoProduct1, alt: "Amnesia V2 Vape package" },
    ],
    details: [
      { label: "Flavour and Aroma", value: "Citrus, Herbal, Fresh" },
      { label: "Effect Profile", value: "Clear, Bright, Focused" },
      { label: "Strain Type", value: "Sativa" },
    ],
    longDescription: [
      "Amnesia V2 offers a lighter and more portable vape profile with a clean citrus-led finish.",
      "It is designed for customers who prefer a straightforward format with dependable performance.",
    ],
    description: sharedDescription,
    howToUse: sharedHowToUse,
  },
  {
    id: "prod_nyc_diesel_v2",
    slug: "nyc-diesel-v2-vape",
    name: "NYC Diesel V2 Vape",
    category: "420",
    price: "£89.00",
    badge: "New",
    image: promoProduct3,
    gallery: [
      { image: promoProduct3, alt: "NYC Diesel V2 Vape" },
      { image: productImage, alt: "NYC Diesel V2 Vape device" },
    ],
    details: [
      { label: "Flavour and Aroma", value: "Diesel, Citrus, Sharp" },
      { label: "Effect Profile", value: "Energetic, Crisp, Modern" },
      { label: "Strain Type", value: "Hybrid" },
    ],
    longDescription: [
      "NYC Diesel V2 is a sharper profile with citrus and diesel notes in a compact daily-carry format.",
      "It balances portability and flavour retention for a cleaner, more focused vape experience.",
    ],
    description: sharedDescription,
    howToUse: sharedHowToUse,
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
