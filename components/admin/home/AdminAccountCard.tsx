import { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { UserProfile } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type Props = {
  user: User;
  userProfile: UserProfile | null;
};

export function AdminAccountCard({ user, userProfile }: Props) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-600">Signed in as</p>
          <p className="text-base font-semibold text-slate-900">{user.email}</p>
          {userProfile ? <p className="mt-1 text-xs text-slate-500">Role: {userProfile.role}</p> : null}
        </div>
        <Button variant="secondary" onClick={() => signOut(auth)}>
          Sign out
        </Button>
      </div>
    </Card>
  );
}
