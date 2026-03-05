import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, History, Play, Heart, MessageSquare, BarChart3, Lightbulb, Image, Video, Globe } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { PreviewInsight, PreviewPlanner, PreviewImageGen, PreviewVideoGen, PreviewTikTok } from './FeaturePreviews';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = (i: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease } },
});

const BRAND_FLOW = [
  {
    label: '市场洞察',
    targetId: 'brand-health',
    desc: '整合宏观趋势、竞品动态与人群画像，快速生成深度洞察报告',
    icon: <BarChart3 className="size-5" />,
    preview: <PreviewInsight />,
  },
  {
    label: '策划方案',
    targetId: 'campaign-planner',
    desc: '基于洞察数据自动生成营销策划方案，涵盖策略、排期与预算',
    icon: <Lightbulb className="size-5" />,
    preview: <PreviewPlanner />,
  },
  {
    label: '图片生成',
    targetId: 'text-to-image',
    desc: '通过文字描述批量生成电商场景图、封面图与风格化素材',
    icon: <Image className="size-5" />,
    preview: <PreviewImageGen />,
  },
  {
    label: '视频生成',
    targetId: 'reference-to-video',
    desc: '从脚本到分镜到成片，AI 辅助完成视频全流程制作',
    icon: <Video className="size-5" />,
    preview: <PreviewVideoGen />,
  },
];

const SKILLS_FLOW: { label: string; targetId: string; desc: string; icon: ReactNode; preview: ReactNode }[] = [
  {
    label: 'TikTok解决方案',
    targetId: 'skills',
    desc: '从选题到脚本到素材清单，生成完整可执行的 TikTok 增长方案',
    icon: <Globe className="size-5" />,
    preview: <PreviewTikTok />,
  },
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
      <div
        className="absolute -right-3 -bottom-3 h-[70%] w-[70%] rounded-[50px] blur-[16px] z-0"
        style={{
          background: 'radial-gradient(60% 60% at 100% 100%, rgba(0,0,0,0.18), rgba(0,0,0,0))',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center overflow-clip bg-muted dark:bg-[hsl(0,0%,5%)] rounded-[20px] backdrop-blur-[5px] z-10">
        <div className="absolute flex h-[150px] items-center justify-center right-[-14px] top-[2px] w-[113px] z-10 transition-transform duration-300 ease-out group-hover:translate-x-[-8px] group-hover:translate-y-[-6px]">
          <div className="flex-none rotate-[-6deg] transition-transform duration-300 ease-out group-hover:rotate-[-4deg]">
            <div className="bg-background overflow-hidden rounded-[4px] shadow-[0px_2px_20px_0px_rgba(35,35,35,0.2)] w-[100px] h-[130px] relative">
              <div className="flex items-start gap-[4px] px-[6px] pt-[6px] pb-[4px]">
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-semibold leading-[normal] line-clamp-1 text-[6px] text-foreground">{card.miniTitle}</p>
                  <div className="flex items-center gap-[2px]">
                    <div className="size-[7px] rounded-full overflow-hidden bg-muted">
                      <img alt="OranAI" src="/favicon.ico" className="w-full h-full object-contain" />
                    </div>
                    <p className="font-medium leading-[normal] text-[5px] text-muted-foreground truncate">OranAI</p>
                  </div>
                  <div className="flex items-center gap-[2.667px]">
                    <div className="flex items-center gap-px">
                      <Play className="size-[4px] text-muted-foreground fill-muted-foreground" />
                      <p className="font-medium leading-[4.85px] text-[4px] text-muted-foreground tracking-[-0.07px]">{card.stats.plays}</p>
                    </div>
                    <div className="flex items-center gap-px">
                      <Heart className="size-[4px] text-muted-foreground" />
                      <p className="font-medium leading-[normal] text-[4px] text-muted-foreground">{card.stats.likes}</p>
                    </div>
                    <div className="flex items-center gap-px">
                      <MessageSquare className="size-[4px] text-muted-foreground" />
                      <p className="font-medium leading-[normal] text-[4px] text-muted-foreground">{card.stats.comments}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[90px] rounded-[4px] mx-[6px] mb-[6px] overflow-hidden">
                <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={card.image} />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-muted to-transparent" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[20px] bg-foreground/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-background text-[12px] leading-[1.4] font-medium">{card.hoverText}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
        <div className="flex flex-col gap-[6px] items-start justify-end p-[18px] py-[13px] w-full">
          <div className="relative shrink-0 max-w-[232px] whitespace-pre-wrap group-hover:opacity-0 transition-opacity duration-200">
            <p className="font-medium leading-[1.35] text-[16px] text-foreground">{card.title}</p>
            <p className="mt-[8px] font-normal leading-[1.35] text-[12px] text-muted-foreground">{card.desc}</p>
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

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="pt-20 pb-16 lg:pt-28 lg:pb-24 flex flex-col">
      <div className="w-full">
        {/* Title */}
        <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.1]">
            Oran Gen Toolbox
          </h1>
          <p className="font-display text-lg sm:text-xl md:text-2xl font-light text-foreground/60 mt-3 max-w-2xl tracking-tight">
            把洞察→策略→素材生产做成可复用工作流
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
            { icon: <History className="w-4 h-4 text-accent" />, text: '可追踪：历史记录与结果复盘' },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-foreground/70 font-light">
              {p.icon}
              <span>{p.text}</span>
            </div>
          ))}
        </motion.div>

        {/* 品牌营销全链路 */}
        <motion.div variants={fadeUp(3)} initial="hidden" animate="visible" className="mt-12">
          <h2 className="text-lg font-normal text-foreground/60 mb-5">品牌营销全链路</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BRAND_FLOW.map((step, i) => (
              <FeatureCard
                key={i}
                icon={step.icon}
                index={String(i + 1).padStart(2, '0')}
                title={step.label}
                description={step.desc}
                preview={step.preview}
                onClick={() => onNavigate(step.targetId)}
              />
            ))}
          </div>
        </motion.div>

        {/* AI营销Skills */}
        <motion.div variants={fadeUp(4)} initial="hidden" animate="visible" className="mt-10">
          <h2 className="text-lg font-normal text-foreground/60 mb-5">AI营销Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SKILLS_FLOW.map((step, i) => (
              <FeatureCard
                key={i}
                icon={step.icon}
                index={String(BRAND_FLOW.length + i + 1).padStart(2, '0')}
                title={step.label}
                description={step.desc}
                preview={step.preview}
                onClick={() => onNavigate(step.targetId)}
              />
            ))}
          </div>
        </motion.div>

        {/* 案例 */}
        <motion.div variants={fadeUp(5)} initial="hidden" animate="visible" className="mt-14">
          <h2 className="text-lg font-normal text-foreground/60 mb-6">案例</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {SHOWCASE_CARDS.map((card, i) => (
              <ShowcaseCard key={i} card={card} onNavigate={onNavigate} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}