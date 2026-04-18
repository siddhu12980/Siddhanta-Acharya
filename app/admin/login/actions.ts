"use server";

import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";

export async function login(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=1");
  }

  await createSession();
  redirect("/admin");
}
