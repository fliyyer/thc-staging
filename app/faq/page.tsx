import Image from "next/image";
import { Search } from "lucide-react";

import faqHeroImage from "@/assets/hero-faq.webp";
import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import MarqueeStrip from "@/components/marquee-strip";
import { FreeShippingBar } from "@/components/free-shipping-bar";

const frequentlyAskedQuestions = [
  {
    question: "What is True High Collabs?",
    answer:
      "True High Collabs is a lifestyle brand inspired by cannabis culture, functional mushrooms, and modern rituals. We focus on quality, design, and intentional product development.",
  },
  {
    question: "How are your products developed?",
    answer:
      "Our products are developed with carefully selected ingredients, considered formulations, and a strong focus on consistency, traceability, and responsible production.",
  },
  {
    question: "What kind of experience can I expect?",
    answer:
      "Each product is designed to offer a refined, straightforward experience. Refer to the individual product page for its flavour profile, features, and recommended use.",
  },
  {
    question: "Where do you ship?",
    answer:
      "We currently ship to eligible addresses within the United Kingdom. Available destinations and delivery options are confirmed during checkout.",
  },
  {
    question: "How do you ship?",
    answer:
      "Orders are prepared in discreet, secure packaging and sent using a tracked delivery service. Tracking information is provided after dispatch.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <FaqHero />
      <MarqueeStrip />
      <FaqSection />
      <SiteFooter />
    </main>
  );
}

function FaqHero() {
  return (
    <section className="relative min-h-[600px] sm:min-h-225 overflow-hidden bg-black text-white">
      <Image
        src={faqHeroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-[600px] sm:min-h-225 flex-col">
        <FreeShippingBar />
        <SiteNavbar activeItem="FAQ" />

        <div className="mx-auto flex w-full max-w-360 flex-1 items-end px-4 pb-10 pt-8 sm:px-10 sm:pb-16 lg:pb-20 2xl:px-0">
          <div className="max-w-5xl">
            <h1 className="text-[28px] sm:text-5xl lg:text-[64px] font-satoshi font-bold leading-tight tracking-normal">
              Answers to Common Questions
            </h1>
            <p className="max-w-4xl text-sm sm:text-lg lg:text-xl font-medium mt-3 sm:mt-4">
              Find quick answers, helpful information, and guidance about
              products, orders, shipping, and the True High Collabs experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="px-6 py-28 sm:px-10 lg:py-36">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs sm:text-base font-medium uppercase">
            Help &amp; Support
          </p>
          <h2 className="mt-4 text-[22px] text-nowrap font-bold leading-tight tracking-normal sm:text-5xl">
            Frequently Asked
            <br className="hidden sm:block" />
            Questions (FAQs)
          </h2>
          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-lg leading-5 text-black">
            Have questions? We&apos;ve got answers. Explore our frequently asked
            questions to find quick solutions to common queries. Save time and
            get the information you need right here.
          </p>
        </div>

        <div className="relative mx-auto mt-8 max-w-sm">
          <Input
            aria-label="Search frequently asked questions"
            className="h-12 rounded-lg border-black/50 pr-11"
            placeholder="Search"
            type="search"
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-black/50" />
        </div>

        <Accordion
          className="mt-12 grid gap-4"
          defaultValue="question-1"
          type="single"
          collapsible
        >
          {frequentlyAskedQuestions.map((item, index) => (
            <AccordionItem
              className="rounded-lg border-0 bg-white px-6 shadow-[0_0_8px_rgba(0,0,0,0.18)]"
              key={item.question}
              value={`question-${index + 1}`}
            >
              <AccordionTrigger className="py-5 text-sm font-bold hover:no-underline sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-2xl pb-5 leading-6 text-xs font-normal hover:no-underline sm:text-sm">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
