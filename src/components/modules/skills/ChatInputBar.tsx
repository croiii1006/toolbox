import { useState, useRef } from 'react';
import { Plus, Bot, ArrowUp, X, Paperclip, Brain, ChevronDown, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CategoryCascader, CATEGORY_TREE } from './CategoryCascader';

export interface MemoryItem {
  id: string;
  name: string;
  desc: string;
  tag: string;
}

interface ChatInputBarProps {
  onSend: (text: string, image?: string | null, category?: string, memoryIds?: string[]) => void;
  disabled?: boolean;
  memoryItems: MemoryItem[];
}

const MODELS = [
  { id: 'k2.5-agent', label: 'K2.5 Agent 集群' },
  { id: 'k2.5-fast', label: 'K2.5 快速' },
  { id: 'k2.5-pro', label: 'K2.5 专业' },
];

export function ChatInputBar({ onSend, disabled, memoryItems }: ChatInputBarProps) {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [memoryDialogOpen, setMemoryDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((!input.trim() && !image) || disabled) return;
    onSend(input.trim(), image, category || undefined, selectedMemoryIds.length > 0 ? selectedMemoryIds : undefined);
    setInput('');
    setImage(null);
    setImageName(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setImageName(file.name);
    }
    setPlusOpen(false);
  };

  const removeImage = () => {
    setImage(null);
    setImageName(null);
  };

  const toggleMemory = (id: string) => {
    setSelectedMemoryIds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  const hasContent = input.trim() || image;

  return (
    <div className="border-t border-border/20 bg-transparent px-6 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          {/* Left: Image upload box */}
          <div className="shrink-0 pt-0.5">
            {image ? (
              <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden border border-border/60 group">
                <img src={image} alt="Product" className="w-full h-full object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground/70 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-[100px] h-[100px] rounded-xl border-2 border-dashed border-border/40 hover:border-foreground/20 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-5 h-5 text-muted-foreground/50" />
                <span className="text-[10px] text-muted-foreground/50 leading-tight text-center px-2">上传商品白底图</span>
              </button>
            )}
          </div>

          {/* Right: Input area */}
          <div className="flex-1 min-w-0">
            {/* Category selector */}
            <div className="flex items-center gap-2 mb-2">
              <CategoryCascader
                data={CATEGORY_TREE}
                value={category}
                onChange={setCategory}
                placeholder="选择品类"
              />
              {selectedMemoryIds.length > 0 && (
                <Badge variant="secondary" className="text-[10px] h-5 gap-1 font-normal">
                  <Brain className="w-3 h-3" />
                  {selectedMemoryIds.length} 个记忆库
                </Badge>
              )}
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="输入商品卖点，描述产品核心优势..."
              disabled={disabled}
              rows={2}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none disabled:opacity-50 leading-relaxed"
              style={{ minHeight: '48px', maxHeight: '200px' }}
            />
          </div>
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between mt-2 pt-2">
          <div className="flex items-center gap-2">
            {/* Plus menu */}
            <button
              onClick={() => setMemoryDialogOpen(true)}
              className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <Brain className="w-4 h-4" />
            </button>

            {/* Credits display */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>剩余额度 40</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model selector */}
            <Popover open={modelOpen} onOpenChange={setModelOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md">
                  {selectedModel.label}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-44 p-1 rounded-xl" sideOffset={8}>
                {MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                      selectedModel.id === m.id
                        ? 'bg-muted text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!hasContent || disabled}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
                hasContent && !disabled
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'bg-muted/60 text-muted-foreground/40 cursor-not-allowed'
              )}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* Memory selection dialog */}
      <Dialog open={memoryDialogOpen} onOpenChange={setMemoryDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-background/40 backdrop-blur-xl border-border/20">
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
