import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/actions";
import LoginForm from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  // Server-side: kiểm tra nếu đã đăng nhập thì redirect luôn
  const user = await getCurrentUser();
  if (user) {
    if (user.role === "admin") {
      redirect("/admin");
    }
    redirect("/");
  }

  const params = await searchParams;
  const redirectTo = params.redirect || "/";
  const unauthorized = params.error === "unauthorized";

  return <LoginForm redirectTo={redirectTo} unauthorized={unauthorized} />;
}
