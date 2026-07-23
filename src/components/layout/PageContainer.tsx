import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export function PageContainer({
  children,
  className,
  narrow,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 py-16 md:py-24",
        narrow ? "max-w-3xl" : "max-w-6xl",
        className
      )}
    >
      {children}
    </div>
  );
}
