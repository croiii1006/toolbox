import { useState, useRef, useCallback } from 'react';
import { ArrowUp, X, Play, Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryCascader, CATEGORY_TREE } from '@/components/modules/skills/CategoryCascader';
import logoDark from '@/assets/logo_dark.svg';

export interface HistoryEntry {
  id: string;
  brandName: string;
  category: string;
  competitors: string[];
  date: string;
}

export const MOCK_HISTORY: HistoryEntry[] = [
{
  id: '1',
  brandName: 'AOS',
  category: '美妆个护 > 彩妆 > 口红',
  competitors: ['花西子', 'ColorKey'],
  date: '2024-01-15'
},
{
  id: '2',
  brandName: 'SHEIN',
  category: '服饰鞋包 > 女装 > 连衣裙',
  competitors: ['ZARA', 'H&M', 'Uniqlo'],
  date: '2024-01-10'
}];


interface MarketInsightComposerProps {
  onSubmit: (payload: {
    brandName: string;
    category: string;
    competitors: string[];
  }) => void;
  disabled?: boolean;
  initialData?: {brandName: string;category: string;competitors: string[];};
}

export function MarketInsightComposer({ onSubmit, disabled, initialData }: MarketInsightComposerProps) {
  const [brandName, setBrandName] = useState(initialData?.brandName || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [competitors, setCompetitors] = useState<string[]>(initialData?.competitors || []);
  const [competitorInput, setCompetitorInput] = useState('');
  const competitorInputRef = useRef<HTMLInputElement>(null);

  const canSend = brandName.trim() && category.trim() && competitors.length > 0;

  const handleSend = useCallback(() => {
    if (!canSend || disabled) return;
    onSubmit({
      brandName: brandName.trim(),
      category,
      competitors
    });
  }, [canSend, disabled, brandName, category, competitors, onSubmit]);

  const addCompetitor = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !competitors.includes(trimmed)) {
      setCompetitors((prev) => [...prev, trimmed]);
    }
    setCompetitorInput('');
  };

  const removeCompetitor = (name: string) => {
    setCompetitors((prev) => prev.filter((c) => c !== name));
  };

  const handleCompetitorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (competitorInput.trim()) {
        addCompetitor(competitorInput);
      } else {
        handleSend();
      }
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-8 py-[80px]">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-normal text-foreground tracking-tight">
            品牌健康度分析
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            输入品牌与品类信息，一键生成洞察报告
          </p>
        </div>

        {/* Composer Card */}
        <div className="relative rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm shadow-sm transition-shadow hover:shadow-md">
          <div className="p-5">
            {/* Fixed sentence structure with inline inputs */}
            <div className="flex items-center flex-wrap gap-y-2 text-sm text-foreground/70 leading-relaxed">
              <span className="whitespace-nowrap">为我生成</span>

              {/* Brand name - inline input */}
              <input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="品牌名称"
                className={cn(
                  'mx-1.5 px-2.5 h-7 bg-muted/20 border border-border/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring/20 transition-colors',
                  'w-[100px]'
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }} />
              

              <span className="whitespace-nowrap">，</span>

              {/* Category - chip cascader */}
              <CategoryCascader
                data={CATEGORY_TREE}
                value={category}
                onChange={setCategory}
                placeholder="选择品类"
                className="h-7 rounded-lg px-2.5 text-sm mx-1" />
              

              <span className="whitespace-nowrap">，</span>

              {/* Competitors inline area */}
              <div className="inline-flex items-center gap-1 flex-wrap mx-1.5">
                {competitors.map((c) =>
                <span
                  key={c}
                  className="inline-flex items-center gap-1 h-6 rounded-full bg-muted/40 border border-border/20 px-2 text-xs text-foreground/80">
                  
                    {c}
                    <button
                    onClick={() => removeCompetitor(c)}
                    className="hover:text-foreground transition-colors">
                    
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <input
                  ref={competitorInputRef}
                  value={competitorInput}
                  onChange={(e) => setCompetitorInput(e.target.value)}
                  onKeyDown={handleCompetitorKeyDown}
                  onBlur={() => { if (competitorInput.trim()) addCompetitor(competitorInput); }}
                  placeholder={competitors.length === 0 ? '输入竞品，回车添加' : '添加竞品...'}
                  className="h-6 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none w-[120px]" />
                
              </div>

              <span className="whitespace-nowrap">的洞察报告</span>
            </div>
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border/20">
            <div className="flex items-center gap-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/8 text-accent/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/60 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent/80" />
                </span>
                <span className="text-[11px] font-medium">联网搜索中</span>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!canSend || disabled}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                canSend && !disabled ?
                'bg-foreground text-background hover:bg-foreground/90' :
                'bg-muted/60 text-muted-foreground/40 cursor-not-allowed'
              )}>
              
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/40 mt-4">
          Enter 发送
        </p>

        {/* Case Card */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://haifeisianalysis.photog.art/"
            target="_blank"
            rel="noreferrer"
            className="block relative group w-full max-w-[350px] cursor-pointer">
            
            {/* Shadow */}
            <div className="absolute -right-3 -bottom-3 h-[70%] w-[70%] rounded-[50px] bg-[radial-gradient(60%_60%_at_100%_100%,rgba(0,0,0,0.18),rgba(0,0,0,0))] blur-[16px] z-0" aria-hidden="true" />

            {/* Main card */}
            <div className="relative overflow-hidden bg-muted/40 dark:bg-muted/20 rounded-[20px] backdrop-blur-[5px] z-10 border border-border/20">
              {/* Floating mini report card */}
              <div className="absolute flex items-center justify-center right-[-14px] top-[2px] w-[113px] z-10 transition-transform duration-300 ease-out group-hover:translate-x-[-8px] group-hover:translate-y-[-6px]">
                <div className="flex-none rotate-[-6deg] transition-transform duration-300 ease-out group-hover:rotate-[-4deg]">
                  <div className="bg-background overflow-hidden rounded-[4px] shadow-[0px_2px_20px_0px_rgba(35,35,35,0.2)] w-[100px] h-[130px] relative">
                    <div className="flex items-center gap-[3px] px-[6px] py-[4px]">
                      <div className="w-[3px] h-[3px] rounded-full bg-destructive" />
                      <div className="w-[3px] h-[3px] rounded-full bg-yellow-400" />
                      <div className="w-[3px] h-[3px] rounded-full bg-green-400" />
                    </div>
                    <div className="flex items-start gap-[4px] px-[6px] pt-[2px] pb-[4px]">
                      <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                        <p className="font-semibold leading-normal line-clamp-1 text-[6px] text-foreground">海飞丝市场洞察深度报告</p>
                        <div className="flex items-center gap-[2px]">
                          <div className="w-[7px] h-[7px] rounded-full overflow-hidden bg-muted">
                            <img alt="OranAI" src={logoDark} className="w-full h-full object-contain" />
                          </div>
                          <p className="font-medium leading-normal text-[5px] text-muted-foreground truncate">OranAI</p>
                        </div>
                        <div className="flex items-center gap-[2.667px]">
                          <div className="flex items-center gap-px">
                            <Play className="w-[4px] h-[4px] text-muted-foreground fill-muted-foreground" />
                            <p className="font-medium text-[4px] text-muted-foreground">1080w</p>
                          </div>
                          <div className="flex items-center gap-px">
                            <Heart className="w-[4px] h-[4px] text-muted-foreground" />
                            <p className="font-medium text-[4px] text-muted-foreground">28w</p>
                          </div>
                          <div className="flex items-center gap-px">
                            <MessageSquare className="w-[4px] h-[4px] text-muted-foreground" />
                            <p className="font-medium text-[4px] text-muted-foreground">12w</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-[90px] rounded-[4px] mx-[6px] mb-[6px] overflow-hidden">
                      <img alt="" className="absolute inset-0 max-w-none object-cover w-full h-full" src="/haifeisi.jpg" />
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-muted to-transparent" />
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[20px] bg-foreground/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-background text-[12px] leading-[1.4] font-medium">点击查看洞察报告案例</p>
              </div>

              {/* Bottom text area */}
              <div className="relative h-[150px]">
                <div className="absolute left-0 bottom-0 flex flex-col gap-[6px] items-start justify-end p-[18px] py-[13px] w-full">
                  <div className="relative shrink-0 w-[232px] whitespace-pre-wrap mb-0 group-hover:opacity-0 transition-opacity duration-200">
                    <p className="font-medium leading-[1.35] text-[16px] text-foreground">海飞丝市场洞察深度报告</p>
                    <p className="mt-[8px] font-normal leading-[1.35] text-[12px] text-muted-foreground">整合宏观趋势、全球化市场、人群画像、和竞品分析</p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>);

}