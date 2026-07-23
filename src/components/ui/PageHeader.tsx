import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-12 text-center", className)}>
      <h1 className="font-display text-4xl font-bold gradient-text md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-lg text-rose-300/60">{subtitle}</p>
      )}
      <div className="divider-glow mt-6" />
    </div>
  );
}
