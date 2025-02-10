import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthHeader from "@/components/auth/AuthHeader";
import Image from "next/image";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      {/* <AuthHeader /> */}
      <section className="form-grid">
        <Image
          src="/forgot-password.svg"
          width={520}
          height={486}
          alt="forgot password illustration"
          className="hidden lg:block lg:w-[450px]"
        />
        <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 container-px mt-14 mx-auto">
          <div>
            <h1 className="text-[32px] font-medium">Forgot Password?</h1>
            <p className="text-flickmart-gray mt-8">
              Enter your email to reset password.
            </p>
          </div>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label className="auth-form-label" htmlFor="email">
              Email address
            </Label>
            <Input
              className="auth-input"
              name="email"
              placeholder="Email address"
              required
            />
            <SubmitButton
              className="submit-btn"
              formAction={forgotPasswordAction}
            >
              Next
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </section>
    </>
  );
}
