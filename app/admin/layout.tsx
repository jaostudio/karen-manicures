"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  Scissors,
  Image,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Calendar", href: "/admin/calendar", icon: Calendar },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Services", href: "/admin/services", icon: Scissors },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Templates", href: "/admin/templates", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        <div className="flex items-center gap-2 h-16 px-6 border-b">
          <Sparkles className="h-5 w-5 text-pink-600" />
          <span className="font-heading font-bold text-pink-700">
            Karen&apos;s Panel
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 min-h-10 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-pink-100 text-pink-700"
                    : "text-muted-foreground hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-3">
            Built by <a href="https://jaostudio.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">Jaostudio</a>
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-600" />
            <span className="font-heading font-bold text-pink-700">
              Karen&apos;s Panel
            </span>
          </div>
          <Sheet>
            <SheetTrigger
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium hover:bg-muted h-10 w-10"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px]">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 min-h-10 rounded-lg text-sm font-medium ${
                        isActive
                          ? "bg-pink-100 text-pink-700"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <hr className="my-4" />
                <Button
                  variant="ghost"
                  className="justify-start text-muted-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </Button>
                <p className="text-[10px] text-muted-foreground/50 text-center mt-3">
                  Built by <a href="https://jaostudio.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">Jaostudio</a>
                </p>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
