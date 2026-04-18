import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 font-sans text-xl font-semibold text-app-text">
          Admin
        </h1>
        <p className="mb-6 font-mono text-xs text-app-text-muted">
          Enter your password to continue.
        </p>

        <form action={login} className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            autoFocus
            placeholder="Password"
            className="w-full rounded border border-app-border bg-app-panel px-3 py-2 font-mono text-sm text-app-text placeholder:text-app-text-muted outline-none focus:border-app-accent"
          />
          {error && (
            <p className="font-mono text-xs text-red-500">
              Incorrect password.
            </p>
          )}
          <button
            type="submit"
            className="rounded border border-app-accent bg-app-accent px-4 py-2 font-mono text-xs text-app-bg transition-opacity hover:opacity-80"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
