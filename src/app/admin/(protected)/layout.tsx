import { AdminHeader } from "@/components/admin/AdminHeader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader />
      {children}
    </>
  );
}
