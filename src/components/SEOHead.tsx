import React, { useEffect } from 'react';
import { SiteSettings, SeoConfig } from '../types.ts';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  siteSettings?: SiteSettings;
  structuredData?: Record<string, any>;
  seoConfig?: SeoConfig | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  siteSettings,
  structuredData,
  seoConfig,
}) => {
  const defaultCompanyName = siteSettings?.companyName || 'LockYourIdea Tech Pvt. Ltd.';
  const defaultTagline = siteSettings?.tagline || "India's 360° AI & IP Consulting";
  const defaultDesc = siteSettings?.heroSubhead || "Transform your business with custom AI software, automated workflows, enterprise agentic CRM, and full-lifecycle patent and trademark protection.";
  
  const finalTitle = seoConfig?.metaTitle?.trim() 
    ? seoConfig.metaTitle 
    : (title ? `${title} | ${defaultCompanyName}` : `${defaultCompanyName} | ${defaultTagline}`);
    
  const finalDesc = seoConfig?.metaDescription?.trim() 
    ? seoConfig.metaDescription 
    : (description || defaultDesc);

  const finalImage = seoConfig?.ogImage?.trim() 
    ? seoConfig.ogImage 
    : (ogImage || siteSettings?.heroBgImage || '/assets/logo.svg');

  const currentWindowUrl = typeof window !== 'undefined' ? window.location.href : 'https://lockyourideatech.com';
  const finalUrl = seoConfig?.canonicalUrl?.trim() 
    ? seoConfig.canonicalUrl 
    : (canonicalUrl || currentWindowUrl);

  const robotsSetting = seoConfig?.customRobots?.trim() 
    || seoConfig?.robots 
    || 'index, follow';

  const ogTitle = seoConfig?.ogTitle?.trim() || finalTitle;
  const ogDesc = seoConfig?.ogDescription?.trim() || finalDesc;
  const ogUrl = seoConfig?.ogUrl?.trim() || finalUrl;
  
  const twitterCardType = seoConfig?.twitterCard || 'summary_large_image';
  const twitterTitle = seoConfig?.twitterTitle?.trim() || finalTitle;
  const twitterDesc = seoConfig?.twitterDescription?.trim() || finalDesc;
  const twitterImg = seoConfig?.twitterImage?.trim() || finalImage;

  // Build merged keywords
  const keywordList = [
    ...(keywords || []),
    ...(seoConfig?.keywords?.primaryKeyword ? [seoConfig.keywords.primaryKeyword] : []),
    ...(seoConfig?.keywords?.secondaryKeywords || []),
  ].filter(Boolean);

  useEffect(() => {
    // 1. Update Document Title
    document.title = finalTitle;

    // 2. Helper to set or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Set Standard & SEO Meta Tags
    setMetaTag('name', 'description', finalDesc);
    if (keywordList.length > 0) {
      setMetaTag('name', 'keywords', Array.from(new Set(keywordList)).join(', '));
    }
    setMetaTag('name', 'robots', robotsSetting);

    // 4. OpenGraph Meta Tags
    setMetaTag('property', 'og:title', ogTitle);
    setMetaTag('property', 'og:description', ogDesc);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', ogUrl);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:site_name', defaultCompanyName);

    // 5. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', twitterCardType);
    setMetaTag('name', 'twitter:title', twitterTitle);
    setMetaTag('name', 'twitter:description', twitterDesc);
    setMetaTag('name', 'twitter:image', twitterImg);

    // 6. Canonical Link Tag (Guarantee single canonical declaration)
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    if (existingCanonicals.length > 1) {
      existingCanonicals.forEach((el, idx) => { if (idx > 0) el.remove(); });
    }
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', finalUrl);

    // 7. Structured Data (JSON-LD) for Search & LLM Crawlers
    const jsonLdScriptId = 'lyi-dynamic-jsonld';
    let scriptTag = document.getElementById(jsonLdScriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = jsonLdScriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    let jsonLdContent: any = null;

    if (seoConfig?.customJsonLd && seoConfig.customJsonLd.trim() !== '') {
      try {
        jsonLdContent = JSON.parse(seoConfig.customJsonLd);
      } catch (e) {
        console.warn('Custom JSON-LD parse error, falling back to auto schema:', e);
      }
    }

    if (!jsonLdContent) {
      const schemaType = seoConfig?.schemaType || 'Organization';
      const baseSchema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        name: defaultCompanyName,
        url: finalUrl,
        logo: siteSettings?.logoUrl || 'https://lockyourideatech.com/assets/logo.svg',
        description: finalDesc,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Pune',
          addressRegion: 'Maharashtra',
          addressCountry: 'India',
          streetAddress: siteSettings?.hqAddress || 'Baner, Pune',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: siteSettings?.phone || '+91 75586 31355',
          contactType: 'customer service',
          email: siteSettings?.email || 'hello@lockyourideatech.com',
        },
        ...structuredData,
      };

      // If FAQs exist for page, inject FAQPage schema structure
      if (seoConfig?.faqs && seoConfig.faqs.length > 0) {
        baseSchema['mainEntity'] = seoConfig.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.directAnswer || faq.detailedAnswer,
          },
        }));
      }

      // If GEO direct answer exists, add snippet
      if (seoConfig?.geo?.primaryAnswer) {
        baseSchema['abstract'] = seoConfig.geo.primaryAnswer;
      }

      jsonLdContent = baseSchema;
    }

    scriptTag.text = JSON.stringify(jsonLdContent, null, 2);
  }, [
    finalTitle,
    finalDesc,
    finalImage,
    finalUrl,
    robotsSetting,
    ogTitle,
    ogDesc,
    ogUrl,
    twitterCardType,
    twitterTitle,
    twitterDesc,
    twitterImg,
    defaultCompanyName,
    keywordList,
    ogType,
    structuredData,
    seoConfig,
  ]);

  return null;
};
