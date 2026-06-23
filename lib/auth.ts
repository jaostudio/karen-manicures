import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import type { AdminSession } from "@/types";
import { sessionOptions } from "./session-config";

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<AdminSession>(cookieStore, sessionOptions);
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) {
    redirect("/admin/login");
  }
  return session;
}

export async function loginAdmin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  await session.save();
  return user;
}

export async function logoutAdmin() {
  const session = await getSession();
  session.destroy();
}
