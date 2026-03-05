import { useState, useRef, useCallback, useMemo } from 'react';
import { ArrowUp, X, ChevronDown, Check, Play, Heart, MessageSquare, Database } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logoDark from '@/assets/logo_dark.svg';
import { useMemory } from '@/contexts/MemoryContext';

/* ─── Types ─── */
export interface CampaignPayload {
  brandName: string;
  goal: string;
  audience: string[];
  sellingPoints: string[];
  budget: string;
  channels: string[];
  cycle: string;
}

/* ─── Constants ─── */
const GOALS = ['品牌升级', '销量增长', '新品发布', '节点营销', '用户拉新'];
const BUDGETS = ['S级全域战役', 'A级核心爆破', 'B级日常种草'];
const CHANNELS = ['抖音', '小红书', '邮件'];
const CYCLES = ['Q1', 'Q2', 'Q3', 'Q4', '全年', '双11节点', '618节点'];

/* ─── Inline picker (extracted outside to avoid remount) ─── */
function InlinePicker({
  options, value, onChange, placeholder, show, setShow,
}: {
  options: string[]; value: string; onChange: (v: string) => void;
  placeholder: string; show: boolean; setShow: (v: boolean) => void;
}) {
  return (
    <div className="relative inline-block mx-1">
      <button
        onClick={() => setShow(!show)}
        className={cn(
          'inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border text-sm transition-colors',
          value
            ? 'bg-accent/10 border-accent/20 text-accent font-medium'
            : 'bg-muted/20 border-border/30 text-muted-foreground/60 hover:border-border/60'
        )}
      >
        {value || placeholder}
        <ChevronDown className="w-3 h-3" />
      </button>
      {show && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShow(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 bg-popover border border-border/30 rounded-xl shadow-lg p-1 min-w-[140px]">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setShow(false); }}
                className={cn(
                  'w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-2',
                  opt === value ? 'bg-accent/10 text-accent font-medium' : 'hover:bg-muted/40 text-foreground/70'
                )}
              >
                {opt === value && <Check className="w-3 h-3" />}
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Tag input component (extracted outside to avoid remount) ─── */
function TagInput({
  tags, input, setInput, onAdd, onRemove, placeholder, inputRef, onEmptyEnter,
}: {
  tags: string[]; input: string; setInput: (v: string) => void;
  onAdd: (v: string) => void; onRemove: (v: string) => void;
  placeholder: string; inputRef?: React.RefObject<HTMLInputElement>;
  onEmptyEnter?: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 flex-wrap mx-1.5">
      {tags.map(t => (
        <span key={t} className="inline-flex items-center gap-1 h-6 rounded-full bg-accent/10 border border-accent/20 px-2 text-xs text-accent font-medium">
          {t}
          <button onClick={() => onRemove(t)} className="hover:text-accent/70 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (input.trim()) onAdd(input);
            else onEmptyEnter?.();
          }
        }}
        onBlur={() => { if (input.trim()) onAdd(input); }}
        placeholder={tags.length === 0 ? placeholder : '添加更多...'}
        className="h-6 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none min-w-[120px] flex-1"
      />
    </div>
  );
}

interface CampaignPlannerComposerProps {
  onSubmit: (payload: CampaignPayload) => void;
  disabled?: boolean;
  initialData?: CampaignPayload;
}

export function CampaignPlannerComposer({ onSubmit, disabled, initialData }: CampaignPlannerComposerProps) {
  const { entries } = useMemory();
  const memoryItems = useMemo(() => entries.map((e) => ({
    id: e.id, name: e.title, desc: e.content.slice(0, 60), tag: e.category,
  })), [entries]);
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);
  const [memoryDialogOpen, setMemoryDialogOpen] = useState(false);
  const [brandName, setBrandName] = useState(initialData?.brandName || '');
  const [goal, setGoal] = useState(initialData?.goal || '');
  const [audience, setAudience] = useState<string[]>(initialData?.audience || []);
  const [audienceInput, setAudienceInput] = useState('');
  const [sellingPoints, setSellingPoints] = useState<string[]>(initialData?.sellingPoints || []);
  const [spInput, setSpInput] = useState('');
  const [budget, setBudget] = useState(initialData?.budget || '');
  const [channels, setChannels] = useState<string[]>(initialData?.channels || ['抖音', '小红书']);
  const [cycle, setCycle] = useState(initialData?.cycle || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [showBudgetPicker, setShowBudgetPicker] = useState(false);
  const [showCyclePicker, setShowCyclePicker] = useState(false);

  const audienceRef = useRef<HTMLInputElement>(null);
  const spRef = useRef<HTMLInputElement>(null);

  const canSend = brandName.trim() && goal && audience.length > 0 && sellingPoints.length > 0;

  const handleSend = useCallback(() => {
    if (!canSend || disabled) return;
    onSubmit({ brandName: brandName.trim(), goal, audience, sellingPoints, budget, channels, cycle });
  }, [canSend, disabled, brandName, goal, audience, sellingPoints, budget, channels, cycle, onSubmit]);

  const toggleMemory = (id: string) => {
    setSelectedMemoryIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const addTag = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) setList(prev => [...prev, trimmed]);
    setInput('');
  };

  const removeTag = (value: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prev => prev.filter(t => t !== value));
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-8 py-[80px]">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-normal text-foreground tracking-tight">
            策划方案
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            输入品牌与营销目标，AI 一键生成营销策划方案
          </p>
        </div>

        {/* Composer Card */}
        <div className="relative rounded-2xl border border-border/30 bg-card/80 backdrop-blur-sm shadow-sm transition-shadow hover:shadow-md">
          <div className="p-5 space-y-3">
            {/* Row 1: Brand + Goal */}
            <div className="flex items-center flex-wrap gap-y-2 text-sm text-foreground/70 leading-relaxed">
              <span className="whitespace-nowrap">为</span>
              <input
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="品牌名称"
                className="mx-1.5 px-2.5 h-7 bg-muted/20 border border-border/30 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring/20 transition-colors w-[100px]"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
              />
              <span className="whitespace-nowrap">制定</span>
              <InlinePicker
                options={GOALS}
                value={goal}
                onChange={setGoal}
                placeholder="营销目标"
                show={showGoalPicker}
                setShow={setShowGoalPicker}
              />
              <span className="whitespace-nowrap">策划方案</span>
            </div>

            {/* Row 2: Audience + Selling Points */}
            <div className="flex items-center flex-wrap gap-y-2 text-sm text-foreground/70 leading-relaxed">
              <span className="whitespace-nowrap">目标人群</span>
              <TagInput
                tags={audience}
                input={audienceInput}
                setInput={setAudienceInput}
                onAdd={v => addTag(v, audience, setAudience, setAudienceInput)}
                onRemove={v => removeTag(v, setAudience)}
                placeholder="如：18-25岁大学生、熬夜党"
                inputRef={audienceRef}
                onEmptyEnter={handleSend}
              />
              <span className="whitespace-nowrap">，核心卖点</span>
              <TagInput
                tags={sellingPoints}
                input={spInput}
                setInput={setSpInput}
                onAdd={v => addTag(v, sellingPoints, setSellingPoints, setSpInput)}
                onRemove={v => removeTag(v, setSellingPoints)}
                placeholder="如：温和不刺激、医生推荐"
                inputRef={spRef}
                onEmptyEnter={handleSend}
              />
            </div>

            {/* Row 4: Budget */}
            <div className="flex items-center flex-wrap gap-y-2 text-sm text-foreground/70 leading-relaxed">
              <span className="whitespace-nowrap">预算量级</span>
              <InlinePicker
                options={BUDGETS}
                value={budget}
                onChange={setBudget}
                placeholder="选择量级"
                show={showBudgetPicker}
                setShow={setShowBudgetPicker}
              />
            </div>

            {/* Advanced settings toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <ChevronDown className={cn('w-3 h-3 transition-transform', showAdvanced && 'rotate-180')} />
              高级设置 (选填)
            </button>

            {showAdvanced && (
              <div className="space-y-3 pt-1 border-t border-border/10">
                {/* Channels */}
                <div className="flex items-center flex-wrap gap-y-2 text-sm text-foreground/70 leading-relaxed">
                  <span className="whitespace-nowrap text-xs text-muted-foreground mr-2">主攻渠道</span>
                  <div className="flex items-center gap-1.5">
                    {CHANNELS.map(ch => {
                      const selected = channels.includes(ch);
                      const comingSoon = ch === '邮件';
                      const btn = (
                        <button
                          key={ch}
                          onClick={() => {
                            if (comingSoon) return;
                            setChannels(prev =>
                              selected ? prev.filter(c => c !== ch) : [...prev, ch]
                            );
                          }}
                          className={cn(
                            'px-2.5 py-1 rounded-full text-[11px] transition-all flex items-center gap-1',
                            selected
                              ? 'bg-accent/10 border border-accent/20 text-accent font-medium'
                              : comingSoon
                                ? 'bg-muted/30 text-muted-foreground/40 cursor-not-allowed border border-transparent'
                                : 'bg-muted/30 text-muted-foreground/60 hover:bg-foreground/5 border border-transparent'
                          )}
                        >
                          {selected && <Check className="w-3 h-3" />}
                          {ch}
                        </button>
                      );
                      if (comingSoon) {
                        return (
                          <Tooltip key={ch}>
                            <TooltipTrigger asChild>{btn}</TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">Coming soon</TooltipContent>
                          </Tooltip>
                        );
                      }
                      return btn;
                    })}
                  </div>
                </div>

                {/* Cycle */}
                <div className="flex items-center flex-wrap gap-y-2 text-sm text-foreground/70 leading-relaxed">
                  <span className="whitespace-nowrap text-xs text-muted-foreground mr-2">营销周期</span>
                  <InlinePicker
                    options={CYCLES}
                    value={cycle}
                    onChange={setCycle}
                    placeholder="选择周期"
                    show={showCyclePicker}
                    setShow={setShowCyclePicker}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border/20">
            <div className="flex items-center gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/8 text-accent/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/60 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent/80" />
                </span>
                <span className="text-[11px] font-medium">联网搜索中</span>
              </div>
              <button
                onClick={() => setMemoryDialogOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/30 text-muted-foreground/60 hover:bg-foreground/5 hover:text-muted-foreground transition-colors"
              >
                <Database className="w-3 h-3" />
                <span className="text-[11px]">记忆库{selectedMemoryIds.length > 0 ? ` (${selectedMemoryIds.length})` : ''}</span>
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!canSend || disabled}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                canSend && !disabled
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'bg-muted/60 text-muted-foreground/40 cursor-not-allowed'
              )}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/40 mt-4">Enter 发送</p>

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
                        <p className="font-semibold leading-normal line-clamp-1 text-[6px] text-foreground">海飞丝营销策划方案</p>
                        <div className="flex items-center gap-[2px]">
                          <div className="w-[7px] h-[7px] rounded-full overflow-hidden bg-muted">
                            <img alt="OranAI" src={logoDark} className="w-full h-full object-contain" />
                          </div>
                          <p className="font-medium leading-normal text-[5px] text-muted-foreground truncate">OranAI</p>
                        </div>
                        <div className="flex items-center gap-[2.667px]">
                          <div className="flex items-center gap-px">
                            <Play className="w-[4px] h-[4px] text-muted-foreground fill-muted-foreground" />
                            <p className="font-medium text-[4px] text-muted-foreground">860w</p>
                          </div>
                          <div className="flex items-center gap-px">
                            <Heart className="w-[4px] h-[4px] text-muted-foreground" />
                            <p className="font-medium text-[4px] text-muted-foreground">22w</p>
                          </div>
                          <div className="flex items-center gap-px">
                            <MessageSquare className="w-[4px] h-[4px] text-muted-foreground" />
                            <p className="font-medium text-[4px] text-muted-foreground">9w</p>
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
                <p className="text-background text-[12px] leading-[1.4] font-medium">点击查看策划方案案例</p>
              </div>

              {/* Bottom text area */}
              <div className="relative h-[150px]">
                <div className="absolute left-0 bottom-0 flex flex-col gap-[6px] items-start justify-end p-[18px] py-[13px] w-full">
                  <div className="relative shrink-0 w-[232px] whitespace-pre-wrap mb-0 group-hover:opacity-0 transition-opacity duration-200">
                    <p className="font-medium leading-[1.35] text-[16px] text-foreground">海飞丝营销策划方案</p>
                    <p className="mt-[8px] font-normal leading-[1.35] text-[12px] text-muted-foreground">涵盖品牌定位、渠道策略、内容规划与预算分配</p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
      {/* Memory selection dialog */}
      <Dialog open={memoryDialogOpen} onOpenChange={setMemoryDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">选择记忆库</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 mt-2 max-h-[50vh] overflow-y-auto scrollbar-thin">
            {memoryItems.map(item => {
              const selected = selectedMemoryIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleMemory(item.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all',
                    selected
                      ? 'border-foreground/20 bg-foreground/[0.03]'
                      : 'border-border/30 hover:border-border/60'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
                        selected ? 'border-foreground bg-foreground' : 'border-border'
                      )}>
                        {selected && <Check className="w-3 h-3 text-background" />}
                      </div>
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">{item.tag}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-[30px]">{item.desc}</p>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end mt-3">
            <Button
              onClick={() => setMemoryDialogOpen(false)}
              size="sm"
              className="rounded-lg h-8 px-5 bg-foreground text-background hover:bg-foreground/90 text-xs"
            >
              确认 ({selectedMemoryIds.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
