import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  preview: ReactNode;
  onClick: () => void;
}

export function FeatureCard({ title, description, preview, onClick }: FeatureCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex items-stretch rounded-2xl border border-border/20 bg-background/40 backdrop-blur-xl overflow-hidden cursor-pointer transition-colors duration-300 hover:border-border/40 hover:shadow-soft-lg hover:bg-background/60 min-h-[140px]">
      
      {/* Left: text */}
      <div className="flex flex-col justify-center gap-2 p-4 pr-3 flex-1 min-w-0">
        <div>
          <h3 className="text-base font-medium text-foreground leading-snug">{title}</h3>
          <p className="text-xs text-muted-foreground font-light mt-1.5 leading-relaxed line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-accent font-medium translate-x-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
          <span>进入</span>
          <ChevronRight className="size-3" />
        </div>
      </div>
    </motion.div>
  );
}
