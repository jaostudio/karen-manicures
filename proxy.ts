import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session-config";
import type { AdminSession } from "@/types";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isAdminPage = pathname.startsWith("/admin/") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isLoginApi = pathname === "/api/admin/login";

  if (isAdminPage || (isAdminApi && !isLoginApi)) {
    const cookieStore = await cookies();
    const session = await getIronSession<AdminSession>(cookieStore, sessionOptions);
    if (!session.userId) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
