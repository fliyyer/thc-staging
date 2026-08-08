import { AuthField } from "@/components/auth/auth-field";
import { AuthHeading } from "@/components/auth/auth-heading";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthSuccessDialog } from "@/components/auth/auth-success-dialog";

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <form className="w-full">
        <AuthHeading
          eyebrow="Reset Password"
          title="Create a New Password"
          description="Enter your new password below to securely regain access to your account."
        />

        <div className="mt-8 space-y-7">
          <AuthField
            id="new-password"
            label="New Password"
            placeholder="New Password"
            type="password"
            required
          />
          <AuthField
            id="confirm-new-password"
            label="Confirm New Password"
            placeholder="Confirm New Password"
            type="password"
            required
          />
        </div>

        <AuthSuccessDialog
          actionHref="/auth/login"
          actionLabel="Sign In"
          buttonLabel="Update Password"
          description="You can now sign in with your new password."
          title="Password Updated Successfully"
        />
      </form>
    </AuthShell>
  );
}
