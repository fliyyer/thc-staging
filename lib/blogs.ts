import type { StaticImageData } from "next/image";

import blogImage from "@/assets/blog/blog.png";
import heroBlogImage from "@/assets/blog/hero-blog.png";
import heroImage from "@/assets/hero.png";

export type BlogPost = {
  author: string;
  content: Array<{
    body: string[];
    title?: string;
  }>;
  date: string;
  excerpt: string;
  heroAlt: string;
  image: StaticImageData;
  readTime: string;
  slug: string;
  title: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "functional-mushrooms",
    title: "Functional Mushrooms: A Quiet Return to Nature's Intelligence",
    excerpt:
      "Long before functional mushrooms became part of modern wellness conversations, they were valued across different cultures for their unique relationship with the human body and mind.",
    image: blogImage,
    heroAlt: "Waterfall landscape with rainbow",
    author: "Collabs",
    date: "January 28, 2026",
    readTime: "2 min read",
    content: [
      {
        body: [
          "Long before functional mushrooms became part of modern wellness conversations, they were valued across different cultures for their unique relationship with the human body and mind. Today, interest in these mushrooms has returned not as a trend, but as part of a broader shift toward natural, intentional living.",
          "Rather than focusing on intensity or quick results, functional mushrooms are often appreciated for their subtlety and consistency, making them a natural fit for daily routines.",
        ],
      },
      {
        title: "Lion's Mane: Supporting Focus and Clarity",
        body: [
          "Lion's Mane is one of the most recognised functional mushrooms, known for its distinctive appearance and long-standing traditional use. It has gained attention for its association with mental clarity and focus.",
          "Often incorporated into morning or daytime routines, Lion's Mane is valued for its ability to complement creative work, learning, and moments that require sustained attention.",
        ],
      },
      {
        title: "Cordyceps: Energy with Balance",
        body: [
          "Cordyceps has traditionally been associated with vitality and physical performance. Unlike stimulants that push the body abruptly, Cordyceps is often described as supporting energy in a more measured, sustainable way.",
          "This makes it a common choice for those looking to maintain momentum throughout the day while avoiding sharp peaks and crashes.",
        ],
      },
      {
        title: "Reishi: Calm and Restoration",
        body: [
          "Reishi is often referred to as a grounding mushroom, traditionally used in evening or wind-down routines. It is associated with rest, balance, and recovery.",
          "Many people incorporate Reishi into moments of stillness, reflection, or evening rituals, appreciating its connection to calm rather than stimulation.",
        ],
      },
      {
        title: "A Considered Approach",
        body: [
          "Functional mushrooms are not about chasing instant results. They reflect a slower philosophy that values rhythm, patience, and alignment with natural processes.",
          "At True High Collabs, this perspective mirrors our broader approach: thoughtful sourcing, restrained formulation, and respect for ingredients that have stood the test of time.",
        ],
      },
    ],
  },
  {
    slug: "understanding-delta-9-thc",
    title: "Understanding Delta-9 THC: What It Is, How It Is Extracted And Why It Matters",
    excerpt:
      "A clear look at Delta-9 THC, extraction methods, and how thoughtful formulation shapes modern product expectations.",
    image: heroImage,
    heroAlt: "Abstract botanical landscape",
    author: "Collabs",
    date: "January 18, 2026",
    readTime: "6 min read",
    content: [
      {
        body: [
          "Delta-9 THC is one of the most discussed cannabinoids in modern plant culture. Its role is often simplified, but the quality of the experience depends heavily on sourcing, extraction, formulation, and responsible use.",
          "For customers, understanding the basics helps separate thoughtful products from generic ones.",
        ],
      },
      {
        title: "Extraction and Formulation",
        body: [
          "Extraction quality affects consistency, aroma, flavour, and the overall profile of a product. Clean inputs and controlled processes matter as much as the final format.",
          "Well-made products are designed around repeatability, clear labelling, and a smoother customer experience.",
        ],
      },
    ],
  },
  {
    slug: "choosing-products-that-age-well",
    title: "Choosing Products That Age Well",
    excerpt:
      "Why packaging, formulation, and product restraint matter when building products intended to stay relevant.",
    image: heroBlogImage,
    heroAlt: "Colourful sky and clouds",
    author: "Collabs",
    date: "January 14, 2026",
    readTime: "1 min read",
    content: [
      {
        body: [
          "Products that age well usually avoid gimmicks. They rely on clear utility, strong sourcing, and design choices that feel considered instead of loud for its own sake.",
          "For True High Collabs, that means product experiences built around consistency, flavour, and presentation.",
        ],
      },
    ],
  },
  {
    slug: "role-of-flavour-in-experience",
    title: "The Role of Flavour in Experience",
    excerpt:
      "Flavour is not just a finishing detail. It shapes memory, expectation, and how customers understand a product.",
    image: heroImage,
    heroAlt: "Colourful abstract trees",
    author: "Collabs",
    date: "January 10, 2026",
    readTime: "1 min read",
    content: [
      {
        body: [
          "Flavour sits at the centre of many product experiences because it is immediate and memorable. It can make a product feel clean, heavy, bright, soft, familiar, or entirely new.",
          "A good flavour system should support the product rather than overwhelm it.",
        ],
      },
    ],
  },
  {
    slug: "underground-to-considered-design",
    title: "From Underground to Considered Design",
    excerpt:
      "Plant culture has evolved from hidden signals into a more polished visual and product language.",
    image: heroBlogImage,
    heroAlt: "Cloudy horizon",
    author: "Collabs",
    date: "January 4, 2026",
    readTime: "1 min read",
    content: [
      {
        body: [
          "Modern plant culture no longer has to rely on messy or disposable design. Customers expect products that feel intentional from the first impression through daily use.",
          "That shift creates room for brands to be bolder while still feeling refined.",
        ],
      },
    ],
  },
  {
    slug: "rise-of-quiet-rituals",
    title: "The Rise of Quiet Rituals",
    excerpt:
      "A slower, more intentional approach to routines is shaping how people choose modern lifestyle products.",
    image: blogImage,
    heroAlt: "Waterfall landscape with rainbow",
    author: "Collabs",
    date: "January 2, 2026",
    readTime: "1 min read",
    content: [
      {
        body: [
          "Quiet rituals are built around repetition, atmosphere, and small moments that feel deliberate. They are less about performance and more about creating a rhythm that fits daily life.",
          "Products designed for these rituals need restraint, reliability, and a clear sense of purpose.",
        ],
      },
    ],
  },
  {
    slug: "psilocybin-and-psilocin",
    title: "Understanding Psilocybin and Psilocin: The Compounds Behind the Mushroom Experience",
    excerpt:
      "A simple primer on two well-known mushroom compounds and the culture around them.",
    image: heroImage,
    heroAlt: "Colourful plant landscape",
    author: "Collabs",
    date: "August 12, 2024",
    readTime: "10 min read",
    content: [
      {
        body: [
          "Psilocybin and psilocin are often discussed together because of their close relationship in mushroom culture. Understanding the distinction helps explain why sourcing, context, and education matter.",
          "This article is a high-level educational overview and does not replace local laws, professional guidance, or responsible decision-making.",
        ],
      },
    ],
  },
  {
    slug: "cannabis-product-types",
    title: "Understanding Cannabis Product Types: Vapes, Gummies and Capsules",
    excerpt:
      "A quick guide to common product formats and how customers compare them.",
    image: heroBlogImage,
    heroAlt: "Colourful cloud landscape",
    author: "Collabs",
    date: "August 12, 2024",
    readTime: "5 min read",
    content: [
      {
        body: [
          "Different formats serve different needs. Vapes focus on portability and immediacy, gummies lean into routine and flavour, while capsules prioritise discretion and simplicity.",
          "The best format depends on customer preference, product quality, and the experience they want to create.",
        ],
      },
    ],
  },
  {
    slug: "how-functional-mushrooms-grow",
    title: "How Functional Mushrooms Are Grown, Extracted And Prepared",
    excerpt:
      "A practical overview of cultivation, extraction, and the importance of careful handling.",
    image: blogImage,
    heroAlt: "Waterfall and rainbow",
    author: "Collabs",
    date: "July 31, 2024",
    readTime: "2 min read",
    content: [
      {
        body: [
          "Functional mushroom quality starts long before final packaging. Cultivation conditions, drying, extraction, and storage all shape the final material.",
          "Careful handling protects consistency and supports a better finished product.",
        ],
      },
    ],
  },
];

export const popularBlog = blogPosts.find(
  (post) => post.slug === "psilocybin-and-psilocin",
)!;

export const popularSideBlogs = [
  "cannabis-product-types",
  "understanding-delta-9-thc",
  "how-functional-mushrooms-grow",
]
  .map((slug) => blogPosts.find((post) => post.slug === slug))
  .filter((post): post is BlogPost => Boolean(post));

export const latestBlogs = blogPosts.slice(0, 6);

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getReadAlsoPosts(currentSlug: string) {
  return blogPosts.filter((post) => post.slug !== currentSlug).slice(0, 3);
}
