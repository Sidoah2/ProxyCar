import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

const AdminDashboardPage = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  // Final Server-Side Security Gate
  if (!session) {
    redirect("/admin/login");
  }

  return <DashboardClient />;
};

export default AdminDashboardPage;
