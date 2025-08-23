import { FormMessage, type Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function ResetPassword(props: {
  searchParams: Promise<Message>; // searchParams is a Promise containing a Message
}) {
  const searchParams = await props.searchParams; // await the Promise to get the actual message
  return (
    <form className="flex w-full max-w-md flex-col gap-2 p-4 [&>input]:mb-4">
      <h1 className="font-medium text-2xl">Reset password</h1>
      <p className="text-foreground/60 text-sm">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New password</Label>
      <Input
        name="password"
        placeholder="New password"
        required
        type="password"
      />
      <Label htmlFor="confirmPassword">Confirm password</Label>
      <Input
        name="confirmPassword"
        placeholder="Confirm password"
        required
        type="password"
      />
      <SubmitButton>Reset password</SubmitButton>
      <FormMessage message={searchParams} /> // Display the message to the user
    </form>
  );
}
