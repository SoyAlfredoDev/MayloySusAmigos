import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { ProfileView } from "@/components/account/ProfileView";
import { getUserProfile } from "@/lib/account/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mi Perfil" };

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/cuenta/ingresar?callbackUrl=/cuenta/perfil");
  }

  const profile = await getUserProfile(session.user.id);

  if (!profile) {
    notFound();
  }

  return <ProfileView profile={profile} />;
}
