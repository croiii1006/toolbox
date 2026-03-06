import { useState } from 'react';
import { ChevronDown, Play, Eye, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CandidateVideo } from './useSkillsEngine';

interface Props {
  videos: CandidateVideo[];
  onSelect: (video: CandidateVideo) => void;
  selectedVideoId?: string;
}

export function VideoCandidateCollapsible({ videos, onSelect, selectedVideoId }: Props) {
  const [open, setOpen] = useState(false);

  if (videos.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/30 bg-background overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-foreground/60" />
          <span className="text-sm font-medium text-foreground">爆款视频列表</span>
          <span className="text-[10px] text-muted-foreground/60 bg-muted/30 px-1.5 py-0.5 rounded-full">
            {videos.length} 条
          </span>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-muted-foreground/50 transition-transform',
          open && 'rotate-180'
        )} />
      </button>

      {open && (
        <div className="border-t border-border/10 max-h-80 overflow-y-auto">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => onSelect(video)}
              className={cn(
                'w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/20 transition-colors border-b border-border/5 last:border-b-0 text-left',
                selectedVideoId === video.id && 'bg-muted/30'
              )}
            >
              {/* Thumbnail */}
              <div className="w-16 h-10 rounded-md bg-muted/30 overflow-hidden shrink-0 relative">
                <img
                  src={video.cover}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {selectedVideoId === video.id && (
                  <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-foreground flex items-center justify-center">
                      <Play className="w-2 h-2 text-background fill-background" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{video.title}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{video.tags?.slice(0, 2).join(' · ')}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                    <Eye className="w-3 h-3" /> {video.views}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                    <Heart className="w-3 h-3" /> {video.likes}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
