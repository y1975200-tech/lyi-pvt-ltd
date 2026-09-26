import { PortfolioItem, TestimonialItem, ClientLogoItem } from '../types.ts';

export { type PortfolioItem, type ClientLogoItem };

export const DEFAULT_CLIENT_LOGOS: ClientLogoItem[] = [
  {
    id: 'logo-1',
    name: 'Tata Consultancy Services',
    tag: 'Enterprise IT & Cloud',
    accentColor: '#0284c7',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><text x="10" y="33" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="%230284c7">tcs</text><text x="58" y="24" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="%230f172a">TATA</text><text x="58" y="36" font-family="Arial,sans-serif" font-weight="500" font-size="9" fill="%2364748b">CONSULTANCY</text></svg>',
    websiteUrl: 'https://www.tcs.com',
  },
  {
    id: 'logo-2',
    name: 'Reliance Industries / Jio',
    tag: 'Telecom & Energy',
    accentColor: '#dc2626',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><circle cx="28" cy="25" r="16" fill="%23e11d48"/><text x="28" y="31" font-family="Arial,sans-serif" font-weight="900" font-size="16" fill="white" text-anchor="middle">Jio</text><text x="54" y="32" font-family="Arial,sans-serif" font-weight="800" font-size="16" fill="%231e3a8a">Reliance</text></svg>',
    websiteUrl: 'https://www.ril.com',
  },
  {
    id: 'logo-3',
    name: 'Infosys',
    tag: 'Global Tech & AI',
    accentColor: '#007cc3',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><text x="10" y="33" font-family="Arial,sans-serif" font-weight="900" font-size="26" fill="%23007cc3" letter-spacing="-1">Infosys</text><circle cx="106" cy="18" r="3" fill="%23e11d48"/></svg>',
    websiteUrl: 'https://www.infosys.com',
  },
  {
    id: 'logo-4',
    name: 'Wipro Technologies',
    tag: 'Enterprise Cloud & IT',
    accentColor: '#5846f6',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><text x="12" y="33" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="%235846f6">wipro</text><circle cx="90" cy="20" r="4.5" fill="%23f97316"/><circle cx="102" cy="24" r="5" fill="%2310b981"/><circle cx="115" cy="30" r="5.5" fill="%2306b6d4"/></svg>',
    websiteUrl: 'https://wipro.com',
  },
  {
    id: 'logo-5',
    name: 'Razorpay',
    tag: 'FinTech & Payments',
    accentColor: '#0c83fe',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><path d="M15,10 L35,10 L25,35 L45,35 L30,48 L35,28 L20,28 Z" fill="%230c83fe"/><text x="48" y="33" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="%230c2340">Razorpay</text></svg>',
    websiteUrl: 'https://razorpay.com',
  },
  {
    id: 'logo-6',
    name: 'Microsoft',
    tag: 'Cloud & AI Platform',
    accentColor: '#00a4ef',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><rect x="12" y="14" width="10" height="10" fill="%23f25022"/><rect x="24" y="14" width="10" height="10" fill="%237fba00"/><rect x="12" y="26" width="10" height="10" fill="%2300a4ef"/><rect x="24" y="26" width="10" height="10" fill="%23ffb900"/><text x="42" y="33" font-family="Arial,sans-serif" font-weight="600" font-size="18" fill="%23505050">Microsoft</text></svg>',
    websiteUrl: 'https://azure.microsoft.com',
  },
  {
    id: 'logo-7',
    name: 'Tech Mahindra',
    tag: 'Next-Gen IT & Telecom',
    accentColor: '#e11d48',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><rect x="10" y="14" width="22" height="22" rx="4" fill="%23e11d48"/><text x="17" y="31" font-family="Arial,sans-serif" font-weight="bold" font-size="16" fill="white">M</text><text x="38" y="24" font-family="Arial,sans-serif" font-weight="900" font-size="14" fill="%230f172a">Tech</text><text x="38" y="38" font-family="Arial,sans-serif" font-weight="900" font-size="14" fill="%23e11d48">Mahindra</text></svg>',
    websiteUrl: 'https://techmahindra.com',
  },
  {
    id: 'logo-8',
    name: 'Persistent Systems',
    tag: 'Software Engineering',
    accentColor: '#f97316',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><circle cx="24" cy="25" r="14" fill="%23f97316"/><text x="24" y="31" font-family="Arial,sans-serif" font-weight="bold" font-size="16" fill="white" text-anchor="middle">P</text><text x="46" y="33" font-family="Arial,sans-serif" font-weight="800" font-size="16" fill="%231e293b">Persistent</text></svg>',
    websiteUrl: 'https://www.persistent.com',
  },
  {
    id: 'logo-9',
    name: 'Zomato Enterprise',
    tag: 'Logistics & Quick Commerce',
    accentColor: '#cb202d',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><rect x="10" y="10" width="130" height="30" rx="8" fill="%23cb202d"/><text x="75" y="31" font-family="Arial,sans-serif" font-weight="900" font-style="italic" font-size="20" fill="white" text-anchor="middle">zomato</text></svg>',
    websiteUrl: 'https://zomato.com',
  },
  {
    id: 'logo-10',
    name: 'Bajaj Auto',
    tag: 'Automotive Manufacturing',
    accentColor: '#0284c7',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><polygon points="15,35 25,15 35,35 30,35 25,23 20,35" fill="%230284c7"/><text x="44" y="32" font-family="Arial,sans-serif" font-weight="900" font-size="18" fill="%230369a1">BAJAJ</text></svg>',
    websiteUrl: 'https://www.bajajauto.com',
  },
  {
    id: 'logo-11',
    name: 'Serum Institute of India',
    tag: 'BioTech & Health Sciences',
    accentColor: '#059669',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><circle cx="24" cy="25" r="14" fill="%23059669"/><path d="M24,17 L24,33 M16,25 L32,25" stroke="white" stroke-width="3"/><text x="46" y="27" font-family="Arial,sans-serif" font-weight="800" font-size="14" fill="%23065f46">SERUM</text><text x="46" y="38" font-family="Arial,sans-serif" font-weight="600" font-size="10" fill="%23047857">INSTITUTE</text></svg>',
    websiteUrl: 'https://www.seruminstitute.com',
  },
  {
    id: 'logo-12',
    name: 'Google Cloud Partner',
    tag: 'AI Infrastructure',
    accentColor: '#4285F4',
    width: 140,
    height: 48,
    fit: 'contain',
    logoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50"><text x="12" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%234285F4">G</text><text x="32" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%23EA4335">o</text><text x="46" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%23FBBC05">o</text><text x="60" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%234285F4">g</text><text x="74" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%2334A853">l</text><text x="80" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="20" fill="%23EA4335">e</text><text x="96" y="32" font-family="Arial,sans-serif" font-weight="bold" font-size="14" fill="%235F6368">Cloud</text></svg>',
    websiteUrl: 'https://cloud.google.com',
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote: '"LockYourIdea Tech built our end-to-end AI quality audit platform in Baner, Pune. Our defect inspection rate plummeted by 44% in the first quarter of deployment."',
    author: 'Rajesh Kulkarni',
    role: 'VP Operations',
    company: 'AutoTech Precision Ltd., Pune',
    initials: 'RK',
    rating: 5,
  },
  {
    id: 't2',
    quote: '"Their dual proficiency in AI architecture and Patent law is completely unmatched in India. They filed our 3 core deep-tech patents while shipping the production models."',
    author: 'Sunita Deshmukh',
    role: 'Founder & CEO',
    company: 'NeuralBio HealthTech, Bengaluru',
    initials: 'SD',
    rating: 5,
  },
  {
    id: 't3',
    quote: '"The Agentic CRM and automated quotation system transformed our B2B manufacturing sales. Our quote turnaround dropped from 48 hours to literally 15 minutes."',
    author: 'Amitabh Joshi',
    role: 'Managing Director',
    company: 'Kalyani Forge Components, Chakan',
    initials: 'AJ',
    rating: 5,
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    category: 'AI Software',
    title: 'Enterprise Inventory Intelligence Platform',
    description: 'Automated stock forecasting and anomaly detection across 42 warehouses in Pune & Mumbai.',
    tag: 'AI Software',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    client: 'Zenith Logistics Ltd.',
    result: '42% lower stockout rate',
    projectUrl: 'https://lockyourideatech.com/portfolio/inventory-intelligence',
  },
  {
    id: '2',
    category: 'AI Platforms',
    title: 'Multi-Tenant AI Analytics Platform',
    description: 'B2B enterprise SaaS with automated data ingestion and natural language query generation.',
    tag: 'AI Platforms',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    client: 'QuantEdge Analytics',
    result: '10x faster SQL query time',
    projectUrl: 'https://lockyourideatech.com/portfolio/ai-analytics',
  },
  {
    id: '3',
    category: 'Automation',
    title: 'End-to-End HR Automation Suite',
    description: 'Candidate screening, offer generation, and onboarding for a 5,000+ employee conglomerate.',
    tag: 'Automation',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    client: 'Apex Corporate Group',
    result: '80% faster hiring cycle',
    projectUrl: 'https://lockyourideatech.com/portfolio/hr-automation',
  },
  {
    id: '4',
    category: 'CRM',
    title: 'Agentic CRM Rollout — Manufacturing Client',
    description: 'Autonomous lead qualification, automated quoting, and sales pipeline optimization.',
    tag: 'CRM',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    client: 'Bharat Precision Forge, Pune',
    result: '₹1.8 Cr revenue uplift',
    projectUrl: 'https://lockyourideatech.com/portfolio/agentic-crm',
  },
  {
    id: '5',
    category: 'AI Video Ads',
    title: 'D2C Brand Launch Video Campaign',
    description: '12 localized, high-definition AI promotional videos generated in under 72 hours.',
    tag: 'AI Video Ads',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    client: 'Nectar Botanicals D2C',
    result: '3.4x ROAS on Meta ads',
    projectUrl: 'https://lockyourideatech.com/portfolio/ai-video-ads',
  },
  {
    id: '6',
    category: 'AI Avatars',
    title: 'CEO Digital Avatar for Investor Updates',
    description: 'Multilingual executive avatar deployed across 4 quarterly shareholder meetings.',
    tag: 'AI Avatars',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    client: 'FinTech Innovations India',
    result: 'Zero filming studio overhead',
    projectUrl: 'https://lockyourideatech.com/portfolio/ceo-avatar',
  },
  {
    id: '7',
    category: 'Government AI',
    title: 'Smart City AI Capacity Program',
    description: 'Trained 350+ municipal engineers on automated traffic analysis and predictive utility maintenance.',
    tag: 'Government AI',
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
    client: 'Pune Smart City Development Corp',
    result: '350+ certified engineers',
    projectUrl: 'https://lockyourideatech.com/portfolio/smart-city-ai',
  },
  {
    id: '8',
    category: 'Patent Projects',
    title: 'Deep-Tech Patent Portfolio — 12 Filings',
    description: 'Cross-border patent filings spanning India, US, and EPO for optical sensor architecture.',
    tag: 'Patent Projects',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    client: 'PhotonSense Tech Labs',
    result: '100% first-examination approval',
    projectUrl: 'https://ipindia.gov.in',
  },
  {
    id: '9',
    category: 'Trademark Success',
    title: 'National Retail Brand Trademark Protection',
    description: 'Defended retail trademark across Class 25 & 35 with nationwide cease-and-desist enforcement.',
    tag: 'Trademark Success',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    client: 'UrbanVogue Apparel',
    result: '14 counterfeit infringers stopped',
    projectUrl: 'https://ipindia.gov.in',
  },
  {
    id: '10',
    category: 'AI Software',
    title: 'AI-Powered Document Intelligence Tool',
    description: 'Extraction and compliance scoring for unstructured legal contracts and tenders.',
    tag: 'AI Software',
    imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
    client: 'Lexis Legal Partners',
    result: '94% automated clause extraction',
    projectUrl: 'https://lockyourideatech.com/portfolio/document-ai',
  },
  {
    id: '11',
    category: 'Automation',
    title: 'Finance Reconciliation Automation',
    description: 'Reduced bank and ledger mismatch resolution time by 82% using automated heuristics.',
    tag: 'Automation',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    client: 'Kalyani Trading Co., Pune',
    result: '₹34 Lakh monthly savings',
    projectUrl: 'https://lockyourideatech.com/portfolio/finance-automation',
  },
  {
    id: '12',
    category: 'Government AI',
    title: 'State Department Chatbot Deployment',
    description: 'Multilingual citizen query assistant handling over 40,000 daily service queries.',
    tag: 'Government AI',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    client: 'Maharashtra Urban Directorate',
    result: '40,000+ daily citizens served',
    projectUrl: 'https://maharashtra.gov.in',
  },
];

export interface IndustryItem {
  id?: string;
  name: string;
  challenge: string;
  aiSolution: string;
  ipSolution: string;
  caseStudy: string;
  icon?: string;
  metric?: string;
  name_style?: any;
  [key: string]: any;
}

export const INDUSTRIES_LIST: IndustryItem[] = [
  {
    name: 'Government',
    challenge: 'Citizen service delays, manual record processing, and siloed departmental databases.',
    aiSolution: 'AI-driven service automation, citizen grievance triage, and departmental capacity building.',
    ipSolution: 'Patent & IP asset protection for state R&D institutions and smart city technologies.',
    caseStudy: 'Smart City AI enablement program deployed across municipal wards.',
  },
  {
    name: 'Manufacturing',
    challenge: 'Manual inventory tracking, quality inspection bottlenecks, and unplanned machine downtime.',
    aiSolution: 'Computer vision automated QA inspection and predictive sensor maintenance.',
    ipSolution: 'Process and apparatus patents protecting proprietary machinery and fabrication tooling.',
    caseStudy: 'Automated QA vision system reduced production defects by 30%.',
  },
  {
    name: 'Healthcare',
    challenge: 'Administrative overload, doctor burnout, and delayed diagnostic triage.',
    aiSolution: 'Clinical documentation AI, patient intake scheduling, and triage assistants.',
    ipSolution: 'Patents for novel medical apparatus and copyright protection for proprietary diagnostic code.',
    caseStudy: 'AI scheduling assistant successfully deployed across 6 regional clinics.',
  },
  {
    name: 'Education',
    challenge: 'Manual admissions intake, delayed applicant support, and outdated curriculum.',
    aiSolution: '24/7 student inquiry chatbots and executive AI prompt engineering workshops for faculty.',
    ipSolution: 'Copyright registration for digital curriculum, LMS platforms, and educational media.',
    caseStudy: 'AI admissions assistant scaled across 3 major university campuses.',
  },
  {
    name: 'Retail',
    challenge: 'Fragmented customer touchpoints, high cart abandonment, and copycat counterfeit brands.',
    aiSolution: 'WhatsApp conversational commerce, automated lead scoring, and instant personalized video ads.',
    ipSolution: 'Class 35 trademark defense and industrial design protection for packaging.',
    caseStudy: 'WhatsApp automation lifted repeat customer orders by 22%.',
  },
  {
    name: 'Banking & Fintech',
    challenge: 'Heavy manual compliance workloads, delayed KYC turnaround, and high operational costs.',
    aiSolution: 'Document AI verification, statement analysis, and robotic process automation.',
    ipSolution: 'IP strategy & patent claims for novel fintech algorithms and encryption architectures.',
    caseStudy: 'Automated document processing slashed turnaround time by 40%.',
  },
  {
    name: 'Pharma & Biotech',
    challenge: 'Lengthy R&D discovery timelines and vulnerable patent filing windows ahead of disclosures.',
    aiSolution: 'Predictive compound search and automated clinical trial data extraction.',
    ipSolution: 'Prior-art novelty searches, provisional patent filing, and patent portfolio valuation.',
    caseStudy: 'Patent portfolio strategy developed for 8 pipeline molecules ahead of funding.',
  },
  {
    name: 'Logistics',
    challenge: 'Manual dispatch coordination, delivery leakage, and dynamic fuel cost volatility.',
    aiSolution: 'Route optimization algorithms, freight rate estimation, and automated dispatch alerts.',
    ipSolution: 'Defensible IP strategy protecting logistics scheduling algorithms.',
    caseStudy: 'Automated dispatch intelligence reduced delivery delays by 18%.',
  },
  {
    name: 'Real Estate',
    challenge: 'Slow response to high-intent property inquiries and unorganized broker pipelines.',
    aiSolution: 'Agentic CRM with automated lead scoring, brochure delivery on WhatsApp, and follow-ups.',
    ipSolution: 'Trademark protection for project branding, slogans, and architectural design registration.',
    caseStudy: 'CRM rollout doubled lead response speed within 45 days.',
  },
  {
    name: 'MSMEs',
    challenge: 'Limited budgets for dedicated IT engineering and lack of affordable legal protection.',
    aiSolution: 'Pre-configured business automation bundles for sales, invoicing, and support.',
    ipSolution: 'Streamlined, cost-effective trademark registration and copyright filing packages.',
    caseStudy: 'MSME automation suite cut daily administrative time by 50%.',
  },
];

export interface CaseStudyItem {
  division: 'AI Hub' | 'IP Hub';
  title: string;
  client: string;
  challenge: string;
  solution: string;
  result: string;
}

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    division: 'AI Hub',
    title: 'Agentic CRM & Quotation Automation for Manufacturing',
    client: 'Industrial Equipment Manufacturer, Pune',
    challenge: 'Manual lead follow-up caused 30% lead leakage and 48-hour quote turnaround bottlenecks across 14 distributor networks.',
    solution: 'Deployed Agentic CRM with automated AI lead scoring, instant quotation generators, and multi-channel follow-ups on WhatsApp & Email.',
    result: 'Lead conversion improved by 28% within 90 days, with quote turnaround time dropping from 48 hours to 15 minutes.',
  },
  {
    division: 'IP Hub',
    title: 'Patent Portfolio Strategy for a Deep-Tech Robotics Startup',
    client: 'Sensory Robotics & Computer Vision Startup, Bengaluru',
    challenge: 'Startup possessed 6 unprotected core inventions ahead of a critical Series A institutional funding round.',
    solution: 'Drafted and filed 6 comprehensive patent applications with an accelerated prosecution roadmap under Indian Patent Office & USPTO treaties.',
    result: 'Secured priority dates and robust claim structure, significantly bolstering enterprise valuation during due diligence.',
  },
  {
    division: 'AI Hub',
    title: 'Government AI Capacity Building & Citizen Query Enablement',
    client: 'State Urban Development Department, Maharashtra',
    challenge: 'A prominent state department needed practical AI literacy and operational tool proficiency across 200+ municipal officers.',
    solution: 'Designed role-specific curriculum covering citizen query triage, document automation, and ethical governance with bilingual LLM agents.',
    result: 'Department successfully launched 3 live internal AI automation pilots within 6 months of training completion.',
  },
  {
    division: 'IP Hub',
    title: 'National Trademark Protection & Counterfeit Defense for D2C Brand',
    client: 'Fast-Growing D2C Fashion & Lifestyle Label, Mumbai',
    challenge: 'Brand encountered copycat sellers and counterfeit marks across major national e-commerce marketplaces.',
    solution: 'Filed and defended trademark applications across all relevant product classes with prompt objection clearance and marketplace brand registry defense.',
    result: 'Secured exclusive nationwide registration and successfully issued cease-and-desist notices to take down imitators.',
  },
  {
    division: 'AI Hub',
    title: 'Computer Vision Automated Quality Inspection for Automotive Tier-1',
    client: 'Auto Precision Forging Components Ltd., Chakan',
    challenge: 'Manual surface inspection on forged alloy components had a 6% human escape defect rate, resulting in expensive buyer rejections.',
    solution: 'Built and integrated high-speed edge AI camera pipelines inspecting 180 parts/min with sub-millimeter flaw classification.',
    result: 'Escape defect rate dropped from 6% to 0.08%, saving ₹1.4 Cr annually in rework and customer chargebacks.',
  },
  {
    division: 'IP Hub',
    title: 'Global Patent & Copyright Prosecution for Enterprise FinTech Protocol',
    client: 'Algorithmic Settlement & Neo-Banking Platform, Mumbai',
    challenge: 'Novel cryptographic transaction reconciliation protocol needed ironclad defensibility against multinational fintech competitors.',
    solution: 'Conducted worldwide patent landscape analysis and executed dual patent filings in India and PCT international phase with copyright source registrations.',
    result: 'Clean patent freedom-to-operate clearance secured, clearing the path for institutional banking licensing agreements.',
  },
];

export interface BlogPost {
  id: string;
  category: 'AI Hub' | 'IP Hub';
  title: string;
  readTime: string;
  excerpt: string;
}

export const BLOG_POSTS: BlogPost[] = [
  { id: 'b1', category: 'AI Hub', title: 'What Is AI Business Automation and Why It Matters for Indian Enterprises', readTime: '5 min read', excerpt: 'A practical breakdown for founders, teams, and decision-makers on eliminating manual operational friction.' },
  { id: 'b2', category: 'AI Hub', title: 'Agentic CRM Explained: How AI-Driven Sales Pipelines Actually Work', readTime: '6 min read', excerpt: 'Why traditional static CRMs fail to close deals and how autonomous agentic pipelines bridge the gap.' },
  { id: 'b3', category: 'AI Hub', title: 'How Much Does Custom AI Software Development Cost in India?', readTime: '8 min read', excerpt: 'A transparent guide to scoping, milestones, cloud infrastructure, and typical investment brackets in 2026.' },
  { id: 'b4', category: 'IP Hub', title: 'Patent Filing in India: A Step-by-Step Guide for First-Time Inventors', readTime: '7 min read', excerpt: 'From novelty search and provisional drafting to examination responses and certificate grant.' },
  { id: 'b5', category: 'IP Hub', title: 'Trademark Registration India: Timelines, Costs, and Common Mistakes', readTime: '6 min read', excerpt: 'Avoid rejection by understanding Class classifications, objection notices, and evidence of prior use.' },
  { id: 'b6', category: 'IP Hub', title: 'Copyright Registration for Software: What Founders Need to Know', readTime: '5 min read', excerpt: 'Protecting your source code, algorithms, and documentation under Indian and global copyright treaties.' },
  { id: 'b7', category: 'AI Hub', title: 'AI for Government: How Departments Are Using AI Capacity Building', readTime: '6 min read', excerpt: 'Real-world governance frameworks helping public sector units adopt generative technology responsibly.' },
  { id: 'b8', category: 'AI Hub', title: 'WhatsApp Automation for Business: A Practical Implementation Guide', readTime: '7 min read', excerpt: 'Converting high-intent WhatsApp leads into confirmed orders with compliant API broadcasts.' },
  { id: 'b9', category: 'AI Hub', title: 'Prompt Engineering for Corporate Teams: Where to Start', readTime: '5 min read', excerpt: 'How non-technical managers can instruct enterprise LLMs with consistent, deterministic outcomes.' },
  { id: 'b10', category: 'IP Hub', title: "Industrial Design Registration vs Patents: What's the Difference?", readTime: '4 min read', excerpt: 'Distinguishing between aesthetic product appearance and functional inventive mechanisms.' },
];
