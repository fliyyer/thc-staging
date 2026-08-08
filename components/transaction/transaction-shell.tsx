import Link from "next/link";
import { Home } from "lucide-react";

import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import { FreeShippingBar } from "@/components/free-shipping-bar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type TransactionStep = "cart" | "checkout" | "complete";

const steps = [
  { key: "cart", label: "Cart", href: "/cart" },
  { key: "checkout", label: "Checkout Details", href: "/checkout" },
  { key: "complete", label: "Order Complete", href: "/order-complete" },
] as const;

export function TransactionShell({
  children,
  step,
}: {
  children: React.ReactNode;
  step: TransactionStep;
}) {
  return (
    <main className="min-h-screen bg-white text-black">
      <FreeShippingBar />
      <SiteNavbar activeUtility="cart" variant="dark" />

      <section className="px-4 pb-20 pt-4 sm:px-10 2xl:px-0">
        <div className="mx-auto max-w-7xl">
          <TransactionBreadcrumb step={step} />
          {children}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function TransactionBreadcrumb({ step }: { step: TransactionStep }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <Home className="size-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {steps.map((item) => (
          <TransactionBreadcrumbStep
            active={item.key === step}
            href={item.href}
            key={item.key}
            label={item.label}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function TransactionBreadcrumbStep({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        {active ? (
          <BreadcrumbPage>{label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={href}>{label}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </>
  );
}
