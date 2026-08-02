import { API_BASE } from './api';

/**
 * API endpoint that redirects to a Cloudinary URL with fl_attachment
 * so the browser downloads a real .pdf file (cross-origin `download` attr does not work).
 */
export function guidePdfDownloadUrl(articleId) {
  if (!articleId) return '#';
  return `${API_BASE}/articles/${encodeURIComponent(articleId)}/download`;
}

/** Same pattern for annual reports / papers if file is already a Cloudinary URL */
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
