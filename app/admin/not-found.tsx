import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl mb-4">🔍</p>
      <h2 className="text-xl font-heading font-bold text-pink-800 mb-2">
        Page not found
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        This admin page doesn&apos;t exist.
      </p>
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center justify-center rounded-full bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 active:scale-[0.97] h-9 px-6 transition-all duration-200"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
