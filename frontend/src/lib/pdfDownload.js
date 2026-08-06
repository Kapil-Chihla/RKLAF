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

export function deskDocumentDownloadUrl(storyIdOrSlug, docId) {
  if (!storyIdOrSlug || !docId) return '#';
  return `${API_BASE}/desk-stories/${encodeURIComponent(storyIdOrSlug)}/documents/${encodeURIComponent(docId)}/download`;
}

export function successDocumentDownloadUrl(storyIdOrSlug, docId) {
  if (!storyIdOrSlug || !docId) return '#';
  return `${API_BASE}/success-stories/${encodeURIComponent(storyIdOrSlug)}/documents/${encodeURIComponent(docId)}/download`;
}

/**
 * Build a Cloudinary delivery URL that forces a PDF download with a real filename.
 *
 * Periods in fl_attachment filenames must be %2E — otherwise Cloudinary returns HTTP 400
 * (it treats `.pdf` as the end of a transformation segment).
 */
export function cloudinaryPdfAttachmentUrl(fileUrl, filename = 'document.pdf') {
  if (!fileUrl) return '#';
  let name = String(filename).trim() || 'document.pdf';
  if (!name.toLowerCase().endsWith('.pdf')) name += '.pdf';
  const safe = encodeURIComponent(name.replace(/[/\\?&#]+/g, '-')).replace(/\./g, '%2E');

  if (/\/upload\/fl_attachment/.test(fileUrl)) return fileUrl;

  if (fileUrl.includes('/upload/')) {
    return fileUrl.replace('/upload/', `/upload/fl_attachment:${safe}/`);
  }
  return fileUrl;
}
