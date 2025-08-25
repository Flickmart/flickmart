'use client';

import { SignIn, useUser } from '@clerk/nextjs';

export default async function ProtectedPage() {
  // Authentication has been removed
  const { user } = useUser();

  if (!user) return <SignIn />;

  return (
    <div className="flex w-full flex-1 flex-col gap-12">
      <div className="w-full">
        <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-foreground text-sm">
          <div className="text-yellow-500">⚠️</div>
          This was a protected page, but authentication has been removed from
          the project.
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <h2 className="mb-4 font-bold text-2xl">Demo user details</h2>
        <pre className="max-h-32 overflow-auto rounded border p-3 font-mono text-xs">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div>
        <h2 className="mb-4 font-bold text-2xl">Next steps</h2>
      </div>
    </div>
  );
}
