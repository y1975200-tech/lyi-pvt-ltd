import mongoose from 'mongoose';

// Ensure we connect only once
export const connectDB = async (uri: string) => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

const SettingsSchema = new mongoose.Schema({
  companyName: String,
  tagline: String,
  hqAddress: String,
  phone: String,
  email: String,
  heroBgImage: String,
  portfolioBgImage: String,
  industriesBgImage: String,
  caseStudiesBgImage: String,
  aboutBgImage: String,
  contactBgImage: String,
  aiHubBgImage: String,
  ipHubBgImage: String,
  web3formsKey: String,
  logoUrl: String,
  heroHeadline: String,
  heroSubhead: String,
  stats: {
    aiProjects: String,
    ipRegistrations: String,
    enterpriseClients: String,
    trainedCount: String,
    successRate: String,
  },
  theme: mongoose.Schema.Types.Mixed,
  testimonials: [mongoose.Schema.Types.Mixed],
  clientLogos: [mongoose.Schema.Types.Mixed],
  industries: [mongoose.Schema.Types.Mixed],
  pageContent: mongoose.Schema.Types.Mixed,
}, { timestamps: true, strict: false });

export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

const PageContentSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String,
  status: { type: String, default: "published" },
  sections: [mongoose.Schema.Types.Mixed],
  seo: mongoose.Schema.Types.Mixed,
}, { timestamps: true, strict: false });

export const Page = mongoose.models.Page || mongoose.model('Page', PageContentSchema);

const ServiceSchema = new mongoose.Schema({
  id: String,
  slug: { type: String, required: true, unique: true },
  title: String,
  division: String,
  subCategory: String,
  shortDesc: String,
  heroHeadline: String,
  heroLede: String,
  problemPoints: [String],
  solutionText: String,
  features: [{ title: String, desc: String }],
  benefits: [String],
  industries: [String],
  processSteps: [{ step: String, title: String, desc: String }],
  faqs: [{ q: String, a: String }],
  imageUrl: String,
  bgImage: String,
  backgroundImageUrl: String,
  overlayOpacity: Number,
  overlayType: String,
  textMode: String,
  categoryLabel: String,
  breadcrumbText: String,
  ctaButtonText: String,
  ctaButtonLink: String,
  headlineSize: String,
  headlineWeight: String,
  headlineColor: String,
  headlineAlign: String,
  headlineItalic: Boolean,
  headlineUnderline: Boolean,
  ledeSize: String,
  ledeColor: String,
  richTextContent: String,
  order: Number,
  visible: { type: Boolean, default: true },
  seo: mongoose.Schema.Types.Mixed,
}, { timestamps: true, strict: false });

export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

const PortfolioSchema = new mongoose.Schema({
  id: String,
  category: String,
  title: String,
  description: String,
  tag: String,
  imageUrl: String,
  client: String,
  result: String,
  projectUrl: String,
  order: Number,
  visible: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

export const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

const ClientLogoSchema = new mongoose.Schema({
  name: String,
  logoUrl: String,
  imageUrl: String,
  tag: String,
  websiteUrl: String,
  link: String,
  altText: String,
  title: String,
  accentColor: String,
  width: Number,
  height: Number,
  fit: String,
  order: Number,
  active: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

export const ClientLogo = mongoose.models.ClientLogo || mongoose.model('ClientLogo', ClientLogoSchema);

const IndustrySchema = new mongoose.Schema({
  name: String,
  image: String,
  backgroundImage: String,
  description: String,
  coreChallenge: String,
  aiTransformationSolution: String,
  ipProtectionStrategy: String,
  ctaText: String,
  ctaLink: String,
  location: String,
  tags: [String],
  seo: mongoose.Schema.Types.Mixed,
  visibility: { type: Boolean, default: true },
  order: Number
}, { timestamps: true, strict: false });

export const Industry = mongoose.models.Industry || mongoose.model('Industry', IndustrySchema);

const TestimonialSchema = new mongoose.Schema({
  id: String,
  author: String,
  name: String,
  role: String,
  designation: String,
  company: String,
  quote: String,
  rating: Number,
  photo: String,
  logo: String,
  initials: String,
  visibility: { type: Boolean, default: true },
  order: Number
}, { timestamps: true, strict: false });

export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

const CaseStudySchema = new mongoose.Schema({
  division: String,
  category: String,
  client: String,
  location: String,
  title: String,
  challenge: String,
  solution: String,
  measuredOutcome: String,
  metric: String,
  image: String,
  backgroundImage: String,
  tags: [String],
  cta: String,
  visibility: { type: Boolean, default: true },
  order: Number
}, { timestamps: true });

export const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);

const BookingSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  fullName: String,
  email: String,
  mobile: String,
  organization: String,
  designation: String,
  orgType: String,
  service: String,
  division: String,
  budget: String,
  date: String,
  timeSlot: String,
  mode: String,
  meetingLink: String,
  assignedConsultant: mongoose.Schema.Types.Mixed,
  message: String,
  status: { type: String, default: "confirmed" },
}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

// Admin User Schema for Security & Auth
const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin' },
  lastLogin: Date,
}, { timestamps: true });

export const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

// Revisions & Version History Schema
const RevisionSchema = new mongoose.Schema({
  entityType: { type: String, required: true }, // 'page' | 'service' | 'settings' | 'portfolio'
  entityId: { type: String, required: true },
  version: { type: Number, required: true },
  snapshotData: { type: mongoose.Schema.Types.Mixed, required: true },
  changeSummary: String,
  updatedBy: { type: String, default: 'admin' },
}, { timestamps: true });

RevisionSchema.index({ entityType: 1, entityId: 1, version: -1 });
export const Revision = mongoose.models.Revision || mongoose.model('Revision', RevisionSchema);

// CRM Integration Configuration Schema
const CRMConfigSchema = new mongoose.Schema({
  provider: { type: String, default: 'webhook' }, // 'webhook' | 'zoho' | 'hubspot' | 'salesforce' | 'custom_rest'
  enabled: { type: Boolean, default: false },
  apiBaseUrl: String,
  apiKey: String,
  webhookUrl: String,
  fieldMappings: { type: mongoose.Schema.Types.Mixed, default: {} },
  syncStatus: { type: String, default: 'idle' },
  lastSyncTime: Date,
  lastSyncError: String,
}, { timestamps: true });

export const CRMConfig = mongoose.models.CRMConfig || mongoose.model('CRMConfig', CRMConfigSchema);

// Media Asset Library Schema
const MediaAssetSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  originalName: String,
  url: { type: String, required: true },
  mimeType: String,
  size: Number,
  tag: { type: String, default: 'general' },
  altText: String,
}, { timestamps: true });

export const MediaAsset = mongoose.models.MediaAsset || mongoose.model('MediaAsset', MediaAssetSchema);

