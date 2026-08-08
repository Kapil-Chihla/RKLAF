import { API_BASE } from './api';

/**
 * Backend download endpoints redirect to a signed Cloudinary Admin download URL.
 * Direct CDN links fail on Free plans (PDF delivery blocked → 401 ACL failure),
 * and fl_attachment:filename.pdf is rejected by Cloudinary's transform parser.
 */
export function guidePdfDownloadUrl(articleId) {
  if (!articleId) return '#';
  return `${API_BASE}/articles/${encodeURIComponent(articleId)}/download`;
}

/** Inline PDF stream for in-page preview modal (falls back to download if /view missing). */
export function guidePdfViewUrl(articleId) {
  if (!articleId) return '#';
  return `${API_BASE}/articles/${encodeURIComponent(articleId)}/view`;
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

export function alsoOnRecordPdfDownloadUrl(recordId) {
  if (!recordId) return '#';
  return `${API_BASE}/also-on-record/${encodeURIComponent(recordId)}/download`;
}

export function pressMentionPdfDownloadUrl(pressId) {
  if (!pressId) return '#';
  return `${API_BASE}/press-mentions/${encodeURIComponent(pressId)}/pdf/download`;
}

/**
 * Best-effort CDN attachment URL. Prefer API download helpers above —
 * Free Cloudinary accounts block public PDF delivery.
 * Never append :filename.pdf — Cloudinary treats ".pdf" as a broken transform flag.
 */
export function cloudinaryPdfAttachmentUrl(fileUrl) {
  if (!fileUrl) return '#';
  if (/\/upload\/fl_attachment/.test(fileUrl)) return fileUrl;
  if (fileUrl.includes('/upload/')) {
    return fileUrl.replace('/upload/', '/upload/fl_attachment/');
  }
  return fileUrl;
}
