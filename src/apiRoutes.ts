import { Router } from "express";
import { 
  Settings, 
  Page, 
  Service, 
  Portfolio, 
  ClientLogo, 
  Industry, 
  Testimonial, 
  CaseStudy, 
  Booking,
  AdminUser,
  Revision,
  CRMConfig,
  MediaAsset,
  SeoConfig,
  isMongoConnected
} from "../serverModels.ts";
import { DEFAULT_SEO_CONFIGS } from "./data/defaultSeoData.ts";
import fs from "fs";
import path from "path";

export const apiRouter = Router();


// Ensure dynamic CMS API routes are never cached by browser or CDN
apiRouter.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// -------------------------------------------------------------
// Helper: Sanitize snapshotData to replace inline Base64 data with clean file references
function sanitizeSnapshotBase64(data: any): any {
  if (!data) return data;
  if (typeof data === "string") {
    if (data.startsWith("data:image/")) {
      const match = data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        let ext = match[1].toLowerCase().replace("+xml", "").replace("jpeg", "jpg");
        if (ext === "svg+xml" || ext === "svg") ext = "svg";
        const base64Content = match[2];
        const buffer = Buffer.from(base64Content, "base64");
        // Hash buffer to reuse identical files
        const crypto = require("crypto");
        const hash = crypto.createHash("md5").update(buffer).digest("hex").slice(0, 12);
        const safeFileName = `rev_img_${Date.now()}_${hash}.${ext}`;
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const filePath = path.join(uploadsDir, safeFileName);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, buffer);
        }
        return `/uploads/${safeFileName}`;
      }
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeSnapshotBase64);
  }
  if (typeof data === "object") {
    const cleaned: any = {};
    for (const key of Object.keys(data)) {
      if (key === "_id" || key === "__v" || key === "createdAt" || key === "updatedAt") continue;
      cleaned[key] = sanitizeSnapshotBase64(data[key]);
    }
    return cleaned;
  }
  return data;
}

// Helper: Snapshot Creator for Versioning & Revisions
async function createRevisionSnapshot(entityType: string, entityId: string, snapshotData: any, changeSummary = "Updated content", updatedBy = "admin") {
  try {
    const sanitizedData = sanitizeSnapshotBase64(snapshotData);
    const sanitizedJsonStr = JSON.stringify(sanitizedData || {});

    const lastRev = await Revision.findOne({ entityType, entityId }).sort({ version: -1 });

    if (lastRev) {
      const lastSanitizedData = sanitizeSnapshotBase64(lastRev.snapshotData);
      const lastJsonStr = JSON.stringify(lastSanitizedData || {});
      if (sanitizedJsonStr === lastJsonStr) {
        console.log(`[Revision] Skipped duplicate revision snapshot for ${entityType}:${entityId}`);
        return;
      }
    }

    const version = lastRev ? lastRev.version + 1 : 1;
    await Revision.create({
      entityType,
      entityId,
      version,
      snapshotData: sanitizedData,
      changeSummary,
      updatedBy,
    });

    // Keep latest 15 revisions max per entity to prevent storage explosion
    const count = await Revision.countDocuments({ entityType, entityId });
    if (count > 15) {
      const oldRevisions = await Revision.find({ entityType, entityId })
        .sort({ version: 1 })
        .limit(count - 15);
      const idsToDelete = oldRevisions.map((r) => r._id);
      await Revision.deleteMany({ _id: { $in: idsToDelete } });
    }
  } catch (err) {
    console.warn("[Revision] Error saving revision snapshot:", err);
  }
}

// -------------------------------------------------------------
// System Health
// -------------------------------------------------------------
apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
apiRouter.post("/auth/login", async (req, res) => {
  try {
    const { password, username = "admin" } = req.body;
    const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "lyiadmin2026";
    
    if (!password || password !== ADMIN_PASSKEY) {
      return res.status(401).json({ success: false, error: "Invalid admin password or passkey" });
    }

    // Generate a lightweight session token
    const token = Buffer.from(`${username}:${Date.now()}:${ADMIN_PASSKEY}`).toString('base64');
    
    // Log or update admin user login time
    await AdminUser.findOneAndUpdate(
      { username },
      { $set: { username, email: "admin@lockyourideatech.com", lastLogin: new Date() } },
      { upsert: true }
    );

    res.json({ 
      success: true, 
      token,
      user: { username, role: "admin" },
      message: "Admin authenticated successfully" 
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Authentication failed" });
  }
});

apiRouter.get("/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true, role: "admin" });
});

apiRouter.post("/auth/logout", (_req, res) => {
  res.json({ success: true, message: "Logged out" });
});

// Helper to get merged SEO configs (Defaults + DB Overrides)
async function getMergedSeoConfigs(): Promise<Record<string, any>> {
  const result: Record<string, any> = { ...DEFAULT_SEO_CONFIGS };
  if (!isMongoConnected()) {
    return result;
  }
  try {
    const dbConfigs = await SeoConfig.find();
    dbConfigs.forEach((item: any) => {
      const obj = item.toObject();
      if (obj.page) {
        result[obj.page] = {
          ...(result[obj.page] || {}),
          ...obj,
        };
      }
    });
  } catch (err) {
    console.warn("[SEO] Error reading SeoConfig collection, using defaults:", err);
  }
  return result;
}

// -------------------------------------------------------------
// Aggregated App Data (High-Speed Initial Paint)
// -------------------------------------------------------------
apiRouter.get("/site-data", async (_req, res) => {
  try {
    const settings = await Settings.findOne() || {};
    const portfolio = await Portfolio.find().sort({ order: 1 });
    const bookings = await Booking.find().sort({ createdAt: -1 });
    const services = await Service.find().sort({ order: 1 });
    const logos = await ClientLogo.find().sort({ order: 1 });
    const pages = await Page.find();
    const industries = await Industry.find().sort({ order: 1 });
    const testimonials = await Testimonial.find().sort({ order: 1 });
    const caseStudies = await CaseStudy.find().sort({ order: 1 });
    const seoConfigs = await getMergedSeoConfigs();
    
    const cmsPages: Record<string, any> = {};
    pages.forEach((p: any) => cmsPages[p.slug] = p);
    
    const confirmedCount = bookings.filter((b: any) => b.status === "confirmed").length;
    const inProgressCount = bookings.filter((b: any) => b.status === "in-progress").length;
    const completedCount = bookings.filter((b: any) => b.status === "completed").length;
    
    res.json({
      settings: { ...settings.toObject(), clientLogos: logos },
      bookings,
      portfolio,
      services,
      customServices: services,
      logos,
      cmsPages,
      industries,
      testimonials,
      caseStudies,
      seoConfigs,
      stats: {
        ...(settings.stats || {}),
        totalBookings: bookings.length,
        confirmedBookings: confirmedCount,
        inProgressBookings: inProgressCount,
        completedBookings: completedCount,
        pipelineValue: "₹48.5 Lakhs",
        conversionRate: "92.4%",
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch aggregated site data" });
  }
});

apiRouter.get("/all-data", async (req, res) => {
  // Alias to site-data for backward compatibility
  return (apiRouter as any).handle(Object.assign(req, { url: '/site-data' }), res);
});

// -------------------------------------------------------------
// SEO / GEO / LLM Optimization Endpoints
// -------------------------------------------------------------
apiRouter.get("/seo", async (_req, res) => {
  try {
    const seoConfigs = await getMergedSeoConfigs();
    res.json({ success: true, seoConfigs });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch SEO configs: " + err.message });
  }
});

apiRouter.get("/seo/:page", async (req, res) => {
  try {
    const pageId = req.params.page;
    const allConfigs = await getMergedSeoConfigs();
    const config = allConfigs[pageId] || DEFAULT_SEO_CONFIGS[pageId] || {
      page: pageId,
      metaTitle: `${pageId.toUpperCase()} | LockYourIdea Tech`,
      metaDescription: `SEO and GEO optimization settings for ${pageId} page at LockYourIdea Tech.`,
      slug: `/#/${pageId}`,
      canonicalUrl: `https://lockyourideatech.com/#/${pageId}`,
      robots: "index, follow",
      ogTitle: `${pageId.toUpperCase()} | LockYourIdea Tech`,
      ogDescription: `Learn more about ${pageId} solutions at LockYourIdea Tech.`,
      ogImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
      ogUrl: `https://lockyourideatech.com/#/${pageId}`,
      twitterCard: "summary_large_image",
      twitterTitle: `${pageId.toUpperCase()} | LockYourIdea Tech`,
      twitterDescription: `Learn more about ${pageId} solutions at LockYourIdea Tech.`,
      twitterImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2400&q=85",
      images: [],
      headings: { h1: "", h2s: [], h3s: [] },
      schemaType: "WebPage",
      customJsonLd: "",
      faqs: [],
      structuredLists: [],
      structuredTables: [],
      internalLinks: [],
      entities: { primaryTopic: "", secondaryTopics: [], primaryEntity: "", relatedEntities: [], organizationName: "LockYourIdea Tech Pvt. Ltd.", services: [], industries: [], locationsServed: [], expertiseAreas: [] },
      keywords: { primaryKeyword: "", secondaryKeywords: [], longTailQueries: [], relatedSearchTopics: [] },
      geo: { primaryAnswer: "", keyFacts: [], definitions: [], importantFacts: [], commonQuestions: [], relatedTopics: [] },
    };
    res.json({ success: true, page: pageId, seoConfig: config });
  } catch (err: any) {
    res.status(500).json({ error: "Error fetching page SEO config: " + err.message });
  }
});

apiRouter.put("/seo/:page", async (req, res) => {
  try {
    const pageId = req.params.page;
    const updates = { ...req.body, page: pageId };

    // Validate JSON-LD if provided
    if (updates.customJsonLd && updates.customJsonLd.trim() !== "") {
      try {
        JSON.parse(updates.customJsonLd);
      } catch (jsonErr: any) {
        return res.status(400).json({
          error: `Invalid Custom JSON-LD syntax: ${jsonErr.message}. Please correct the JSON syntax before saving.`
        });
      }
    }

    const savedDoc = await SeoConfig.findOneAndUpdate(
      { page: pageId },
      { $set: updates },
      { new: true, upsert: true }
    );

    // Create revision snapshot for auditing
    await createRevisionSnapshot("seo", pageId, savedDoc.toObject(), `Updated SEO/GEO settings for ${pageId}`);

    res.json({ success: true, page: pageId, seoConfig: savedDoc });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save SEO config: " + err.message });
  }
});

apiRouter.delete("/seo/:page", async (req, res) => {
  try {
    const pageId = req.params.page;
    await SeoConfig.findOneAndDelete({ page: pageId });
    const defaultConfig = DEFAULT_SEO_CONFIGS[pageId] || null;
    res.json({ success: true, message: `SEO config for ${pageId} reset to default`, defaultConfig });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Helper to keep individual Mongo collections (ClientLogo, Industry, Testimonial) 100% in sync with Settings
async function syncSettingsWithCollections(updates: any) {
  try {
    if (Array.isArray(updates.clientLogos)) {
      await ClientLogo.deleteMany({});
      const logosToInsert = updates.clientLogos.map((l: any, idx: number) => ({
        id: l.id || `logo_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        name: l.name || '',
        logoUrl: l.logoUrl || l.imageUrl || '',
        imageUrl: l.logoUrl || l.imageUrl || '',
        tag: l.tag || 'Enterprise Client',
        websiteUrl: l.websiteUrl || l.link || '',
        link: l.websiteUrl || l.link || '',
        altText: l.altText || l.name || '',
        title: l.title || l.name || '',
        accentColor: l.accentColor || '#7c3aed',
        width: Number(l.width) || 140,
        height: Number(l.height) || 48,
        fit: l.fit || 'contain',
        order: l.order !== undefined ? l.order : idx,
        active: l.active !== undefined ? l.active : true,
      }));
      if (logosToInsert.length > 0) {
        try {
          const inserted = await ClientLogo.insertMany(logosToInsert, { ordered: false });
          console.log(`[Sync] Successfully synchronized ${inserted.length} ClientLogo documents in MongoDB Atlas.`);
        } catch (insertErr: any) {
          console.error("[Sync insertMany Error]:", insertErr.message || insertErr);
          if (insertErr.insertedDocs) {
            console.log(`[Sync Partial] Inserted ${insertErr.insertedDocs.length} documents despite error.`);
          }
        }
      }
    }

    if (Array.isArray(updates.industries)) {
      await Industry.deleteMany({});
      const industriesToInsert = updates.industries.map((ind: any, idx: number) => ({
        ...ind,
        order: ind.order !== undefined ? ind.order : idx,
      }));
      if (industriesToInsert.length > 0) {
        await Industry.insertMany(industriesToInsert);
      }
    }

    if (Array.isArray(updates.testimonials)) {
      await Testimonial.deleteMany({});
      const testimonialsToInsert = updates.testimonials.map((t: any, idx: number) => ({
        ...t,
        order: t.order !== undefined ? t.order : idx,
      }));
      if (testimonialsToInsert.length > 0) {
        await Testimonial.insertMany(testimonialsToInsert);
      }
    }
  } catch (err) {
    console.error("[Sync Error] Failed to synchronize collections with Settings:", err);
  }
}

// -------------------------------------------------------------
// Brand Settings & Theme Configuration
// -------------------------------------------------------------
apiRouter.get("/settings", async (_req, res) => {
  const settings = await Settings.findOne() || {};
  res.json(settings);
});

apiRouter.put("/settings", async (req, res) => {
  try {
    const updates = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(updates);
      await settings.save();
    } else {
      settings = await Settings.findOneAndUpdate({}, { $set: updates }, { new: true, upsert: true });
    }
    
    // Synchronize individual MongoDB collections (ClientLogo, Industry, Testimonial)
    await syncSettingsWithCollections(updates);
    
    // Create revision snapshot
    await createRevisionSnapshot("settings", "global", settings.toObject(), "Updated site settings & brand identity");
    
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to save settings: " + error.message });
  }
});

// -------------------------------------------------------------
// CMS Pages (Sections, Copy & SEO)
// -------------------------------------------------------------
apiRouter.get("/pages/:pageId", async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const page = await Page.findOne({ slug: pageId });
    if (!page) return res.status(404).json({ error: `Page ${pageId} not found` });
    res.json({ success: true, pageContent: page });
  } catch (e) {
    res.status(500).json({ error: "Error fetching page" });
  }
});

apiRouter.put("/pages/:pageId", async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const updates = req.body;
    const page = await Page.findOneAndUpdate({ slug: pageId }, { $set: updates }, { returnDocument: 'after', upsert: true });
    
    // Also sync to Settings.pageContent
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    if (!settings.pageContent) settings.pageContent = {};
    settings.pageContent[pageId] = {
      ...(settings.pageContent[pageId] || {}),
      ...updates,
      pageId,
    };
    settings.markModified("pageContent");
    await settings.save();

    await createRevisionSnapshot("page", pageId, page.toObject(), `Updated page ${pageId}`);
    res.json({ success: true, pageContent: page });
  } catch (e: any) {
    res.status(500).json({ error: "Error updating page: " + e.message });
  }
});

apiRouter.get("/cms/pages", async (_req, res) => {
  const pages = await Page.find();
  res.json({ success: true, pages });
});

apiRouter.get("/cms/pages/:slug", async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json({ success: true, page });
});

apiRouter.get("/cms/pages/:slug/sections", async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json({ success: true, sections: page.sections || [] });
});

apiRouter.put("/cms/pages/:slug", async (req, res) => {
  try {
    const page = await Page.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: req.body },
      { new: true, upsert: true }
    );
    await createRevisionSnapshot("page", req.params.slug, page.toObject(), `Updated page ${req.params.slug}`);
    res.json({ success: true, page });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.post("/cms/pages/:slug/sections", async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: "Page not found" });
    
    const newSection = {
      sectionId: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...req.body
    };
    
    page.sections.push(newSection);
    await page.save();
    await createRevisionSnapshot("page", req.params.slug, page.toObject(), `Added section to ${req.params.slug}`);
    res.json({ success: true, section: newSection, page });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.put("/cms/pages/:slug/sections/:sectionId", async (req, res) => {
  try {
    const { slug, sectionId } = req.params;
    const page = await Page.findOne({ slug });
    if (!page) return res.status(404).json({ error: "Page not found" });
    
    const idx = page.sections.findIndex((s: any) => s.sectionId === sectionId);
    if (idx === -1) return res.status(404).json({ error: "Section not found" });
    
    page.sections[idx] = { ...page.sections[idx], ...req.body, sectionId };
    await page.save();
    await createRevisionSnapshot("page", slug, page.toObject(), `Updated section ${sectionId} on ${slug}`);
    res.json({ success: true, section: page.sections[idx], page });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.delete("/cms/pages/:slug/sections/:sectionId", async (req, res) => {
  try {
    const { slug, sectionId } = req.params;
    const page = await Page.findOne({ slug });
    if (!page) return res.status(404).json({ error: "Page not found" });
    
    page.sections = page.sections.filter((s: any) => s.sectionId !== sectionId);
    await page.save();
    await createRevisionSnapshot("page", slug, page.toObject(), `Deleted section ${sectionId} on ${slug}`);
    res.json({ success: true, page });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// -------------------------------------------------------------
// Client Logos CMS (Ordering, Dimensions, Links)
// -------------------------------------------------------------
async function syncLogosToSettingsDocument() {
  try {
    const logos = await ClientLogo.find().sort({ order: 1 });
    await Settings.findOneAndUpdate({}, { $set: { clientLogos: logos } }, { upsert: true });
  } catch (_) {}
}

apiRouter.get("/cms/logos", async (_req, res) => {
  const logos = await ClientLogo.find().sort({ order: 1 });
  res.json({ success: true, count: logos.length, logos });
});

apiRouter.post("/cms/logos", async (req, res) => {
  try {
    const logo = new ClientLogo({ ...req.body });
    await logo.save();
    await syncLogosToSettingsDocument();
    const count = await ClientLogo.countDocuments();
    res.status(201).json({ success: true, logo, totalLogos: count });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.put("/cms/logos/reorder", async (req, res) => {
  try {
    const { logoIds } = req.body;
    if (Array.isArray(logoIds)) {
      for (let i = 0; i < logoIds.length; i++) {
        await ClientLogo.findByIdAndUpdate(logoIds[i], { $set: { order: i } });
      }
    }
    const logos = await ClientLogo.find().sort({ order: 1 });
    await Settings.findOneAndUpdate({}, { $set: { clientLogos: logos } }, { upsert: true });
    res.json({ success: true, logos });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.put("/cms/logos/:id", async (req, res) => {
  try {
    const logo = await ClientLogo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    await syncLogosToSettingsDocument();
    res.json({ success: true, logo });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.delete("/cms/logos/:id", async (req, res) => {
  try {
    await ClientLogo.findByIdAndDelete(req.params.id);
    await syncLogosToSettingsDocument();
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// -------------------------------------------------------------
// Image Upload & Media Asset Registry
// -------------------------------------------------------------
apiRouter.post("/upload-image", async (req, res) => {
  try {
    const { imageData, fileName, target, altText } = req.body;
    if (!imageData) return res.status(400).json({ error: "No image data provided" });

    if (imageData.startsWith("data:")) {
      const match = imageData.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        let ext = match[1].toLowerCase().replace("+xml", "").replace("jpeg", "jpg");
        if (ext === "svg+xml" || ext === "svg") ext = "svg";
        const base64Content = match[2];
        const buffer = Buffer.from(base64Content, "base64");

        const MAX_BYTES = 2 * 1024 * 1024; // 2 MB strict limit
        if (buffer.length > MAX_BYTES) {
          return res.status(400).json({ error: "Image size must be 2 MB or smaller." });
        }

        const safeTarget = (target || "photo").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const safeFileName = `${safeTarget}_${Date.now()}.${ext}`;
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const filePath = path.join(uploadsDir, safeFileName);
        fs.writeFileSync(filePath, buffer);
        
        const finalUrl = `/uploads/${safeFileName}`;
        
        // Save asset in MediaAsset library collection
        await MediaAsset.create({
          fileName: safeFileName,
          originalName: fileName || safeFileName,
          url: finalUrl,
          mimeType: `image/${ext}`,
          size: buffer.length,
          tag: target || "general",
          altText: altText || fileName || "",
        });

        return res.json({ success: true, url: finalUrl, fileName: safeFileName, size: buffer.length });
      }
    }
    
    // External URL fallback
    res.json({ success: true, url: imageData.trim(), fileName: fileName || "external_image" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to process image: " + err.message });
  }
});

apiRouter.get("/media", async (_req, res) => {
  try {
    const assets = await MediaAsset.find().sort({ createdAt: -1 });
    res.json({ success: true, count: assets.length, assets });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete("/media/:id", async (req, res) => {
  try {
    const asset = await MediaAsset.findById(req.params.id);
    if (asset) {
      const filePath = path.join(process.cwd(), "public", asset.url);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
      await MediaAsset.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Portfolio CMS (Case Studies & Deployment Cards)
// -------------------------------------------------------------
apiRouter.get("/portfolio", async (_req, res) => {
  const items = await Portfolio.find().sort({ order: 1 });
  res.json(items);
});

apiRouter.get("/cms/portfolio", async (_req, res) => {
  const items = await Portfolio.find().sort({ order: 1 });
  res.json(items);
});

apiRouter.post("/portfolio", async (req, res) => {
  try {
    const id = req.body.id || `port_${Date.now()}`;
    const itemData = { ...req.body, id };
    const item = await Portfolio.findOneAndUpdate(
      { $or: [{ id }, { title: req.body.title }] },
      { $set: itemData },
      { new: true, upsert: true }
    );
    await createRevisionSnapshot("portfolio", id, item.toObject(), "Created/Updated portfolio project");
    res.status(201).json({ success: true, item });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.post("/cms/portfolio", async (req, res) => {
  return (apiRouter as any).handle(Object.assign(req, { url: '/portfolio', method: 'POST' }), res);
});

apiRouter.put("/portfolio/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idParam);
    const query = isObjectId
      ? { $or: [{ _id: idParam }, { id: idParam }] }
      : { $or: [{ id: idParam }, { title: req.body.title || idParam }] };
    const item = await Portfolio.findOneAndUpdate(query, { $set: req.body }, { new: true, upsert: true });
    if (item) {
      await createRevisionSnapshot("portfolio", idParam, item.toObject(), "Updated portfolio project");
    }
    res.json({ success: true, item });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.put("/cms/portfolio/:id", async (req, res) => {
  return (apiRouter as any).handle(Object.assign(req, { url: `/portfolio/${req.params.id}`, method: 'PUT' }), res);
});

apiRouter.delete("/portfolio/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idParam);
    const query = isObjectId ? { $or: [{ _id: idParam }, { id: idParam }] } : { id: idParam };
    await Portfolio.findOneAndDelete(query);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.delete("/cms/portfolio/:id", async (req, res) => {
  return (apiRouter as any).handle(Object.assign(req, { url: `/portfolio/${req.params.id}`, method: 'DELETE' }), res);
});

// -------------------------------------------------------------
// Services CMS (AI Hub & IP Hub Catalog)
// -------------------------------------------------------------
apiRouter.get("/services", async (_req, res) => {
  const items = await Service.find().sort({ order: 1 });
  res.json(items);
});

apiRouter.get("/cms/services", async (_req, res) => {
  const items = await Service.find().sort({ order: 1 });
  res.json(items);
});

apiRouter.get("/services/:slug", async (req, res) => {
  const service = await Service.findOne({ $or: [{ slug: req.params.slug }, { _id: req.params.slug }] });
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json({ success: true, service });
});

apiRouter.get("/cms/services/:slug", async (req, res) => {
  const service = await Service.findOne({ $or: [{ slug: req.params.slug }, { _id: req.params.slug }] });
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json({ success: true, service });
});

apiRouter.post("/services", async (req, res) => {
  try {
    let { slug, title, id, division } = req.body;
    if (!slug && title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (!slug) {
      slug = `service-${Date.now()}`;
    }
    const serviceId = id || `srv_${Date.now()}`;
    
    // Check if slug already exists
    const existing = await Service.findOne({ slug });
    if (existing && existing.id !== serviceId && existing._id?.toString() !== serviceId) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const serviceData = {
      ...req.body,
      id: serviceId,
      slug,
      division: division || 'AI Hub',
    };

    const item = await Service.findOneAndUpdate(
      { $or: [{ id: serviceId }, { slug: serviceData.slug }] },
      { $set: serviceData },
      { new: true, upsert: true }
    );
    await createRevisionSnapshot("service", item.slug || item._id.toString(), item.toObject(), "Created/Updated service");
    res.status(201).json({ success: true, service: item });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.post("/cms/services", async (req, res) => {
  return (apiRouter as any).handle(Object.assign(req, { url: '/services', method: 'POST' }), res);
});

apiRouter.put("/services/:slug", async (req, res) => {
  try {
    const slugParam = req.params.slug;
    const query = { $or: [{ slug: slugParam }, { id: slugParam }] };
    const item = await Service.findOneAndUpdate(
      query, 
      { $set: req.body }, 
      { new: true, upsert: true }
    );
    await createRevisionSnapshot("service", slugParam, item.toObject(), `Updated service ${slugParam}`);
    res.json({ success: true, service: item });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.put("/cms/services/:slug", async (req, res) => {
  return (apiRouter as any).handle(Object.assign(req, { url: `/services/${req.params.slug}`, method: 'PUT' }), res);
});

apiRouter.delete("/services/:slug", async (req, res) => {
  try {
    const slugParam = req.params.slug;
    await Service.findOneAndDelete({ $or: [{ slug: slugParam }, { id: slugParam }] });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.delete("/cms/services/:slug", async (req, res) => {
  return (apiRouter as any).handle(Object.assign(req, { url: `/services/${req.params.slug}`, method: 'DELETE' }), res);
});

// -------------------------------------------------------------
// Industries CMS
// -------------------------------------------------------------
apiRouter.get("/cms/industries", async (_req, res) => {
  const items = await Industry.find().sort({ order: 1 });
  res.json(items);
});

apiRouter.post("/cms/industries", async (req, res) => {
  try {
    const item = new Industry(req.body);
    await item.save();
    res.json({ success: true, item });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.put("/cms/industries/:id", async (req, res) => {
  try {
    const item = await Industry.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json({ success: true, item });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.delete("/cms/industries/:id", async (req, res) => {
  try {
    await Industry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// -------------------------------------------------------------
// Testimonials CMS
// -------------------------------------------------------------
apiRouter.get("/cms/testimonials", async (_req, res) => {
  const items = await Testimonial.find().sort({ order: 1 });
  res.json(items);
});

apiRouter.post("/cms/testimonials", async (req, res) => {
  try {
    const item = new Testimonial(req.body);
    await item.save();
    res.json({ success: true, item });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.put("/cms/testimonials/:id", async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json({ success: true, item });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.delete("/cms/testimonials/:id", async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// -------------------------------------------------------------
// Case Studies CMS
// -------------------------------------------------------------
apiRouter.get("/cms/case-studies", async (_req, res) => {
  const items = await CaseStudy.find().sort({ order: 1 });
  res.json(items);
});

apiRouter.post("/cms/case-studies", async (req, res) => {
  try {
    const item = new CaseStudy(req.body);
    await item.save();
    res.json({ success: true, item });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.put("/cms/case-studies/:id", async (req, res) => {
  try {
    const item = await CaseStudy.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json({ success: true, item });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.delete("/cms/case-studies/:id", async (req, res) => {
  try {
    await CaseStudy.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// -------------------------------------------------------------
// Revisions & Version History Endpoints (Phase 21)
// -------------------------------------------------------------
apiRouter.get("/revisions/:entityType/:entityId", async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const revisions = await Revision.find({ entityType, entityId }).sort({ version: -1 }).limit(30);
    res.json({ success: true, revisions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post("/revisions/:id/restore", async (req, res) => {
  try {
    const rev = await Revision.findById(req.params.id);
    if (!rev) return res.status(404).json({ error: "Revision not found" });

    const { entityType, entityId, snapshotData } = rev;
    if (entityType === "page") {
      await Page.findOneAndUpdate({ slug: entityId }, { $set: snapshotData }, { upsert: true });
    } else if (entityType === "service") {
      await Service.findOneAndUpdate({ $or: [{ slug: entityId }, { _id: entityId }] }, { $set: snapshotData }, { upsert: true });
    } else if (entityType === "settings") {
      await Settings.findOneAndUpdate({}, { $set: snapshotData }, { upsert: true });
    } else if (entityType === "portfolio") {
      await Portfolio.findByIdAndUpdate(entityId, { $set: snapshotData });
    }

    await createRevisionSnapshot(entityType, entityId, snapshotData, `Restored from version ${rev.version}`);
    res.json({ success: true, message: `Successfully restored version ${rev.version}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// CRM Integration Configuration & Webhook Dispatcher (Phase 22)
// -------------------------------------------------------------
apiRouter.get("/crm/config", async (_req, res) => {
  try {
    let config = await CRMConfig.findOne();
    if (!config) {
      config = await CRMConfig.create({ provider: "webhook", enabled: false });
    }
    // Return sanitized config (mask API key for frontend safety)
    const sanitized = config.toObject();
    if (sanitized.apiKey) {
      sanitized.apiKey = sanitized.apiKey.length > 8 
        ? `${sanitized.apiKey.substring(0, 4)}...${sanitized.apiKey.slice(-4)}`
        : "********";
    }
    res.json({ success: true, config: sanitized });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put("/crm/config", async (req, res) => {
  try {
    const updates = { ...req.body };
    // If apiKey is masked, do not overwrite existing key
    if (updates.apiKey && (updates.apiKey.includes("...") || updates.apiKey === "********")) {
      delete updates.apiKey;
    }
    const config = await CRMConfig.findOneAndUpdate({}, { $set: updates }, { new: true, upsert: true });
    res.json({ success: true, config });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post("/crm/test", async (req, res) => {
  try {
    const config = await CRMConfig.findOne();
    if (!config || !config.webhookUrl) {
      return res.status(400).json({ success: false, error: "No webhook URL configured" });
    }

    const testPayload = {
      event: "test_lead",
      timestamp: new Date().toISOString(),
      sampleLead: {
        reference: "LYI-TEST-9999",
        fullName: "Test Lead User",
        email: "test@example.com",
        mobile: "+91 99999 99999",
        service: "Custom AI Solutions",
        division: "AI Hub",
        message: "This is a test notification from LockYourIdea Tech CMS CRM Integration.",
      }
    };

    // Forward to webhook URL
    const fetch = (await import('node-fetch')).default || globalThis.fetch;
    const response = await fetch(config.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey ? { "Authorization": `Bearer ${config.apiKey}` } : {})
      },
      body: JSON.stringify(testPayload),
    });

    const statusText = await response.text().catch(() => "");
    const isSuccess = response.ok;

    await CRMConfig.findOneAndUpdate({}, {
      $set: {
        lastSyncTime: new Date(),
        syncStatus: isSuccess ? "connected" : "error",
        lastSyncError: isSuccess ? undefined : `HTTP ${response.status}: ${statusText.substring(0, 200)}`,
      }
    });

    res.json({ 
      success: isSuccess, 
      httpStatus: response.status, 
      response: statusText.substring(0, 300),
      message: isSuccess ? "Test lead dispatched successfully to CRM endpoint!" : `CRM endpoint returned HTTP ${response.status}`
    });
  } catch (err: any) {
    await CRMConfig.findOneAndUpdate({}, {
      $set: {
        lastSyncTime: new Date(),
        syncStatus: "error",
        lastSyncError: err.message,
      }
    });
    res.status(500).json({ success: false, error: "Failed to dispatch test lead: " + err.message });
  }
});
