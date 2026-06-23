import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <Sparkles className="h-12 w-12 text-pink-600 mb-4" />
      <h1 className="text-6xl font-heading font-bold text-foreground mb-2">
        404
      </h1>
      <p className="text-xl text-muted-foreground mb-6">
        Page not found
      </p>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-pink-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-pink-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
