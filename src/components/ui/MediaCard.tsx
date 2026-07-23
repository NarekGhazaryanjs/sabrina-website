import { cn } from "@/lib/utils";

interface MediaCardProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function MediaCard({ children, footer, className }: MediaCardProps) {
  return (
    <div className={cn("media-card group", className)}>
      <div className="overflow-hidden">{children}</div>
      {footer && (
        <div className="border-t border-rose-400/10 p-4">{footer}</div>
      )}
    </div>
  );
}
