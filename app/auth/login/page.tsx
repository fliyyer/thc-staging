"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { AuthField } from "@/components/auth/auth-field";
import { AuthHeading, BrandPill } from "@/components/auth/auth-heading";
import { AuthShell } from "@/components/auth/auth-shell";
import { SocialAuth } from "@/components/auth/social-auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/use-login";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { mutate: loginMutation, isPending, error: apiError } = useLogin();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("refreshToken", response.refreshToken);
          router.push("/");
        },
      },
    );
  };

  return (
    <AuthShell>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <AuthHeading
          eyebrow="Login"
          title={
            <>
              Welcome back to <BrandPill />
            </>
          }
          description="Enter your email and password to access your account."
        />

        {apiError ? (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 font-medium">
            {apiError.message || "Login failed. Please check your credentials."}
          </div>
        ) : null}

        <div className="mt-8 space-y-7">
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
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Label
                className="flex cursor-pointer items-center gap-3 text-xs sm:text-sm font-semibold text-black"
                htmlFor="remember-me"
              >
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                  className="size-3.5 cursor-pointer border-black data-[state=checked]:border-black data-[state=checked]:bg-black"
                />
                Remember me
              </Label>
            )}
          />
          <Link
            className="text-xs sm:text-sm font-semibold text-black hover:underline"
            href="/auth/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="mt-8 py-5 px-6 w-full rounded-lg bg-black text-sm sm:text-lg font-normal text-white hover:bg-black/85 disabled:bg-black/50"
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>

        <p className="mt-7 text-center text-sm sm:text-lg text-black">
          Don&apos;t have an account True High Collabs?{" "}
          <Link className="font-semibold hover:underline" href="/auth/register">
            Sign up
          </Link>
        </p>

        <SocialAuth className="mt-8" />
      </form>
    </AuthShell>
  );
}
