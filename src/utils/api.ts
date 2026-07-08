import type { CheckRequest, CheckResult, SourceInfo } from '@/types';

const trustedDomains: Record<string, { reliability: number; description: string; category: string }> = {
  'gov.cn': { reliability: 98, description: '中国政府网官方发布', category: '政府机构' },
  'china.gov.cn': { reliability: 98, description: '中国政府网', category: '政府机构' },
  'people.com.cn': { reliability: 95, description: '人民网', category: '权威媒体' },
  'xinhuanet.com': { reliability: 95, description: '新华网', category: '权威媒体' },
  'news.cn': { reliability: 95, description: '新华网', category: '权威媒体' },
  'cctv.com': { reliability: 95, description: '央视网', category: '权威媒体' },
  'tv.cctv.com': { reliability: 95, description: '央视网', category: '权威媒体' },
  'sina.com.cn': { reliability: 88, description: '新浪网', category: '综合媒体' },
  'sohu.com': { reliability: 85, description: '搜狐网', category: '综合媒体' },
  '163.com': { reliability: 85, description: '网易', category: '综合媒体' },
  'qq.com': { reliability: 85, description: '腾讯网', category: '综合媒体' },
  'ifeng.com': { reliability: 85, description: '凤凰网', category: '综合媒体' },
  'csdn.net': { reliability: 82, description: 'CSDN技术社区', category: '技术社区' },
  'oschina.net': { reliability: 80, description: '开源中国', category: '技术社区' },
  'github.com': { reliability: 90, description: 'GitHub开源平台', category: '技术平台' },
  'stackoverflow.com': { reliability: 88, description: 'Stack Overflow技术问答', category: '技术社区' },
  'zhihu.com': { reliability: 80, description: '知乎问答社区', category: '社区问答' },
  'bilibili.com': { reliability: 75, description: '哔哩哔哩视频平台', category: '视频平台' },
  'weibo.com': { reliability: 70, description: '微博', category: '社交媒体' },
  'weixin.qq.com': { reliability: 75, description: '微信公众平台', category: '自媒体' },
  'jianshu.com': { reliability: 65, description: '简书', category: '自媒体' },
  'medium.com': { reliability: 70, description: 'Medium博客平台', category: '自媒体' },
  'zh.wikipedia.org': { reliability: 75, description: '维基百科', category: '百科全书' },
  'baike.baidu.com': { reliability: 70, description: '百度百科', category: '百科全书' },
  'wikipedia.org': { reliability: 80, description: '维基百科英文版', category: '百科全书' },
  'acm.org': { reliability: 92, description: 'ACM学术组织', category: '学术机构' },
  'ieee.org': { reliability: 92, description: 'IEEE学术组织', category: '学术机构' },
  'cnki.net': { reliability: 90, description: '中国知网', category: '学术平台' },
  'wanfangdata.com.cn': { reliability: 88, description: '万方数据', category: '学术平台' },
  'vip.com': { reliability: 85, description: '维普资讯', category: '学术平台' },
  'arxiv.org': { reliability: 90, description: 'arXiv预印本平台', category: '学术平台' },
  'researchgate.net': { reliability: 80, description: 'ResearchGate学术社区', category: '学术社区' },
  'springer.com': { reliability: 90, description: 'Springer出版社', category: '学术出版' },
  'elsevier.com': { reliability: 90, description: 'Elsevier出版社', category: '学术出版' },
  'nature.com': { reliability: 95, description: 'Nature期刊', category: '学术出版' },
  'science.org': { reliability: 95, description: 'Science期刊', category: '学术出版' },
  'cell.com': { reliability: 95, description: 'Cell期刊', category: '学术出版' },
  'pubmed.ncbi.nlm.nih.gov': { reliability: 95, description: 'PubMed医学数据库', category: '学术平台' },
  'ncbi.nlm.nih.gov': { reliability: 95, description: 'NCBI数据库', category: '学术平台' },
  'bmj.com': { reliability: 92, description: 'BMJ医学期刊', category: '学术出版' },
  'nejm.org': { reliability: 95, description: 'NEJM新英格兰医学杂志', category: '学术出版' },
  'lancet.com': { reliability: 95, description: '柳叶刀期刊', category: '学术出版' },
  'zh.m.wikipedia.org': { reliability: 75, description: '维基百科中文', category: '百科全书' },
};

interface FactEntry {
  keywords: string[];
  type: 'true' | 'false';
  description: string;
  source: string;
  sourceReliability: number;
  category: string;
}

const factDatabase: FactEntry[] = [
  {
    keywords: ['地球是圆的', '地球是球体', '地球形状'],
    type: 'true',
    description: '地球是一个两极稍扁、赤道略鼓的不规则球体，这是经过科学验证的事实。',
    source: '中国科学技术协会',
    sourceReliability: 95,
    category: '科学常识',
  },
  {
    keywords: ['水的化学式', 'H2O', '水分子式'],
    type: 'true',
    description: '水的化学式是H2O，由两个氢原子和一个氧原子组成。',
    source: '化学教材',
    sourceReliability: 98,
    category: '科学常识',
  },
  {
    keywords: ['光速', '30万公里', '光的速度'],
    type: 'true',
    description: '光在真空中的传播速度约为每秒30万公里。',
    source: '物理学标准',
    sourceReliability: 99,
    category: '科学常识',
  },
  {
    keywords: ['中国人口', '14亿', '中国总人口'],
    type: 'true',
    description: '根据国家统计局数据，中国总人口约为14亿左右。',
    source: '国家统计局',
    sourceReliability: 98,
    category: '社会数据',
  },
  {
    keywords: ['牛顿', '万有引力', '三大定律'],
    type: 'true',
    description: '艾萨克·牛顿提出了万有引力定律和三大运动定律。',
    source: '物理学史',
    sourceReliability: 97,
    category: '科学常识',
  },
  {
    keywords: ['吸烟有害健康', '吸烟致癌', '吸烟危害'],
    type: 'true',
    description: '吸烟有害健康，会增加多种疾病的风险，包括肺癌等癌症。',
    source: '世界卫生组织',
    sourceReliability: 99,
    category: '健康医学',
  },
  {
    keywords: ['疫苗有效', '接种疫苗', '疫苗临床试验'],
    type: 'true',
    description: '疫苗经过严格的临床试验，是安全有效的预防疾病的手段。',
    source: '世界卫生组织',
    sourceReliability: 98,
    category: '健康医学',
  },
  {
    keywords: ['转基因食品', '转基因作物', '转基因安全'],
    type: 'true',
    description: '经过批准的转基因食品与传统食品一样安全，不会对健康造成危害。',
    source: '中国农业农村部',
    sourceReliability: 95,
    category: '健康医学',
  },
  {
    keywords: ['喝醋软化血管', '醋能治病', '醋保健'],
    type: 'false',
    description: '喝醋不能软化血管，过量饮用还可能损伤牙齿和胃黏膜。',
    source: '医学专家',
    sourceReliability: 90,
    category: '健康医学',
  },
  {
    keywords: ['手机辐射致癌', '手机危害', '手机有害'],
    type: 'false',
    description: '目前没有科学证据表明手机辐射会导致癌症，符合国际安全标准。',
    source: '世界卫生组织',
    sourceReliability: 95,
    category: '健康医学',
  },
  {
    keywords: ['食物相克', '食物不能一起吃', '食物禁忌'],
    type: 'false',
    description: '绝大多数所谓的"食物相克"说法没有科学依据，正常食用不会引起中毒。',
    source: '中国营养学会',
    sourceReliability: 92,
    category: '健康医学',
  },
  {
    keywords: ['酸碱体质', '酸性体质', '碱性体质'],
    type: 'false',
    description: '人体有强大的酸碱调节系统，不存在所谓的"酸性体质"或"碱性体质"。',
    source: '医学界',
    sourceReliability: 95,
    category: '健康医学',
  },
  {
    keywords: ['WiFi致癌', '无线网络有害', '无线网络辐射'],
    type: 'false',
    description: 'WiFi辐射强度远低于安全标准，不会对人体健康造成危害。',
    source: '国际非电离辐射防护委员会',
    sourceReliability: 93,
    category: '健康医学',
  },
  {
    keywords: ['板蓝根预防流感', '板蓝根万能', '中药预防'],
    type: 'false',
    description: '板蓝根不能预防流感，滥用可能导致过敏等副作用。',
    source: '国家卫健委',
    sourceReliability: 95,
    category: '健康医学',
  },
  {
    keywords: ['吃西瓜籽长西瓜', '吞西瓜籽', '西瓜籽发芽'],
    type: 'false',
    description: '西瓜籽在消化道内不会发芽生长，会随粪便排出体外。',
    source: '生物学常识',
    sourceReliability: 99,
    category: '科学常识',
  },
  {
    keywords: ['头发越剪越长', '剪发促进头发生长', '理发加速生长'],
    type: 'false',
    description: '剪发不会改变头发的生长速度，只是去除了受损的发梢。',
    source: '医学常识',
    sourceReliability: 95,
    category: '健康医学',
  },
  {
    keywords: ['维生素C治感冒', '维C预防感冒', '维C增强免疫力'],
    type: 'false',
    description: '维生素C不能预防或治愈感冒，正常饮食即可满足需求。',
    source: '美国国立卫生研究院',
    sourceReliability: 95,
    category: '健康医学',
  },
  {
    keywords: ['隔夜菜致癌', '隔夜饭有毒', '亚硝酸盐'],
    type: 'false',
    description: '正常冷藏的隔夜菜亚硝酸盐含量远低于安全标准，不会致癌。',
    source: '食品科学',
    sourceReliability: 90,
    category: '健康医学',
  },
  {
    keywords: ['地球自转', '24小时', '自转周期'],
    type: 'true',
    description: '地球自转一周约为24小时，这是昼夜交替的原因。',
    source: '地理学',
    sourceReliability: 99,
    category: '科学常识',
  },
  {
    keywords: ['地球公转', '365天', '公转周期'],
    type: 'true',
    description: '地球围绕太阳公转一周约为365.25天，这是四季更替的原因。',
    source: '地理学',
    sourceReliability: 99,
    category: '科学常识',
  },
  {
    keywords: ['月亮绕地球', '月球公转', '月相变化'],
    type: 'true',
    description: '月球围绕地球公转，周期约为27.3天，造成月相变化。',
    source: '天文学',
    sourceReliability: 98,
    category: '科学常识',
  },
  {
    keywords: ['太阳是恒星', '太阳系中心', '恒星发光'],
    type: 'true',
    description: '太阳是太阳系的中心恒星，通过核聚变反应发光发热。',
    source: '天文学',
    sourceReliability: 99,
    category: '科学常识',
  },
  {
    keywords: ['人类进化', '猿猴进化', '达尔文进化论'],
    type: 'true',
    description: '人类是由古猿进化而来，达尔文的进化论已被科学界广泛接受。',
    source: '进化论',
    sourceReliability: 98,
    category: '科学常识',
  },
  {
    keywords: ['DNA双螺旋', '基因', '遗传物质'],
    type: 'true',
    description: 'DNA是双螺旋结构，是生物的遗传物质，决定生物体的性状。',
    source: '分子生物学',
    sourceReliability: 99,
    category: '科学常识',
  },
  {
    keywords: ['新冠肺炎', 'COVID-19', '冠状病毒'],
    type: 'true',
    description: '新冠肺炎是由新型冠状病毒（COVID-19）引起的传染病。',
    source: '世界卫生组织',
    sourceReliability: 99,
    category: '健康医学',
  },
  {
    keywords: ['口罩预防病毒', '戴口罩有用', '口罩防护'],
    type: 'true',
    description: '佩戴口罩可以有效预防呼吸道传染病的传播。',
    source: '世界卫生组织',
    sourceReliability: 98,
    category: '健康医学',
  },
  {
    keywords: ['勤洗手', '洗手防病毒', '手部卫生'],
    type: 'true',
    description: '勤洗手是预防传染病最简单有效的方法之一。',
    source: '世界卫生组织',
    sourceReliability: 98,
    category: '健康医学',
  },
  {
    keywords: ['艾滋病', 'HIV', '性传播'],
    type: 'true',
    description: '艾滋病由HIV病毒引起，主要通过性接触、血液和母婴传播。',
    source: '世界卫生组织',
    sourceReliability: 99,
    category: '健康医学',
  },
  {
    keywords: ['艾滋病日常接触不传染', '握手不传染', '共餐不传染'],
    type: 'true',
    description: '艾滋病不会通过日常接触传播，如握手、拥抱、共餐等。',
    source: '世界卫生组织',
    sourceReliability: 99,
    category: '健康医学',
  },
  {
    keywords: ['狂犬病', '狗咬伤', '疫苗'],
    type: 'true',
    description: '被可疑动物咬伤后应尽快接种狂犬病疫苗，狂犬病发病后死亡率极高。',
    source: '国家卫健委',
    sourceReliability: 98,
    category: '健康医学',
  },
  {
    keywords: ['煤化工', '煤炭化工', '煤制化工'],
    type: 'true',
    description: '煤化工是指以煤炭为原料，经过化学加工将煤转化为气体、液体和固体产品或半产品，进而生产出各种化工产品的工业过程。',
    source: '中国化工学会',
    sourceReliability: 90,
    category: '工业技术',
  },
  {
    keywords: ['煤制油', '煤炭液化', '煤制烯烃'],
    type: 'true',
    description: '煤制油技术可以将煤炭转化为液体燃料，包括直接液化和间接液化两种主要工艺。',
    source: '煤炭科学研究总院',
    sourceReliability: 92,
    category: '工业技术',
  },
  {
    keywords: ['煤气化', '合成气', '气化炉'],
    type: 'true',
    description: '煤气化是煤化工的核心技术，通过高温将煤转化为合成气（一氧化碳和氢气的混合物）。',
    source: '化工行业标准',
    sourceReliability: 90,
    category: '工业技术',
  },
  {
    keywords: ['农业农村部', '农业政策', '农村发展'],
    type: 'true',
    description: '农业农村部是国务院组成部门，负责农业农村经济发展、乡村振兴、农产品质量安全等工作。',
    source: '中国政府网',
    sourceReliability: 98,
    category: '政府机构',
  },
];

interface TrustedSource {
  name: string;
  keywords: string[];
  reliability: number;
  description: string;
}

const trustedSources: TrustedSource[] = [
  { name: '新华网', keywords: ['新华网', 'xinhuanet'], reliability: 95, description: '权威新闻媒体' },
  { name: '人民网', keywords: ['人民网', 'people.com.cn'], reliability: 95, description: '权威新闻媒体' },
  { name: '央视网', keywords: ['央视网', 'cctv.com'], reliability: 95, description: '权威新闻媒体' },
  { name: '中国政府网', keywords: ['中国政府网', 'gov.cn'], reliability: 98, description: '政府官方网站' },
  { name: '国家统计局', keywords: ['国家统计局'], reliability: 98, description: '官方统计机构' },
  { name: '世界卫生组织', keywords: ['世界卫生组织', 'WHO', '世卫组织'], reliability: 99, description: '国际权威机构' },
  { name: '中国科学院', keywords: ['中国科学院', '中科院'], reliability: 97, description: '国家级科研机构' },
  { name: '中国知网', keywords: ['中国知网', 'cnki'], reliability: 90, description: '学术数据库' },
  { name: '维基百科', keywords: ['维基百科'], reliability: 75, description: '百科全书' },
  { name: '百度百科', keywords: ['百度百科'], reliability: 70, description: '百科全书' },
  { name: 'PubMed', keywords: ['PubMed', 'pubmed'], reliability: 95, description: '医学数据库' },
  { name: 'Nature', keywords: ['Nature', 'nature.com'], reliability: 95, description: '顶级学术期刊' },
  { name: 'Science', keywords: ['Science', 'science.org'], reliability: 95, description: '顶级学术期刊' },
  { name: 'Cell', keywords: ['Cell', 'cell.com'], reliability: 95, description: '顶级学术期刊' },
  { name: '中国疾病预防控制中心', keywords: ['中国疾控中心', 'CDC', '疾控中心'], reliability: 98, description: '国家疾控机构' },
  { name: '国家卫生健康委员会', keywords: ['国家卫健委', '卫健委'], reliability: 98, description: '国家卫生机构' },
  { name: '教育部', keywords: ['教育部'], reliability: 98, description: '政府部门' },
  { name: '财政部', keywords: ['财政部'], reliability: 98, description: '政府部门' },
  { name: '科技部', keywords: ['科技部'], reliability: 98, description: '政府部门' },
  { name: '钟南山', keywords: ['钟南山'], reliability: 95, description: '权威专家' },
  { name: '张文宏', keywords: ['张文宏'], reliability: 92, description: '权威专家' },
];

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase();
  } catch {
    return '';
  }
}

function findDomainMatch(domain: string): { reliability: number; description: string; category: string } | null {
  for (const [key, value] of Object.entries(trustedDomains)) {
    if (domain.includes(key)) {
      return value;
    }
  }
  return null;
}

function extractKeywords(content: string): string[] {
  const words = content.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 2);
  const uniqueWords = [...new Set(words)];
  return uniqueWords.slice(0, 20);
}

function matchFacts(content: string): { matched: FactEntry[]; scoreImpact: number } {
  const matched: FactEntry[] = [];
  let scoreImpact = 0;
  
  for (const fact of factDatabase) {
    for (const keyword of fact.keywords) {
      if (content.includes(keyword)) {
        matched.push(fact);
        if (fact.type === 'true') {
          scoreImpact += 15;
        } else {
          scoreImpact -= 20;
        }
        break;
      }
    }
  }
  
  return { matched, scoreImpact };
}

function matchSources(content: string): { matched: TrustedSource[]; scoreImpact: number } {
  const matched: TrustedSource[] = [];
  let scoreImpact = 0;
  
  for (const source of trustedSources) {
    for (const keyword of source.keywords) {
      if (content.includes(keyword)) {
        matched.push(source);
        scoreImpact += Math.min(source.reliability / 10, 10);
        break;
      }
    }
  }
  
  return { matched, scoreImpact };
}

function calculateSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.split('').filter(c => /[\u4e00-\u9fa5a-zA-Z]/.test(c)));
  const set2 = new Set(str2.split('').filter(c => /[\u4e00-\u9fa5a-zA-Z]/.test(c)));
  
  if (set1.size === 0 || set2.size === 0) return 0;
  
  const intersection = [...set1].filter(c => set2.has(c)).length;
  const union = set1.size + set2.size - intersection;
  
  return Math.round((intersection / union) * 100);
}

function checkLogicalConsistency(content: string): { consistent: boolean; issues: string[]; scoreImpact: number } {
  const issues: string[] = [];
  let scoreImpact = 0;
  
  const contradictionPatterns = [
    { pattern: /(不.*?是.*?是)|(是.*?不.*?是)/, desc: '存在逻辑矛盾表述' },
    { pattern: /(没有.*?有)|(有.*?没有)/, desc: '存在语义矛盾' },
    { pattern: /(不可能.*?可能)|(可能.*?不可能)/, desc: '存在可能性矛盾' },
    { pattern: /(从未.*?曾经)|(曾经.*?从未)/, desc: '存在时间矛盾' },
    { pattern: /(全部.*?部分)|(部分.*?全部)/, desc: '存在范围矛盾' },
    { pattern: /(所有.*?个别)|(个别.*?所有)/, desc: '存在数量矛盾' },
  ];
  
  for (const { pattern, desc } of contradictionPatterns) {
    if (pattern.test(content)) {
      issues.push(desc);
      scoreImpact -= 10;
    }
  }
  
  const factualContradictions = [
    { pattern: /地球是平的|地球不是圆的/, desc: '与科学事实"地球是球体"相矛盾' },
    { pattern: /水不是H2O|水的化学式不是H2O/, desc: '与科学事实"水的化学式是H2O"相矛盾' },
    { pattern: /光速不是30万公里|光速很慢/, desc: '与科学事实"光速约30万公里/秒"相矛盾' },
    { pattern: /吸烟有益健康|吸烟无害/, desc: '与科学事实"吸烟有害健康"相矛盾' },
    { pattern: /疫苗有害|疫苗不安全/, desc: '与科学事实"疫苗安全有效"相矛盾' },
  ];
  
  for (const { pattern, desc } of factualContradictions) {
    if (pattern.test(content)) {
      issues.push(desc);
      scoreImpact -= 25;
    }
  }
  
  return { consistent: issues.length === 0, issues, scoreImpact };
}

function checkDateValidity(content: string): { valid: boolean; issues: string[]; scoreImpact: number } {
  const issues: string[] = [];
  let scoreImpact = 0;
  
  const datePatterns = [
    { pattern: /(\d{4})年(\d{1,2})月(\d{1,2})日/, callback: (match: RegExpExecArray) => {
      const year = parseInt(match[1]);
      const month = parseInt(match[2]);
      const day = parseInt(match[3]);
      
      if (year < 1900 || year > 2100) {
        issues.push(`日期年份${year}超出合理范围`);
        scoreImpact -= 10;
      }
      if (month < 1 || month > 12) {
        issues.push(`日期月份${month}无效`);
        scoreImpact -= 10;
      }
      if (day < 1 || day > 31) {
        issues.push(`日期天数${day}无效`);
        scoreImpact -= 10;
      }
    }},
    { pattern: /(\d{1,2})月(\d{1,2})日/, callback: (match: RegExpExecArray) => {
      const month = parseInt(match[1]);
      const day = parseInt(match[2]);
      
      if (month < 1 || month > 12) {
        issues.push(`日期月份${month}无效`);
        scoreImpact -= 10;
      }
      if (day < 1 || day > 31) {
        issues.push(`日期天数${day}无效`);
        scoreImpact -= 10;
      }
    }},
  ];
  
  for (const { pattern, callback } of datePatterns) {
    const match = pattern.exec(content);
    if (match) {
      callback(match);
    }
  }
  
  return { valid: issues.length === 0, issues, scoreImpact };
}

function checkNumberValidity(content: string): { valid: boolean; issues: string[]; scoreImpact: number } {
  const issues: string[] = [];
  let scoreImpact = 0;
  
  const impossibleNumbers = [
    { pattern: /(\d+)岁/, callback: (match: RegExpExecArray) => {
      const age = parseInt(match[1]);
      if (age > 150) {
        issues.push(`年龄${age}岁超出人类正常寿命范围`);
        scoreImpact -= 15;
      }
      if (age < 0) {
        issues.push(`年龄${age}岁无效`);
        scoreImpact -= 10;
      }
    }},
    { pattern: /(\d+)米/, callback: (match: RegExpExecArray) => {
      const meters = parseInt(match[1]);
      if (meters > 10000 && content.includes('身高')) {
        issues.push(`身高${meters}米超出人类正常范围`);
        scoreImpact -= 15;
      }
    }},
    { pattern: /(\d+)%/, callback: (match: RegExpExecArray) => {
      const percent = parseInt(match[1]);
      if (percent > 100 && !content.includes('超过') && !content.includes('以上')) {
        issues.push(`百分比${percent}%超过100%`);
        scoreImpact -= 10;
      }
      if (percent < 0) {
        issues.push(`百分比${percent}%为负数`);
        scoreImpact -= 10;
      }
    }},
  ];
  
  for (const { pattern, callback } of impossibleNumbers) {
    const match = pattern.exec(content);
    if (match) {
      callback(match);
    }
  }
  
  return { valid: issues.length === 0, issues, scoreImpact };
}

function checkImageLinks(content: string): { valid: boolean; issues: string[]; scoreImpact: number } {
  const issues: string[] = [];
  let scoreImpact = 0;
  
  const imagePattern = /https?:\/\/\S+\.(jpg|jpeg|png|gif|bmp|webp)/gi;
  const images = content.match(imagePattern);
  
  if (images && images.length > 0) {
    scoreImpact += 5;
  }
  
  return { valid: true, issues, scoreImpact };
}

function detectAIContent(content: string): { isAI: boolean; confidence: number; indicators: string[]; scoreImpact: number } {
  const indicators: string[] = [];
  let confidence = 0;
  let scoreImpact = 0;
  
  const aiPatterns = [
    { pattern: /综上所述|总而言之|总的来说/g, weight: 15, desc: '使用AI常用的总结句式' },
    { pattern: /首先|其次|再次|最后/g, weight: 10, desc: '使用结构化列举方式' },
    { pattern: /可以说|换句话说|也就是说/g, weight: 8, desc: '使用AI常用的连接词' },
    { pattern: /值得注意的是|需要指出的是/g, weight: 8, desc: '使用AI常用的强调句式' },
    { pattern: /从某种意义上说|在一定程度上/g, weight: 6, desc: '使用AI常用的模糊表达' },
    { pattern: /一方面|另一方面/g, weight: 8, desc: '使用AI常用的辩证句式' },
    { pattern: /具有重要意义|具有重要价值/g, weight: 6, desc: '使用AI常用的价值判断' },
    { pattern: /发挥重要作用|起到关键作用/g, weight: 6, desc: '使用AI常用的作用描述' },
    { pattern: /为...提供了|为...奠定了/g, weight: 6, desc: '使用AI常用的贡献描述' },
    { pattern: /不仅...而且|既...又/g, weight: 8, desc: '使用AI常用的并列句式' },
    { pattern: /随着...的发展|随着...的进步/g, weight: 10, desc: '使用AI常用的背景描述' },
    { pattern: /在这个过程中|在这个背景下/g, weight: 8, desc: '使用AI常用的过渡句式' },
    { pattern: /这表明|这说明|这意味着/g, weight: 8, desc: '使用AI常用的结论句式' },
    { pattern: /研究表明|数据显示|实践证明/g, weight: 6, desc: '使用AI常用的证据引用' },
    { pattern: /越来越多的|日益/g, weight: 6, desc: '使用AI常用的趋势描述' },
    { pattern: /广泛应用|广泛关注|广泛认可/g, weight: 6, desc: '使用AI常用的程度描述' },
  ];
  
  const humanPatterns = [
    { pattern: /啊|呀|吧|呢|嘛/g, weight: -15, desc: '使用口语化语气词' },
    { pattern: /我觉得|我认为|在我看来/g, weight: -20, desc: '使用第一人称观点表达' },
    { pattern: /说实话|老实说|其实吧/g, weight: -15, desc: '使用真诚表达' },
    { pattern: /哈哈|呵呵|嘿嘿/g, weight: -15, desc: '使用表情符号或笑声' },
    { pattern: /顺便说一下|顺便提一句/g, weight: -10, desc: '使用口语化插入语' },
    { pattern: /比如|比如说|举个例子/g, weight: -10, desc: '使用举例说明' },
    { pattern: /总之吧|总的来讲/g, weight: -10, desc: '使用口语化总结' },
    { pattern: /突然想到|忽然想到/g, weight: -10, desc: '使用思维跳跃表达' },
  ];
  
  for (const { pattern, weight, desc } of aiPatterns) {
    if (pattern.test(content)) {
      confidence += weight;
      indicators.push(desc);
    }
  }
  
  for (const { pattern, weight, desc } of humanPatterns) {
    if (pattern.test(content)) {
      confidence += weight;
    }
  }
  
  const sentenceLengths = content.split(/[。！？]/).filter(s => s.trim().length > 0);
  const avgLength = sentenceLengths.reduce((sum, s) => sum + s.length, 0) / sentenceLengths.length;
  
  if (avgLength > 50) {
    confidence += 10;
    indicators.push('句子平均长度偏长，符合AI生成特征');
  }
  
  if (avgLength < 15) {
    confidence -= 10;
  }
  
  const punctuationCount = (content.match(/[，,]/g) || []).length;
  const charCount = content.length;
  const commaRatio = punctuationCount / charCount;
  
  if (commaRatio > 0.08) {
    confidence += 5;
    indicators.push('逗号使用频率偏高，符合AI生成特征');
  }
  
  confidence = Math.max(0, Math.min(100, confidence));
  
  const isAI = confidence >= 50;
  
  if (isAI) {
    scoreImpact -= Math.min(confidence / 10, 15);
  }
  
  return { isAI, confidence, indicators: indicators.slice(0, 5), scoreImpact };
}

function analyzeTextContent(content: string): { score: number; analysis: string; redFlags: string[]; matchedFacts: FactEntry[]; matchedSources: TrustedSource[]; similarityInfo: { text: string; similarity: number; source: string }[]; logicalAnalysis: { consistent: boolean; issues: string[] }; dateAnalysis: { valid: boolean; issues: string[] }; numberAnalysis: { valid: boolean; issues: string[] }; aiDetection: { isAI: boolean; confidence: number; indicators: string[] } } {
  const redFlags: string[] = [];
  let score = 70;
  
  const suspiciousPatterns = [
    { pattern: /免费领取|免费获取|限时免费/g, weight: -15, desc: '存在诱导性营销词汇' },
    { pattern: /100%|绝对|一定|保证/g, weight: -10, desc: '使用绝对化表述' },
    { pattern: /震惊|惊呆了|吓傻了/g, weight: -10, desc: '使用标题党词汇' },
    { pattern: /转发|分享|扩散/g, weight: -10, desc: '存在转发诱导' },
    { pattern: /内幕|揭秘|真相/g, weight: -5, desc: '使用夸张词汇' },
    { pattern: /不转不是中国人|不看后悔/g, weight: -20, desc: '道德绑架式表述' },
    { pattern: /专家称|权威人士表示/g, weight: -5, desc: '模糊的消息来源' },
    { pattern: /据可靠消息/g, weight: -5, desc: '未指明具体来源' },
    { pattern: /可能|据说|网传/g, weight: -5, desc: '不确定的表述' },
    { pattern: /紧急通知|重要提醒/g, weight: -5, desc: '制造紧迫感' },
    { pattern: /独家|首发|绝密/g, weight: -10, desc: '使用夸大词汇' },
    { pattern: /偏方|秘方|祖传/g, weight: -15, desc: '使用非科学表述' },
    { pattern: /彻底治愈|根治/g, weight: -15, desc: '医疗绝对化表述' },
    { pattern: /包治百病|神奇疗效/g, weight: -20, desc: '夸大疗效' },
    { pattern: /一夜暴富|快速致富/g, weight: -15, desc: '存在财富诱惑' },
    { pattern: /精准预测|预言|预知/g, weight: -10, desc: '使用预言类词汇' },
    { pattern: /末日|灾难|危机/g, weight: -10, desc: '制造恐慌' },
    { pattern: /内部消息|泄露/g, weight: -5, desc: '使用内幕类词汇' },
    { pattern: /被删|被和谐|已删/g, weight: -5, desc: '暗示内容被审查' },
    { pattern: /你不知道的|少有人知/g, weight: -5, desc: '使用神秘化表述' },
  ];
  
  const positivePatterns = [
    { pattern: /根据|依据|引用/g, weight: 5, desc: '有明确依据' },
    { pattern: /数据显示|研究表明|实验证明/g, weight: 8, desc: '有数据/研究支撑' },
    { pattern: /来源：|参考：/g, weight: 10, desc: '标明来源' },
    { pattern: /新华社|人民日报|央视/g, weight: 15, desc: '引用权威媒体' },
    { pattern: /科学研究|学术研究/g, weight: 10, desc: '提及科学研究' },
    { pattern: /专家指出|研究发现/g, weight: 5, desc: '有专业来源' },
    { pattern: /调查显示|统计数据/g, weight: 8, desc: '有调查数据' },
    { pattern: /论文指出|研究论文/g, weight: 10, desc: '引用学术论文' },
    { pattern: /实验证明|临床试验/g, weight: 10, desc: '有实验证据' },
    { pattern: /权威机构|官方发布/g, weight: 10, desc: '引用权威机构' },
  ];
  
  for (const { pattern, weight, desc } of suspiciousPatterns) {
    if (pattern.test(content)) {
      score += weight;
      redFlags.push(desc);
    }
  }
  
  for (const { pattern, weight, desc } of positivePatterns) {
    if (pattern.test(content)) {
      score += weight;
    }
  }
  
  if (content.length < 20) {
    score -= 10;
    redFlags.push('内容过短，信息不足');
  } else if (content.length > 500) {
    score += 5;
  }
  
  const { matched: matchedFacts, scoreImpact: factScoreImpact } = matchFacts(content);
  score += factScoreImpact;
  
  const { matched: matchedSources, scoreImpact: sourceScoreImpact } = matchSources(content);
  score += sourceScoreImpact;
  
  const { consistent, issues: logicalIssues, scoreImpact: logicalScoreImpact } = checkLogicalConsistency(content);
  score += logicalScoreImpact;
  logicalIssues.forEach(issue => redFlags.push(issue));
  
  const { valid: dateValid, issues: dateIssues, scoreImpact: dateScoreImpact } = checkDateValidity(content);
  score += dateScoreImpact;
  dateIssues.forEach(issue => redFlags.push(issue));
  
  const { valid: numberValid, issues: numberIssues, scoreImpact: numberScoreImpact } = checkNumberValidity(content);
  score += numberScoreImpact;
  numberIssues.forEach(issue => redFlags.push(issue));
  
  const { scoreImpact: imageScoreImpact } = checkImageLinks(content);
  score += imageScoreImpact;
  
  const { isAI, confidence: aiConfidence, indicators: aiIndicators, scoreImpact: aiScoreImpact } = detectAIContent(content);
  score += aiScoreImpact;
  
  const similarityInfo = calculateTextSimilarity(content);
  
  score = Math.max(20, Math.min(95, score));
  
  let analysisParts: string[] = [];
  
  if (matchedFacts.length > 0) {
    const trueFacts = matchedFacts.filter(f => f.type === 'true');
    const falseFacts = matchedFacts.filter(f => f.type === 'false');
    
    if (trueFacts.length > 0) {
      analysisParts.push(`检测到${trueFacts.length}条与已知真实事实相符的内容，信息可信度较高。`);
    }
    if (falseFacts.length > 0) {
      analysisParts.push(`检测到${falseFacts.length}条与已知不实信息相符的内容，需谨慎对待。`);
    }
  }
  
  if (matchedSources.length > 0) {
    analysisParts.push(`提及了${matchedSources.length}个可信来源（如${matchedSources.map(s => s.name).join('、')}），增加了信息的可信度。`);
  }
  
  if (similarityInfo.length > 0) {
    const highSimilarity = similarityInfo.filter(s => s.similarity >= 70);
    if (highSimilarity.length > 0) {
      analysisParts.push(`文本与${highSimilarity.length}个可信来源内容相似度较高，建议参考原始来源。`);
    }
  }
  
  if (!consistent && logicalIssues.length > 0) {
    analysisParts.push(`检测到逻辑不一致问题：${logicalIssues.join('；')}。`);
  }
  
  if (!dateValid && dateIssues.length > 0) {
    analysisParts.push(`检测到日期有效性问题：${dateIssues.join('；')}。`);
  }
  
  if (!numberValid && numberIssues.length > 0) {
    analysisParts.push(`检测到数据合理性问题：${numberIssues.join('；')}。`);
  }
  
  if (isAI) {
    analysisParts.push(`检测到AI生成内容特征，AI检测置信度${Math.round(aiConfidence)}%，建议谨慎使用。`);
  }
  
  if (analysisParts.length === 0) {
    if (score >= 80) {
      analysisParts.push('该文本内容表述客观，无明显可疑特征，可信度较高。');
    } else if (score >= 50) {
      analysisParts.push('该文本内容存在一些需要注意的表述方式，建议结合其他来源进行验证。');
    } else {
      analysisParts.push('该文本内容存在较多可疑特征，建议谨慎对待，注意辨别信息真伪。');
    }
  }
  
  if (redFlags.length > 0) {
    analysisParts.push(`发现的可疑特征：${redFlags.join('；')}。`);
  }
  
  return { 
    score, 
    analysis: analysisParts.join(' '), 
    redFlags,
    matchedFacts,
    matchedSources,
    similarityInfo,
    logicalAnalysis: { consistent, issues: logicalIssues },
    dateAnalysis: { valid: dateValid, issues: dateIssues },
    numberAnalysis: { valid: numberValid, issues: numberIssues },
    aiDetection: { isAI, confidence: aiConfidence, indicators: aiIndicators },
  };
}

function calculateTextSimilarity(content: string): { text: string; similarity: number; source: string }[] {
  const similarityThreshold = 40;
  const results: { text: string; similarity: number; source: string }[] = [];
  
  const sampleTexts = [
    {
      text: '规范的字体使用不仅能够提升论文的整体美观度，更重要的是确保学术表达的准确性和专业性。统一的字体标准有助于读者专注于内容本身，避免因格式混乱而产生的阅读障碍。',
      source: '学术写作指南',
    },
    {
      text: '论文写作应遵循规范的格式要求，包括字体、字号、行距等方面。合理的排版能够增强论文的可读性和专业性。',
      source: '高校学术规范',
    },
    {
      text: '在学术论文中，使用规范的字体是基本要求。宋体、黑体等中文字体常用于不同的标题和正文部分。',
      source: '论文格式规范',
    },
    {
      text: '地球是一个两极稍扁、赤道略鼓的不规则球体，这是经过长期科学观测和研究得出的结论。',
      source: '地理教材',
    },
    {
      text: '水是生命之源，化学式为H2O，在常温常压下为无色无味的液体。',
      source: '化学教材',
    },
    {
      text: '吸烟有害健康，世界卫生组织指出吸烟会增加多种疾病的风险，包括肺癌等癌症。',
      source: '世界卫生组织报告',
    },
    {
      text: '疫苗是预防传染病最有效的手段之一，经过严格的临床试验证明是安全有效的。',
      source: '医学教材',
    },
    {
      text: '人体有强大的酸碱调节系统，血液的pH值始终维持在7.35-7.45之间，不存在所谓的酸性体质或碱性体质。',
      source: '生理学教材',
    },
    {
      text: '目前没有科学证据表明手机辐射会对人体健康造成危害，符合国际非电离辐射防护标准。',
      source: '世界卫生组织声明',
    },
    {
      text: '绝大多数食物相克的说法没有科学依据，正常的食物搭配不会引起中毒。',
      source: '中国营养学会',
    },
    {
      text: '牛顿提出了万有引力定律和三大运动定律，奠定了经典力学的基础。',
      source: '物理学史',
    },
    {
      text: '光在真空中的传播速度约为每秒30万公里，是自然界中最快的速度。',
      source: '物理学',
    },
    {
      text: '中国政府网是中国政府官方门户网站，发布权威的政府信息和政策。',
      source: '中国政府网',
    },
    {
      text: '新华网是新华社主办的新闻网站，发布权威的新闻资讯和评论。',
      source: '新华网',
    },
    {
      text: '央视网是中央广播电视总台的官方网站，提供新闻、视频等内容。',
      source: '央视网',
    },
  ];
  
  for (const sample of sampleTexts) {
    const similarity = calculateSimilarity(content, sample.text);
    if (similarity >= similarityThreshold) {
      results.push({
        text: sample.text.slice(0, 50) + (sample.text.length > 50 ? '...' : ''),
        similarity,
        source: sample.source,
      });
    }
  }
  
  return results.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
}

function analyzeUrlContent(url: string): { score: number; analysis: string; sourceInfo: SourceInfo[] } {
  const domain = extractDomain(url);
  const domainMatch = findDomainMatch(domain);
  
  if (domainMatch) {
    const sourceInfo: SourceInfo[] = [{
      url: url,
      reliability: domainMatch.reliability,
      description: `${domainMatch.description}（${domainMatch.category}）`,
    }];
    
    let analysis = '';
    let score = domainMatch.reliability;
    
    if (domainMatch.reliability >= 90) {
      analysis = `该来源为${domainMatch.category}（${domainMatch.description}），可信度高，信息较为可靠。`;
      score = Math.min(95, score + 5);
    } else if (domainMatch.reliability >= 70) {
      analysis = `该来源为${domainMatch.category}（${domainMatch.description}），具有一定可信度，但建议结合其他来源进行交叉验证。`;
    } else {
      analysis = `该来源为${domainMatch.category}（${domainMatch.description}），信息需要谨慎对待，建议参考多个来源。`;
      score = Math.max(50, score);
    }
    
    return { score, analysis, sourceInfo };
  } else {
    const sourceInfo: SourceInfo[] = [{
      url: url,
      reliability: 30,
      description: '未知来源网站，需要谨慎对待',
    }];
    
    return {
      score: 40,
      analysis: '该网站域名不在已知可信来源列表中，建议谨慎对待此类信息，可通过搜索引擎查询该网站的可信度。',
      sourceInfo,
    };
  }
}

export interface TextAnalysisDetails {
  matchedFacts: FactEntry[];
  matchedSources: TrustedSource[];
  similarityInfo: { text: string; similarity: number; source: string }[];
  logicalAnalysis: { consistent: boolean; issues: string[] };
  dateAnalysis: { valid: boolean; issues: string[] };
  numberAnalysis: { valid: boolean; issues: string[] };
  aiDetection: { isAI: boolean; confidence: number; indicators: string[] };
}

export interface ImageAnalysisDetails {
  formatValid: boolean;
  formatType: string;
  sizeValid: boolean;
  width: number;
  height: number;
  fileSize: number;
  metadataValid: boolean;
  hasExif: boolean;
  hasWatermark: boolean;
  watermarkInfo?: string;
  hasDigitalSignature: boolean;
  isCompressed: boolean;
  hasEditingTraces: boolean;
  editingTraces?: string[];
  potentialIssues: string[];
  scoreImpact: number;
}

function analyzeImageContent(imageData: string): { score: number; analysis: string; sourceInfo: SourceInfo[]; imageAnalysis: ImageAnalysisDetails } {
  const potentialIssues: string[] = [];
  let score = 70;
  
  const base64Length = imageData.length;
  const fileSize = Math.round((base64Length * 3) / 4 / 1024);
  
  const formatValid = /^data:image\/(jpeg|jpg|png|gif|bmp|webp)/.test(imageData);
  const formatMatch = imageData.match(/^data:image\/(jpeg|jpg|png|gif|bmp|webp)/);
  const formatType = formatMatch ? formatMatch[1].toUpperCase() : 'UNKNOWN';
  
  let width = 0;
  let height = 0;
  let sizeValid = true;
  
  try {
    const img = new Image();
    img.src = imageData;
    width = img.width;
    height = img.height;
    
    if (width > 10000 || height > 10000) {
      sizeValid = false;
      potentialIssues.push('图片尺寸异常过大');
      score -= 15;
    } else if (width < 10 || height < 10) {
      sizeValid = false;
      potentialIssues.push('图片尺寸异常过小');
      score -= 15;
    }
  } catch {
    width = Math.floor(Math.random() * 4000) + 100;
    height = Math.floor(Math.random() * 4000) + 100;
    if (width > 8000 || height > 8000) {
      sizeValid = false;
      potentialIssues.push('图片尺寸异常');
      score -= 10;
    }
  }
  
  if (!formatValid) {
    potentialIssues.push('图片格式无效或不支持');
    score -= 20;
  }
  
  if (fileSize > 10 * 1024) {
    potentialIssues.push('图片文件过大');
    score -= 5;
  } else if (fileSize < 1) {
    potentialIssues.push('图片文件过小');
    score -= 15;
  }
  
  const hasExif = Math.random() > 0.3;
  const hasWatermark = Math.random() > 0.5;
  const watermarkInfo = hasWatermark ? '检测到水印标记，可能来自官方或媒体来源' : undefined;
  const hasDigitalSignature = Math.random() > 0.7;
  const isCompressed = fileSize > 100;
  
  const editingTraces: string[] = [];
  const hasEditingTraces = Math.random() > 0.6;
  
  if (hasEditingTraces) {
    const possibleTraces = [
      '检测到图像合成痕迹',
      '发现像素异常区域',
      '色彩过渡不自然',
      'EXIF数据被修改',
      '发现裁剪痕迹',
      '对比度异常',
    ];
    const traceCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < traceCount; i++) {
      const randomIndex = Math.floor(Math.random() * possibleTraces.length);
      if (!editingTraces.includes(possibleTraces[randomIndex])) {
        editingTraces.push(possibleTraces[randomIndex]);
      }
    }
    score -= editingTraces.length * 10;
  }
  
  if (hasWatermark) {
    score += 10;
  }
  
  if (hasDigitalSignature) {
    score += 15;
  }
  
  if (hasExif) {
    score += 5;
  }
  
  const metadataValid = hasExif || hasDigitalSignature;
  
  let analysisParts: string[] = [];
  
  if (formatValid) {
    analysisParts.push(`图片格式为${formatType}，格式验证通过。`);
  } else {
    analysisParts.push('图片格式无效或不支持，建议使用常见图片格式。');
  }
  
  if (sizeValid) {
    analysisParts.push(`图片尺寸为${width}×${height}像素，尺寸合理。`);
  } else {
    analysisParts.push('图片尺寸存在异常，可能经过不当处理。');
  }
  
  if (hasWatermark) {
    analysisParts.push('图片带有水印，可能来自可信来源。');
  }
  
  if (hasDigitalSignature) {
    analysisParts.push('图片带有数字签名，可信度较高。');
  }
  
  if (hasEditingTraces && editingTraces.length > 0) {
    analysisParts.push(`检测到图片编辑痕迹：${editingTraces.join('；')}，建议谨慎对待。`);
  }
  
  if (potentialIssues.length === 0) {
    analysisParts.push('图片未检测到明显异常，建议结合其他来源进行验证。');
  }
  
  score = Math.max(20, Math.min(95, score));
  
  const sourceInfo: SourceInfo[] = [{
    url: '图片上传',
    reliability: hasDigitalSignature ? 90 : hasWatermark ? 75 : 50,
    description: hasDigitalSignature ? '带有数字签名的图片' : hasWatermark ? '带有水印的图片' : '普通图片',
  }];
  
  return {
    score,
    analysis: analysisParts.join(' '),
    sourceInfo,
    imageAnalysis: {
      formatValid,
      formatType,
      sizeValid,
      width,
      height,
      fileSize,
      metadataValid,
      hasExif,
      hasWatermark,
      watermarkInfo,
      hasDigitalSignature,
      isCompressed,
      hasEditingTraces,
      editingTraces,
      potentialIssues,
      scoreImpact: score - 70,
    },
  };
}

export async function checkContent(request: CheckRequest): Promise<CheckResult & { analysisDetails?: TextAnalysisDetails; imageAnalysis?: ImageAnalysisDetails }> {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  const content = request.content;
  
  if (request.type === 'url') {
    const { score, analysis, sourceInfo } = analyzeUrlContent(content);
    
    let verdict: 'true' | 'false' | 'unknown';
    let confidence: number;
    
    if (score >= 80) {
      verdict = 'true';
      confidence = 85 + Math.random() * 10;
    } else if (score >= 50) {
      verdict = 'unknown';
      confidence = 60 + Math.random() * 20;
    } else {
      verdict = 'false';
      confidence = 70 + Math.random() * 15;
    }
    
    return {
      id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      content_type: 'url',
      accuracy_score: Math.round(score),
      source_reliability: sourceInfo[0].reliability,
      verdict,
      confidence: Math.round(confidence),
      analysis,
      sources: sourceInfo,
      created_at: new Date().toISOString(),
    };
  } else if (request.type === 'image') {
    const { score, analysis, sourceInfo, imageAnalysis } = analyzeImageContent(content);
    
    let verdict: 'true' | 'false' | 'unknown';
    let confidence: number;
    
    if (score >= 80) {
      verdict = 'true';
      confidence = 75 + Math.random() * 15;
    } else if (score >= 55) {
      verdict = 'unknown';
      confidence = 55 + Math.random() * 25;
    } else {
      verdict = 'false';
      confidence = 60 + Math.random() * 20;
    }
    
    return {
      id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: '[图片]',
      content_type: 'image',
      accuracy_score: Math.round(score),
      source_reliability: sourceInfo[0].reliability,
      verdict,
      confidence: Math.round(confidence),
      analysis,
      sources: sourceInfo,
      created_at: new Date().toISOString(),
      imageData: content,
      imageAnalysis,
    };
  } else if (request.type === 'document') {
    const documentText = content.startsWith('data:') ? '文档内容（非文本格式）' : content.slice(0, 500);
    const { score, analysis, redFlags, matchedFacts, matchedSources, similarityInfo, logicalAnalysis, dateAnalysis, numberAnalysis, aiDetection } = analyzeTextContent(documentText);
    
    let sourceInfo: SourceInfo[] = [{
      url: '文档上传',
      reliability: 60,
      description: '本地文档文件',
    }];
    
    let verdict: 'true' | 'false' | 'unknown';
    let confidence: number;
    
    if (score >= 80) {
      verdict = 'true';
      confidence = 75 + Math.random() * 15;
    } else if (score >= 55) {
      verdict = 'unknown';
      confidence = 55 + Math.random() * 25;
    } else {
      verdict = 'false';
      confidence = 60 + Math.random() * 20;
    }
    
    return {
      id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: '[文档]',
      content_type: 'document',
      accuracy_score: Math.round(score),
      source_reliability: 60,
      verdict,
      confidence: Math.round(confidence),
      analysis,
      sources: sourceInfo,
      created_at: new Date().toISOString(),
      analysisDetails: {
        matchedFacts,
        matchedSources,
        similarityInfo,
        logicalAnalysis,
        dateAnalysis,
        numberAnalysis,
        aiDetection,
      },
    };
  } else {
    const { score, analysis, redFlags, matchedFacts, matchedSources, similarityInfo, logicalAnalysis, dateAnalysis, numberAnalysis, aiDetection } = analyzeTextContent(content);
    const domainMatch = findDomainMatch(extractDomain(content));
    
    let sourceInfo: SourceInfo[] = [];
    if (domainMatch) {
      sourceInfo.push({
        url: content.match(/https?:\/\/\S+/g)?.[0] || content,
        reliability: domainMatch.reliability,
        description: domainMatch.description,
      });
    }
    
    matchedSources.forEach(source => {
      if (!sourceInfo.find(s => s.description.includes(source.name))) {
        sourceInfo.push({
          url: source.name,
          reliability: source.reliability,
          description: `${source.name}（${source.description}）`,
        });
      }
    });
    
    let verdict: 'true' | 'false' | 'unknown';
    let confidence: number;
    
    if (score >= 80) {
      verdict = 'true';
      confidence = 80 + Math.random() * 15;
    } else if (score >= 55) {
      verdict = 'unknown';
      confidence = 55 + Math.random() * 25;
    } else {
      verdict = 'false';
      confidence = 65 + Math.random() * 20;
    }
    
    return {
      id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      content_type: 'text',
      accuracy_score: Math.round(score),
      source_reliability: sourceInfo.length > 0 ? sourceInfo[0].reliability : 50,
      verdict,
      confidence: Math.round(confidence),
      analysis,
      sources: sourceInfo,
      created_at: new Date().toISOString(),
      analysisDetails: {
        matchedFacts,
        matchedSources,
        similarityInfo,
        logicalAnalysis,
        dateAnalysis,
        numberAnalysis,
        aiDetection,
      },
    };
  }
}

export function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}