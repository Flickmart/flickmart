"use client";

import { SignIn, useUser } from "@clerk/nextjs";

export default async function ProtectedPage() {
  // Authentication has been removed
  const { user } = useUser();

  if (!user) return <SignIn />;

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <div className="text-yellow-500">⚠️</div>
          This was a protected page, but authentication has been removed from
          the project.
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Demo user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
      </div>
    </div>
  );
}
