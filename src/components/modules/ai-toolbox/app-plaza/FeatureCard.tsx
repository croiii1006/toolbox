import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface FeatureCardProps {
  icon: ReactNode;
  index: string;
  title: string;
  description: string;
  previewImage: string;
  onClick: () => void;
}

export function FeatureCard({ icon, index, title, description, previewImage, onClick }: FeatureCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-stretch rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:border-border/60 hover:shadow-card-hover"
    >
      {/* Left: text */}
      <div className="flex flex-col justify-center gap-3 p-6 pr-4 flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-9 rounded-xl bg-accent/10 text-accent shrink-0">
            {icon}
          </div>
          <span className="text-xs text-muted-foreground font-light">{index}</span>
        </div>
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
        <div className="w-full h-full rounded-xl overflow-hidden bg-muted/50 shadow-soft-sm">
          <img
            src={previewImage}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
