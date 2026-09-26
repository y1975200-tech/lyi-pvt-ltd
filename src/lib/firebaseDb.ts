// Replaced Firebase with HTTP calls to Express API -> MongoDB
import { SiteSettings, BookingData, PortfolioItem, PageContentItem, ServiceItem } from '../types.ts';

const API_BASE = '/api';

export function sanitizeForFirestore<T>(obj: T): T {
  return obj; // No longer needed
}

export async function getSiteSettingsFromFirestore(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(e);
  }
  return null;
}

export async function saveSiteSettingsToFirestore(settings: Partial<SiteSettings>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getAllPageContentsFromFirestore(): Promise<Record<string, PageContentItem>> {
  try {
    const res = await fetch(`${API_BASE}/cms/pages`);
    if (res.ok) {
      const data = await res.json();
      const map: Record<string, PageContentItem> = {};
      data.pages.forEach((p: any) => map[p.slug] = p);
      return map;
    }
  } catch (e) {
    console.error(e);
  }
  return {};
}

export async function savePageContentToFirestore(pageId: string, content: Partial<PageContentItem>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/pages/${pageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function saveImageToFirestore(imageId: string, dataUrl: string, name?: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/upload-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData: dataUrl, fileName: name, target: 'general' })
    });
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export async function getBookingsFromFirestore(): Promise<BookingData[]> {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(e);
  }
  return [];
}

export async function saveBookingToFirestore(booking: BookingData): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function updateBookingInFirestore(bookingId: string, updates: Partial<BookingData>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates), // Adjust based on API
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function deleteBookingFromFirestore(bookingId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

// Simple polling fallback for subscriptions since we removed Firebase real-time
export function subscribeToBookings(callback: (bookings: BookingData[]) => void) {
  getBookingsFromFirestore().then(callback);
  const interval = setInterval(() => getBookingsFromFirestore().then(callback), 10000);
  return () => clearInterval(interval);
}

export async function savePortfolioToFirestore(items: PortfolioItem[]): Promise<boolean> {
  for (const item of items) {
    await saveSinglePortfolioItemToFirestore(item);
  }
  return true;
}

export async function saveSinglePortfolioItemToFirestore(item: PortfolioItem): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/portfolio/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function deletePortfolioItemFromFirestore(itemId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/portfolio/${itemId}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getPortfolioFromFirestore(): Promise<PortfolioItem[]> {
  try {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function subscribeToPortfolio(callback: (items: PortfolioItem[]) => void) {
  getPortfolioFromFirestore().then(callback);
  const interval = setInterval(() => getPortfolioFromFirestore().then(callback), 10000);
  return () => clearInterval(interval);
}

export function subscribeToSiteSettings(callback: (settings: SiteSettings) => void) {
  getSiteSettingsFromFirestore().then(s => { if (s) callback(s) });
  const interval = setInterval(() => getSiteSettingsFromFirestore().then(s => { if (s) callback(s) }), 10000);
  return () => clearInterval(interval);
}

export function subscribeToPageContents(callback: (pages: Record<string, PageContentItem>) => void) {
  getAllPageContentsFromFirestore().then(callback);
  const interval = setInterval(() => getAllPageContentsFromFirestore().then(callback), 10000);
  return () => clearInterval(interval);
}

export async function saveServiceToFirestore(service: ServiceItem): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/services/${service.id || service.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    if (!res.ok) {
      await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function deleteServiceFromFirestore(serviceId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/services/${serviceId}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getServicesFromFirestore(): Promise<ServiceItem[]> {
  try {
    const res = await fetch(`${API_BASE}/services`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function subscribeToServices(callback: (services: ServiceItem[]) => void) {
  getServicesFromFirestore().then(callback);
  const interval = setInterval(() => getServicesFromFirestore().then(callback), 10000);
  return () => clearInterval(interval);
}

export async function bootstrapFirestoreDefaultsIfEmpty(
  defaultSettings: SiteSettings,
  defaultPortfolio: PortfolioItem[],
  defaultServices?: ServiceItem[]
) {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok || (await res.json()).companyName === undefined) {
      await saveSiteSettingsToFirestore(defaultSettings);
    }
  } catch (e) {
    console.error(e);
  }
}
