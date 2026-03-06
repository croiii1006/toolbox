import { useRef, useCallback } from 'react';
import { HeroSection } from './app-plaza/HeroSection';

interface AppPlazaProps {
  onNavigate: (itemId: string) => void;
}

export function AppPlaza({ onNavigate }: AppPlazaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div ref={scrollRef} className="min-h-full overflow-y-auto scrollbar-thin" style={{ background: 'radial-gradient(ellipse at 20% 20%, hsla(25, 100%, 92%, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 80% 60%, hsla(340, 80%, 92%, 0.5) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, hsla(0, 0%, 100%, 1) 0%, transparent 60%), hsl(0, 0%, 100%)' }}>
      <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full">
        <HeroSection onNavigate={onNavigate} onScrollTo={scrollTo} />
        <div className="h-16" />
      </div>
    </div>
  );
}
