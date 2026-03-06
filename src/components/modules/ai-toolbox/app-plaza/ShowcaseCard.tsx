export interface ShowcaseCardData {
  title: string;
  desc: string;
  hoverText: string;
  image: string;
  miniTitle: string;
  targetId: string;
  category: string;
}

export function ShowcaseCard({
  card,
  onClick,
}: {
  card: ShowcaseCardData;
  onClick: () => void;
}) {
  return (
    <div
      className="group relative rounded-lg border border-border/40 overflow-hidden cursor-pointer hover:border-border transition-colors"
      onClick={onClick}
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

export const SHOWCASE_CARDS: ShowcaseCardData[] = [
  // 市场洞察
  { title: '海飞丝市场洞察深度报告', desc: '整合宏观趋势、全球化市场、人群画像、和竞品分析', hoverText: '点击查看市场洞察报告案例', image: '/haifeisi.jpg', miniTitle: '海飞丝市场洞察深度报告', targetId: 'brand-health', category: 'market' },
  { title: '护肤品赛道趋势分析', desc: '消费者偏好变化与新兴品牌竞争格局', hoverText: '点击查看市场洞察报告案例', image: '/placeholder.svg', miniTitle: '护肤品赛道趋势分析', targetId: 'brand-health', category: 'market' },
  { title: '饮料行业消费者画像', desc: '年轻消费群体购买行为与偏好深度洞察', hoverText: '点击查看市场洞察报告案例', image: '/placeholder.svg', miniTitle: '饮料行业消费者画像', targetId: 'brand-health', category: 'market' },
  { title: '母婴品类竞品监测', desc: '头部品牌营销策略与市场份额对比分析', hoverText: '点击查看市场洞察报告案例', image: '/placeholder.svg', miniTitle: '母婴品类竞品监测', targetId: 'brand-health', category: 'market' },
  // 策划方案
  { title: 'TikTok 爆款方案实战', desc: '从选题到脚本到素材清单，完整可执行方案', hoverText: '点击查看策划方案案例', image: '/placeholder.svg', miniTitle: 'TikTok 爆款方案实战', targetId: 'campaign-planner', category: 'campaign' },
  { title: '双十一整合营销方案', desc: '全渠道联动的促销策略与执行排期', hoverText: '点击查看策划方案案例', image: '/placeholder.svg', miniTitle: '双十一整合营销方案', targetId: 'campaign-planner', category: 'campaign' },
  { title: '新品上市推广计划', desc: '从预热到引爆的完整上市营销节奏', hoverText: '点击查看策划方案案例', image: '/placeholder.svg', miniTitle: '新品上市推广计划', targetId: 'campaign-planner', category: 'campaign' },
  { title: 'KOL 合作投放方案', desc: '达人筛选、内容共创与效果追踪一体化', hoverText: '点击查看策划方案案例', image: '/placeholder.svg', miniTitle: 'KOL 合作投放方案', targetId: 'campaign-planner', category: 'campaign' },
  // 图片生成
  { title: '电商场景图批量生成', desc: '一键生成多尺寸封面图、场景图与风格化素材', hoverText: '点击查看图片生成案例', image: '/placeholder.svg', miniTitle: '电商场景图批量生成', targetId: 'text-to-image', category: 'image' },
  { title: '社交媒体配图生成', desc: '适配各平台尺寸的品牌风格化配图', hoverText: '点击查看图片生成案例', image: '/placeholder.svg', miniTitle: '社交媒体配图生成', targetId: 'text-to-image', category: 'image' },
  { title: '产品主图风格迁移', desc: '参考竞品风格快速生成同系列产品图', hoverText: '点击查看图片生成案例', image: '/placeholder.svg', miniTitle: '产品主图风格迁移', targetId: 'text-to-image', category: 'image' },
  { title: '广告 Banner 智能设计', desc: '输入文案自动生成多版本广告横幅', hoverText: '点击查看图片生成案例', image: '/placeholder.svg', miniTitle: '广告 Banner 智能设计', targetId: 'text-to-image', category: 'image' },
  // 视频生成
  { title: '短视频素材智能生成', desc: '从脚本到分镜到成片，AI 辅助视频全流程', hoverText: '点击查看视频生成案例', image: '/placeholder.svg', miniTitle: '短视频素材智能生成', targetId: 'reference-to-video', category: 'video' },
  { title: '产品展示视频生成', desc: '商品 360° 展示与卖点解说视频', hoverText: '点击查看视频生成案例', image: '/placeholder.svg', miniTitle: '产品展示视频生成', targetId: 'reference-to-video', category: 'video' },
  { title: '口播视频脚本转片', desc: '输入文案自动生成带字幕的口播视频', hoverText: '点击查看视频生成案例', image: '/placeholder.svg', miniTitle: '口播视频脚本转片', targetId: 'reference-to-video', category: 'video' },
  { title: '爆款视频风格复刻', desc: '参考热门视频风格快速生成同类内容', hoverText: '点击查看视频生成案例', image: '/placeholder.svg', miniTitle: '爆款视频风格复刻', targetId: 'reference-to-video', category: 'video' },
];
