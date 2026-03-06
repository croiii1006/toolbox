import { Play, ChevronRight } from 'lucide-react';
import { CandidateVideo } from './useSkillsEngine';

interface Props {
  videos: CandidateVideo[];
  onShowPanel: () => void;
}

export function VideoCandidateCollapsible({ videos, onShowPanel }: Props) {
  if (videos.length === 0) return null;

  return (
    <button
      onClick={onShowPanel}
      className="w-full rounded-xl border border-border/30 bg-background px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Play className="w-4 h-4 text-foreground/60" />
        <span className="text-sm font-medium text-foreground">爆款视频列表</span>
        <span className="text-[10px] text-muted-foreground/60 bg-muted/30 px-1.5 py-0.5 rounded-full">
          {videos.length} 条
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
    </button>
  );
}