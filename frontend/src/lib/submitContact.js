import publicApi from './publicApi';

/**
 * POST a site message to /api/contact (emailed to the organisation inbox).
 * @param {{ name: string, email?: string, phone?: string, message: string, source?: string, subject?: string }} payload
 */
export async function submitContact(payload) {
  const { data } = await publicApi.post('/contact', payload);
  return data;
}

export function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}
