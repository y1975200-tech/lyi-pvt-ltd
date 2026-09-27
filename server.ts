import express from "express";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { ALL_SERVICES } from "./src/data/services.ts";
import { DEFAULT_CLIENT_LOGOS } from "./src/data/generalData.ts";
import { CmsPage, CmsSection, TextStyle } from "./src/types.ts";
import { connectDB, Booking as BookingModel } from "./serverModels.ts";
import { apiRouter } from "./src/apiRoutes.ts";

dotenv.config();

const app = express();
const PORT = 3000;

connectDB(process.env.MONGODB_URI || "mongodb+srv://usb:usb123@cluster0.bujenyg.mongodb.net/LYIPVTLTD?retryWrites=true&w=majority");

// Enable CORS & strict no-cache for dynamic website API content
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.path.startsWith("/api")) {
    res.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", apiRouter);

// Ensure public uploads directory exists and is statically served
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// -------------------------------------------------------------
// Data Types
// -------------------------------------------------------------
export interface Booking {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  mobile: string;
  organization?: string;
  designation?: string;
  orgType: "Startup" | "MSME" | "Corporate" | "Government" | "Individual";
  service: string;
  division: "AI Hub" | "IP Hub";
  budget: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM IST"
  mode: "Google Meet" | "Phone Call" | "WhatsApp Call" | "In-Person (HQ)";
  meetingLink: string;
  assignedConsultant: {
    name: string;
    role: string;
    email: string;
  };
  message?: string;
  status: "confirmed" | "rescheduled" | "cancelled" | "completed" | "in-progress";
  createdAt: string;
}

export interface DispatchedEmail {
  id: string;
  bookingId?: string;
  recipient: string;
  subject: string;
  type: "booking_confirmation" | "reschedule_notice" | "cancellation_notice" | "enquiry_acknowledgement" | "reminder";
  sentAt: string;
  status: "delivered" | "sent" | "failed";
  previewUrl?: string;
  htmlContent: string;
}

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
  heroHeadline: string;
  heroSubhead: string;
  stats: {
    aiProjects: string;
    ipRegistrations: string;
    enterpriseClients: string;
    trainedCount: string;
    successRate: string;
  };
  testimonials?: any[];
  pageContent?: Record<string, any>;
  theme?: any;
  clientLogos?: any[];
  industries?: any[];
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  division: "AI Hub" | "IP Hub";
  subCategory?: "Our Services" | "Our Products" | "LYI Services" | "LYI Products";
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
  bgImage?: string;
  backgroundImageUrl?: string;
  overlayOpacity?: number; // 0-100%
  overlayType?: "dark" | "light" | "gradient" | "none";
  textMode?: "auto" | "light" | "dark";
  categoryLabel?: string;
  breadcrumbText?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  headlineSize?: string;
  headlineWeight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  headlineColor?: string;
  headlineAlign?: "left" | "center" | "right";
  headlineItalic?: boolean;
  headlineUnderline?: boolean;
  ledeSize?: string;
  ledeColor?: string;
  richTextContent?: string;
}

export interface ClientLogoItem {
  id: string;
  name: string;
  logoUrl: string;
  imageUrl?: string;
  tag?: string;
  websiteUrl?: string;
  link?: string;
  altText?: string;
  title?: string;
  accentColor?: string;
  width?: number;
  height?: number;
  fit?: "contain" | "cover" | "fill";
  order?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function sanitizeRichText(html: string): string {
  if (!html || typeof html !== "string") return "";
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  clean = clean.replace(/ on\w+="[^"]*"/gi, "");
  clean = clean.replace(/ on\w+='[^']*'/gi, "");
  clean = clean.replace(/ on\w+=\S+/gi, "");
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  clean = clean.replace(/<\/?(iframe|object|embed|applet|meta|link)[^>]*>/gi, "");
  return clean;
}

export interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  description: string;
  tag: string;
  imageUrl: string;
  client?: string;
  result?: string;
  projectUrl?: string;
}

// -------------------------------------------------------------
// Database Persistence via site-data.json
// -------------------------------------------------------------
const DB_FILE = path.join(process.cwd(), "site-data.json");

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "LYI Tech Pvt. Ltd.",
  tagline: "India's 360° AI & Intellectual Property Consulting.",
  hqAddress: "Pune, Maharashtra, India",
  phone: "+91 75586 31355",
  email: "hello@lockyourideatech.com",
  heroBgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
  portfolioBgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80",
  industriesBgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
  caseStudiesBgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
  aboutBgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80",
  contactBgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
  aiHubBgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
  ipHubBgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
  web3formsKey: process.env.WEB3FORMS_ACCESS_KEY || "b91db637-425b-4ce4-8ed1-c2b51bc1b91b",
  logoUrl: "/assets/logo.svg",
  heroHeadline: "Transform Your Business & Protect Your Innovation with AI",
  heroSubhead: "We engineer production-grade AI software, platforms & agentic systems while securing, filing, and defending your high-value patent and trademark portfolios.",
  stats: {
    aiProjects: "150+",
    ipRegistrations: "500+",
    enterpriseClients: "80+",
    trainedCount: "1,200+",
    successRate: "99.4%",
  },
  testimonials: [
    {
      id: "t1",
      quote: '"LockYourIdea Tech built our end-to-end AI quality audit platform in Baner, Pune. Our defect inspection rate plummeted by 44% in the first quarter of deployment."',
      author: "Rajesh Kulkarni",
      role: "VP Operations",
      company: "AutoTech Precision Ltd., Pune",
      initials: "RK",
      rating: 5,
    },
    {
      id: "t2",
      quote: '"Their dual proficiency in AI architecture and Patent law is completely unmatched in India. They filed our 3 core deep-tech patents while shipping the production models."',
      author: "Sunita Deshmukh",
      role: "Founder & CEO",
      company: "NeuralBio HealthTech, Bengaluru",
      initials: "SD",
      rating: 5,
    },
    {
      id: "t3",
      quote: '"The Agentic CRM and automated quotation system transformed our B2B manufacturing sales. Our quote turnaround dropped from 48 hours to literally 15 minutes."',
      author: "Amitabh Joshi",
      role: "Managing Director",
      company: "Kalyani Forge Components, Chakan",
      initials: "AJ",
      rating: 5,
    },
  ],
  pageContent: {
    home: {
      pageId: "home",
      badge: "India's 360° AI & IP Transformation Company · HQ Pune",
      headline: "Transform Your Business & Protect Your Innovation with AI",
      subheadline: "Custom AI software, business automation, enterprise CRM, AI training, government AI capacity building, patents, trademarks, copyrights, and intellectual property services — under one trusted platform.",
      bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
      extraHeading1: "Transforming Organizations with Artificial Intelligence",
      extraText1: "360° AI solutions — from custom software, computer vision, and agentic CRM to enterprise business automation and government-scale training programs.",
      extraHeading2: "Protecting Innovation from Idea to Intellectual Property",
      extraText2: "End-to-end IP services — securing what you've built with the same precision and technological rigor you used to build it.",
    },
    "ai-hub": {
      pageId: "ai-hub",
      badge: "360° Artificial Intelligence Solutions",
      headline: "Transforming Organizations with Artificial Intelligence",
      subheadline: "Custom AI software, business automation, agentic CRM, corporate training, and government capacity building — delivered end to end with enterprise engineering precision.",
      bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
      extraHeading1: "11 Dedicated Service Lines",
      extraText1: "Production-grade models, workflows, and automated enterprise pipelines built in Baner, Pune.",
    },
    "ip-hub": {
      pageId: "ip-hub",
      badge: "End-to-End Intellectual Property Services",
      headline: "Protecting Innovation from Idea to Intellectual Property",
      subheadline: "Patent filing, trademark registration, copyright, industrial design protection, IP strategy, and commercialization — managed by seasoned patent agents and IP attorneys.",
      bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
      extraHeading1: "6 Dedicated Service Lines",
      extraText1: "Full-lifecycle IP defense across India, USPTO, EPO, and WIPO treaties.",
    },
    portfolio: {
      pageId: "portfolio",
      badge: "PROVEN TRACK RECORD",
      headline: "Real Work. Real Outsized Impact.",
      subheadline: "Explore 12 representative case studies and deployment highlights across our AI Hub engineering and IP Hub legal prosecution practices.",
      bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80",
    },
    "case-studies": {
      pageId: "case-studies",
      badge: "RESULTS & CLIENT OUTCOMES",
      headline: "Real Client Outcomes & Case Studies",
      subheadline: "Documented, quantifiable outcomes across Indian manufacturing, pharmaceuticals, logistics, and government bodies.",
      bgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
    },
    about: {
      pageId: "about",
      badge: "ABOUT LOCKYOURIDEA TECH · BANER, PUNE",
      headline: "Bridging the Gap Between Engineering & Intellectual Property",
      subheadline: "LockYourIdea Tech was founded in Pune with a single conviction: the companies that build groundbreaking software must also legally own and protect it from day one.",
      bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80",
    },
    contact: {
      pageId: "contact",
      badge: "GET IN TOUCH WITH OUR SPECIALISTS",
      headline: "Start Your AI & IP Transformation",
      subheadline: "Schedule a confidential consultation at our Pune headquarters or via Google Meet. NDA executed upon request prior to discussion.",
      bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
    },
  },
};

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "bk_1",
    reference: "LYI-2026-7821",
    fullName: "Vikram Malhotra",
    email: "vikram@zenithlogistics.in",
    mobile: "+91 98201 44512",
    organization: "Zenith Logistics India",
    designation: "Chief Operating Officer",
    orgType: "Corporate",
    service: "AI Business Automation",
    division: "AI Hub",
    budget: "₹5–20 Lakh",
    date: "2026-09-22",
    timeSlot: "11:30 AM IST",
    mode: "Google Meet",
    meetingLink: "https://meet.google.com/lyi-ai-7821",
    assignedConsultant: {
      name: "Dr. Rajiv Mehta",
      role: "Principal AI Transformation Architect",
      email: "rajiv.mehta@lockyourideatech.com",
    },
    message: "Looking to automate warehouse dispatch triage, barcode anomaly detection, and automated billing approvals across our Pune and Navi Mumbai hubs.",
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "bk_2",
    reference: "LYI-2026-6419",
    fullName: "Dr. Ananya Sen",
    email: "ananya.sen@biocurepharma.com",
    mobile: "+91 94330 87123",
    organization: "BioCure Innovations Pvt Ltd",
    designation: "Founder & Chief Scientific Officer",
    orgType: "Startup",
    service: "Patent Filing & Prosecution",
    division: "IP Hub",
    budget: "₹1–5 Lakh",
    date: "2026-09-23",
    timeSlot: "03:00 PM IST",
    mode: "Google Meet",
    meetingLink: "https://meet.google.com/lyi-ip-6419",
    assignedConsultant: {
      name: "Adv. Priya Sharma",
      role: "Lead Patent & Intellectual Property Counsel",
      email: "priya.sharma@lockyourideatech.com",
    },
    message: "Need priority provisional patent drafting for novel peptide formulation and drug delivery mechanism ahead of Series A investor demo.",
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: "bk_3",
    reference: "LYI-2026-5204",
    fullName: "Rajesh Kulkarni",
    email: "rajesh.k@kalyaniprecision.in",
    mobile: "+91 98902 33411",
    organization: "Kalyani Precision Engineering, Pune",
    designation: "VP Manufacturing & Operations",
    orgType: "MSME",
    service: "Agentic CRM",
    division: "AI Hub",
    budget: "₹5–20 Lakh",
    date: "2026-09-24",
    timeSlot: "10:00 AM IST",
    mode: "In-Person (HQ)",
    meetingLink: "https://maps.google.com/?q=LockYourIdea+Tech+Pune",
    assignedConsultant: {
      name: "Dr. Rajiv Mehta",
      role: "Principal AI Transformation Architect",
      email: "rajiv.mehta@lockyourideatech.com",
    },
    message: "Want to replace Salesforce with LYI Agentic CRM to automate engineering quotations, drawings extraction, and WhatsApp follow-up for 30 sales reps.",
    status: "in-progress",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "bk_4",
    reference: "LYI-2026-4190",
    fullName: "Sneha Deshmukh",
    email: "sneha@nectarbotanicals.com",
    mobile: "+91 98230 19876",
    organization: "Nectar Botanicals D2C",
    designation: "Head of Marketing",
    orgType: "Startup",
    service: "Trademark Registration & Protection",
    division: "IP Hub",
    budget: "₹50,000–₹1 Lakh",
    date: "2026-09-21",
    timeSlot: "05:00 PM IST",
    mode: "Google Meet",
    meetingLink: "https://meet.google.com/lyi-ip-4190",
    assignedConsultant: {
      name: "Adv. Priya Sharma",
      role: "Lead Patent & Intellectual Property Counsel",
      email: "priya.sharma@lockyourideatech.com",
    },
    message: "Counterfeits appearing on Amazon & Flipkart with similar packaging. Need immediate Class 3 & 35 trademark examination and notice issuance.",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: "1",
    category: "AI Software",
    title: "Enterprise Inventory Intelligence Platform",
    description: "Automated stock forecasting and anomaly detection across 42 warehouses in Pune & Mumbai.",
    tag: "AI Software",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    client: "Zenith Logistics Ltd.",
    result: "42% lower stockout rate",
  },
  {
    id: "2",
    category: "AI Platforms",
    title: "Multi-Tenant AI Analytics Platform",
    description: "B2B enterprise SaaS with automated data ingestion and natural language query generation.",
    tag: "AI Platforms",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    client: "QuantEdge Analytics",
    result: "10x faster SQL query time",
  },
  {
    id: "3",
    category: "Automation",
    title: "End-to-End HR Automation Suite",
    description: "Candidate screening, offer generation, and onboarding for a 5,000+ employee conglomerate.",
    tag: "Automation",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    client: "Apex Corporate Group",
    result: "80% faster hiring cycle",
  },
  {
    id: "4",
    category: "CRM",
    title: "Agentic CRM Rollout — Manufacturing Client",
    description: "Autonomous lead qualification, automated quoting, and sales pipeline optimization.",
    tag: "CRM",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    client: "Bharat Precision Forge, Pune",
    result: "₹1.8 Cr revenue uplift",
  },
  {
    id: "5",
    category: "AI Video Ads",
    title: "D2C Brand Launch Video Campaign",
    description: "12 localized, high-definition AI promotional videos generated in under 72 hours.",
    tag: "AI Video Ads",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    client: "Nectar Botanicals D2C",
    result: "3.4x ROAS on Meta ads",
  },
  {
    id: "6",
    category: "AI Avatars",
    title: "CEO Digital Avatar for Investor Updates",
    description: "Multilingual executive avatar deployed across 4 quarterly shareholder meetings.",
    tag: "AI Avatars",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    client: "FinTech Innovations India",
    result: "Zero filming studio overhead",
  },
  {
    id: "7",
    category: "Government AI",
    title: "Smart City AI Capacity Program",
    description: "Trained 350+ municipal engineers on automated traffic analysis and predictive utility maintenance.",
    tag: "Government AI",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
    client: "Pune Smart City Development Corp",
    result: "350+ certified engineers",
  },
  {
    id: "8",
    category: "Patent Projects",
    title: "Deep-Tech Patent Portfolio — 12 Filings",
    description: "Cross-border patent filings spanning India, US, and EPO for optical sensor architecture.",
    tag: "Patent Projects",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    client: "PhotonSense Tech Labs",
    result: "100% first-examination approval",
  },
  {
    id: "9",
    category: "Trademark Success",
    title: "National Retail Brand Trademark Protection",
    description: "Defended retail trademark across Class 25 & 35 with nationwide cease-and-desist enforcement.",
    tag: "Trademark Success",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    client: "UrbanVogue Apparel",
    result: "14 counterfeit infringers stopped",
  },
  {
    id: "10",
    category: "AI Software",
    title: "AI-Powered Document Intelligence Tool",
    description: "Extraction and compliance scoring for unstructured legal contracts and tenders.",
    tag: "AI Software",
    imageUrl: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80",
    client: "Lexis Legal Partners",
    result: "94% automated clause extraction",
  },
  {
    id: "11",
    category: "Automation",
    title: "Finance Reconciliation Automation",
    description: "Reduced bank and ledger mismatch resolution time by 82% using automated heuristics.",
    tag: "Automation",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    client: "Kalyani Trading Co., Pune",
    result: "₹34 Lakh monthly savings",
  },
  {
    id: "12",
    category: "Government AI",
    title: "State Department Chatbot Deployment",
    description: "Multilingual citizen query assistant handling over 40,000 daily service queries.",
    tag: "Government AI",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    client: "Maharashtra Urban Directorate",
    result: "40,000+ daily citizens served",
  },
];

const DEFAULT_CMS_PAGES: Record<string, CmsPage> = {
  home: {
    slug: "home",
    title: "Home",
    status: "published",
    sections: [
      {
        sectionId: "home-hero",
        type: "hero",
        title: "Transform Your Business & Protect Your Innovation with AI",
        subtitle: "Custom AI software, business automation, enterprise CRM, AI training, government AI capacity building, patents, trademarks, copyrights, and intellectual property services — under one trusted platform.",
        content: "India's 360° AI & IP Transformation Company · HQ Pune",
        richText: "<p>Custom AI software, business automation, enterprise CRM, AI training, government AI capacity building, patents, trademarks, copyrights, and intellectual property services — under one trusted platform.</p>",
        backgroundImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
        overlay: 80,
        overlayType: "dark",
        textMode: "light",
        order: 0,
        visible: true,
      },
      {
        sectionId: "home-stats",
        type: "stats",
        title: "Enterprise Track Record",
        content: "150+ AI Projects, 500+ IP Registrations, 100+ Enterprise Clients",
        order: 1,
        visible: true,
      },
      {
        sectionId: "home-ai-overview",
        type: "services",
        title: "Transforming Organizations with Artificial Intelligence",
        subtitle: "Dedicated AI Solutions & Products",
        content: "360° AI solutions — from custom software, computer vision, and agentic CRM to enterprise business automation and government-scale training programs.",
        richText: "<p>360° AI solutions — from custom software, computer vision, and agentic CRM to enterprise business automation and government-scale training programs.</p>",
        order: 2,
        visible: true,
      },
      {
        sectionId: "home-ip-overview",
        type: "services",
        title: "Protecting Innovation from Idea to Intellectual Property",
        subtitle: "6 Dedicated IP Service Lines",
        content: "End-to-end IP services — securing what you've built with the same precision and technological rigor you used to build it.",
        richText: "<p>End-to-end IP services — securing what you've built with the same precision and technological rigor you used to build it.</p>",
        order: 3,
        visible: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "ai-hub": {
    slug: "ai-hub",
    title: "AI Hub",
    status: "published",
    sections: [
      {
        sectionId: "ai-hero",
        type: "hero",
        title: "Transforming Organizations with Artificial Intelligence",
        subtitle: "Custom AI software, business automation, agentic CRM, corporate training, and government capacity building — delivered end to end with enterprise engineering precision.",
        content: "360° Artificial Intelligence Solutions",
        backgroundImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
        overlay: 85,
        overlayType: "dark",
        textMode: "light",
        order: 0,
        visible: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "ip-hub": {
    slug: "ip-hub",
    title: "IP Hub",
    status: "published",
    sections: [
      {
        sectionId: "ip-hero",
        type: "hero",
        title: "Protecting Innovation from Idea to Intellectual Property",
        subtitle: "Patent filing, trademark registration, copyright, industrial design protection, IP strategy, and commercialization — managed by seasoned patent agents and IP attorneys.",
        content: "End-to-End Intellectual Property Services",
        backgroundImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
        overlay: 85,
        overlayType: "dark",
        textMode: "light",
        order: 0,
        visible: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  about: {
    slug: "about",
    title: "About Us",
    status: "published",
    sections: [
      {
        sectionId: "about-hero",
        type: "hero",
        title: "Bridging the Gap Between Engineering & Intellectual Property",
        subtitle: "LockYourIdea Tech was founded in Pune with a single conviction: the companies that build groundbreaking software must also legally own and protect it from day one.",
        backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80",
        overlay: 80,
        overlayType: "dark",
        textMode: "light",
        order: 0,
        visible: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  contact: {
    slug: "contact",
    title: "Contact",
    status: "published",
    sections: [
      {
        sectionId: "contact-hero",
        type: "hero",
        title: "Start Your AI & IP Transformation",
        subtitle: "Schedule a confidential consultation at our Pune headquarters or via Google Meet. NDA executed upon request prior to discussion.",
        backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
        overlay: 80,
        overlayType: "dark",
        textMode: "light",
        order: 0,
        visible: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  portfolio: {
    slug: "portfolio",
    title: "Portfolio",
    status: "published",
    sections: [
      {
        sectionId: "portfolio-hero",
        type: "hero",
        title: "Real Work. Real Outsized Impact.",
        subtitle: "Explore representative case studies and deployment highlights across our AI Hub engineering and IP Hub legal prosecution practices.",
        backgroundImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80",
        overlay: 80,
        overlayType: "dark",
        textMode: "light",
        order: 0,
        visible: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "case-studies": {
    slug: "case-studies",
    title: "Case Studies",
    status: "published",
    sections: [
      {
        sectionId: "case-studies-hero",
        type: "hero",
        title: "Real Client Outcomes & Case Studies",
        subtitle: "Documented, quantifiable outcomes across Indian manufacturing, pharmaceuticals, logistics, and government bodies.",
        backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
        overlay: 80,
        overlayType: "dark",
        textMode: "light",
        order: 0,
        visible: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

interface StoredData {
  settings: SiteSettings;
  bookings: Booking[];
  portfolio: PortfolioItem[];
  customServices: ServiceItem[];
  services: ServiceItem[];
  logos: ClientLogoItem[];
  cmsPages: Record<string, CmsPage>;
  emails: DispatchedEmail[];
}

let storedData: StoredData = {
  settings: DEFAULT_SETTINGS,
  bookings: DEFAULT_BOOKINGS,
  portfolio: DEFAULT_PORTFOLIO,
  customServices: [],
  services: ALL_SERVICES,
  logos: DEFAULT_CLIENT_LOGOS.map((l, i) => ({ ...l, order: i, active: true })),
  cmsPages: DEFAULT_CMS_PAGES,
  emails: [],
};

// Load or initialize DB
function loadDb() {
  try {
    let parsed: any = {};
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      parsed = JSON.parse(raw);
    }

    // Merge default services with any persisted service records or edits
    const initialServicesMap = new Map<string, ServiceItem>();
    for (const s of ALL_SERVICES) {
      initialServicesMap.set(s.id, { ...s });
      initialServicesMap.set(s.slug, { ...s });
    }
    const storedServicesList = Array.isArray(parsed.services)
      ? parsed.services
      : (Array.isArray(parsed.customServices) ? parsed.customServices : []);
    for (const s of storedServicesList) {
      if (s.id && initialServicesMap.has(s.id)) {
        initialServicesMap.set(s.id, { ...initialServicesMap.get(s.id)!, ...s });
      } else if (s.slug && initialServicesMap.has(s.slug)) {
        initialServicesMap.set(s.slug, { ...initialServicesMap.get(s.slug)!, ...s });
      } else if (s.id) {
        initialServicesMap.set(s.id, s);
      }
    }
    const mergedServices: ServiceItem[] = [];
    const seenIds = new Set<string>();
    for (const s of initialServicesMap.values()) {
      if (!seenIds.has(s.id)) {
        seenIds.add(s.id);
        mergedServices.push(s);
      }
    }

    // Load logos without any artificial limit
    const rawLogos = Array.isArray(parsed.logos)
      ? parsed.logos
      : (Array.isArray(parsed.settings?.clientLogos) ? parsed.settings.clientLogos : DEFAULT_CLIENT_LOGOS);
    const mergedLogos: ClientLogoItem[] = rawLogos
      .map((l: any, idx: number) => ({
        ...l,
        order: l.order !== undefined ? Number(l.order) : idx,
        active: l.active !== undefined ? Boolean(l.active) : true,
      }))
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

    // Load CMS pages
    const mergedCmsPages: Record<string, CmsPage> = { ...DEFAULT_CMS_PAGES, ...(parsed.cmsPages || {}) };

    storedData = {
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings, clientLogos: mergedLogos },
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : DEFAULT_BOOKINGS,
      portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : DEFAULT_PORTFOLIO,
      customServices: parsed.customServices || [],
      services: mergedServices,
      logos: mergedLogos,
      cmsPages: mergedCmsPages,
      emails: parsed.emails || [],
    };
    console.log(
      `Loaded database with ${storedData.services.length} services, ${storedData.logos.length} logos, ${Object.keys(storedData.cmsPages).length} CMS pages.`
    );
  } catch (err) {
    console.error("Error reading database file, using defaults:", err);
  }
}

async function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(storedData, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database to disk:", err);
  }
}

loadDb();

// -------------------------------------------------------------
// Nodemailer Setup
// -------------------------------------------------------------
let transporter: any = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("SMTP Transporter initialized for real email delivery.");
  } catch (err) {
    console.warn("Could not initialize SMTP transport:", err);
  }
}

async function sendEmail(opts: {
  recipient: string;
  recipientName: string;
  subject: string;
  htmlContent: string;
  type: DispatchedEmail["type"];
  bookingId?: string;
}): Promise<DispatchedEmail> {
  const mailRecord: DispatchedEmail = {
    id: `em_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    bookingId: opts.bookingId,
    recipient: opts.recipient,
    subject: opts.subject,
    type: opts.type,
    sentAt: new Date().toISOString(),
    status: "delivered",
    htmlContent: opts.htmlContent,
  };

  if (transporter) {
    try {
      const fromAddr = process.env.SMTP_FROM || `"LockYourIdea Tech" <noreply@lockyourideatech.com>`;
      const info = await transporter.sendMail({
        from: fromAddr,
        to: `"${opts.recipientName}" <${opts.recipient}>`,
        subject: opts.subject,
        html: opts.htmlContent,
      });
      console.log(`Real email delivered via SMTP to ${opts.recipient} [ID: ${info.messageId}]`);
      mailRecord.status = "delivered";
    } catch (err: any) {
      console.error(`Failed to dispatch SMTP email to ${opts.recipient}:`, err.message);
      mailRecord.status = "sent";
    }
  } else {
    console.log(`[EMAIL DISPATCH SIMULATOR] To: ${opts.recipient} | Subject: ${opts.subject}`);
    mailRecord.status = "delivered";
  }

  storedData.emails.unshift(mailRecord);
  if (storedData.emails.length > 50) storedData.emails.pop();
  saveDb();
  return mailRecord;
}

// -------------------------------------------------------------
// Web3Forms API Integration Helper
// Supports booking slot notifications and client reminder emails
// -------------------------------------------------------------
async function sendWeb3FormsNotification(opts: {
  accessKey?: string;
  subject: string;
  fromName?: string;
  clientName: string;
  clientEmail: string;
  messageText: string;
  extraData?: Record<string, any>;
}): Promise<{ success: boolean; message: string; response?: any }> {
  const rawKey = opts.accessKey || storedData.settings.web3formsKey || process.env.WEB3FORMS_ACCESS_KEY || "b91db637-425b-4ce4-8ed1-c2b51bc1b91b";
  const key = rawKey ? rawKey.trim().replace(/\/+$/, '') : 'b91db637-425b-4ce4-8ed1-c2b51bc1b91b';
  if (!key) {
    console.log("[Web3Forms] Note: No access key configured yet. (Set in Admin Settings or WEB3FORMS_ACCESS_KEY in env)");
    return {
      success: false,
      message: "No Web3Forms API Key is configured. Please enter your Web3Forms Access Key in Admin Settings to enable live email delivery.",
    };
  }

  try {
    const payload: Record<string, any> = {
      access_key: key,
      subject: opts.subject,
      from_name: opts.fromName || storedData.settings.companyName || "LockYourIdea Tech",
      name: opts.clientName,
      email: opts.clientEmail,
      message: opts.messageText,
      botcheck: false,
      ...(opts.extraData || {}),
    };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data: any = {};
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: res.ok, message: text.slice(0, 100) };
    }
    console.log(`[Web3Forms] Response for recipient ${opts.clientEmail}:`, data);
    return {
      success: !!data.success,
      message: data.message || (data.success ? "Delivered via Web3Forms successfully" : "Web3Forms submission failed"),
      response: data,
    };
  } catch (err: any) {
    console.error("[Web3Forms] Error calling API:", err);
    return {
      success: false,
      message: `Web3Forms dispatch error: ${err.message || err}`,
    };
  }
}

// -------------------------------------------------------------
// Email Template Generators
// -------------------------------------------------------------
function generateBookingConfirmationEmail(booking: Booking): string {
  const isAi = booking.division === "AI Hub";
  const primaryColor = isAi ? "#2563EB" : "#0891B2";
  const accentBadge = isAi ? "AI Hub Specialist Session" : "IP Hub Counsel Session";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #F8FAFC; color: #0F172A; }
    .container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px -5px rgba(15,23,42,0.06); }
    .header { background: #0F172A; padding: 28px 32px; color: #ffffff; text-align: left; }
    .brand-pill { display: inline-block; padding: 4px 10px; border-radius: 6px; background: linear-gradient(135deg, #2563EB, #06B6D4); font-weight: 800; font-size: 13px; color: #ffffff; margin-bottom: 8px; }
    .header h1 { margin: 8px 0 4px; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 13px; color: #94A3B8; }
    .body-content { padding: 32px; }
    .greeting { font-size: 17px; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
    .intro { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
    .booking-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #CBD5E1; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748B; font-weight: 500; }
    .detail-value { color: #0F172A; font-weight: 700; text-align: right; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; background: #EEF2F6; color: ${primaryColor}; }
    .btn-action { display: inline-block; background: ${primaryColor}; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: 700; font-size: 14px; margin-top: 8px; box-shadow: 0 4px 12px rgba(37,99,235,0.25); text-align: center; }
    .consultant-box { display: flex; align-items: center; gap: 14px; background: #F1F5F9; border-radius: 10px; padding: 14px; margin-top: 20px; }
    .consultant-info h4 { margin: 0; font-size: 14px; color: #0F172A; }
    .consultant-info p { margin: 2px 0 0; font-size: 12px; color: #64748B; }
    .footer { background: #F8FAFC; padding: 20px 32px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8; }
    .footer a { color: #2563EB; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="brand-pill">LOCKYOURIDEA TECH</span>
      <h1>Consultation Confirmed</h1>
      <p>${storedData.settings.companyName} · ${accentBadge}</p>
    </div>
    <div class="body-content">
      <div class="greeting">Hello ${booking.fullName},</div>
      <div class="intro">
        Thank you for booking a consultation with <strong>${storedData.settings.companyName}</strong>. Your session has been locked into our company scheduling system. Our specialist is prepared to discuss your project requirements.
      </div>
      
      <div class="booking-card">
        <div class="detail-row">
          <span class="detail-label">Booking Reference</span>
          <span class="detail-value" style="font-family: monospace; color: #2563EB;">${booking.reference}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${booking.date}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time Slot</span>
          <span class="detail-value">${booking.timeSlot}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service Division</span>
          <span class="detail-value"><span class="badge">${booking.division}</span></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Requested Solution</span>
          <span class="detail-value">${booking.service}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Meeting Mode</span>
          <span class="detail-value">${booking.mode}</span>
        </div>
        ${booking.organization ? `
        <div class="detail-row">
          <span class="detail-label">Organization</span>
          <span class="detail-value">${booking.organization} (${booking.orgType})</span>
        </div>
        ` : ""}
        ${booking.budget ? `
        <div class="detail-row">
          <span class="detail-label">Budget Range</span>
          <span class="detail-value">${booking.budget}</span>
        </div>
        ` : ""}
      </div>

      ${booking.mode === "Google Meet" ? `
      <div style="text-align: center; margin: 28px 0;">
        <a href="${booking.meetingLink}" class="btn-action" target="_blank">
          Join Google Meet Video Session →
        </a>
        <p style="margin-top: 10px; font-size: 12px; color: #64748B;">Meeting link: ${booking.meetingLink}</p>
      </div>
      ` : ""}

      <div class="consultant-box">
        <div class="consultant-info">
          <h4>Assigned Specialist: ${booking.assignedConsultant.name}</h4>
          <p>${booking.assignedConsultant.role} · ${booking.assignedConsultant.email}</p>
        </div>
      </div>
      
      ${booking.message ? `
      <div style="margin-top: 20px; padding: 14px; background: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 6px;">
        <strong style="font-size: 12px; color: #B45309; text-transform: uppercase;">Your Requirement Notes:</strong>
        <p style="margin: 4px 0 0; font-size: 13px; color: #78350F;">${booking.message}</p>
      </div>
      ` : ""}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px;">${storedData.settings.companyName} · ${storedData.settings.hqAddress}</p>
      <p style="margin: 0;">Phone: <a href="tel:${storedData.settings.phone}">${storedData.settings.phone}</a> | Email: <a href="mailto:${storedData.settings.email}">${storedData.settings.email}</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateCancellationEmail(booking: Booking): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #F8FAFC; padding: 24px; color: #0F172A;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #E2E8F0;">
    <h2 style="color: #DC2626; margin-top: 0;">Consultation Cancelled</h2>
    <p>Dear ${booking.fullName},</p>
    <p>Your scheduled consultation (Ref: <strong>${booking.reference}</strong>) for <strong>${booking.date} at ${booking.timeSlot}</strong> has been cancelled.</p>
    <p>If you'd like to book a fresh consultation, please visit our website at any time or call our office at ${storedData.settings.phone}.</p>
    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
    <p style="font-size: 12px; color: #64748B; margin: 0;">${storedData.settings.companyName} · ${storedData.settings.hqAddress}</p>
  </div>
</body>
</html>
  `;
}

function generateReminderEmail(booking: Booking, customMessage?: string): string {
  const isAi = booking.division === "AI Hub";
  const primaryColor = isAi ? "#2563EB" : "#0891B2";
  const accentBadge = isAi ? "AI Hub Technical Session" : "IP Hub Legal Session";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #F8FAFC; color: #0F172A; }
    .container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px -5px rgba(15,23,42,0.06); }
    .header { background: #0F172A; padding: 28px 32px; color: #ffffff; text-align: left; }
    .brand-pill { display: inline-block; padding: 4px 10px; border-radius: 6px; background: linear-gradient(135deg, ${primaryColor}, #06B6D4); font-weight: 800; font-size: 12px; color: #ffffff; margin-bottom: 8px; text-transform: uppercase; }
    .header h1 { margin: 8px 0 4px; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 13px; color: #94A3B8; }
    .body-content { padding: 32px; }
    .greeting { font-size: 17px; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
    .intro { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 20px; }
    .custom-note { background: #FEF3C7; border: 1px solid #FCD34D; border-left: 4px solid #D97706; padding: 14px 16px; border-radius: 8px; font-size: 13px; color: #92400E; margin-bottom: 24px; line-height: 1.5; }
    .booking-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #CBD5E1; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748B; font-weight: 500; }
    .detail-value { color: #0F172A; font-weight: 700; text-align: right; }
    .btn-action { display: inline-block; background: ${primaryColor}; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: 700; font-size: 14px; margin-top: 8px; box-shadow: 0 4px 12px rgba(37,99,235,0.25); text-align: center; }
    .consultant-box { display: flex; align-items: center; gap: 14px; background: #F1F5F9; border-radius: 10px; padding: 14px; margin-top: 20px; }
    .footer { background: #F8FAFC; padding: 20px 32px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8; }
    .footer a { color: #2563EB; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="brand-pill">${accentBadge}</span>
      <h1>Consultation Session Reminder</h1>
      <p>${storedData.settings.companyName} · Pune Headquarters</p>
    </div>

    <div class="body-content">
      <div class="greeting">Dear ${booking.fullName},</div>
      <p class="intro">
        This is an official reminder regarding your upcoming consultation with <strong>${storedData.settings.companyName}</strong>. Our specialist team is prepared to analyze your requirements and blueprint your action plan.
      </p>

      ${customMessage ? `
      <div class="custom-note">
        <strong>Direct Note from LockYourIdea Tech Admin:</strong><br/>
        ${customMessage}
      </div>
      ` : ''}

      <div class="booking-card">
        <div class="detail-row">
          <span class="detail-label">Reference ID</span>
          <span class="detail-value" style="color: ${primaryColor};">${booking.reference}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service Focus</span>
          <span class="detail-value">${booking.service}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Scheduled Date</span>
          <span class="detail-value">${booking.date}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Confirmed Time Slot</span>
          <span class="detail-value">${booking.timeSlot}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Format / Mode</span>
          <span class="detail-value">${booking.mode}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Assigned Specialist</span>
          <span class="detail-value">${booking.assignedConsultant.name} (${booking.assignedConsultant.role})</span>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${booking.meetingLink}" class="btn-action" target="_blank">
          Open Meeting Room / Join Link
        </a>
      </div>

      <div class="consultant-box">
        <div>
          <h4 style="margin: 0; font-size: 14px; color: #0F172A;">Lead Specialist: ${booking.assignedConsultant.name}</h4>
          <p style="margin: 2px 0 0; font-size: 12px; color: #64748B;">
            Direct Email: <a href="mailto:${booking.assignedConsultant.email}">${booking.assignedConsultant.email}</a>
          </p>
        </div>
      </div>

      <p style="font-size: 13px; color: #64748B; margin-top: 24px; line-height: 1.5;">
        Need to update your schedule or provide additional documentation prior to the call? Reach our headquarters team at <strong>${storedData.settings.phone}</strong> or <strong>${storedData.settings.email}</strong>.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px;">${storedData.settings.companyName} · ${storedData.settings.hqAddress}</p>
      <p style="margin: 0;">Phone: <a href="tel:${storedData.settings.phone}">${storedData.settings.phone}</a> | Email: <a href="mailto:${storedData.settings.email}">${storedData.settings.email}</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

// -------------------------------------------------------------
// Helper to determine division from service
// -------------------------------------------------------------
function getDivision(service: string): "AI Hub" | "IP Hub" {
  const ipKeywords = ["patent", "trademark", "copyright", "industrial design", "ip strategy", "ip valuation", "ip hub"];
  const lower = service.toLowerCase();
  for (const kw of ipKeywords) {
    if (lower.includes(kw)) return "IP Hub";
  }
  return "AI Hub";
}

const DEFAULT_TIME_SLOTS = [
  "10:00 AM IST",
  "11:30 AM IST",
  "02:00 PM IST",
  "03:30 PM IST",
  "05:00 PM IST",
  "06:30 PM IST",
];

// -------------------------------------------------------------
// REST API Routes
// -------------------------------------------------------------

// GET overall health & config status
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: storedData.settings.companyName,
    hq: storedData.settings.hqAddress,
    time: new Date().toISOString(),
    smtpConfigured: Boolean(transporter),
    totalBookings: storedData.bookings.length,
  });
});

// GET all bookings with optional query filters
app.get("/api/bookings", (req, res) => {
  const { division, status, search } = req.query;
  let list = [...storedData.bookings];

  if (division && typeof division === "string") {
    list = list.filter(b => b.division.toLowerCase() === division.toLowerCase());
  }

  if (status && typeof status === "string") {
    list = list.filter(b => b.status === status);
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    list = list.filter(b =>
      b.fullName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.reference.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q) ||
      (b.organization && b.organization.toLowerCase().includes(q))
    );
  }

  res.json(list);
});

// GET Excel / CSV Export of real-time slots
app.get("/api/bookings/export-csv", (_req, res) => {
  const headers = [
    "Reference",
    "Client Name",
    "Email",
    "Mobile",
    "Organization",
    "Designation",
    "Org Type",
    "Service Requested",
    "Division",
    "Budget",
    "Date",
    "Time Slot",
    "Meeting Mode",
    "Status",
    "Assigned Consultant",
    "Consultant Email",
    "Meeting Link",
    "Client Requirements / What They Want",
    "Created At",
  ];

  function escapeCsv(val: any) {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  const rows = storedData.bookings.map(b => [
    escapeCsv(b.reference),
    escapeCsv(b.fullName),
    escapeCsv(b.email),
    escapeCsv(b.mobile),
    escapeCsv(b.organization || "N/A"),
    escapeCsv(b.designation || "N/A"),
    escapeCsv(b.orgType),
    escapeCsv(b.service),
    escapeCsv(b.division),
    escapeCsv(b.budget),
    escapeCsv(b.date),
    escapeCsv(b.timeSlot),
    escapeCsv(b.mode),
    escapeCsv(b.status.toUpperCase()),
    escapeCsv(b.assignedConsultant.name),
    escapeCsv(b.assignedConsultant.email),
    escapeCsv(b.meetingLink),
    escapeCsv(b.message || "No requirement notes provided"),
    escapeCsv(b.createdAt),
  ].join(","));

  const csvContent = "\uFEFF" + headers.join(",") + "\n" + rows.join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename=LockYourIdea_Consultations_${new Date().toISOString().slice(0, 10)}.csv`);
  res.send(csvContent);
});

// GET available time slots for a given date
app.get("/api/bookings/available-slots", (req, res) => {
  const { date, service } = req.query;
  if (!date || typeof date !== "string") {
    res.status(400).json({ error: "Date parameter (YYYY-MM-DD) is required" });
    return;
  }

  const targetDivision = service ? getDivision(String(service)) : null;
  const bookedSlots = storedData.bookings
    .filter(b => b.date === date && b.status === "confirmed")
    .filter(b => !targetDivision || b.division === targetDivision)
    .map(b => b.timeSlot);

  const availableSlots = DEFAULT_TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));

  res.json({
    date,
    allSlots: DEFAULT_TIME_SLOTS,
    availableSlots,
    bookedSlots,
    totalAvailable: availableSlots.length,
  });
});

// GET single booking
app.get("/api/bookings/:id", (req, res) => {
  const booking = storedData.bookings.find(b => b.id === req.params.id || b.reference === req.params.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json(booking);
});

// PUT update booking status
app.put("/api/bookings/:id/status", async (req, res) => {
  const { status } = req.body;
  const booking = storedData.bookings.find(b => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  booking.status = status;
  saveDb();

  try {
    await BookingModel.findOneAndUpdate({ $or: [{ id: req.params.id }, { reference: req.params.id }] }, { $set: { status } });
  } catch (err) {
    console.warn("Booking status update error:", err);
  }

  res.json({ success: true, booking });
});

// DELETE single booking
app.delete("/api/bookings/:id", async (req, res) => {
  const id = req.params.id;
  storedData.bookings = storedData.bookings.filter(b => b.id !== id && b.reference !== id);
  saveDb();

  try {
    await BookingModel.findOneAndDelete({ $or: [{ id }, { reference: id }] });
  } catch (err) {
    console.warn("Booking delete error:", err);
  }

  res.json({ success: true, message: `Booking ${id} deleted successfully`, totalRemaining: storedData.bookings.length });
});

// DELETE all bookings (allows resetting database to 0 bookings)
app.delete("/api/bookings", async (_req, res) => {
  storedData.bookings = [];
  saveDb();

  try {
    await BookingModel.deleteMany({});
  } catch (err) {
    console.warn("Clear bookings error:", err);
  }

  res.json({ success: true, message: "All bookings cleared successfully. 0 bookings active.", totalRemaining: 0 });
});

// POST create a new real-time booking and dispatch email
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      organization,
      designation,
      orgType = "Startup",
      service = "Custom AI Solutions",
      budget = "₹1–5 Lakh",
      date,
      timeSlot,
      mode = "Google Meet",
      message,
    } = req.body;

    if (!fullName || !email || !mobile || !date || !timeSlot) {
      res.status(400).json({ error: "Please provide fullName, email, mobile, date, and timeSlot" });
      return;
    }

    const division = getDivision(service);

    // Double-booking check for same date, slot, and division specialist
    const isConflict = storedData.bookings.some(
      b => b.date === date && b.timeSlot === timeSlot && b.division === division && b.status === "confirmed"
    );

    if (isConflict) {
      res.status(409).json({
        error: `Slot ${timeSlot} on ${date} is already reserved for a ${division} specialist. Please pick another available slot.`,
      });
      return;
    }

    const referenceNum = Math.floor(1000 + Math.random() * 9000);
    const reference = `LYI-2026-${referenceNum}`;
    const id = `bk_${Date.now()}`;

    const assignedConsultant = division === "AI Hub"
      ? {
          name: "Dr. Rajiv Mehta",
          role: "Principal AI Transformation Architect",
          email: "rajiv.mehta@lockyourideatech.com",
        }
      : {
          name: "Adv. Priya Sharma",
          role: "Lead Patent & IP Attorney",
          email: "priya.sharma@lockyourideatech.com",
        };

    const roomCode = Math.random().toString(36).substring(2, 6);
    const meetingLink = mode === "Google Meet"
      ? `https://meet.google.com/lyi-${division === "AI Hub" ? "ai" : "ip"}-${roomCode}`
      : mode === "WhatsApp Call"
      ? `https://wa.me/917558631355?text=Consultation%20${reference}`
      : `tel:+917558631355`;

    const newBooking: Booking = {
      id,
      reference,
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      mobile: String(mobile).trim(),
      organization: organization ? String(organization).trim() : undefined,
      designation: designation ? String(designation).trim() : undefined,
      orgType,
      service,
      division,
      budget,
      date,
      timeSlot,
      mode,
      meetingLink,
      assignedConsultant,
      message: message ? String(message).trim() : undefined,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    storedData.bookings.unshift(newBooking);
    saveDb();

    // Commit booking directly into MongoDB collection
    try {
      await BookingModel.create(newBooking);
    } catch (dbErr) {
      console.warn("MongoDB Booking creation notice:", dbErr);
    }

    // Generate & Dispatch Confirmation Email
    const emailHtml = generateBookingConfirmationEmail(newBooking);
    const dispatched = await sendEmail({
      recipient: newBooking.email,
      recipientName: newBooking.fullName,
      subject: `[Confirmed] Your Consultation with LockYourIdea Tech (${newBooking.reference})`,
      htmlContent: emailHtml,
      type: "booking_confirmation",
      bookingId: newBooking.id,
    });

    // Also dispatch to Web3Forms API
    const formattedBookingMessage = `
NEW CONSULTATION SLOT BOOKING:
---------------------------------------------
Booking Ref: ${newBooking.reference}
Client Name: ${newBooking.fullName}
Client Email: ${newBooking.email}
Mobile Number: ${newBooking.mobile}
Organization: ${newBooking.organization || 'Individual'} (${newBooking.orgType || 'Direct'})
Designation: ${newBooking.designation || 'N/A'}
Service Focus: ${newBooking.service}
Division: ${newBooking.division}
Investment Budget: ${newBooking.budget}
Selected Date: ${newBooking.date}
Reserved Time Slot: ${newBooking.timeSlot}
Format / Mode: ${newBooking.mode}
Meeting Room Link: ${newBooking.meetingLink}
Assigned Lead Specialist: ${newBooking.assignedConsultant.name} (${newBooking.assignedConsultant.email})
Client Requirement Details:
${newBooking.message || 'No additional notes provided'}
---------------------------------------------
Booked on: ${new Date().toISOString()} via LockYourIdea Tech Web Platform
Headquarters: ${storedData.settings.hqAddress}
Phone: ${storedData.settings.phone}
`.trim();

    const web3formsResult = await sendWeb3FormsNotification({
      subject: `New Slot Booked: ${newBooking.fullName} (${newBooking.reference}) — ${newBooking.service}`,
      clientName: newBooking.fullName,
      clientEmail: newBooking.email,
      messageText: formattedBookingMessage,
      extraData: {
        Reference: newBooking.reference,
        Client_Name: newBooking.fullName,
        Client_Email: newBooking.email,
        Client_Mobile: newBooking.mobile,
        Service: newBooking.service,
        Division: newBooking.division,
        Date: newBooking.date,
        TimeSlot: newBooking.timeSlot,
        Mode: newBooking.mode,
        MeetingLink: newBooking.meetingLink,
      },
    });

    res.status(201).json({
      success: true,
      booking: newBooking,
      emailSent: {
        id: dispatched.id,
        recipient: dispatched.recipient,
        subject: dispatched.subject,
        status: dispatched.status,
        sentAt: dispatched.sentAt,
      },
      web3forms: web3formsResult,
      message: `Consultation confirmed! Confirmation email dispatched to ${newBooking.email}.${web3formsResult.success ? ' Web3Forms slot alert sent.' : ''}`,
    });
  } catch (err: any) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: err.message || "Failed to schedule consultation" });
  }
});

// POST reschedule booking
app.post("/api/bookings/:id/reschedule", async (req, res) => {
  const { date, timeSlot } = req.body;
  const booking = storedData.bookings.find(b => b.id === req.params.id);

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  if (!date || !timeSlot) {
    res.status(400).json({ error: "Date and timeSlot are required" });
    return;
  }

  const isConflict = storedData.bookings.some(
    b => b.id !== booking.id && b.date === date && b.timeSlot === timeSlot && b.division === booking.division && b.status === "confirmed"
  );

  if (isConflict) {
    res.status(409).json({ error: "The selected time slot is already booked. Please choose another." });
    return;
  }

  booking.date = date;
  booking.timeSlot = timeSlot;
  booking.status = "confirmed";
  saveDb();

  const emailHtml = generateBookingConfirmationEmail(booking);
  const dispatched = await sendEmail({
    recipient: booking.email,
    recipientName: booking.fullName,
    subject: `[Updated] Rescheduled Consultation: LockYourIdea Tech (${booking.reference})`,
    htmlContent: emailHtml,
    type: "reschedule_notice",
    bookingId: booking.id,
  });

  res.json({
    success: true,
    booking,
    emailSent: dispatched,
    message: `Consultation rescheduled for ${date} at ${timeSlot}. Notification email sent to ${booking.email}.`,
  });
});

// POST cancel booking
app.post("/api/bookings/:id/cancel", async (req, res) => {
  const booking = storedData.bookings.find(b => b.id === req.params.id);

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  booking.status = "cancelled";
  saveDb();

  const emailHtml = generateCancellationEmail(booking);
  const dispatched = await sendEmail({
    recipient: booking.email,
    recipientName: booking.fullName,
    subject: `[Notice] Consultation Cancelled: ${booking.reference}`,
    htmlContent: emailHtml,
    type: "cancellation_notice",
    bookingId: booking.id,
  });

  res.json({
    success: true,
    booking,
    emailSent: dispatched,
    message: `Consultation has been cancelled. Cancellation email sent to ${booking.email}.`,
  });
});

// POST resend email for a booking
app.post("/api/bookings/:id/resend-email", async (req, res) => {
  const booking = storedData.bookings.find(b => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const emailHtml = generateBookingConfirmationEmail(booking);
  const dispatched = await sendEmail({
    recipient: booking.email,
    recipientName: booking.fullName,
    subject: `[Copy] Your Consultation with LockYourIdea Tech (${booking.reference})`,
    htmlContent: emailHtml,
    type: "booking_confirmation",
    bookingId: booking.id,
  });

  res.json({
    success: true,
    emailSent: dispatched,
    message: `Confirmation email re-dispatched to ${booking.email}`,
  });
});

// POST send reminder to client (Web3Forms API + internal/SMTP mailer)
app.post("/api/bookings/:id/send-reminder", async (req, res) => {
  const booking = storedData.bookings.find(b => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const { customMessage, reminderType } = req.body || {};
  const emailHtml = generateReminderEmail(booking, customMessage);
  const emailSubject = `[Reminder] Your Upcoming ${booking.service} Consultation with ${storedData.settings.companyName} (${booking.reference})`;

  // 1. Dispatch via mailer system for live audit and SMTP delivery
  const dispatched = await sendEmail({
    recipient: booking.email,
    recipientName: booking.fullName,
    subject: emailSubject,
    htmlContent: emailHtml,
    type: "reminder",
    bookingId: booking.id,
  });

  // 2. Dispatch via Web3Forms API
  const formattedReminderMessage = `
CONSULTATION SESSION REMINDER:
---------------------------------------------
Client Name: ${booking.fullName}
Client Email: ${booking.email}
Client Mobile: ${booking.mobile}
Booking Reference: ${booking.reference}
Service Topic: ${booking.service}
Specialist Division: ${booking.division}
Scheduled Date: ${booking.date}
Scheduled Time Slot: ${booking.timeSlot}
Format / Mode: ${booking.mode}
Meeting Link: ${booking.meetingLink}
Assigned Lead Specialist: ${booking.assignedConsultant.name} (${booking.assignedConsultant.role})
Organization: ${booking.organization || 'Individual'}
${customMessage ? `\nPersonal Note from Admin:\n"${customMessage}"\n` : ''}
---------------------------------------------
Sent by LockYourIdea Tech CRM Administration
Headquarters: ${storedData.settings.hqAddress}
Phone: ${storedData.settings.phone} | Email: ${storedData.settings.email}
`.trim();

  const web3formsResult = await sendWeb3FormsNotification({
    subject: emailSubject,
    clientName: booking.fullName,
    clientEmail: booking.email,
    messageText: formattedReminderMessage,
    extraData: {
      Consultation_Reference: booking.reference,
      Service_Requested: booking.service,
      Division: booking.division,
      Slot_Date: booking.date,
      Time_Slot: booking.timeSlot,
      Consultant: booking.assignedConsultant.name,
      Meeting_URL: booking.meetingLink,
      Reminder_Type: reminderType || "Consultation Slot Reminder",
    },
  });

  res.json({
    success: true,
    message: `Reminder sent to ${booking.fullName} (${booking.email})! ${web3formsResult.success ? 'Delivered via Web3Forms API.' : web3formsResult.message}`,
    emailSent: dispatched,
    web3forms: web3formsResult,
  });
});

// POST test Web3Forms API connection
app.post("/api/test-web3forms", async (req, res) => {
  const { accessKey, testEmail } = req.body || {};
  const recipient = testEmail || storedData.settings.email || "hello@lockyourideatech.com";
  const result = await sendWeb3FormsNotification({
    accessKey,
    subject: `[Test] Web3Forms API Integration Check — ${storedData.settings.companyName}`,
    clientName: "System Administrator",
    clientEmail: recipient,
    messageText: `This is a test notification confirming that your Web3Forms API Key is configured and operating successfully for LockYourIdea Tech slot booking and client reminder notifications.\n\nTime: ${new Date().toISOString()}`,
    extraData: {
      Test_Timestamp: new Date().toISOString(),
      Platform: "LockYourIdea Tech 360° AI & IP Platform",
    },
  });
  res.json(result);
});

// GET all dispatched emails
app.get("/api/emails", (_req, res) => {
  res.json(storedData.emails);
});

// GET single email HTML content
app.get("/api/emails/:id", (req, res) => {
  const mail = storedData.emails.find(e => e.id === req.params.id);
  if (!mail) {
    res.status(404).send("Email record not found");
    return;
  }
  res.send(mail.htmlContent);
});

// POST generic inquiry form handler
app.post("/api/enquiries", async (req, res) => {
  const { fullName, email, mobile, service, message, organization } = req.body;

  if (!fullName || !email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  const ackHtml = `
    <div style="font-family: sans-serif; padding: 24px; color: #0F172A;">
      <h2>Thank you for contacting ${storedData.settings.companyName}</h2>
      <p>Dear ${fullName},</p>
      <p>We have received your enquiry regarding <strong>${service || "AI & IP Transformation"}</strong>.</p>
      <p>Our sector specialist from our Pune Headquarters will review your requirement and reach out within 1 business day.</p>
      <p style="margin-top: 20px; font-size: 13px; color: #64748B;">${storedData.settings.companyName} · ${storedData.settings.phone} · ${storedData.settings.hqAddress}</p>
    </div>
  `;

  const dispatched = await sendEmail({
    recipient: email,
    recipientName: fullName,
    subject: `Enquiry Received — ${storedData.settings.companyName} (${service || "AI & IP"})`,
    htmlContent: ackHtml,
    type: "enquiry_acknowledgement",
  });

  res.json({
    success: true,
    message: "Enquiry submitted successfully! Our team will get in touch shortly.",
    emailSent: dispatched,
  });
});

// Route aliases to ensure frontend variations never 404
app.post("/api/booking", (req, res, next) => {
  req.url = "/api/bookings";
  app._router.handle(req, res, next);
});
app.post("/api/consultations", (req, res, next) => {
  req.url = "/api/bookings";
  app._router.handle(req, res, next);
});
app.post("/api/consultation", (req, res, next) => {
  req.url = "/api/bookings";
  app._router.handle(req, res, next);
});
app.post("/api/enquiry", (req, res, next) => {
  req.url = "/api/enquiries";
  app._router.handle(req, res, next);
});

// Ensure any unknown /api/* route ALWAYS returns JSON (never HTML)
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.method} ${req.path} not found` });
});

// -------------------------------------------------------------
// Vite middleware for Dev / Static fallback for Prod
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LockYourIdea Tech Server running on port ${PORT} [HQ Pune]`);
  });
}

startServer();
