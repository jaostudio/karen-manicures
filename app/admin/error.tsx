"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-4xl mb-4">😵</p>
      <h2 className="text-xl font-heading font-bold text-pink-800 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-full bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 active:scale-[0.97] h-9 px-6 transition-all duration-200"
      >
        Try again
      </button>
    </div>
  );
}
