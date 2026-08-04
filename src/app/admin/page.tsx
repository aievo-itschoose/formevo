import { AdminLogin } from "@/components/admin-login";

export default function AdminPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(125,74,249,0.18),_transparent_30%)] px-6 py-10 text-white">
      <AdminLogin />
    </main>
  );
}
