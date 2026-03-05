import { useState, useMemo, useRef } from 'react';
import {
  Database, Plus, Search, Download, X, Edit2, Trash2,
  Tag, FileText, Package, Users, Target, MoreHorizontal, Upload } from
'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from
'@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useMemory, MemoryEntry } from '@/contexts/MemoryContext';

const CATEGORIES = [
{ id: 'brand', label: '品牌信息', icon: Package },
{ id: 'product', label: '产品知识', icon: FileText },
{ id: 'competitor', label: '竞品分析', icon: Users },
{ id: 'strategy', label: '营销策略', icon: Target },
{ id: 'other', label: '其他', icon: Tag }];


const categoryMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemoryLibraryDrawer({ open, onOpenChange }: Props) {
  const { entries, addEntry, updateEntry, deleteEntry, importEntries } = useMemory();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editEntry, setEditEntry] = useState<MemoryEntry | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    let list = entries;
    if (activeCategory !== 'all') list = list.filter((e) => e.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q) || e.tags.some((t) => t.includes(q)));
    }
    return list;
  }, [entries, activeCategory, search]);

  const openNew = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      // Try JSON array import
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        importEntries(parsed);
      } else {
        // Single object
        addEntry({
          title: parsed.title || file.name.replace(/\.[^/.]+$/, ''),
          content: parsed.content || text,
          category: parsed.category || 'other',
          tags: parsed.tags || [],
        });
      }
    } catch {
      // Plain text file — create entry from file content
      addEntry({
        title: file.name.replace(/\.[^/.]+$/, ''),
        content: text,
        category: 'other',
        tags: [],
      });
    }
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openEdit = (entry: MemoryEntry) => {
    setEditEntry({ ...entry });
    setEditDialogOpen(true);
  };

  const saveEntry = () => {
    if (!editEntry) return;
    if (editEntry.id) {
      updateEntry(editEntry);
    } else {
      addEntry({ title: editEntry.title, content: editEntry.content, category: editEntry.category, tags: editEntry.tags });
    }
    setEditDialogOpen(false);
    setEditEntry(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;a.download = 'memory-library.json';a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text) as MemoryEntry[];
        if (Array.isArray(data)) importEntries(data);
      } catch {/* ignore */}
    };
    input.click();
  };

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: entries.length };
    CATEGORIES.forEach((c) => {map[c.id] = 0;});
    entries.forEach((e) => {map[e.category] = (map[e.category] || 0) + 1;});
    return map;
  }, [entries]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col gap-0 [&>button]:hidden">
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-border space-y-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-base">
                <Database className="w-4.5 h-4.5" />
                记忆库
              </SheetTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="搜索记忆条目..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm bg-muted/50 border-border/50" />
            </div>
          </SheetHeader>

          <div className="px-5 pt-3 pb-1 flex gap-1.5 flex-wrap">
            <button onClick={() => setActiveCategory('all')} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
              全部 {categoryCounts.all}
            </button>
            {CATEGORIES.map((c) =>
            <button key={c.id} onClick={() => setActiveCategory(c.id)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', activeCategory === c.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                {c.label} {categoryCounts[c.id] || 0}
              </button>
            )}
          </div>

          <ScrollArea className="flex-1 px-5 py-3">
            <div className="space-y-2">
              {filtered.length === 0 && <div className="text-center py-16 text-muted-foreground text-sm">暂无记忆条目</div>}
              {filtered.map((entry) => {
                const cat = categoryMap[entry.category];
                const CatIcon = cat?.icon || Tag;
                return (
                  <div key={entry.id} className="rounded-xl border border-border/50 bg-card p-4 hover:shadow-sm transition-shadow cursor-pointer group" onClick={() => openEdit(entry)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <CatIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">{entry.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{cat?.label || entry.category}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem onClick={(e) => {e.stopPropagation();openEdit(entry);}}>
                            <Edit2 className="w-3.5 h-3.5 mr-2" /> 编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={(e) => {e.stopPropagation();setDeleteConfirm(entry.id);}}>
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> 删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-xs text-foreground/70 mt-2 line-clamp-2 leading-relaxed">{entry.content}</p>
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      {entry.tags.map((tag) =>
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">{tag}</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto">{entry.updatedAt}</span>
                    </div>
                  </div>);

              })}
            </div>
          </ScrollArea>

          <div className="px-5 py-3 border-t border-border">
            <input ref={fileInputRef} type="file" accept=".json,.txt,.md,.csv" className="hidden" onChange={handleFileImport} />
            <Button onClick={openNew} className="w-full h-10 rounded-xl gap-2 font-medium">
              <Upload className="w-4 h-4" />
              导入记忆条目
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editEntry?.id ? '编辑记忆' : '新增记忆'}</DialogTitle>
          </DialogHeader>
          {editEntry &&
          <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">标题</label>
                <Input value={editEntry.title} onChange={(e) => setEditEntry({ ...editEntry, title: e.target.value })} placeholder="输入标题" className="h-9" maxLength={100} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">分类</label>
                <Select value={editEntry.category} onValueChange={(v) => setEditEntry({ ...editEntry, category: v })}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">内容</label>
                <Textarea value={editEntry.content} onChange={(e) => setEditEntry({ ...editEntry, content: e.target.value })} placeholder="输入记忆内容..." className="min-h-[120px] text-sm" maxLength={2000} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">标签（逗号分隔）</label>
                <Input value={editEntry.tags.join(', ')} onChange={(e) => setEditEntry({ ...editEntry, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} placeholder="标签1, 标签2" className="h-9" />
              </div>
            </div>
          }
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>取消</Button>
            <Button onClick={saveEntry} disabled={!editEntry?.title.trim()}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>确认删除</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">删除后无法恢复，确定要删除这条记忆吗？</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>取消</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && (deleteEntry(deleteConfirm), setDeleteConfirm(null))}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>);

}