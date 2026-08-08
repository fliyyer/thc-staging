import { AccountDashboard } from "@/components/account/account-dashboard";
import { SiteFooter } from "@/components/home/footer";
import { SiteNavbar } from "@/components/home/navbar";
import { FreeShippingBar } from "@/components/free-shipping-bar";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <FreeShippingBar />
      <SiteNavbar activeItem="Account" variant="dark" />

      <AccountDashboard />

      <SiteFooter />
    </main>
  );
}
