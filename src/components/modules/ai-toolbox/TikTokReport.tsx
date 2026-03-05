import { useState } from 'react';
import { TikTokReportComposer } from './TikTokReportComposer';
import { TikTokReportResults } from './TikTokReportResults';
import { useTikTokInspiration } from '@/contexts/TikTokInspirationContext';
import { useReplicatePrefill } from '@/contexts/ReplicatePrefillContext';
import { Clock, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TikTokReportProps {
  onNavigate?: (itemId: string) => void;
}

export function TikTokReport({ onNavigate }: TikTokReportProps) {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState('');
  const [sellingPoints, setSellingPoints] = useState<string[]>([]);
  const { reportHistory, addReportHistory, deleteReportHistory } = useTikTokInspiration();
  const { setPrefill } = useReplicatePrefill();

  const handleSubmit = (payload: { category: string; sellingPoints: string[] }) => {
    setCategory(payload.category);
    setSellingPoints(payload.sellingPoints);
    addReportHistory({
      category: payload.category,
      sellingPoints: payload.sellingPoints,
      videoCount: 6, // mock count
    });
    setSubmitted(true);
  };

  const handleBack = () => {
    setSubmitted(false);
  };

  const handleReplicate = (videoId: string) => {
    // Find video's original URL and pass selling points to replicate workspace
    setPrefill({
      tiktokLink: `https://www.tiktok.com/video/${videoId}`,
      sellingPoints,
      autoStart: true,
    });
    onNavigate?.('replicate-video');
  };

  const handleRefresh = () => {
    console.log('Refresh videos for:', { category, sellingPoints });
  };

  const handleRestoreHistory = (item: { category: string; sellingPoints: string[] }) => {
    setCategory(item.category);
    setSellingPoints(item.sellingPoints);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <TikTokReportResults
        category={category}
        sellingPoints={sellingPoints}
        onBack={handleBack}
        onReplicate={handleReplicate}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <TikTokReportComposer onSubmit={handleSubmit} />

      {/* History section */}
      {reportHistory.length > 0 && (
        <div className="w-full max-w-2xl mx-auto px-6 pb-8 -mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground/50" />
            <h3 className="text-sm font-medium text-muted-foreground/70">历史记录</h3>
          </div>
          <div className="space-y-2">
            {reportHistory.map(item => (
              <div
                key={item.id}
                className="group flex items-center gap-3 rounded-xl border border-border/20 bg-card/60 px-4 py-3 hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => handleRestoreHistory(item)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-foreground/80">{item.category}</span>
                    {item.sellingPoints.map(p => (
                      <span key={p} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/40 text-muted-foreground">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground/50">
                    <span>{new Date(item.createdAt).toLocaleString('zh-CN')}</span>
                    <span>·</span>
                    <span>{item.videoCount} 个视频</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteReportHistory(item.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-muted/40 transition-all"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground/50" />
                </button>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
