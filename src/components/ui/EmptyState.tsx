import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl glass px-8 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 text-3xl">✨</div>
      <p className="text-rose-300/50">{message}</p>
    </div>
  );
}
