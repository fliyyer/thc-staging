"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
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

type AuthSuccessDialogProps = {
  buttonLabel?: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AuthSuccessDialog({
  buttonLabel,
  title,
  description,
  actionLabel,
  actionHref,
  open,
  onOpenChange,
}: AuthSuccessDialogProps) {
  const actionButton = (
    <Button className="h-10 w-full rounded-lg bg-black text-sm sm:text-lg font-normal text-white hover:bg-black/85">
      {actionLabel}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {buttonLabel ? (
        <DialogTrigger asChild>
          <Button
            className="mt-8 w-full rounded-lg bg-black px-6 py-5 text-sm sm:text-lg font-normal text-white hover:bg-black/85"
            type="button"
          >
            {buttonLabel}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent
        className="w-11/12 sm:max-w-md gap-0 rounded-lg border border-[#d2d5db] bg-white p-5 text-black shadow-md lg:left-[75%]"
        showCloseButton={false}
      >
        <DialogHeader className="items-center gap-0 text-center">
          <div className="mb-3 flex size-8 items-center justify-center rounded-full bg-[#7ce8bf] text-white">
            <Check className="size-5 stroke-3" />
          </div>
          <DialogTitle className="text-center text-sm sm:text-lg font-semibold leading-5 text-black">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-xs sm:text-base leading-4 text-black">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5 block">
          <DialogClose asChild>
            {actionHref ? (
              <Button
                asChild
                className="h-10 w-full rounded-lg bg-black text-sm sm:text-lg font-normal text-white hover:bg-black/85"
              >
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              actionButton
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
