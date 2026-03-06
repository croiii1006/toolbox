import { useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useMemory } from '@/contexts/MemoryContext';
import { useSkillsEngine, CandidateVideo } from './useSkillsEngine';
import { SetupSummary } from './SetupSummary';
import { ChecklistCard } from './ChecklistCard';
import { VideoCandidateCollapsible } from './VideoCandidateCollapsible';
import { VideoCandidateRow } from './VideoCandidateRow';
import { PromptEditorBlock } from './PromptEditorBlock';
import { ResultPreviewBlock } from './ResultPreviewBlock';
import { TaskDetailPanel } from './TaskDetailPanel';

import { ChatInputBar } from './ChatInputBar';
import { Loader2, Zap, CheckCircle2, SkipForward, RefreshCw, ArrowLeft, Clapperboard, PartyPopper, Search, ListChecks, Check, ChevronRight } from 'lucide-react';

export function SkillsModule() {
  const {
    state,
    CATEGORIES,
    completeSetup,
    refreshCandidates,
    selectVideo,
    updatePrompt,
    confirmGenerate,
    setActiveTaskId,
    handleUserInput,
    resetSession
  } = useSkillsEngine();

  const { entries } = useMemory();
  const memoryItems = useMemo(() => entries.map((e) => ({
    id: e.id,
    name: e.title,
    desc: e.content.slice(0, 60) + (e.content.length > 60 ? '...' : ''),
    tag: e.category
  })), [entries]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [state.messages.length]);

  const activeTask = state.tasks.find((t) => t.id === state.activeTaskId);

  // Determine if right panel should show
  const hasVideoCandidates = state.candidateVideos.length > 0;
  const showRightPanel = activeTask || hasVideoCandidates;

  const handleSend = (text: string, image?: string | null, category?: string, memoryIds?: string[]) => {
    if (!state.setupCompleted && (image || text)) {
      completeSetup({
        image: image || null,
        imageName: image ? 'uploaded-image' : null,
        memoryEnabled: memoryIds && memoryIds.length > 0 || false,
        selectedMemoryIds: memoryIds || [],
        sellingPoints: text || '',
        category: category || '其它'
      });
    } else {
      handleUserInput(text);
    }
  };

  const handleVideoSelect = (video: CandidateVideo) => {
    selectVideo(video);
  };

  const renderMessage = (msg: typeof state.messages[0]) => {
    switch (msg.type) {
      case 'setup-summary':{
          const setup = JSON.parse(msg.content);
          return <SetupSummary key={msg.id} setup={setup} />;
        }
      case 'checklist':
        return (
          <ChecklistCard
            key={msg.id}
            tasks={state.tasks}
            onTaskClick={setActiveTaskId}
            activeTaskId={state.activeTaskId} />);


      case 'task-subtask-list':{
          const parentTask = state.tasks.find((t) => t.id === msg.content);
          if (!parentTask || parentTask.children.length === 0) return null;
          return (
            <div key={msg.id} className="rounded-xl border border-border/20 bg-muted/10 overflow-hidden">
            <button
                onClick={() => setActiveTaskId(parentTask.id)}
                className="w-full px-3 py-2 border-b border-border/10 flex items-center gap-2 hover:bg-muted/20 transition-colors">
                
              <ListChecks className="w-3.5 h-3.5 text-foreground/50" />
              <span className="text-xs font-medium text-foreground/70">{parentTask.title}</span>
              <span className="text-[10px] text-muted-foreground/50 ml-auto">
                {parentTask.children.filter((c) => c.status === 'done').length}/{parentTask.children.length}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />
            </button>
            <div className="px-3 py-1.5">
              {parentTask.children.map((child) =>
                <button
                  key={child.id}
                  onClick={() => setActiveTaskId(parentTask.id)}
                  className="w-full flex items-center gap-2 py-1.5 px-1 rounded-md hover:bg-muted/20 transition-colors">
                  
                  {child.status === 'done' ?
                  <div className="w-4 h-4 rounded-full bg-foreground flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-background" strokeWidth={2.5} />
                    </div> :
                  child.status === 'running' ?
                  <Loader2 className="w-4 h-4 text-foreground animate-spin shrink-0" /> :

                  <div className="w-4 h-4 rounded-full border border-border/30 shrink-0" />
                  }
                  <span className={cn(
                    'text-xs',
                    child.status === 'done' ? 'text-foreground/70' : 'text-muted-foreground/50'
                  )}>{child.title}</span>
                </button>
                )}
            </div>
          </div>);

        }
      case 'video-candidates':
        return (
          <VideoCandidateCollapsible
            key={msg.id}
            videos={state.candidateVideos}
            onSelect={handleVideoSelect}
            selectedVideoId={state.selectedVideo?.id}
          />
        );
      case 'video-gen-status': {
          const content = msg.content;
          let icon = null;
          let cleanContent = content;
          if (content.startsWith('✅')) {
            icon = <CheckCircle2 className="w-4 h-4 text-foreground shrink-0 mt-0.5" />;
            cleanContent = content.slice(2).trim();
          } else if (content.startsWith('🎉')) {
            icon = <PartyPopper className="w-4 h-4 text-foreground shrink-0 mt-0.5" />;
            cleanContent = content.slice(2).trim();
          }
          return (
            <div key={msg.id} className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed animate-fade-in">
              {icon}
              <span>{cleanContent}</span>
            </div>
          );
        }
      case 'prompt-editor':
        return (
          <PromptEditorBlock
            key={msg.id}
            prompt={state.generatedPrompt}
            onChange={updatePrompt}
            onConfirm={confirmGenerate}
            onBack={() => {}}
            memoryEnabled={state.setup.memoryEnabled} />);


      case 'result-preview':
        return <ResultPreviewBlock key={msg.id} />;
      case 'text':
      default:{
          const content = msg.content;
          let icon = null;
          let cleanContent = content;

          if (content.startsWith('✅')) {
            icon = <CheckCircle2 className="w-4 h-4 text-foreground shrink-0 mt-0.5" />;
            cleanContent = content.slice(2).trim();
          } else if (content.startsWith('⏭️')) {
            icon = <SkipForward className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />;
            cleanContent = content.slice(3).trim();
          } else if (content.startsWith('🔄')) {
            icon = <RefreshCw className="w-4 h-4 text-foreground/60 shrink-0 mt-0.5" />;
            cleanContent = content.slice(2).trim();
          } else if (content.startsWith('🔙')) {
            icon = <ArrowLeft className="w-4 h-4 text-foreground/60 shrink-0 mt-0.5" />;
            cleanContent = content.slice(2).trim();
          } else if (content.startsWith('🎬')) {
            icon = <Clapperboard className="w-4 h-4 text-foreground/60 shrink-0 mt-0.5" />;
            cleanContent = content.slice(2).trim();
          } else if (content.startsWith('🎉')) {
            icon = <PartyPopper className="w-4 h-4 text-foreground shrink-0 mt-0.5" />;
            cleanContent = content.slice(2).trim();
          } else if (content.startsWith('🔍') || content.startsWith('🎯')) {
            icon = <Search className="w-4 h-4 text-foreground/60 shrink-0 mt-0.5" />;
            cleanContent = content.slice(2).trim();
          } else if (content.startsWith('📋') || content.startsWith('🌐') || content.startsWith('✏️')) {
            cleanContent = content.slice(2).trim();
          }

          return (
            <div key={msg.id} className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed">
            {icon}
            <span className={cn(
                msg.isStreaming && 'after:inline-block after:w-1 after:h-3.5 after:bg-foreground/50 after:ml-0.5 after:animate-pulse after:rounded-sm'
              )}>
              {cleanContent}
            </span>
          </div>);

        }
    }
  };

  const isEmpty = !state.setupCompleted && state.messages.length === 0;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-background">
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation column */}
        <div className={cn(
          'flex flex-col transition-all duration-300',
          showRightPanel ? 'w-1/2 border-r border-border/20' : 'w-full'
        )}>
          {isEmpty ? (
          /* Centered composer layout - mirroring Market Insight style */
          <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-8 py-[60px]">
              <div className="w-full max-w-2xl animate-fade-in">
                {/* Title */}
                <div className="text-center mb-10">
                  <h1 className="text-2xl md:text-3xl font-normal text-foreground tracking-tight">
                    TikTok 解决方案
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    上传商品图开始对话，或直接输入问题
                  </p>
                </div>

                {/* Chat input card */}
                <div className="rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm shadow-sm">
                  <ChatInputBar
                  onSend={handleSend}
                  disabled={state.isProcessing}
                  memoryItems={memoryItems} />
                
                </div>

                

              
              </div>
            </div>) :

          <>
              {/* Messages area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="px-6 py-6">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {state.messages.map(renderMessage)}
                    {state.isProcessing && state.messages.length > 0 &&
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>正在处理中...</span>
                      </div>
                  }
                  </div>
                </div>
              </div>

              {/* Chat input */}
              <ChatInputBar
              onSend={handleSend}
              disabled={state.isProcessing}
              memoryItems={memoryItems} />
            
            </>
          }
        </div>

        {/* Right panel: Task detail or Video list */}
        {showRightPanel &&
        <div className="w-1/2 animate-in slide-in-from-right-4 duration-300">
            {activeTask ?
          <TaskDetailPanel
            task={activeTask}
            onClose={() => setActiveTaskId(null)}
            videoCandidates={
            activeTask.id === 'task-crawl' || activeTask.id === 'task-wait-select' ?
            state.candidateVideos : undefined
            }
            selectedVideoId={state.selectedVideo?.id}
            onVideoSelect={handleVideoSelect}
            onVideoRefresh={refreshCandidates} /> :

          hasVideoCandidates ?
          <div className="h-full flex flex-col bg-background">
                <div className="px-5 py-4 border-b border-border/20 flex items-center justify-between shrink-0">
                  <span className="text-sm font-medium text-foreground">爆款参考视频</span>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  <VideoCandidateRow
                videos={state.candidateVideos}
                onSelect={handleVideoSelect}
                onRefresh={refreshCandidates}
                selectedVideoId={state.selectedVideo?.id} />
              
                </div>
              </div> :
          null}
          </div>
        }
      </div>
    </div>);

}