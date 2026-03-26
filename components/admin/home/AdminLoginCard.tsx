import { FormEvent } from "react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type Props = {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function AdminLoginCard({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Props) {
  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Sign in</h2>
      <p className="mt-1 text-sm text-slate-600">Use your admin account.</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm text-slate-700">
          Email
          <input
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            type="email"
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Password
          <input
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            type="password"
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            required
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit" disabled={loading} className="w-fit">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Card>
  );
}
