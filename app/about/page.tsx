"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import aboutImage from "@/assets/about/about-1.png";
import aboutHeroImage from "@/assets/about/hero.png";
import philo3Image from "@/assets/philosophy/philo-3.png";
import { WhyChooseSlider } from "@/components/about/why-choose-slider";
import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import MarqueeStrip from "@/components/marquee-strip";
import { FreeShippingBar } from "@/components/free-shipping-bar";

const stats = [
  {
    label: "Products Sold",
    value: "7.000+",
    text: "Products delivered to happy customers",
  },
  {
    label: "Costumer Rating",
    value: "5.0 ★",
    text: "Average rating from our costumers",
  },
  {
    label: "Years in Business",
    value: "3+",
    text: "Delivering premium quality since 2023",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <AboutHero />
      <MarqueeStrip />
      <CompanySection />
      <MissionSection />
      <WhyChooseUs />
      <SiteFooter />
    </main>
  );
}

function AboutHero() {
  return (
    <section className="relative min-h-[600px] sm:min-h-225 overflow-hidden bg-black text-white">
      <Image
        src={aboutHeroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex min-h-[600px] sm:min-h-225 flex-col">
        <FreeShippingBar />
        <SiteNavbar activeItem="About" />

        <div className="mx-auto flex w-full max-w-360 flex-1 items-end px-4 pb-10 pt-8 sm:px-10 sm:pb-16 lg:pb-20 2xl:px-0">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="max-w-5xl"
          >
            <h1 className="text-[28px] sm:text-5xl lg:text-[64px] font-satoshi font-bold leading-tight tracking-normal">
              A More Considered
              <br />
              Approach to Modern Plant Culture
            </h1>
            <p className="max-w-4xl text-sm sm:text-lg lg:text-xl font-medium mt-3 sm:mt-4">
              True High Collabs was created to explore the space between
              tradition and innovation — where plant culture, thoughtful design,
              and intentional living intersect.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CompanySection() {
  return (
    <section className="px-4 py-16 sm:px-10 sm:py-28 2xl:px-0">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs font-medium uppercase sm:text-base">
            Our Company
          </p>
          <h2 className="mt-3 text-[22px] font-satoshi font-bold tracking-normal sm:mt-4 sm:text-5xl">
            Refining Modern Plant Culture
          </h2>
        </motion.div>

        <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[minmax(0,586px)_1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <Image
              src={aboutImage}
              alt="Abstract plant culture"
              width={586}
              height={440}
              className="h-auto w-full rounded-sm object-cover"
            />
          </motion.div>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="space-y-2 text-xs leading-6 sm:text-base"
            >
              <p className="text-justify text-sm sm:text-base">
                <strong>True High Collabs</strong> was built for people who
                expect more from modern plant-based culture. We bring together
                premium cannabis inspiration, bold flavour, considered design,
                and carefully selected ingredients to create products that feel
                elevated from the first look to the final experience. At the
                heart of the brand is collaboration — a meeting point between
                nature and innovation, functional botanicals and modern
                lifestyle, old-school ritual and new-school refinement.
              </p>
              <p className="text-sm sm:text-base text-justify">
                <strong>True High Collabs </strong>is built around the idea of
                bringing together two of nature&apos;s finest extracts into
                products that feel intentional, discreet, organic,
                future-forward, and unmistakably True High. Our collections are
                inspired by premium cannabis culture and the growing
                appreciation for ceremonial mushrooms — not as a trend, but as
                part of a wider movement towards more mindful, design-led,
                plant-focused living.
              </p>
            </motion.div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <Card className="gap-0 rounded-[5px] border-0 bg-white p-5 shadow-[0_0_10px_0_rgba(0,0,0,0.25)] h-full transition-shadow duration-300 hover:shadow-md">
                    <CardTitle className="text-bsm font-semibold">
                      {stat.label}
                    </CardTitle>
                    <p className="mt-3 text-2xl font-satoshi font-bold sm:text-4xl">
                      {stat.value}
                    </p>
                    <CardDescription className="mt-3 text-xs text-black">
                      {stat.text}
                    </CardDescription>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="px-4 py-16 sm:px-10 sm:py-20 2xl:px-0">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-center text-xs font-medium uppercase sm:text-base">
            Our Vision. Our Mission
          </p>
          <h2 className="mx-auto mt-4 font-satoshi max-w-4xl text-center text-[22px] font-bold leading-tight tracking-normal sm:text-5xl">
            Designing The Future Of
            <br />
            Elevated Plant Culture
          </h2>
        </motion.div>

        <div className="mt-10 grid items-center gap-6 sm:mt-12 sm:gap-8 lg:gap-24 lg:grid-cols-[1fr_380px_1fr] relative z-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 sm:space-y-20"
          >
            <blockquote className="italic leading-6 text-sm sm:text-lg">
              “Crafted with intention.
              <br />
              Grown with care.”
              <footer className="mt-4 sm:mt-8 not-italic text-sm sm:text-lg">
                — TRUE HIGH COLLABS
              </footer>
            </blockquote>
            <Card className="gap-0 rounded-[5px] border-0 p-5 shadow-[0_0_10px_0_rgba(0,0,0,0.25)] sm:p-6 transition-shadow duration-300 hover:shadow-md">
              <CardTitle className="text-base font-satoshi font-bold sm:text-3xl">
                Vision
              </CardTitle>
              <CardContent className="mt-5 p-0 text-sm sm:text-base text-justify leading-5">
                We create discreet, organic, and future-forward solutions for
                people who want plant-based products that feel premium,
                considered, and easy to enjoy.
              </CardContent>
            </Card>
          </motion.div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={philo3Image}
                alt="Colourful botanical field"
                width={504}
                height={504}
                className="h-auto w-full rounded-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -40, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.4 }}
              className="absolute bottom-34 left-4 z-10 sm:-left-16 sm:top-1/4 sm:bottom-auto"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Card className="w-36 gap-0 rounded-[5px] border-0 bg-white p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] sm:w-44 sm:p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]">
                  <CardTitle className="text-xs sm:text-sm">Quality</CardTitle>
                  <CardDescription className="mt-2 text-xs tracking-wide text-black">
                    Clean ingredients, no compromise
                  </CardDescription>
                </Card>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 40, rotate: 8 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.6 }}
              className="absolute bottom-34 right-4 z-10 sm:-right-12 sm:bottom-20"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Card className="w-32 gap-0 rounded-[5px] border-0 bg-white p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] sm:w-40 sm:p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]">
                  <CardTitle className="text-sm">Bold</CardTitle>
                  <CardDescription className="mt-2 text-sm text-black">
                    Always different, never ordinary.
                  </CardDescription>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-8 sm:block sm:space-y-20"
          >
            <Card className="gap-0 rounded-[5px] border-0 p-5 shadow-[0_0_10px_0_rgba(0,0,0,0.25)] sm:p-6 transition-shadow duration-300 hover:shadow-md">
              <CardTitle className="text-base font-satoshi font-bold sm:text-3xl">
                Mission
              </CardTitle>
              <CardContent className="mt-5 p-0 text-sm sm:text-base text-justify leading-5">
                True High Collabs is for those who like their products with
                character. For people who appreciate strong visuals, premium
                ingredients, and a sense of occasion. Whether it is vapes,
                gummies, chocolates, or future collaborations, our mission is
                simple: to create products that stand out, feel exciting, and
                are made with care and love for our culture.
              </CardContent>
            </Card>
            <blockquote className="max-w-sm text-sm sm:text-lg italic leading-6 text-right ml-auto">
              “Stand out. Feel exciting.
              <br />
              Made with love.”
              <footer className="mt-2 sm:mt-8 text-sm not-italic sm:text-lg">
                — TRUE HIGH COLLABS
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section className="px-4 py-16 sm:px-10 sm:py-28 2xl:px-0">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-center text-xs font-medium uppercase sm:text-base">
            Why Choose Us
          </p>
          <h2 className="mx-auto font-satoshi mt-4 max-w-4xl text-center text-[22px] font-bold leading-tight tracking-normal sm:text-5xl">
            Why True High Collabs is The
            <br />
            Right Choice For You
          </h2>
        </motion.div>
        <WhyChooseSlider />
      </div>
    </section>
  );
}
