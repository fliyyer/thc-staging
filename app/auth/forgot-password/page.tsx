import { AuthField } from "@/components/auth/auth-field";
import { AuthHeading } from "@/components/auth/auth-heading";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthSuccessDialog } from "@/components/auth/auth-success-dialog";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <form className="w-full">
        <AuthHeading
          eyebrow="Forgot Password"
          title="Need a new password?"
          description="Forgot your password? Please enter your email address. You will receive a link to create a new password via email."
        />

        <AuthField
          className="mt-8"
          id="email"
          label="Email Address"
          placeholder="Email"
          type="email"
          required
        />

        <AuthSuccessDialog
          actionLabel="Got it"
          buttonLabel="Send Instructions"
          description="We've sent a reset link to your inbox."
          title="Check Your Email"
        />
      </form>
    </AuthShell>
  );
}
