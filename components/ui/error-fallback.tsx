"use client";

interface ErrorFallbackProps {
  error?: Error;
  reset?: () => void;
  message?: string;
}

export function ErrorFallback({
  reset,
  message = "Something went wrong",
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-muted-foreground mb-2">{message}</p>
      {reset && (
        <button
          onClick={reset}
          className="text-sm text-pink-600 hover:text-pink-700 underline underline-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}
