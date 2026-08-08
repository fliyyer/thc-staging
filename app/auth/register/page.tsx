"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { AuthField } from "@/components/auth/auth-field";
import { AuthHeading, BrandPill } from "@/components/auth/auth-heading";
import { AuthShell } from "@/components/auth/auth-shell";
import { SocialAuth } from "@/components/auth/social-auth";
import { AuthSuccessDialog } from "@/components/auth/auth-success-dialog";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/use-register";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const {
    mutate: registerMutation,
    isPending,
    error: apiError,
  } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setIsSuccessOpen(true);
        },
      },
    );
  };

  return (
    <AuthShell>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <AuthHeading
          eyebrow="Register"
          title={
            <>
              New to <BrandPill />
            </>
          }
          description="Create an account to enjoy a faster checkout, track your orders, and save your details."
        />

        {apiError ? (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 font-medium">
            {apiError.message || "Registration failed. Please try again."}
          </div>
        ) : null}

        <div className="mt-4 grid gap-7 sm:grid-cols-2">
          <AuthField
            id="firstName"
            label="First Name"
            placeholder="First Name"
            required
            disabled={isPending}
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <AuthField
            id="lastName"
            label="Last name"
            placeholder="Last Name"
            required
            disabled={isPending}
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <div className="mt-7 space-y-7">
          <AuthField
            id="email"
            label="Email Address"
            placeholder="Email"
            type="email"
            required
            disabled={isPending}
            error={errors.email?.message}
            {...register("email")}
          />
          <AuthField
            id="password"
            label="Password"
            placeholder="Password"
            type="password"
            required
            disabled={isPending}
            error={errors.password?.message}
            {...register("password")}
          />
          <AuthField
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            required
            disabled={isPending}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="mt-8 py-5 px-6 w-full rounded-lg bg-black text-sm sm:text-lg font-normal text-white hover:bg-black/85 disabled:bg-black/50"
        >
          {isPending ? "Registering..." : "Register"}
        </Button>

        <p className="mt-7 text-center text-sm sm:text-lg text-black">
          Already an account True High Collabs?{" "}
          <Link className="font-semibold hover:underline" href="/auth/login">
            Sign in
          </Link>
        </p>

        <SocialAuth className="mt-8" />
      </form>

      <AuthSuccessDialog
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        title="Registration Successful!"
        description="Your account has been successfully created."
        actionLabel="Sign In Now"
        actionHref="/auth/login"
      />
    </AuthShell>
  );
}
