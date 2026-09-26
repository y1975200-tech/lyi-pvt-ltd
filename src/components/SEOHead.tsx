import React, { useEffect } from 'react';
import { SiteSettings } from '../types.ts';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  siteSettings?: SiteSettings;
  structuredData?: Record<string, any>;
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
}) => {
  const defaultCompanyName = siteSettings?.companyName || 'LockYourIdea Tech Pvt. Ltd.';
  const defaultTagline = siteSettings?.tagline || "India's 360° AI & IP Consulting";
  const defaultDesc = siteSettings?.heroSubhead || "Transform your business with custom AI software, automated workflows, enterprise agentic CRM, and full-lifecycle patent and trademark protection.";
  
  const finalTitle = title ? `${title} | ${defaultCompanyName}` : `${defaultCompanyName} | ${defaultTagline}`;
  const finalDesc = description || defaultDesc;
  const finalImage = ogImage || siteSettings?.heroBgImage || '/assets/logo.svg';
  const finalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://lockyourideatech.com');

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
    if (keywords && keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '));
    }
    setMetaTag('name', 'robots', 'index, follow');

    // 4. OpenGraph Meta Tags
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', finalUrl);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:site_name', defaultCompanyName);

    // 5. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDesc);
    setMetaTag('name', 'twitter:image', finalImage);

    // 6. Canonical Link Tag
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

    const defaultJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: defaultCompanyName,
      url: 'https://lockyourideatech.com',
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

    scriptTag.text = JSON.stringify(defaultJsonLd);
  }, [finalTitle, finalDesc, finalImage, finalUrl, defaultCompanyName, keywords, ogType, structuredData]);

  return null;
};
