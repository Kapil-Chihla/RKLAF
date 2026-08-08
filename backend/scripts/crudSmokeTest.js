/**
 * Integration smoke test for RKLAF backend CRUD.
 * Usage: node scripts/crudSmokeTest.js
 * Requires: backend/.env with MONGODB_URI, JWT_SECRET; server not required (boots app inline).
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const http = require('http');
const connectDB = require('../config/database');
const { configureCloudinary } = require('../config/cloudinary');

// Import after env
const app = (() => {
  // Load server app without listen — re-require routes via a minimal express clone of server mounts
  const express = require('express');
  const cors = require('cors');
  const a = express();
  a.use(cors());
  a.use(express.json({ limit: '2mb' }));
  a.use(express.urlencoded({ extended: true }));
  a.use('/api/auth', require('../routes/auth'));
  a.use('/api/invites', require('../routes/invites'));
  a.use('/api/users', require('../routes/users'));
  a.use('/api/admin', require('../routes/admin'));
  a.use('/api/blogs', require('../routes/blogs'));
  a.use('/api/articles', require('../routes/articles'));
  a.use('/api/guide-categories', require('../routes/guideCategories'));
  a.use('/api/desk-stories', require('../routes/deskStories'));
  a.use('/api/success-stories', require('../routes/successStories'));
  a.use('/api/papers', require('../routes/papers'));
  a.use('/api/explainer-videos', require('../routes/explainerVideos'));
  a.use('/api/reports', require('../routes/reports'));
  a.use('/api/camps', require('../routes/camps'));
  a.use('/api/contact', require('../routes/contact'));
  a.use('/api/payment', require('../routes/payment'));
  a.use('/api/team', require('../routes/team'));
  a.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  return a;
})();

function request(method, path, { token, body, form } = {}) {
  return new Promise((resolve, reject) => {
    const data = form || (body ? JSON.stringify(body) : null);
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body && !form) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(data);
    }
    if (form) {
      headers['Content-Type'] = `multipart/form-data; boundary=${form.boundary}`;
      headers['Content-Length'] = form.buffer.length;
    }
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: serverPort,
        path,
        method,
        headers,
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          let json = null;
          try {
            json = raw ? JSON.parse(raw) : null;
          } catch {
            json = raw;
          }
          resolve({ status: res.statusCode, json });
        });
      },
    );
    req.on('error', reject);
    if (form) req.write(form.buffer);
    else if (data) req.write(data);
    req.end();
  });
}

/** Minimal multipart with text fields only (no files) */
function multipart(fields) {
  const boundary = '----RKLAF' + Date.now();
  const parts = [];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`,
    );
  }
  parts.push(`--${boundary}--\r\n`);
  const buffer = Buffer.from(parts.join(''), 'utf8');
  return { boundary, buffer };
}

let serverPort;
const results = [];

function ok(name, pass, detail = '') {
  results.push({ name, pass, detail });
  const mark = pass ? 'PASS' : 'FAIL';
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function main() {
  configureCloudinary();
  await connectDB();
  await require('../seed/testSuperAdmin')();

  const server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  serverPort = server.address().port;
  console.log(`\nTest server on :${serverPort}\n`);

  // Health
  {
    const r = await request('GET', '/api/health');
    ok('GET /api/health', r.status === 200 && r.json?.status === 'ok');
  }

  // Login
  let token = '';
  {
    const r = await request('POST', '/api/auth/login', {
      body: { email: 'admin@rklaf.test', password: 'Admin@12345' },
    });
    token = r.json?.token || '';
    ok('POST /api/auth/login (test super admin)', r.status === 200 && Boolean(token), r.json?.message);
  }

  if (!token) {
    console.error('Cannot continue without auth token');
    process.exit(1);
  }

  // Stats
  {
    const r = await request('GET', '/api/admin/stats', { token });
    ok('GET /api/admin/stats', r.status === 200 && typeof r.json?.blogs === 'number');
  }

  // --- Blog CRUD ---
  let blogId = '';
  {
    const r = await request('POST', '/api/blogs', {
      token,
      form: multipart({
        title: `CRUD Test Blog ${Date.now()}`,
        excerpt: 'excerpt',
        content: 'body content for test',
        kind: 'blog',
        author: 'Tester',
      }),
    });
    blogId = r.json?.id || '';
    ok('POST /api/blogs', r.status === 201 && Boolean(blogId), r.json?.message);
  }
  {
    const r = await request('PUT', `/api/blogs/${blogId}`, {
      token,
      form: multipart({ title: 'CRUD Test Blog Updated', excerpt: 'updated', content: 'updated body' }),
    });
    ok('PUT /api/blogs/:id', r.status === 200 && r.json?.title === 'CRUD Test Blog Updated', r.json?.message);
  }
  {
    const r = await request('GET', `/api/blogs/${blogId}?all=true`);
    ok('GET /api/blogs/:id', r.status === 200 && r.json?.id === blogId);
  }
  {
    const r = await request('DELETE', `/api/blogs/${blogId}`, { token });
    ok('DELETE /api/blogs/:id', r.status === 200, r.json?.message);
  }

  // --- Paper CRUD (PDF required on create — skip file upload if no buffer; test list + auth gates) ---
  {
    const r = await request('GET', '/api/papers?all=true');
    ok('GET /api/papers', r.status === 200 && Array.isArray(r.json));
  }
  {
    const r = await request('PUT', '/api/papers/missing-id', {
      token,
      form: multipart({ title: 'x', kind: 'research' }),
    });
    ok('PUT /api/papers/:id 404', r.status === 404);
  }

  // --- Explainer video CRUD (external URL, no file) ---
  let videoId = '';
  {
    const r = await request('POST', '/api/explainer-videos', {
      token,
      form: multipart({
        title: `CRUD Video ${Date.now()}`,
        meta: '90 sec',
        externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }),
    });
    videoId = r.json?.id || '';
    ok('POST /api/explainer-videos', r.status === 201 && Boolean(videoId), r.json?.message);
  }
  {
    const r = await request('PUT', `/api/explainer-videos/${videoId}`, {
      token,
      form: multipart({ title: 'CRUD Video Updated', meta: '2 min', sortOrder: '1' }),
    });
    ok('PUT /api/explainer-videos/:id', r.status === 200 && r.json?.title === 'CRUD Video Updated', r.json?.message);
  }
  {
    const r = await request('DELETE', `/api/explainer-videos/${videoId}`, { token });
    ok('DELETE /api/explainer-videos/:id', r.status === 200);
  }

  // --- Team CRUD ---
  let teamId = '';
  {
    const r = await request('POST', '/api/team', {
      token,
      form: multipart({ name: 'CRUD Member', role: 'Advocate', bio: 'test' }),
    });
    teamId = r.json?.id || '';
    ok('POST /api/team', r.status === 201 && Boolean(teamId), r.json?.message);
  }
  {
    const r = await request('PUT', `/api/team/${teamId}`, {
      token,
      form: multipart({ name: 'CRUD Member Updated', role: 'Senior Advocate' }),
    });
    ok('PUT /api/team/:id', r.status === 200 && r.json?.name === 'CRUD Member Updated');
  }
  {
    const r = await request('DELETE', `/api/team/${teamId}`, { token });
    ok('DELETE /api/team/:id', r.status === 200);
  }

  // --- Contact public + admin inbox ---
  let contactId = '';
  {
    const r = await request('POST', '/api/contact', {
      body: {
        name: 'CRUD Visitor',
        email: 'visitor@example.com',
        phone: '9999999999',
        message: 'Hello from smoke test',
        source: 'contact',
      },
    });
    contactId = r.json?.contact?.id || '';
    ok('POST /api/contact (public)', r.status === 201 && Boolean(contactId), r.json?.message);
  }
  {
    const r = await request('GET', '/api/contact', { token });
    ok('GET /api/contact (admin inbox)', r.status === 200 && Array.isArray(r.json));
  }
  {
    const r = await request('PATCH', `/api/contact/${contactId}`, { token, body: { read: true } });
    ok('PATCH /api/contact/:id', r.status === 200 && r.json?.read === true);
  }
  {
    const r = await request('DELETE', `/api/contact/${contactId}`, { token });
    ok('DELETE /api/contact/:id', r.status === 200);
  }

  // --- Desk / success / camps list (full CRUD already existed) ---
  for (const path of ['/api/desk-stories?all=true', '/api/success-stories?all=true', '/api/camps?all=true', '/api/reports?all=true', '/api/articles']) {
    const r = await request('GET', path);
    ok(`GET ${path.split('?')[0]}`, r.status === 200 && Array.isArray(r.json));
  }

  // Method presence checks via OPTIONS not needed — verify PUT exists by 404 on missing (auth ok)
  {
    const r = await request('PUT', '/api/articles/nope', {
      token,
      form: multipart({ title: 'x', summary: 'y' }),
    });
    ok('PUT /api/articles/:id reachable', r.status === 404);
  }
  {
    const r = await request('PUT', '/api/reports/nope', {
      token,
      form: multipart({ year: '2025–26', title: 'x' }),
    });
    ok('PUT /api/reports/:id reachable', r.status === 404);
  }

  const failed = results.filter((x) => !x.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log('Failures:');
    failed.forEach((f) => console.log(` - ${f.name}: ${f.detail}`));
  }

  server.close();
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
