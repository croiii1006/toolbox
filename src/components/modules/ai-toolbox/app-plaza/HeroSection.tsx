import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, History, Play, Heart, MessageSquare, BarChart3, Lightbulb, Image, Video, Globe } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { PreviewInsight, PreviewPlanner, PreviewImageGen, PreviewVideoGen, PreviewTikTok } from './FeaturePreviews';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = (i: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease } }
});

const BRAND_FLOW = [
{
  label: '市场洞察',
  targetId: 'brand-health',
  desc: '整合宏观趋势、竞品动态与人群画像，快速生成深度洞察报告',
  icon: <BarChart3 className="size-5" />,
  preview: <PreviewInsight />
},
{
  label: '策划方案',
  targetId: 'campaign-planner',
  desc: '基于洞察数据自动生成营销策划方案，涵盖策略、排期与预算',
  icon: <Lightbulb className="size-5" />,
  preview: <PreviewPlanner />
},
{
  label: '图片生成',
  targetId: 'text-to-image',
  desc: '通过文字描述批量生成电商场景图、封面图与风格化素材',
  icon: <Image className="size-5" />,
  preview: <PreviewImageGen />
},
{
  label: '视频生成',
  targetId: 'reference-to-video',
  desc: '从脚本到分镜到成片，AI 辅助完成视频全流程制作',
  icon: <Video className="size-5" />,
  preview: <PreviewVideoGen />
}];


const SKILLS_FLOW: {label: string;targetId: string;desc: string;icon: ReactNode;preview: ReactNode;}[] = [
{
  label: 'TikTok解决方案',
  targetId: 'skills',
  desc: '从选题到脚本到素材清单，生成完整可执行的 TikTok 增长方案',
  icon: <Globe className="size-5" />,
  preview: <PreviewTikTok />
}];


const CASE_CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'market', label: '市场洞察' },
  { id: 'campaign', label: '策划方案' },
  { id: 'image', label: '图片生成' },
  { id: 'video', label: '视频生成' },
] as const;

const SHOWCASE_CARDS = [
{
  title: '海飞丝市场洞察深度报告',
  desc: '整合宏观趋势、全球化市场、人群画像、和竞品分析',
  hoverText: '点击查看市场洞察报告案例',
  image: '/haifeisi.jpg',
  miniTitle: '海飞丝市场洞察深度报告',
  stats: { plays: '1080w', likes: '28w', comments: '12w' },
  targetId: 'brand-health',
  category: 'market'
},
{
  title: '电商场景图批量生成',
  desc: '一键生成多尺寸封面图、场景图与风格化素材',
  hoverText: '点击查看图片生成案例',
  image: '/placeholder.svg',
  miniTitle: '电商场景图批量生成',
  stats: { plays: '860w', likes: '15w', comments: '6w' },
  targetId: 'text-to-image',
  category: 'image'
},
{
  title: '短视频素材智能生成',
  desc: '从脚本到分镜到成片，AI 辅助视频全流程',
  hoverText: '点击查看视频生成案例',
  image: '/placeholder.svg',
  miniTitle: '短视频素材智能生成',
  stats: { plays: '920w', likes: '22w', comments: '9w' },
  targetId: 'reference-to-video',
  category: 'video'
},
{
  title: 'TikTok 爆款方案实战',
  desc: '从选题到脚本到素材清单，完整可执行方案',
  hoverText: '点击查看策划方案案例',
  image: '/placeholder.svg',
  miniTitle: 'TikTok 爆款方案实战',
  stats: { plays: '1200w', likes: '35w', comments: '18w' },
  targetId: 'skills',
  category: 'campaign'
}];


function ShowcaseCard({
  card,
  onNavigate
}: {card: (typeof SHOWCASE_CARDS)[0];onNavigate: (id: string) => void;}) {
  return (
    <div
      className="group relative rounded-lg border border-border/40 overflow-hidden cursor-pointer hover:border-border transition-colors"
      onClick={() => onNavigate(card.targetId)}
    >
      <div className="aspect-[4/3] bg-muted/30 overflow-hidden">
        <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <p className="text-xs font-medium truncate">{card.miniTitle}</p>
        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{card.desc}</p>
      </div>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs font-medium text-foreground/80">{card.hoverText}</span>
      </div>
    </div>
  );
}

interface HeroSectionProps {
  onNavigate: (itemId: string) => void;
  onScrollTo: (anchor: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const [activeCaseCategory, setActiveCaseCategory] = useState<string>('all');
  const filteredCases = activeCaseCategory === 'all'
    ? SHOWCASE_CARDS
    : SHOWCASE_CARDS.filter(c => c.category === activeCaseCategory);
  return (
    <section className="pt-20 pb-16 lg:pt-28 lg:pb-24 flex flex-col">
      <div className="w-full">
        {/* Title */}
        <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] text-[#3d3d3d] font-normal">
            Oran Gen Toolbox
          </h1>
          <p className="font-display text-lg sm:text-xl md:text-2xl font-light text-foreground/60 mt-3 max-w-2xl tracking-tight">
            把洞察→策略→素材生产做成可复用工作流
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp(1)} initial="hidden" animate="visible"
          className="text-sm sm:text-base font-light text-muted-foreground mt-6 max-w-2xl leading-relaxed">
          
          用 5 个核心工具完成 TikTok 增长闭环：先看市场，再定策略，最后批量生产内容。
        </motion.p>

        {/* Selling points */}
        <motion.div
          variants={fadeUp(2)} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-8">
          
          {[
          { icon: <Zap className="w-4 h-4 text-accent" />, text: '更快：输入关键要素，一键生成可用输出' },
          { icon: <Shield className="w-4 h-4 text-accent" />, text: '更稳：模板化结构，团队统一口径' },
          { icon: <History className="w-4 h-4 text-accent" />, text: '可追踪：历史记录与结果复盘' }].
          map((p, i) =>
          <div key={i} className="flex items-center gap-2 text-sm text-foreground/70 font-light">
              {p.icon}
              <span>{p.text}</span>
            </div>
          )}
        </motion.div>

        {/* 品牌营销全链路 */}
        <motion.div variants={fadeUp(3)} initial="hidden" animate="visible" className="mt-12">
          <h2 className="text-lg font-normal text-foreground/60 mb-5">品牌营销全链路</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BRAND_FLOW.map((step, i) =>
            <FeatureCard
              key={i}

              title={step.label}
              description={step.desc}
              preview={step.preview}
              onClick={() => onNavigate(step.targetId)} />

            )}
          </div>
        </motion.div>

        {/* AI营销Skills */}
        <motion.div variants={fadeUp(4)} initial="hidden" animate="visible" className="mt-10">
          <h2 className="text-lg font-normal text-foreground/60 mb-5">AI营销Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SKILLS_FLOW.map((step, i) =>
            <FeatureCard
              key={i}


              title={step.label}
              description={step.desc}
              preview={step.preview}
              onClick={() => onNavigate(step.targetId)} />

            )}
          </div>
        </motion.div>

        {/* 案例 */}
        <motion.div variants={fadeUp(5)} initial="hidden" animate="visible" className="mt-14">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-normal text-foreground/60">案例</h2>
            <div className="flex gap-1">
              {CASE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCaseCategory(cat.id)}
                  className={`px-3 py-1 rounded-md text-xs transition-colors ${
                    activeCaseCategory === cat.id
                      ? 'text-foreground font-medium bg-muted/60'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCases.map((card, i) =>
            <ShowcaseCard key={card.targetId} card={card} onNavigate={onNavigate} />
            )}
          </div>
        </motion.div>
      </div>
    </section>);

}