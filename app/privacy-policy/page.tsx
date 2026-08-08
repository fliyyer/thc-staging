import Image from "next/image";
import Link from "next/link";

import privacyHeroImage from "@/assets/hero-privacy.webp";
import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import { Card, CardContent } from "@/components/ui/card";
import MarqueeStrip from "@/components/marquee-strip";
import { FreeShippingBar } from "@/components/free-shipping-bar";

const collectedInformation = [
  "Contact information: name, email address, postal address, and phone number.",
  "Account information: username and password for any account you may create.",
  "Transaction information: purchase details and payment information.",
  "Marketing preferences: information on your preferences for receiving marketing communications.",
  "Usage data: information on how you use our site, including IP address, browser type, and website interaction data.",
];

const informationUses = [
  "To process and fulfil orders.",
  "To improve and personalise our services.",
  "To communicate with you regarding purchases, including customer service and support.",
  "To send marketing and promotional content where you have opted in.",
  "To comply with legal obligations, including fraud prevention and regulatory compliance.",
];

const informationSharing = [
  "Service providers: third-party providers that assist with payment processing, website hosting, email marketing, and data analysis.",
  "Legal obligations: where disclosure is required by law or needed to protect our rights or the rights of others.",
  "Business transfers: if our business undergoes a sale, merger, or acquisition, your information may be transferred to the new owner.",
];

const privacyRights = [
  "Access: request access to the personal data we hold about you.",
  "Rectification: request that we correct or update inaccurate information.",
  "Erasure: request that we delete your personal data, under certain conditions.",
  "Restriction: request that we limit how we use your data.",
  "Objection: object to us processing your data for direct marketing purposes.",
  "Data portability: request to receive your data in a structured, commonly used, and machine-readable format.",
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <PrivacyHero />
      <MarqueeStrip />
      <PrivacyContent />
      <SiteFooter />
    </main>
  );
}

function PrivacyHero() {
  return (
    <section className="relative min-h-[600px] sm:min-h-225 overflow-hidden bg-black text-white">
      <Image
        src={privacyHeroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-[600px] sm:min-h-225 flex-col">
        <FreeShippingBar />
        <SiteNavbar />

        <div className="mx-auto flex w-full max-w-360 flex-1 items-end px-4 pb-10 pt-8 sm:px-10 sm:pb-16 lg:pb-20 2xl:px-0">
          <div className="max-w-5xl">
            <h1 className="text-[28px] sm:text-5xl lg:text-[64px] font-satoshi font-bold leading-tight tracking-normal">
              Trust Starts With Transparency
            </h1>
            <p className="max-w-4xl text-sm sm:text-lg lg:text-xl font-medium mt-3 sm:mt-4">
              Your privacy matters to us. Learn how True High Collabs collects,
              uses, and protects your information across our website and
              services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrivacyContent() {
  return (
    <section className="px-6 py-28 sm:px-10 lg:py-36">
      <article className="mx-auto max-w-7xl">
        <header className="text-center">
          <p className="text-xs sm:text-base font-medium uppercase">
            Help &amp; Support
          </p>
          <h2 className="mt-4 text-[22px] font-bold tracking-normal sm:text-5xl">
            Privacy Policy
          </h2>
          <Card className="mx-auto mt-4 sm:mt-7 w-fit border-[#D2D5DB] rounded-[5px] py-0 shadow-none">
            <CardContent className="px-6 py-4 text-xs sm:text-sm font-bold">
              Last updated: November 11, 2024
            </CardContent>
          </Card>
        </header>

        <div className="mt-10 sm:mt-16 space-y-8 text-sm sm:text-lg leading-6">
          <p>
            Welcome to True High Collabs. Your privacy is important to us. This
            Privacy Policy explains how we collect, use, store, and protect your
            personal information when you visit our website,{" "}
            <Link
              className="underline underline-offset-2"
              href="https://truehighcollabs.co.uk"
            >
              https://truehighcollabs.co.uk
            </Link>
            , and engage with our services.
          </p>

          <PolicySection title="Who We Are">
            <p>
              True High Collabs (&quot;we&quot;, &quot;our&quot;, or
              &quot;us&quot;) operates as a provider of supplements and wellness
              products. We are committed to complying with the UK General Data
              Protection Regulation (GDPR) and the Data Protection Act 2018.
            </p>
          </PolicySection>

          <PolicySection title="Information We Collect">
            <p>We may collect the following types of personal information:</p>
            <PolicyList items={collectedInformation} />
          </PolicySection>

          <PolicySection title="How We Use Your Information">
            <p>
              We use the personal information we collect for the following
              purposes:
            </p>
            <PolicyList items={informationUses} />
          </PolicySection>

          <PolicySection title="Marketing Communications">
            <p>
              If you opt in, we may send information about products, offers, and
              updates by email or SMS. You can unsubscribe at any time using the
              unsubscribe link in an email or by contacting us directly.
            </p>
          </PolicySection>

          <PolicySection title="Sharing Your Information">
            <p>
              We may share your personal information with third parties under
              the following circumstances:
            </p>
            <PolicyList items={informationSharing} />
            <p>We do not sell or rent your information to third parties.</p>
          </PolicySection>

          <PolicySection title="Your Rights">
            <p>
              Under the UK GDPR, you have the following rights regarding your
              personal data:
            </p>
            <PolicyList items={privacyRights} />
            <p>
              To exercise any of these rights, please contact us at
              hello@truehighcollabs.co.uk.
            </p>
          </PolicySection>

          <PolicySection title="Data Security">
            <p>
              We take data security seriously. We use appropriate physical,
              electronic, and procedural measures to protect your personal
              information. However, no method of internet transmission can be
              guaranteed as completely secure.
            </p>
          </PolicySection>

          <PolicySection title="Data Retention">
            <p>
              We retain personal data only for as long as necessary for the
              purposes for which it was collected or as required by law. When
              data is no longer needed, we securely delete or anonymise it.
            </p>
          </PolicySection>

          <PolicySection title="Cookies and Tracking Technologies">
            <p>
              Our site uses cookies and similar technologies to improve user
              experience and analyse website traffic. By using our site, you
              consent to our use of cookies in accordance with our Cookie
              Policy.
            </p>
          </PolicySection>

          <PolicySection title="Changes to Our Privacy Policy">
            <p>
              We may update this Privacy Policy periodically. We will notify you
              of significant changes by posting the new policy on our site. We
              encourage you to review this page regularly to stay informed of
              our data practices.
            </p>
          </PolicySection>

          <PolicySection title="Contact Us">
            <p>
              If you have questions, concerns, or complaints about this Privacy
              Policy or how we handle your data, contact us at:
            </p>
            <ul className="list-disc pl-5">
              <li>True High Collabs</li>
              <li>Email: hello@truehighcollabs.co.uk</li>
              <li>
                Address: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
              </li>
            </ul>
          </PolicySection>
        </div>
      </article>
    </section>
  );
}

function PolicySection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-base sm:text-2xl font-bold tracking-normal">
        {title}
      </h3>
      {children}
    </section>
  );
}

function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
