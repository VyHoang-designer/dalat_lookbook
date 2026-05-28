"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/* ==========================================
   ĐĂNG KÝ
   ========================================== */
export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;

  // 1. Tạo user trên Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // 2. Tạo profile trong database với role = customer (dùng Supabase, không dùng Prisma)
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        full_name: fullName,
        phone,
        role: "customer",
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }
  }

  return { success: true };
}

/* ==========================================
   ĐĂNG NHẬP
   ========================================== */
export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // Đảm bảo profile tồn tại (dùng Supabase client, không dùng Prisma)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      // Profile chưa tồn tại → tạo mới
      await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || null,
          phone: data.user.user_metadata?.phone || null,
          role: "customer",
        });

      return { success: true, role: "customer" };
    }

    // Trả về role để client redirect đúng
    return { success: true, role: profile.role || "customer" };
  }

  return { success: true, role: "customer" };
}

/* ==========================================
   ĐĂNG XUẤT
   ========================================== */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/* ==========================================
   LẤY THÔNG TIN USER HIỆN TẠI
   ========================================== */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role, avatar_url")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    fullName: profile?.full_name || user.user_metadata?.full_name || null,
    phone: profile?.phone || null,
    role: profile?.role || "customer",
    avatarUrl: profile?.avatar_url || null,
  };
}

/* ==========================================
   KIỂM TRA QUYỀN ADMIN
   ========================================== */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/login?error=unauthorized");
  }
  return user;
}
