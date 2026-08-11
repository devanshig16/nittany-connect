import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10 flex items-center gap-4">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "Profile photo"}
            width={56}
            height={56}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {session.user.name}
          </h1>
          <p className="text-sm text-neutral-500">{session.user.email}</p>
        </div>
      </div>
    </div>
  );
}
