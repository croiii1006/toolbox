import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, History, Play, Heart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = (i: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease } },
});

const FLOW_STEPS = [
  { label: '市场洞察', anchor: 'section-market' },
  { label: '策划方案', anchor: 'section-planning' },
  { label: '图片 / 视频生成', anchor: 'section-material' },
  { label: '发布与迭代', anchor: '' },
];

const SHOWCASE_CARDS = [
  {
    title: '海飞丝市场洞察深度报告',
    desc: '整合宏观趋势、全球化市场、人群画像、和竞品分析',
    hoverText: '点击查看洞察报告案例',
    image: '/haifeisi.jpg',
    miniTitle: '海飞丝市场洞察深度报告',
    stats: { plays: '1080w', likes: '28w', comments: '12w' },
    targetId: 'brand-health',
  },
  {
    title: '电商场景图批量生成',
    desc: '一键生成多尺寸封面图、场景图与风格化素材',
    hoverText: '点击查看图片生成案例',
    image: '/placeholder.svg',
    miniTitle: '电商场景图批量生成',
    stats: { plays: '860w', likes: '15w', comments: '6w' },
    targetId: 'text-to-image',
  },
  {
    title: '短视频素材智能生成',
    desc: '从脚本到分镜到成片，AI 辅助视频全流程',
    hoverText: '点击查看视频生成案例',
    image: '/placeholder.svg',
    miniTitle: '短视频素材智能生成',
    stats: { plays: '920w', likes: '22w', comments: '9w' },
    targetId: 'reference-to-video',
  },
  {
    title: 'TikTok 爆款方案实战',
    desc: '从选题到脚本到素材清单，完整可执行方案',
    hoverText: '点击查看 TikTok 方案案例',
    image: '/placeholder.svg',
    miniTitle: 'TikTok 爆款方案实战',
    stats: { plays: '1200w', likes: '35w', comments: '18w' },
    targetId: 'skills',
  },
];

function ShowcaseCard({
  card,
  onNavigate,
}: {
  card: (typeof SHOWCASE_CARDS)[0];
  onNavigate: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onNavigate(card.targetId)}
      className="block relative group w-full max-w-[350px] h-[210px] cursor-pointer"
    >
      {/* Shadow blob */}
      <div
        className="absolute -right-3 -bottom-3 h-[70%] w-[70%] rounded-[50px] blur-[16px] z-0"
        style={{
          background:
            'radial-gradient(60% 60% at 100% 100%, rgba(0,0,0,0.18), rgba(0,0,0,0))',
        }}
        aria-hidden="true"
      />

      {/* Main card body */}
      <div className="absolute inset-0 flex items-center overflow-clip bg-muted dark:bg-[hsl(0,0%,5%)] rounded-[20px] backdrop-blur-[5px] z-10">
        {/* Tilted mini report card */}
        <div className="absolute flex h-[150px] items-center justify-center right-[-14px] top-[2px] w-[113px] z-10 transition-transform duration-300 ease-out group-hover:translate-x-[-8px] group-hover:translate-y-[-6px]">
          <div className="flex-none rotate-[-6deg] transition-transform duration-300 ease-out group-hover:rotate-[-4deg]">
            <div className="bg-background overflow-hidden rounded-[4px] shadow-[0px_2px_20px_0px_rgba(35,35,35,0.2)] w-[100px] h-[130px] relative">
              {/* Mini card header */}
              <div className="flex items-start gap-[4px] px-[6px] pt-[6px] pb-[4px]">
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-semibold leading-[normal] line-clamp-1 text-[6px] text-foreground">
                    {card.miniTitle}
                  </p>
                  <div className="flex items-center gap-[2px]">
                    <div className="size-[7px] rounded-full overflow-hidden bg-muted">
                      <img
                        alt="OranAI"
                        src="/favicon.ico"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="font-medium leading-[normal] text-[5px] text-muted-foreground truncate">
                      OranAI
                    </p>
                  </div>
                  <div className="flex items-center gap-[2.667px]">
                    <div className="flex items-center gap-px">
                      <Play className="size-[4px] text-muted-foreground fill-muted-foreground" />
                      <p className="font-medium leading-[4.85px] text-[4px] text-muted-foreground tracking-[-0.07px]">
                        {card.stats.plays}
                      </p>
                    </div>
                    <div className="flex items-center gap-px">
                      <Heart className="size-[4px] text-muted-foreground" />
                      <p className="font-medium leading-[normal] text-[4px] text-muted-foreground">
                        {card.stats.likes}
                      </p>
                    </div>
                    <div className="flex items-center gap-px">
                      <MessageSquare className="size-[4px] text-muted-foreground" />
                      <p className="font-medium leading-[normal] text-[4px] text-muted-foreground">
                        {card.stats.comments}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Mini card image */}
              <div className="relative h-[90px] rounded-[4px] mx-[6px] mb-[6px] overflow-hidden">
                <img
                  alt=""
                  className="absolute inset-0 max-w-none object-cover size-full"
                  src={card.image}
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-muted to-transparent" />
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[20px] bg-foreground/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-background text-[12px] leading-[1.4] font-medium">
            {card.hoverText}
          </p>
        </div>
      </div>

      {/* Bottom text overlay */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
        <div className="flex flex-col gap-[6px] items-start justify-end p-[18px] py-[13px] w-full">
          <div className="relative shrink-0 max-w-[232px] whitespace-pre-wrap group-hover:opacity-0 transition-opacity duration-200">
            <p className="font-medium leading-[1.35] text-[16px] text-foreground">
              {card.title}
            </p>
            <p className="mt-[8px] font-normal leading-[1.35] text-[12px] text-muted-foreground">
              {card.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HeroSectionProps {
  onNavigate: (itemId: string) => void;
  onScrollTo: (anchor: string) => void;
}

export function HeroSection({ onNavigate, onScrollTo }: HeroSectionProps) {
  return (
    <section className="pt-20 pb-16 lg:pt-28 lg:pb-24 min-h-[80vh] flex flex-col justify-center">
      <div className="w-full">
        <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.1]">
            Oran Gen Toolbox
          </h1>
          <p className="font-display text-lg sm:text-xl md:text-2xl font-light text-foreground/60 mt-3 max-w-2xl tracking-tight">
            把洞察 → 策略 → 素材生产做成可复用工作流
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp(1)} initial="hidden" animate="visible"
          className="text-sm sm:text-base font-light text-muted-foreground mt-6 max-w-2xl leading-relaxed"
        >
          用 5 个核心工具完成 TikTok 增长闭环：先看市场，再定策略，最后批量生产内容。
        </motion.p>

        {/* Selling points */}
        <motion.div
          variants={fadeUp(2)} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-8"
        >
          {[
            { icon: <Zap className="w-4 h-4 text-accent" />, text: '更快：输入关键要素，一键生成可用输出' },
            { icon: <Shield className="w-4 h-4 text-accent" />, text: '更稳：模板化结构，团队统一口径' },
            { icon: <History className="w-4 h-4 text-accent" />, text: '可追踪：历史记录与结果复用' },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-foreground/70 font-light">
              {p.icon}
              <span>{p.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp(3)} initial="hidden" animate="visible"
          className="flex items-center gap-5 mt-10"
        >
          <Button
            onClick={() => onNavigate('skills')}
            className="h-12 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 font-display font-medium text-sm transition-all duration-300"
          >
            开始做 TikTok 方案
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <button
            onClick={() => onScrollTo('section-market')}
            className="group text-sm font-light text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1"
          >
            从品牌洞察开始
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </motion.div>

        {/* Flow bar */}
        <motion.div
          variants={fadeUp(4)} initial="hidden" animate="visible"
          className="mt-16 flex items-center gap-0 overflow-x-auto"
        >
          {FLOW_STEPS.map((step, i) => (
            <div key={i} className="flex items-center shrink-0">
              <button
                onClick={() => step.anchor ? onScrollTo(step.anchor) : undefined}
                disabled={!step.anchor}
                className="px-4 py-2.5 rounded-full border border-border/40 bg-card/80 backdrop-blur-sm text-xs font-medium text-foreground/70 hover:text-foreground hover:border-border/60 hover:bg-muted/30 transition-all duration-200 disabled:cursor-default disabled:opacity-50"
              >
                {step.label}
              </button>
              {i < FLOW_STEPS.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 mx-1.5 shrink-0" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Showcase cards */}
        <motion.div
          variants={fadeUp(5)} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-14"
        >
          {SHOWCASE_CARDS.map((card, i) => (
            <ShowcaseCard key={i} card={card} onNavigate={onNavigate} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
