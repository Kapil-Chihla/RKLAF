/**
 * Integration test: press-mentions CRUD for all layouts
 * (clip, link, image, quote, video/youtube, pdf)
 *
 * Mocks Cloudinary uploads so we can verify routing + validation without CDN.
 * Usage: node scripts/test-press-mentions.js
 */
require('dotenv').config();
const http = require('http');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const FormData = require('form-data');
const { User, PressMention } = require('../models');
const { signToken } = require('../utils/tokens');

// Mock Cloudinary before routes load uploadBuffer
const cloudinaryUpload = require('../lib/cloudinaryUpload');
const originalUpload = cloudinaryUpload.uploadBuffer.bind(cloudinaryUpload);
cloudinaryUpload.uploadBuffer = async (file, folder) => {
  const name = file?.originalname || 'file';
  return `https://res.cloudinary.com/test/rklaf/${folder}/${Date.now()}-${name}`;
};

const pressRouter = require('../routes/pressMentions');

const MIN_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);
const MIN_PDF = Buffer.from(
  '%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n'
);
// Tiny fake "mp4" — route only checks mime/ext, mock skips real encode
const MIN_MP4 = Buffer.from('ftypisomfake');

function request(port, method, urlPath, { token, form } = {}) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    let body;
    if (form) {
      body = form.getBuffer();
      Object.assign(headers, form.getHeaders());
    }
    const req = http.request(
      { hostname: '127.0.0.1', port, path: urlPath, method, headers },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          let data = raw;
          try {
            data = JSON.parse(raw);
          } catch {
            /* keep string */
          }
          resolve({ status: res.statusCode, data, headers: res.headers });
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const results = [];
  const createdIds = [];

  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await User.findOne({ role: { $in: ['super_admin', 'admin', 'editor'] } }).lean();
  assert(admin, 'No admin/editor user found in DB — cannot test auth CRUD');
  const token = signToken({ id: admin.id, email: admin.email, role: admin.role });

  const app = express();
  app.use(express.json());
  app.use('/api/press-mentions', pressRouter);
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const pass = (name) => {
    results.push({ name, ok: true });
    console.log(`✓ ${name}`);
  };
  const fail = (name, err) => {
    results.push({ name, ok: false, err: String(err.message || err) });
    console.error(`✗ ${name}: ${err.message || err}`);
  };

  // --- Public list ---
  try {
    const r = await request(port, 'GET', '/api/press-mentions');
    assert(r.status === 200 && Array.isArray(r.data), `list status ${r.status}`);
    pass('GET /press-mentions (public list)');
  } catch (e) {
    fail('GET /press-mentions (public list)', e);
  }

  // --- Unauth create should 401 ---
  try {
    const form = new FormData();
    form.append('title', 'no auth');
    form.append('layout', 'quote');
    form.append('quote', 'x');
    const r = await request(port, 'POST', '/api/press-mentions', { form });
    assert(r.status === 401, `expected 401 got ${r.status}`);
    pass('POST without token → 401');
  } catch (e) {
    fail('POST without token → 401', e);
  }

  // --- Quote create ---
  let quoteId;
  try {
    const form = new FormData();
    form.append('title', 'Quote test');
    form.append('layout', 'quote');
    form.append('quote', 'A trust that files and follows up.');
    form.append('quoteAttribution', '· Test daily');
    form.append('sortOrder', '1');
    const r = await request(port, 'POST', '/api/press-mentions', { token, form });
    assert(r.status === 201, `got ${r.status} ${JSON.stringify(r.data)}`);
    assert(r.data.layout === 'quote' && r.data.quote.includes('trust'), 'quote fields');
    quoteId = r.data.id;
    createdIds.push(quoteId);
    pass('CREATE quote layout');
  } catch (e) {
    fail('CREATE quote layout', e);
  }

  // --- Link create (URL required) ---
  try {
    const bad = new FormData();
    bad.append('title', 'Link no url');
    bad.append('layout', 'link');
    bad.append('outlet', 'Hindu');
    const badR = await request(port, 'POST', '/api/press-mentions', { token, form: bad });
    assert(badR.status === 400, `expected 400 got ${badR.status}`);
    pass('CREATE link without URL → 400');

    const form = new FormData();
    form.append('title', 'Link test');
    form.append('layout', 'link');
    form.append('outlet', 'The Hindu');
    form.append('url', 'https://example.com/press');
    form.append('meta', 'National · 2025');
    const r = await request(port, 'POST', '/api/press-mentions', { token, form });
    assert(r.status === 201 && r.data.url.includes('example.com'), JSON.stringify(r.data));
    createdIds.push(r.data.id);
    pass('CREATE link layout');
  } catch (e) {
    fail('CREATE link layout', e);
  }

  // --- Clip with optional URL ---
  try {
    const form = new FormData();
    form.append('title', 'Clip test');
    form.append('layout', 'clip');
    form.append('outlet', 'Amar Ujala');
    form.append('url', 'https://example.com/clip');
    form.append('meta', 'Gurgaon · 2024');
    form.append('image', MIN_PNG, { filename: 'clip.png', contentType: 'image/png' });
    const r = await request(port, 'POST', '/api/press-mentions', { token, form });
    assert(r.status === 201 && r.data.image, JSON.stringify(r.data));
    createdIds.push(r.data.id);
    pass('CREATE clip + image');
  } catch (e) {
    fail('CREATE clip + image', e);
  }

  // --- Image layout ---
  try {
    const bad = new FormData();
    bad.append('title', 'Image no file');
    bad.append('layout', 'image');
    const badR = await request(port, 'POST', '/api/press-mentions', { token, form: bad });
    assert(badR.status === 400, `expected 400 got ${badR.status}`);
    pass('CREATE image without file → 400');

    const form = new FormData();
    form.append('title', 'Image test');
    form.append('layout', 'image');
    form.append('imageCaption', 'Front page scan');
    form.append('image', MIN_PNG, { filename: 'scan.png', contentType: 'image/png' });
    const r = await request(port, 'POST', '/api/press-mentions', { token, form });
    assert(r.status === 201 && r.data.image, JSON.stringify(r.data));
    createdIds.push(r.data.id);
    pass('CREATE image layout');
  } catch (e) {
    fail('CREATE image layout', e);
  }

  // --- Video YouTube only ---
  let videoId;
  try {
    const bad = new FormData();
    bad.append('title', 'Video empty');
    bad.append('layout', 'video');
    const badR = await request(port, 'POST', '/api/press-mentions', { token, form: bad });
    assert(badR.status === 400, `expected 400 got ${badR.status}`);
    pass('CREATE video without source → 400');

    const form = new FormData();
    form.append('title', 'YouTube coverage');
    form.append('layout', 'video');
    form.append('outlet', 'Regional TV');
    form.append('youtubeUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    form.append('thumbnail', MIN_PNG, { filename: 'thumb.png', contentType: 'image/png' });
    const r = await request(port, 'POST', '/api/press-mentions', { token, form });
    assert(r.status === 201 && r.data.youtubeUrl.includes('youtube'), JSON.stringify(r.data));
    assert(r.data.thumbnail, 'thumbnail uploaded');
    videoId = r.data.id;
    createdIds.push(videoId);
    pass('CREATE video (YouTube + thumbnail)');
  } catch (e) {
    fail('CREATE video (YouTube + thumbnail)', e);
  }

  // --- Video file upload ---
  try {
    const form = new FormData();
    form.append('title', 'Uploaded clip');
    form.append('layout', 'video');
    form.append('video', MIN_MP4, { filename: 'clip.mp4', contentType: 'video/mp4' });
    const r = await request(port, 'POST', '/api/press-mentions', { token, form });
    assert(r.status === 201 && r.data.video, JSON.stringify(r.data));
    createdIds.push(r.data.id);
    pass('CREATE video (uploaded file)');
  } catch (e) {
    fail('CREATE video (uploaded file)', e);
  }

  // --- PDF ---
  let pdfId;
  try {
    const bad = new FormData();
    bad.append('title', 'PDF empty');
    bad.append('layout', 'pdf');
    const badR = await request(port, 'POST', '/api/press-mentions', { token, form: bad });
    assert(badR.status === 400, `expected 400 got ${badR.status}`);
    pass('CREATE pdf without file → 400');

    const form = new FormData();
    form.append('title', 'Clipping PDF');
    form.append('layout', 'pdf');
    form.append('outlet', 'Dainik Jagran');
    form.append('meta', 'Mathura · March 2025');
    form.append('pdf', MIN_PDF, { filename: 'clipping.pdf', contentType: 'application/pdf' });
    const r = await request(port, 'POST', '/api/press-mentions', { token, form });
    assert(r.status === 201 && r.data.pdf, JSON.stringify(r.data));
    pdfId = r.data.id;
    createdIds.push(pdfId);
    pass('CREATE pdf layout');
  } catch (e) {
    fail('CREATE pdf layout', e);
  }

  // --- GET by id ---
  try {
    assert(pdfId, 'pdfId missing');
    const r = await request(port, 'GET', `/api/press-mentions/${pdfId}`);
    assert(r.status === 200 && r.data.id === pdfId, JSON.stringify(r.data));
    pass('GET /:id');
  } catch (e) {
    fail('GET /:id', e);
  }

  // --- Filter by layout ---
  try {
    const r = await request(port, 'GET', '/api/press-mentions?layout=video');
    assert(r.status === 200 && Array.isArray(r.data), 'not array');
    assert(r.data.every((x) => x.layout === 'video'), 'filter leaked other layouts');
    pass('GET ?layout=video filter');
  } catch (e) {
    fail('GET ?layout=video filter', e);
  }

  // --- UPDATE ---
  try {
    assert(quoteId, 'quoteId missing');
    const form = new FormData();
    form.append('title', 'Quote updated');
    form.append('quote', 'Updated quote text.');
    form.append('published', 'false');
    const r = await request(port, 'PUT', `/api/press-mentions/${quoteId}`, { token, form });
    assert(r.status === 200 && r.data.title === 'Quote updated', JSON.stringify(r.data));
    assert(r.data.published === false, 'published should be false');
    pass('UPDATE quote + unpublish');
  } catch (e) {
    fail('UPDATE quote + unpublish', e);
  }

  // --- Draft hidden from public list ---
  try {
    const r = await request(port, 'GET', '/api/press-mentions');
    assert(!r.data.some((x) => x.id === quoteId), 'draft still in public list');
    const all = await request(port, 'GET', '/api/press-mentions?all=true');
    assert(all.data.some((x) => x.id === quoteId), 'draft missing from ?all=true');
    pass('Draft hidden from public, visible with ?all=true');
  } catch (e) {
    fail('Draft hidden from public, visible with ?all=true', e);
  }

  // --- UPDATE video youtubeUrl ---
  try {
    assert(videoId, 'videoId missing');
    const form = new FormData();
    form.append('youtubeUrl', 'https://youtu.be/abcdefghijk');
    const r = await request(port, 'PUT', `/api/press-mentions/${videoId}`, { token, form });
    assert(r.status === 200 && r.data.youtubeUrl.includes('abcdefghijk'), JSON.stringify(r.data));
    pass('UPDATE video youtubeUrl');
  } catch (e) {
    fail('UPDATE video youtubeUrl', e);
  }

  // --- PDF download endpoint exists (mock URL may 502 upstream — just check route finds doc) ---
  try {
    assert(pdfId, 'pdfId missing');
    // Patch send path: with fake cloudinary URL, download may 500/502 — assert not 404
    const r = await request(port, 'GET', `/api/press-mentions/${pdfId}/pdf/download`);
    assert(r.status !== 404, `download returned ${r.status}`);
    pass(`PDF download route responds (${r.status}, not 404)`);
  } catch (e) {
    fail('PDF download route', e);
  }

  // --- DELETE ---
  try {
    assert(quoteId, 'quoteId missing');
    const r = await request(port, 'DELETE', `/api/press-mentions/${quoteId}`, { token });
    assert(r.status === 200, `got ${r.status}`);
    const gone = await request(port, 'GET', `/api/press-mentions/${quoteId}`);
    assert(gone.status === 404, 'still exists after delete');
    createdIds.splice(createdIds.indexOf(quoteId), 1);
    pass('DELETE press mention');
  } catch (e) {
    fail('DELETE press mention', e);
  }

  // Cleanup remaining test docs
  if (createdIds.length) {
    await PressMention.deleteMany({ id: { $in: createdIds } });
    console.log(`cleaned ${createdIds.length} test docs`);
  }

  server.close();
  await mongoose.disconnect();
  cloudinaryUpload.uploadBuffer = originalUpload;

  const failed = results.filter((x) => !x.ok);
  console.log('\n———');
  console.log(`${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    failed.forEach((f) => console.log(`  FAIL: ${f.name} — ${f.err}`));
    process.exit(1);
  }
  console.log('All press-mentions backend checks passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
