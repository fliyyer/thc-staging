"use client";

import { signIn } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type SocialAuthProps = {
  className?: string;
};

const providers = [
  {
    id: "google",
    name: "Google",
    icon: <GoogleIcon />,
    disabled: false,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <FacebookIcon />,
    disabled: false,
  },
  {
    id: "apple",
    name: "Apple",
    icon: <AppleIcon />,
    disabled: true,
  },
];

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M9.01131 1.3263C9.91756 1.22505 10.4538 1.22505 11.4276 1.3263C13.1512 1.58142 14.7491 2.37816 15.9901 3.6013C15.1515 4.39397 14.3239 5.19822 13.5076 6.0138C11.9442 4.6888 10.1992 4.38297 8.27256 5.0963C6.85923 5.7463 5.87506 6.79964 5.32006 8.2563C4.41311 7.58109 3.51797 6.89015 2.63506 6.1838C2.5737 6.15151 2.50362 6.13968 2.43506 6.15005C3.83756 3.44589 6.02923 1.83755 9.01006 1.32505"
        fill="#F44336"
        fillRule="evenodd"
        opacity="0.987"
      />
      <path
        clipRule="evenodd"
        d="M2.43257 6.1501C2.5034 6.13927 2.57049 6.15052 2.63382 6.18385C3.51674 6.8902 4.41187 7.58114 5.31882 8.25635C5.1761 8.82393 5.08614 9.40347 5.05007 9.9876C5.0809 10.5526 5.17049 11.1072 5.31882 11.6514L2.50007 13.8951C1.27257 11.3301 1.25007 8.74844 2.43257 6.1501Z"
        fill="#FFC107"
        fillRule="evenodd"
        opacity="0.997"
      />
      <path
        clipRule="evenodd"
        d="M15.8563 16.6125C14.9787 15.8385 14.0598 15.1125 13.1038 14.4375C14.0622 13.7609 14.6438 12.8325 14.8488 11.6525H10.1526V8.39129C12.8609 8.36879 15.568 8.39171 18.2738 8.46004C18.7872 11.2475 18.1943 13.7609 16.4951 16C16.293 16.2148 16.079 16.4193 15.8563 16.6125Z"
        fill="#448AFF"
        fillRule="evenodd"
        opacity="0.999"
      />
      <path
        clipRule="evenodd"
        d="M5.31875 11.6526C6.34375 14.2001 8.22292 15.3893 10.9563 15.2201C11.7235 15.1313 12.4592 14.8632 13.1038 14.4376C14.0604 15.1143 14.9779 15.8393 15.8563 16.6126C14.4646 17.8632 12.6901 18.6052 10.8225 18.7176C10.3982 18.7515 9.97182 18.7515 9.5475 18.7176C6.36583 18.3426 4.01667 16.7351 2.5 13.8951L5.31875 11.6526Z"
        fill="#43A047"
        fillRule="evenodd"
        opacity="0.993"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 10.0251C20 4.49123 15.52 0 10 0C4.48 0 0 4.49123 0 10.0251C0 14.8772 3.44 18.9173 8 19.8496V13.0326H6V10.0251H8V7.5188C8 5.58396 9.57 4.01003 11.5 4.01003H14V7.01754H12C11.45 7.01754 11 7.46867 11 8.02005V10.0251H14V13.0326H11V20C16.05 19.4987 20 15.2281 20 10.0251Z"
        fill="#3D5A98"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-4.25"
      fill="none"
      viewBox="0 0 17 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.1643 19.1976C13.0658 20.253 11.8665 20.0864 10.712 19.5864C9.49031 19.0754 8.36946 19.0532 7.08049 19.5864C5.46647 20.2752 4.61462 20.0752 3.65069 19.1976C-1.81905 13.6094 -1.01204 5.09936 5.19746 4.78828C6.71061 4.86605 7.76421 5.6104 8.64968 5.67706C9.97228 5.41043 11.2388 4.64386 12.6511 4.74385C14.3436 4.87716 15.6214 5.54374 16.462 6.74359C12.9649 8.82111 13.7944 13.3872 17 14.6648C16.3611 16.3313 15.5317 17.9866 14.153 19.2087L14.1643 19.1976ZM8.53759 4.72163C8.36946 2.24416 10.3982 0.199975 12.7296 0C13.0546 2.8663 10.1068 4.99937 8.53759 4.72163Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SocialAuth({ className }: SocialAuthProps) {
  const handleSocialClick = (providerId: string, disabled: boolean) => {
    if (disabled) return;
    signIn(providerId, { callbackUrl: "/" });
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-5">
        <Separator className="flex-1 bg-[#d7d7d7]" />
        <span className="text-xs sm:text-base text-black">or continue with email</span>
        <Separator className="flex-1 bg-[#d7d7d7]" />
      </div>

      <div className="mt-8 grid gap-5 md:px-20 grid-cols-3">
        {providers.map((provider) => (
          <Button
            className={`flex items-center justify-center gap-2.5 rounded-[5px] border border-[#D2D5DB] bg-white px-6 py-3 text-xs sm:text-base font-normal text-black transition hover:border-black hover:bg-[#f7f7f7] ${
              provider.disabled ? "opacity-50 cursor-not-allowed hover:bg-white hover:border-[#D2D5DB]" : "cursor-pointer"
            }`}
            key={provider.name}
            type="button"
            disabled={provider.disabled}
            onClick={() => handleSocialClick(provider.id, provider.disabled)}
            title={provider.disabled ? "Apple sign in is temporarily unavailable" : `Sign in with ${provider.name}`}
          >
            {provider.icon}
            {provider.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
