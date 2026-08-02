import { API_BASE } from './api';

/**
 * Backend download endpoints redirect to Cloudinary with fl_attachment
 * so the browser saves a real .pdf (HTML download attr fails cross-origin).
 */
export function guidePdfDownloadUrl(articleId) {
  if (!articleId) return '#';
  return `${API_BASE}/articles/${encodeURIComponent(articleId)}/download`;
}

export function paperPdfDownloadUrl(paperId) {
  if (!paperId) return '#';
  return `${API_BASE}/papers/${encodeURIComponent(paperId)}/download`;
}

export function reportPdfDownloadUrl(reportId) {
  if (!reportId) return '#';
  return `${API_BASE}/reports/${encodeURIComponent(reportId)}/download`;
}

/** Fallback if you only have a raw Cloudinary URL (no API id). */
export function cloudinaryPdfAttachmentUrl(fileUrl, filename = 'document.pdf') {
  if (!fileUrl) return '#';
  let name = String(filename).trim() || 'document.pdf';
  if (!name.toLowerCase().endsWith('.pdf')) name += '.pdf';
  const safe = encodeURIComponent(name.replace(/[/\\?&#]+/g, '-'));
  if (fileUrl.includes('/upload/')) {
    return fileUrl.replace('/upload/', `/upload/fl_attachment:${safe}/`);
  }
  return fileUrl;
}
