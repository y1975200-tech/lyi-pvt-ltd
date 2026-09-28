export type ServiceDivision = 'AI Hub' | 'IP Hub';

export type AiSubCategory = 'Our Services' | 'Our Products' | 'LYI Services' | 'LYI Products';

export interface TextStyle {
  fontSize?: string; // 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string; // hex or semantic var
  align?: 'left' | 'center' | 'right';
  italic?: boolean;
  underline?: boolean;
}

export interface CmsSection {
  sectionId: string;
  type: string; // 'hero' | 'intro' | 'services' | 'cards' | 'cta' | 'content' | 'custom'
  title: string;
  subtitle?: string;
  content?: string;
  richText?: string;
  backgroundImage?: string;
  backgroundImageUrl?: string;
  overlay?: number; // 0 to 100
  overlayType?: 'dark' | 'light' | 'gradient' | 'none';
  textMode?: 'auto' | 'light' | 'dark';
  settings?: Record<string, any>;
  visible?: boolean;
  order?: number;
  style?: TextStyle;
}

export interface CmsPage {
  slug: string; // 'home' | 'ai-hub' | 'ip-hub' | 'portfolio' | 'about' | 'contact' | ...
  title: string;
  status: 'published' | 'draft';
  sections: CmsSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  division: ServiceDivision;
  subCategory?: AiSubCategory; // 'LYI Services' (e.g. Custom AI, Automation, WhatsApp Automation, AI Website Chatbots) vs 'LYI Products' (e.g. Agentic CRM, Card Scanner)
  shortDesc: string;
  heroHeadline: string;
  heroLede: string;
  problemPoints: string[];
  solutionText: string;
  features: { title: string; desc: string }[];
  benefits: string[];
  industries: string[];
  processSteps: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  imageUrl?: string;
  // Dynamic Background Image & Visual Contrast Controls
  bgImage?: string;
  backgroundImageUrl?: string;
  overlayOpacity?: number; // 0 - 100%
  overlayType?: 'dark' | 'light' | 'gradient' | 'none';
  textMode?: 'auto' | 'light' | 'dark';
  // Breadcrumbs, Labels & CTAs
  categoryLabel?: string;
  breadcrumbText?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  // Hero Text Typography & Formatting Controls
  headlineSize?: string;
  headlineWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  headlineColor?: string;
  headlineAlign?: 'left' | 'center' | 'right';
  headlineItalic?: boolean;
  headlineUnderline?: boolean;
  ledeSize?: string;
  ledeColor?: string;
  [key: string]: any;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tag: string;
  client?: string;
  result?: string;
  projectUrl?: string; // Website / Project live link added by Admin
  title_style?: TextStyle;
  description_style?: TextStyle;
  tag_style?: TextStyle;
  result_style?: TextStyle;
  [key: string]: any;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role?: string;
  company: string;
  initials?: string;
  avatarUrl?: string;
  rating?: number;
  quote_style?: TextStyle;
  author_style?: TextStyle;
  company_style?: TextStyle;
  [key: string]: any;
}

export interface PageContentItem {
  pageId?: string; // 'home' | 'ai-hub' | 'ip-hub' | 'portfolio' | 'case-studies' | 'about' | 'contact'
  badge?: string;
  headline?: string;
  subheadline?: string;
  bgImage?: string;
  leadParagraph?: string;
  extraHeading1?: string;
  extraText1?: string;
  extraHeading2?: string;
  extraText2?: string;
  aiCardTitle?: string;
  aiCardDesc?: string;
  aiCardBg?: string;
  ipCardTitle?: string;
  ipCardDesc?: string;
  ipCardBg?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ThemeCustomization {
  mode?: 'light' | 'dark' | 'custom';
  locked?: boolean;
  templateName?: string;
  primaryColor?: string;
  primaryButtonColor?: string;
  primaryButtonTextColor?: string;
  secondaryColor?: string;
  secondaryButtonColor?: string;
  secondaryButtonTextColor?: string;
  accentColor?: string;
  textColor?: string;
  headingColor?: string;
  textMutedColor?: string;
  bodyBgColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  cardTextColor?: string;
  borderColor?: string;
  inputBgColor?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  navBgColor?: string;
  navTextColor?: string;
  footerBgColor?: string;
  footerTextColor?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
  headlineFontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  headlineItalic?: boolean;
  headlineUnderline?: boolean;
  buttonFontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  buttonItalic?: boolean;
  buttonUnderline?: boolean;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  themeBgImage?: string;
  themeBgOverlayOpacity?: number;
  themeBgBlur?: number;
  themeBgPosition?: 'cover' | 'contain' | 'repeat' | 'fixed';
  sourceImage?: string;
  contrastScore?: number;
}

export interface ClientLogoItem {
  id: string;
  name: string;
  logoUrl: string;
  tag?: string;
  websiteUrl?: string;
  link?: string; // synonym for websiteUrl
  altText?: string;
  title?: string;
  accentColor?: string;
  width?: number; // custom logo width in px (default ~44)
  height?: number; // custom logo height in px (default ~44)
  fit?: 'contain' | 'cover' | 'fill';
  order?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IndustryItem {
  id?: string;
  name: string;
  challenge: string;
  aiSolution: string;
  ipSolution: string;
  caseStudy: string;
  icon?: string;
  metric?: string;
  name_style?: TextStyle;
  [key: string]: any;
}

export interface ImageEffectsConfig {
  blurEnabled?: boolean;
  blurAmount?: number; // 0 to 20px
  brightnessEnabled?: boolean;
  brightnessAmount?: number; // 0 to 200%, default 100
  contrastEnabled?: boolean;
  contrastAmount?: number; // 0 to 200%, default 100
  saturationEnabled?: boolean;
  saturationAmount?: number; // 0 to 200%, default 100
  grayscaleEnabled?: boolean;
  grayscaleAmount?: number; // 0 to 100%, default 0
  opacityEnabled?: boolean;
  opacityAmount?: number; // 0 to 100%, default 100
  
  overlayEnabled?: boolean;
  overlayColor?: string; // hex #000000
  overlayOpacity?: number; // 0 to 100%

  tintEnabled?: boolean;
  tintColor?: string; // hex #000000
  tintOpacity?: number; // 0 to 100%

  shadowEnabled?: boolean;
  shadowIntensity?: number; // 0 to 50px
  shadowColor?: string;

  zoomEnabled?: boolean;
  zoomScale?: number; // 1.0 to 2.0

  gradientEnabled?: boolean;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientOpacity?: number; // 0 to 100%
  gradientDirection?: string; // 'to bottom', 'to right', '135deg', etc.
}

export type ImageEffectsMap = Record<string, ImageEffectsConfig>;

export interface SiteSettings {
  companyName: string;
  tagline: string;
  hqAddress: string;
  phone: string;
  email: string;
  heroBgImage: string;
  portfolioBgImage?: string;
  industriesBgImage?: string;
  caseStudiesBgImage?: string;
  aboutBgImage?: string;
  contactBgImage?: string;
  aiHubBgImage?: string;
  ipHubBgImage?: string;
  web3formsKey?: string;
  logoUrl: string;
  logoWidth?: number;
  logoHeight?: number;
  heroHeadline: string;
  heroSubhead: string;
  whatsappNumber?: string;
  address?: string;
  contactEmail?: string;
  testimonials?: TestimonialItem[];
  clientLogos?: ClientLogoItem[];
  industries?: IndustryItem[];
  services?: ServiceItem[];
  portfolio?: PortfolioItem[];
  cmsPages?: Record<string, CmsPage>;
  theme?: ThemeCustomization;
  imageEffects?: ImageEffectsMap;
  stats: {
    aiProjects: string;
    ipRegistrations: string;
    enterpriseClients: string;
    trainedCount: string;
    successRate: string;
  };
  pageContent?: Record<string, PageContentItem>;
  [key: string]: any;
}

export interface BookingData {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  mobile: string;
  organization?: string;
  designation?: string;
  orgType: 'Startup' | 'MSME' | 'Corporate' | 'Government' | 'Individual';
  service: string;
  division: ServiceDivision;
  budget: string;
  date: string;
  timeSlot: string;
  mode: 'Google Meet' | 'Phone Call' | 'WhatsApp Call' | 'In-Person (HQ)';
  meetingLink: string;
  assignedConsultant: {
    name: string;
    role: string;
    email: string;
  };
  message?: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'in-progress';
  createdAt: string;
}

export interface DispatchedEmail {
  id: string;
  bookingId?: string;
  recipient: string;
  subject: string;
  type: string;
  sentAt: string;
  status: 'delivered' | 'sent' | 'failed';
  previewUrl?: string;
  htmlContent: string;
}

export interface ImageSeoItem {
  id?: string;
  url: string;
  altText: string;
  title?: string;
  description?: string;
}

export interface FaqSeoItem {
  id?: string;
  question: string;
  directAnswer: string;
  detailedAnswer: string;
}

export interface StructuredListItem {
  id?: string;
  title: string;
  listType: 'ordered' | 'unordered';
  items: string[];
}

export interface StructuredTableItem {
  id?: string;
  title: string;
  headers: string[];
  rows: string[][];
}

export interface InternalLinkItem {
  id?: string;
  anchorText: string;
  destination: string;
  relationship?: string;
}

export interface KeyFactItem {
  id?: string;
  fact: string;
  value: string;
}

export interface DefinitionItem {
  id?: string;
  term: string;
  definition: string;
}

export interface EntityInfo {
  primaryTopic: string;
  secondaryTopics: string[];
  primaryEntity: string;
  relatedEntities: string[];
  organizationName: string;
  services: string[];
  industries: string[];
  locationsServed: string[];
  expertiseAreas: string[];
}

export interface KeywordInfo {
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailQueries: string[];
  relatedSearchTopics: string[];
}

export interface GeoContent {
  primaryAnswer: string;
  keyFacts: KeyFactItem[];
  definitions: DefinitionItem[];
  importantFacts: KeyFactItem[];
  commonQuestions: { question: string; answer: string }[];
  relatedTopics: string[];
}

export interface SeoConfig {
  page: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  canonicalUrl: string;
  robots: string;
  customRobots?: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  images: ImageSeoItem[];
  headings: {
    h1: string;
    h2s: string[];
    h3s: string[];
  };
  schemaType: string;
  customJsonLd: string;
  faqs: FaqSeoItem[];
  structuredLists: StructuredListItem[];
  structuredTables: StructuredTableItem[];
  internalLinks: InternalLinkItem[];
  entities: EntityInfo;
  keywords: KeywordInfo;
  geo: GeoContent;
  updatedAt?: string;
  updatedBy?: string;
}

export type PageRoute =
  | 'home'
  | 'about'
  | 'ai-hub'
  | 'ip-hub'
  | 'service-detail'
  | 'portfolio'
  | 'industries'
  | 'case-studies'
  | 'blog'
  | 'resources'
  | 'contact'
  | 'privacy'
  | 'book-consultation'
  | 'admin-dashboard';

