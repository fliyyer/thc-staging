"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { countryCodes } from "@/lib/country-codes";
import { Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneCodeSelect } from "@/components/ui/phone-code-select";

import contactPanelImage from "@/assets/contact/contact-info.png";
import contactHeroImage from "@/assets/contact/hero.png";
import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MarqueeStrip from "@/components/marquee-strip";
import { FreeShippingBar } from "@/components/free-shipping-bar";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <ContactHero />
      <MarqueeStrip />
      <ContactFormSection />
      <SiteFooter />
    </main>
  );
}

function ContactHero() {
  return (
    <section className="relative min-h-[600px] sm:min-h-225 overflow-hidden bg-black text-white">
      <Image
        src={contactHeroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-50 flex min-h-[600px] sm:min-h-225 flex-col">
        <FreeShippingBar />
        <SiteNavbar activeItem="Contact" />

        <div className="mx-auto flex w-full max-w-360 flex-1 items-end px-4 pb-10 pt-8 sm:px-10 sm:pb-16 lg:pb-20 2xl:px-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <h1 className="text-[28px] sm:text-5xl lg:text-[64px] font-satoshi font-bold leading-tight tracking-normal">
              Lets Work Together
            </h1>
            <p className="max-w-4xl text-sm sm:text-lg lg:text-xl font-medium mt-3 sm:mt-4">
              Interested in working together? Would you like to become a
              wholesaler? Or do you simply have query? Fill out some info and we
              will be in touch shortly! We can&apos;t wait to hear from you!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactFormSection() {
  return (
    <section className="px-6 py-28 sm:px-10 lg:py-36 2xl:px-0 overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,580px)_minmax(0,580px)] lg:items-stretch lg:justify-center xl:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full"
        >
          <ContactPanel />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="h-full"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}

function ContactPanel() {
  return (
    <aside className="relative h-full min-h-140 overflow-hidden rounded-[5px] text-white sm:min-h-155 lg:min-h-0">
      <Image
        src={contactPanelImage}
        alt=""
        fill
        sizes="(min-width: 1024px) 580px, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 flex h-full min-h-140 flex-col justify-between p-6 sm:min-h-155 sm:p-8 lg:min-h-0">
        <div>
          <p className="text-sm sm:text-lg font-medium uppercase">
            Send a message
          </p>
          <h2 className="mt-6 text-[22px] font-bold font-satoshi leading-tight tracking-normal sm:text-5xl">
            Tell Us What&apos;s On
            <br />
            Your Mind
          </h2>
          <p className="mt-8 max-w-lg text-sm sm:text-lg sm:leading-5">
            We&apos;re always open to conversations, questions, collaborations,
            and new ideas. Reach out and let&apos;s create something meaningful
            together.
          </p>
        </div>

        <div className="grid max-w-sm gap-4 sm:max-w-xs">
          <div className="flex h-14 items-center gap-5 rounded-[5px] bg-white px-6 text-black">
            <Mail className="size-5" />
            <span className="break-all text-xs sm:text-base">
              hello@truehighcollabs.co.uk
            </span>
          </div>
          <div className="flex h-14 items-center gap-5 rounded-[5px] bg-white px-6 text-black">
            <InstagramIcon className="size-5" />
            <span className="text-xs sm:text-base">truehighcollabs</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ContactForm() {
  return (
    <form className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id="first-name" label="Full Name" placeholder="First Name" />
        <FormField id="last-name" label="Last Name" placeholder="Last Name" />
      </div>

      <FormField
        id="email"
        label="Email Address"
        placeholder="Email Address"
        type="email"
      />

      <div>
        <Label className="text-sm sm:text-base font-bold" htmlFor="phone">
          Phone<span className="text-red-600">*</span>
        </Label>
        <div className="mt-4 grid gap-4 grid-cols-[110px_1fr] sm:gap-6">
          <PhoneCodeSelect
            name="phoneCode"
            defaultValue="+44"
            className="h-13 w-full text-sm sm:text-base"
          />
          <Input
            className="h-13 rounded-lg text-sm sm:text-base"
            id="phone"
            placeholder="Phone"
            type="tel"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm sm:text-base font-bold" htmlFor="message">
          Message<span className="text-red-600">*</span>
        </Label>
        <textarea
          className="mt-4 min-h-36 w-full rounded-lg border border-input bg-white px-5 py-4 text-sm sm:text-base outline-none placeholder:text-muted-foreground focus-visible:border-foreground/60 focus-visible:ring-3 focus-visible:ring-ring/50"
          id="message"
          placeholder="Your Message"
        />
      </div>

      <label className="flex items-start gap-4 text-sm sm:text-base leading-5">
        <Checkbox className="mt-1 data-[state=checked]:border-black data-[state=checked]:bg-black" />
        <span>
          I agree to the{" "}
          <Link className="underline" href="#">
            privacy policy
          </Link>{" "}
          and consent to True High Collabs storing my enquiry details to respond
          to my message.
        </span>
      </label>

      <Button className="h-10 sm:h-13 rounded-lg bg-black text-sm sm:text-base font-normal text-white hover:bg-black/85">
        Submit
      </Button>
    </form>
  );
}

function FormField({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <Label className="text-sm sm:text-base font-bold" htmlFor={id}>
        {label}
        <span className="text-red-600">*</span>
      </Label>
      <Input
        className="mt-4 h-13 rounded-lg text-sm sm:text-base"
        id={id}
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="17"
        x="3.5"
        y="3.5"
      />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" fill="currentColor" r="1.1" />
    </svg>
  );
}
