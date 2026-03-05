import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  preview: ReactNode;
  onClick: () => void;
}

export function FeatureCard({ title, description, preview, onClick }: FeatureCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-stretch rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:border-border/60 hover:shadow-card-hover min-h-[180px]"
    >
      {/* Left: text */}
      <div className="flex flex-col justify-center gap-3 p-6 pr-4 flex-1 min-w-0">
        <div>
          <h3 className="text-base font-medium text-foreground leading-snug">{title}</h3>
          <p className="text-xs text-muted-foreground font-light mt-1.5 leading-relaxed line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>进入</span>
          <ChevronRight className="size-3" />
        </div>
      </div>

      {/* Right: preview */}
      <div className="relative w-[45%] shrink-0 flex items-center justify-center p-3">
        <div className="w-full h-full rounded-xl overflow-hidden bg-background shadow-soft-sm border border-border/20 p-2.5 scale-[0.95] transition-transform duration-300 group-hover:scale-100">
          {preview}
        </div>
      </div>
    </div>
  );
}
