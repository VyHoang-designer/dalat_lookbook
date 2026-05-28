import { createClient } from "@/lib/supabase/server";

export interface Customer {
  id: string;
  full_name: string | null;
  email?: string;
  phone: string | null;
  address: string | null;
  role: string;
  created_at: string;
  order_count?: number;
}

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*, rental_orders(count)")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCustomers error:", error.message);
    return [];
  }

  return (profiles || []).map((p: any) => ({
    ...p,
    order_count: p.rental_orders?.[0]?.count || 0,
    rental_orders: undefined,
  }));
}

export async function getCustomerCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");
  return count || 0;
}
