"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { PhoneCodeSelect } from "@/components/ui/phone-code-select";
import { AddressSelect } from "@/components/ui/address-select";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CircleUserRound,
  Clock3,
  Home,
  ImagePlus,
  LogOut,
  Mail,
  MapPin,
  Package,
  RefreshCw,
  Settings,
  Truck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import productImage from "@/assets/produk.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useOrderHistory } from "@/hooks/use-order-history";
import { getProductImageUrl } from "@/lib/api/products-api";
import type { UserProfile, UpdateProfilePayload } from "@/lib/api/auth-api";

type AccountView =
  | "overview"
  | "orders"
  | "order-detail"
  | "addresses"
  | "edit-address"
  | "details";

type OrderStatus =
  | "Completed"
  | "Shipped"
  | "Processing"
  | "Pending"
  | "Cancelled";

type OrderItem = {
  image: StaticImageData;
  name: string;
  price: string;
  quantity: number;
};

type Order = {
  id: string;
  date: string;
  note: string;
  placedOn: string;
  status: OrderStatus;
  statusMessage: string;
  total: string;
  items: OrderItem[];
};

const orderFilters = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Completed",
  "Cancelled",
] as const;

function mapBackendOrderToOrder(apiOrder: any): Order {
  const dateStr = new Date(apiOrder.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let status: OrderStatus = "Pending";
  let statusMessage = "We are awaiting your payment confirmation.";
  const normalized = apiOrder.status
    ? apiOrder.status.toUpperCase()
    : "PENDING";
  if (normalized === "COMPLETED" || normalized === "SUCCESS") {
    status = "Completed";
    statusMessage =
      "Your order has been completed successfully. Thank you for shopping with us!";
  } else if (normalized === "SHIPPED") {
    status = "Shipped";
    statusMessage = "Your order has been shipped and is on its way to you!";
  } else if (normalized === "PROCESSING") {
    status = "Processing";
    statusMessage =
      "We are currently processing your order and preparing it for delivery.";
  } else if (normalized === "CANCELLED") {
    status = "Cancelled";
    statusMessage = "This order has been cancelled.";
  }

  const items = (apiOrder.orderItems || []).map((item: any) => {
    const rawImage =
      item.product?.imageUrl ||
      (item.product?.imageUrls && item.product?.imageUrls[0]);
    const displayImage = rawImage ? getProductImageUrl(rawImage) : productImage;

    return {
      image: displayImage as any,
      name: item.product?.title || "Product",
      price: `$${item.price.toFixed(2)}`,
      quantity: item.quantity,
    };
  });

  const totalCount = items.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0,
  );

  return {
    id: apiOrder.orderNumber || apiOrder.id,
    date: dateStr,
    note: apiOrder.orderNotes || "",
    placedOn: dateStr,
    status,
    statusMessage,
    total: `$${apiOrder.totalAmount.toFixed(2)} (${totalCount} ${totalCount > 1 ? "Items" : "Item"})`,
    items,
    subtotal: apiOrder.subTotal || 0,
    discount: apiOrder.discountAmount || 0,
    totalVal: apiOrder.totalAmount || 0,
    billing: {
      name: `${apiOrder.firstName} ${apiOrder.lastName}`,
      street: apiOrder.streetAddress,
      city: apiOrder.city,
      state: apiOrder.state,
      postcode: apiOrder.postcode,
      country:
        apiOrder.country === "uk" ? "United Kingdom (UK)" : apiOrder.country,
      phone: apiOrder.phone,
      email: apiOrder.email,
    },
  } as any;
}

export function AccountDashboard() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<AccountView>("overview");
  const { data: profile, isLoading, error } = useProfile();
  const { userProfile: cartUserProfile } = useCart();
  const { data: rawOrders = [], isLoading: ordersLoading } = useOrderHistory();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeProfile = profile || cartUserProfile;

  const mappedOrders = useMemo(() => {
    return rawOrders.map(mapBackendOrderToOrder);
  }, [rawOrders]);

  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

  useEffect(() => {
    if (mappedOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(mappedOrders[0].id);
    }
  }, [mappedOrders, selectedOrderId]);

  if (!mounted || (isLoading && !activeProfile)) {
    return (
      <div className="py-24 text-center text-gray-500 animate-pulse font-medium">
        Loading Account Dashboard...
      </div>
    );
  }

  if (!activeProfile) {
    return (
      <div className="py-20 text-center border border-dashed rounded-lg max-w-md mx-auto px-6 my-12 shadow-sm">
        <CircleUserRound className="size-12 mx-auto text-gray-400" />
        <p className="text-lg font-semibold text-black mt-4">Access Denied</p>
        <p className="mt-2 text-sm text-gray-500">
          Please sign in to view your dashboard.
        </p>
        <Button
          asChild
          className="mt-6 bg-black text-white hover:bg-black/85 px-6"
        >
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="px-4 pb-20 pt-6 sm:px-10 sm:pb-28 sm:pt-8 2xl:px-0">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-[28px] font-satoshi font-bold tracking-normal sm:text-5xl">
          My Account
        </h1>

        <div className="mt-8 grid gap-8 sm:mt-10 sm:gap-12 lg:grid-cols-[280px_minmax(0,1fr)]">
          <AccountSidebar view={view} onViewChange={setView} />
          <AccountContent
            selectedOrderId={selectedOrderId}
            view={view}
            profile={activeProfile!}
            orders={mappedOrders}
            ordersLoading={ordersLoading}
            onSelectOrder={(orderId) => {
              setSelectedOrderId(orderId);
              setView("order-detail");
            }}
            onViewChange={setView}
          />
        </div>
      </div>
    </section>
  );
}

function AccountSidebar({
  onViewChange,
  view,
}: {
  onViewChange: (view: AccountView) => void;
  view: AccountView;
}) {
  const navigation = [
    { label: "Overview", icon: Home, view: "overview" as const },
    { label: "Orders", icon: Package, view: "orders" as const },
    { label: "Addresses", icon: MapPin, view: "addresses" as const },
    { label: "Account Details", icon: UserRound, view: "details" as const },
  ];

  return (
    <aside>
      <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.view === "addresses"
              ? view === "addresses" || view === "edit-address"
              : item.view === "orders"
                ? view === "orders" || view === "order-detail"
                : item.view === view;

          return (
            <Button
              className={
                isActive
                  ? "h-12 w-full justify-start rounded-[5px] text-sm sm:text-lg bg-black px-5 text-white hover:bg-black/85 lg:h-14 lg:px-6 gap-2"
                  : "h-12 w-full justify-start rounded-[5px] text-sm sm:text-lg px-5 text-black hover:bg-black hover:text-white lg:h-14 lg:px-6 gap-2"
              }
              disabled={!item.view}
              key={item.label}
              onClick={() => item.view && onViewChange(item.view)}
              type="button"
              variant={isActive ? "default" : "ghost"}
            >
              <Icon className="size-3 sm:size-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <Separator className="my-5 lg:my-6" />
      <LogoutDialog />
    </aside>
  );
}

function LogoutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-12 w-full text-xs sm:text-base justify-start rounded-[5px] text-black hover:bg-black hover:text-white lg:h-14 gap-2"
          variant="ghost"
        >
          <LogOut className="size-3 sm:size-5" />
          Logout
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-74 rounded-[5px] text-center"
        showCloseButton={false}
      >
        <DialogHeader className="items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#e5e7eb]">
            <LogOut className="size-5" />
          </div>
          <DialogTitle className="mt-2 text-center">
            Log out of your account?
          </DialogTitle>
          <DialogDescription className="text-center">
            You&apos;ll need to sign in again to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-3 grid grid-cols-2 items-center justify-center gap-3 ">
          <DialogClose asChild>
            <Button
              className="w-full hover:bg-red-600 hover:text-white"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-full bg-black text-white hover:bg-black/80"
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("thc_google_profile");
              signOut({ callbackUrl: "/auth/login" });
            }}
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AccountContent({
  onSelectOrder,
  onViewChange,
  selectedOrderId,
  view,
  profile,
  orders,
  ordersLoading,
}: {
  onSelectOrder: (orderId: string) => void;
  onViewChange: (view: AccountView) => void;
  selectedOrderId: string;
  view: AccountView;
  profile: UserProfile;
  orders: Order[];
  ordersLoading: boolean;
}) {
  if (view === "orders") {
    return (
      <OrdersView
        onViewOrder={onSelectOrder}
        orders={orders}
        ordersLoading={ordersLoading}
      />
    );
  }

  if (view === "order-detail") {
    const order =
      orders.find((currentOrder) => currentOrder.id === selectedOrderId) ??
      orders[0];

    if (!order) {
      return (
        <div>
          <Button
            className="mb-5 bg-black text-white hover:bg-black/80 gap-2"
            onClick={() => onViewChange("orders")}
            type="button"
          >
            <ArrowLeft className="size-4" />
            Back to Orders
          </Button>
          <div className="py-10 text-center border border-dashed rounded-lg text-black/50">
            No order details found.
          </div>
        </div>
      );
    }

    return (
      <OrderDetailView order={order} onBack={() => onViewChange("orders")} />
    );
  }

  if (view === "addresses") {
    return (
      <AddressesView
        profile={profile}
        onEdit={() => onViewChange("edit-address")}
      />
    );
  }

  if (view === "edit-address") {
    return (
      <EditAddressView
        profile={profile}
        onBack={() => onViewChange("addresses")}
      />
    );
  }

  if (view === "details") {
    return <AccountDetailsView profile={profile} />;
  }

  return <OverviewView profile={profile} />;
}

function OrdersView({
  onViewOrder,
  orders,
  ordersLoading,
}: {
  onViewOrder: (orderId: string) => void;
  orders: Order[];
  ordersLoading: boolean;
}) {
  const [activeFilter, setActiveFilter] =
    useState<(typeof orderFilters)[number]>("All");
  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  if (ordersLoading) {
    return (
      <div>
        <h2 className="text-[22px] font-satoshi font-bold tracking-normal sm:text-3xl">
          Order History
        </h2>
        <div className="py-12 text-center text-black/50 animate-pulse">
          Loading order history...
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[22px] font-satoshi font-bold tracking-normal sm:text-3xl">
        Order History
      </h2>
      <p className="mt-5 text-sm sm:text-lg text-black/70">
        You have{" "}
        <span className="font-semibold text-xs sm:text-base text-black">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>{" "}
        in total
      </p>

      {orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed rounded-lg text-black/50 mt-8">
          You haven&apos;t placed any orders yet.
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {orderFilters.map((filter) => (
              <Button
                className={
                  activeFilter === filter
                    ? "h-11 w-full rounded-[5px] text-[10px] bg-black px-4 text-white hover:bg-black/85 sm:h-12 text-sm sm:text-base sm:px-6"
                    : "h-11 w-full rounded-[5px] text-[10px] px-4 text-black hover:bg-black hover:text-white sm:h-12 text-sm sm:text-base sm:px-6"
                }
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
                variant={activeFilter === filter ? "default" : "outline"}
              >
                {filter}
              </Button>
            ))}
          </div>

          <div className="mt-8 hidden overflow-x-auto md:block">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[1fr_1fr_1fr_1.2fr_auto] rounded-[5px] border px-6 py-4 text-sm sm:text-base font-bold">
                <span>Order</span>
                <span>Date</span>
                <span>Status</span>
                <span>Total</span>
                <span>Action</span>
              </div>

              <div className="mt-5 grid gap-5">
                {filteredOrders.map((order) => (
                  <Card
                    className="rounded-[5px] py-0 shadow-none"
                    key={order.id}
                  >
                    <CardContent className="grid grid-cols-[1fr_1fr_1fr_1.2fr_auto] items-center px-6 py-5 text-sm sm:text-base">
                      <span>{order.id}</span>
                      <span>{order.date}</span>
                      <OrderStatusBadge status={order.status} />
                      <span>{order.total}</span>
                      <Button
                        className="bg-black px-6 text-white hover:bg-black/80"
                        onClick={() => onViewOrder(order.id)}
                        type="button"
                      >
                        View
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:hidden">
            {filteredOrders.map((order) => (
              <Card className="rounded-[5px] py-0 shadow-none" key={order.id}>
                <CardContent className="grid gap-4 p-4 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-black/55">Order</p>
                      <p className="mt-1 font-bold">{order.id}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm sm:text-base text-black/55">Date</p>
                      <p className="mt-1 text-sm sm:text-base">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-black/55">
                        Total
                      </p>
                      <p className="mt-1 font-semibold text-sm sm:text-base">
                        {order.total}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-fit px-8 bg-black text-sm sm:text-base text-white hover:bg-black/80"
                    onClick={() => onViewOrder(order.id)}
                    type="button"
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function OrderDetailView({
  onBack,
  order,
}: {
  onBack: () => void;
  order: Order;
}) {
  const statusConfig = getOrderStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-4xl">
      <Button
        className="mb-5 w-full bg-black text-white hover:bg-black/80 sm:mb-6 sm:w-auto gap-2"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <h2 className="text-2xl font-bold tracking-normal sm:text-3xl">
        Order {order.id}
      </h2>
      <p className="mt-5 text-sm text-black/70">
        Place on <span className="font-bold text-black">{order.placedOn}</span>
      </p>

      <div
        className={`mt-6 flex flex-col gap-4 rounded-[5px] p-4 sm:flex-row sm:gap-5 sm:p-6 ${statusConfig.panelClassName}`}
      >
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${statusConfig.iconClassName}`}
        >
          <StatusIcon className="size-5" />
        </div>
        <div>
          <p className="text-sm font-bold">Current Status</p>
          <p className={`mt-2 text-xl font-bold ${statusConfig.textClassName}`}>
            {order.status}
          </p>
          <p className="mt-3 text-sm text-black/75">{order.statusMessage}</p>
        </div>
      </div>

      <h3 className="mt-10 text-xl font-bold">Order Details</h3>
      <Card className="mt-5 rounded-[5px] py-0 shadow-none">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b pb-5 text-sm font-bold uppercase">
            <span>Product</span>
            <span>Total</span>
          </div>

          <div className="grid gap-6 py-6 sm:gap-8 sm:py-8">
            {order.items.map((item) => (
              <div
                className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8"
                key={item.name}
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <Image
                    alt={item.name}
                    className="h-auto w-20 object-contain sm:w-24"
                    height={96}
                    src={item.image}
                    width={96}
                  />
                  <div>
                    <p className="text-sm font-semibold sm:text-base">
                      {item.name}
                    </p>
                    <p className="mt-2 text-sm">x{item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold sm:text-right">{item.price}</p>
              </div>
            ))}
          </div>

          <OrderTotalRow
            label="Subtotal"
            value={`$${((order as any).subtotal ?? 0).toFixed(2)}`}
          />
          {(order as any).discount > 0 && (
            <OrderTotalRow
              label="Discount"
              value={`-$${((order as any).discount ?? 0).toFixed(2)}`}
            />
          )}
          <OrderTotalRow
            label="Shipping"
            value={
              ((order as any).subtotal ?? 0) >= 125
                ? "Free"
                : `$${(((order as any).subtotal ?? 0) >= 125 ? 0 : 12.99).toFixed(2)}`
            }
          />
          <OrderTotalRow label="Payment method" value="Direct bank transfer" />
          <OrderTotalRow
            label="Total"
            value={`$${((order as any).totalVal ?? 0).toFixed(2)}`}
            valueClassName="font-bold"
          />
          {order.note && <OrderTotalRow label="Note" value={order.note} />}
        </CardContent>
      </Card>

      <h3 className="mt-8 text-xl font-satoshi font-bold">Billing Address</h3>
      <Card className="mt-5 rounded-[5px] py-0 shadow-none">
        <CardContent className="space-y-1 p-4 text-sm leading-5 sm:p-6">
          {(order as any).billing ? (
            <>
              <p className="font-bold">{(order as any).billing.name}</p>
              <p>{(order as any).billing.street}</p>
              <p>{(order as any).billing.city}</p>
              <p>{(order as any).billing.state}</p>
              <p>{(order as any).billing.postcode}</p>
              <p className="capitalize">{(order as any).billing.country}</p>
              <p>{(order as any).billing.phone}</p>
              <p>{(order as any).billing.email}</p>
            </>
          ) : (
            <p className="text-gray-400">No billing address available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderTotalRow({
  label,
  sublabel,
  value,
  valueClassName = "",
}: {
  label: string;
  sublabel?: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 py-3 text-sm sm:grid-cols-[1fr_auto] sm:gap-6">
      <div>
        <p className="font-bold">{label}</p>
        {sublabel ? (
          <p className="mt-1 text-xs text-black/60">{sublabel}</p>
        ) : null}
      </div>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig = getOrderStatusConfig(status);

  return (
    <span
      className={`w-fit rounded-[4px] px-3 py-1 text-xs sm:text-sm font-bold ${statusConfig.badgeClassName}`}
    >
      {status}
    </span>
  );
}

function getOrderStatusConfig(status: OrderStatus) {
  const config = {
    Completed: {
      icon: Check,
      badgeClassName: "bg-[#F2F9F2] text-[#04DA8D]",
      iconClassName: "bg-emerald-500 text-white",
      panelClassName: "bg-emerald-50",
      textClassName: "text-emerald-600",
    },
    Shipped: {
      icon: Truck,
      badgeClassName: "bg-[#F8F2F9] text-[#B604DA]",
      iconClassName: "bg-fuchsia-600 text-white",
      panelClassName: "bg-fuchsia-50",
      textClassName: "text-fuchsia-600",
    },
    Processing: {
      icon: RefreshCw,
      badgeClassName: "bg-[#F2F2F9] text-[#2404DA]",
      iconClassName: "bg-indigo-700 text-white",
      panelClassName: "bg-indigo-50",
      textClassName: "text-indigo-700",
    },
    Pending: {
      icon: Clock3,
      badgeClassName: "bg-[#FEF8ED] text-[#FEBF54]",
      iconClassName: "bg-amber-400 text-white",
      panelClassName: "bg-amber-50",
      textClassName: "text-amber-500",
    },
    Cancelled: {
      icon: X,
      badgeClassName: "bg-[#D2D5DB40] text-black",
      iconClassName: "bg-black text-white",
      panelClassName: "bg-zinc-100",
      textClassName: "text-black",
    },
  } satisfies Record<
    OrderStatus,
    {
      badgeClassName: string;
      icon: typeof Check;
      iconClassName: string;
      panelClassName: string;
      textClassName: string;
    }
  >;

  return config[status];
}

function OverviewView({ profile }: { profile: UserProfile }) {
  const memberDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "May 2026";

  const dynamicAccountDetails = [
    {
      label: "Full Name",
      value: `${profile.firstName} ${profile.lastName}`,
      icon: CircleUserRound,
    },
    {
      label: "Email Address",
      value: profile.email,
      icon: Mail,
    },
    {
      label: "Member Since",
      value: memberDate,
      icon: CalendarDays,
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="text-[22px] font-satoshi font-bold tracking-normal sm:text-3xl">
            Welcome back, {profile.firstName}
          </h2>
          <p className="mt-5 max-w-2xl text-sm sm:text-lg leading-5 text-black">
            From your account dashboard you can view your recent orders, manage
            your shipping and billing addresses, and edit your password and
            account details.
          </p>
        </div>
        <ProfileAvatar
          className="size-24"
          firstName={profile.firstName}
          lastName={profile.lastName}
        />
      </div>

      <Card className="mt-8 rounded-[5px] py-0 shadow-none">
        <CardContent className="grid p-0 md:grid-cols-3">
          {dynamicAccountDetails.map((detail, index) => {
            const Icon = detail.icon;

            return (
              <div
                className={`p-6 ${
                  index < dynamicAccountDetails.length - 1
                    ? "border-b md:border-b-0 md:border-r"
                    : ""
                }`}
                key={detail.label}
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-black text-white">
                  <Icon className="size-5" />
                </div>
                <p className="mt-5 text-xs sm:text-sm uppercase text-black/55">
                  {detail.label}
                </p>
                <p className="mt-3 text-sm sm:text-base font-semibold">
                  {detail.value}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="mt-6 rounded-[5px] py-0 shadow-none">
        <CardContent className="flex gap-4 p-4 sm:p-6">
          <Settings className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-sm sm:text-base font-semibold">
              Need to update your information?
            </p>
            <p className="mt-2 text-sm sm:text-base text-black/70">
              You can update your personal information, password, and email in
              Account Details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddressesView({
  profile,
  onEdit,
}: {
  profile: UserProfile;
  onEdit: () => void;
}) {
  const hasAddress = !!profile.streetAddress1;

  return (
    <div>
      <h2 className="text-[22px] font-satoshi font-bold tracking-normal sm:text-3xl">
        Billing Address
      </h2>
      <p className="mt-5 text-sm sm:text-lg text-black/70">
        The following addresses will be used on the checkout page by default.
      </p>

      {hasAddress ? (
        <Card className="mt-8 max-w-3xl rounded-[5px] py-0 shadow-none">
          <CardContent className="space-y-1 p-4 text-xs sm:text-sm leading-5 sm:p-6">
            <p className="font-bold">
              {profile.firstName} {profile.lastName}
            </p>
            {profile.streetAddress1 && <p>{profile.streetAddress1}</p>}
            {profile.streetAddress2 && <p>{profile.streetAddress2}</p>}
            {profile.city && <p>{profile.city}</p>}
            {profile.province && <p>{profile.province}</p>}
            {profile.postcode && <p>{profile.postcode}</p>}
            {profile.country && <p>{profile.country}</p>}
            {profile.phone && <p>{profile.phone}</p>}
            <p>{profile.email}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 p-6 border border-dashed rounded-[5px] max-w-3xl text-gray-500 text-sm">
          No billing address configured yet. Click edit below to add one.
        </div>
      )}

      <Button
        className="mt-5 w-fit bg-black px-6 text-white hover:bg-black/80 sm:w-auto"
        onClick={onEdit}
      >
        {hasAddress ? "Edit Address" : "Add Address"}
      </Button>
    </div>
  );
}

function EditAddressView({
  profile,
  onBack,
}: {
  profile: UserProfile;
  onBack: () => void;
}) {
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const country = formData.get("address-country") as string;
    const streetAddress1 = formData.get("address-street1") as string;
    const streetAddress2 = formData.get("address-street2") as string;
    const city = formData.get("address-city") as string;
    const province = formData.get("address-province") as string;
    const postcode = formData.get("address-postcode") as string;
    const phoneCode = formData.get("address-phone-code") as string;
    const phoneNum = formData.get("address-phone-num") as string;

    const phone = phoneNum ? `${phoneCode} ${phoneNum}` : "";

    updateProfile(
      {
        country,
        streetAddress1,
        streetAddress2,
        city,
        province,
        postcode,
        phone,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            onBack();
          }, 1500);
        },
      },
    );
  };

  // Split phone code and number if existing
  const phoneParts = profile.phone ? profile.phone.split(" ") : [];
  const defaultPhoneCode = phoneParts[0] || "+44";
  const defaultPhoneNum = phoneParts.slice(1).join(" ") || "";

  return (
    <div className="max-w-3xl">
      <Button
        className="mb-5 w-full hover:bg-black hover:text-white sm:mb-6 sm:w-auto gap-2"
        onClick={onBack}
        variant="outline"
        disabled={isPending}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>
      <h2 className="text-2xl font-bold tracking-normal sm:text-3xl">
        Edit Billing Address
      </h2>
      <p className="mt-5 text-sm text-black/70">
        Update your billing information below. Changes will be applied to future
        orders at checkout.
      </p>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm sm:text-sm text-red-600 font-medium">
          {error.message || "Failed to update address. Please try again."}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm sm:text-sm text-emerald-600 font-medium">
          Address saved successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <AccountField
            defaultValue={profile.firstName}
            id="address-first"
            label="First Name"
            name="address-first"
            disabled
          />
          <AccountField
            defaultValue={profile.lastName}
            id="address-last"
            label="Last Name"
            name="address-last"
            disabled
          />
        </div>
        <AddressSelect
          countryName="address-country"
          stateName="address-province"
          cityName="address-city"
          defaultCountryCode={profile.country || "GB"}
          defaultStateCode={profile.province || ""}
          defaultCity={profile.city || ""}
          disabled={isPending}
        />

        <div>
          <Label className="font-semibold">
            Street Address<span className="text-red-600">*</span>
          </Label>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Input
              className="h-12"
              defaultValue={profile.streetAddress1 || ""}
              name="address-street1"
              required
              placeholder="House Number and Street Name"
              disabled={isPending}
            />
            <Input
              className="h-12"
              defaultValue={profile.streetAddress2 || ""}
              name="address-street2"
              placeholder="Apartment, suite, unit, etc (optional)"
              disabled={isPending}
            />
          </div>
        </div>

        <AccountField
          defaultValue={profile.postcode || ""}
          id="address-postcode"
          label="Postcode"
          name="address-postcode"
          required
          disabled={isPending}
        />

        <div>
          <Label className="font-semibold">
            Phone<span className="text-red-600">*</span>
          </Label>
          <div className="mt-3 grid gap-4 sm:grid-cols-[100px_1fr]">
            <PhoneCodeSelect
              name="address-phone-code"
              defaultValue={defaultPhoneCode || "+44"}
              className="h-12 w-full text-sm"
              disabled={isPending}
            />
            <Input
              className="h-12"
              defaultValue={defaultPhoneNum}
              name="address-phone-num"
              required
              placeholder="Phone Number"
              disabled={isPending}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-black px-6 text-sm text-white hover:bg-black/80 sm:w-fit"
        >
          {isPending ? "Saving..." : "Save Address"}
        </Button>
      </form>
    </div>
  );
}

function AccountDetailsView({ profile }: { profile: UserProfile }) {
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const { userAvatar } = useCart();
  const [success, setSuccess] = useState(false);
  const [passError, setPassError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateProfile(
        { avatar: file },
        {
          onSuccess: () => {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          },
        },
      );
    }
  };

  const handleRemoveImage = () => {
    updateProfile(
      { avatarUrl: "" },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        },
      },
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setPassError("");

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("details-first") as string;
    const lastName = formData.get("details-last") as string;
    const username = formData.get("username") as string;

    const phoneCode = formData.get("details-phone-code") as string;
    const phoneNum = formData.get("details-phone-num") as string;
    const phone = phoneNum ? `${phoneCode} ${phoneNum}` : "";

    const currentPassword = formData.get("current-password") as string;
    const newPassword = formData.get("new-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    const payload: UpdateProfilePayload = {
      firstName,
      lastName,
      username,
      phone,
    };

    if (newPassword || currentPassword || confirmPassword) {
      if (!currentPassword) {
        setPassError("Current password is required to change password.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPassError("New passwords do not match.");
        return;
      }
      if (newPassword.length < 6) {
        setPassError("New password must be at least 6 characters long.");
        return;
      }
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    updateProfile(payload, {
      onSuccess: () => {
        setSuccess(true);
        const form = e.target as HTMLFormElement;
        const currentPassInput = form.querySelector(
          "#current-password",
        ) as HTMLInputElement;
        const newPassInput = form.querySelector(
          "#new-password",
        ) as HTMLInputElement;
        const confirmPassInput = form.querySelector(
          "#confirm-password",
        ) as HTMLInputElement;
        if (currentPassInput) currentPassInput.value = "";
        if (newPassInput) newPassInput.value = "";
        if (confirmPassInput) confirmPassInput.value = "";

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      },
    });
  };

  // Split phone code and number if existing
  const phoneParts = profile.phone ? profile.phone.split(" ") : [];
  const defaultPhoneCode = phoneParts[0] || "+62";
  const defaultPhoneNum = phoneParts.slice(1).join(" ") || "";

  return (
    <div className="max-w-3xl">
      <h2 className="text-[22px] font-bold tracking-normal sm:text-3xl">
        Account Details
      </h2>
      <h3 className="mt-8 text-sm sm:text-lg font-bold">
        Personal Information
      </h3>
      <p className="mt-3 text-sm sm:text-lg text-black/70">
        Keep your personal details up to date for a smoother account experience.
      </p>

      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
        <ProfileAvatar
          className="size-24"
          firstName={profile.firstName}
          lastName={profile.lastName}
        />
        <div className="grid gap-3 sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-fit bg-black text-xs sm:text-base text-white hover:bg-black/80 sm:w-auto gap-2"
            disabled={isPending}
          >
            <ImagePlus className="size-4" />
            {isPending ? "Uploading..." : "Change Image"}
          </Button>
          {userAvatar && (
            <Button
              type="button"
              onClick={handleRemoveImage}
              className="w-fit text-red-600 hover:bg-red-600 text-xs sm:text-base hover:text-white sm:w-auto gap-2"
              variant="outline"
              disabled={isPending}
            >
              <Trash2 className="size-4" />
              Remove Image
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 font-medium">
          {error.message || "Failed to update profile. Please try again."}
        </div>
      )}

      {passError && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 font-medium">
          {passError}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-600 font-medium">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <AccountField
            defaultValue={profile.firstName}
            id="details-first"
            label="First Name"
            name="details-first"
            required
            disabled={isPending}
          />
          <AccountField
            defaultValue={profile.lastName}
            id="details-last"
            label="Last Name"
            name="details-last"
            required
            disabled={isPending}
          />
        </div>
        <AccountField
          defaultValue={profile.username || ""}
          id="username"
          label="Username"
          name="username"
          required
          disabled={isPending}
        />

        <div>
          <Label className="font-semibold">
            Phone<span className="text-red-600">*</span>
          </Label>
          <div className="mt-3 grid gap-4 sm:grid-cols-[100px_1fr]">
            <PhoneCodeSelect
              name="details-phone-code"
              defaultValue={defaultPhoneCode || "+44"}
              className="h-12 w-full text-sm"
              disabled={isPending}
            />
            <Input
              className="h-12"
              defaultValue={defaultPhoneNum}
              id="details-phone-num"
              name="details-phone-num"
              required
              disabled={isPending}
              placeholder="Phone Number"
            />
          </div>
        </div>

        <Separator className="my-2" />

        <h3 className="text-base sm:text-xl font-bold">E-mail Address</h3>
        <p className="-mt-3 text-sm sm:text-lg text-black/70">
          Manage the email address used for account access and order updates.
        </p>
        <AccountField
          defaultValue={profile.email}
          id="details-email"
          label="E-mail Address"
          name="details-email"
          type="email"
          disabled
        />

        <Separator className="my-2" />

        <h3 className="text-base sm:text-xl font-bold">Change Password</h3>
        <p className="-mt-3 text-sm sm:text-lg text-black/70">
          Change your password to help keep your account secure.
        </p>
        <PasswordField
          id="current-password"
          name="current-password"
          label="Current Password"
          disabled={isPending}
        />
        <PasswordField
          id="new-password"
          name="new-password"
          label="New Password"
          disabled={isPending}
        />
        <PasswordField
          id="confirm-password"
          name="confirm-password"
          label="Confirm New Password"
          disabled={isPending}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-fit text-sm sm:text-lg bg-black px-6 text-white hover:bg-black/80 sm:w-fit"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

function ProfileAvatar({
  className,
  firstName = "",
  lastName = "",
}: {
  className?: string;
  firstName?: string;
  lastName?: string;
}) {
  const { userAvatar } = useCart();
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "TH";
  return (
    <Avatar className={`border-2 border-black/10 ${className ?? ""}`}>
      {userAvatar ? (
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src={userAvatar}
            alt="Profile Picture"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <AvatarFallback className="bg-black text-2xl font-bold text-white">
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

function AccountField({
  defaultValue,
  id,
  label,
  name,
  type = "text",
  required = false,
  disabled = false,
}: {
  defaultValue: string;
  id: string;
  label: string;
  name?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const [val, setVal] = useState(defaultValue || "");

  useEffect(() => {
    setVal(defaultValue || "");
  }, [defaultValue]);

  return (
    <div>
      <Label className="font-semibold" htmlFor={id}>
        {label}
        {required && <span className="text-red-600">*</span>}
      </Label>
      <Input
        className="mt-3 h-12"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        id={id}
        name={name || id}
        type={type}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

function PasswordField({
  id,
  label,
  name,
  disabled = false,
}: {
  id: string;
  label: string;
  name?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <Label className="font-semibold" htmlFor={id}>
        {label}
      </Label>
      <Input
        className="mt-3 h-12"
        id={id}
        name={name || id}
        type="password"
        disabled={disabled}
      />
      {id !== "confirm-password" ? (
        <p className="mt-2 text-xs text-black/55">
          Leave blank to leave unchanged
        </p>
      ) : null}
    </div>
  );
}
