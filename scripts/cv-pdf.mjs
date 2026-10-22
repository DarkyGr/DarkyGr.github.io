/**
 * Prints the built /cv/ pages to ATS-friendly PDFs (tagged, real text, with metadata).
 *
 *   npm run cv:pdf
 *
 * Public PDFs (no phone)  -> public/cv/*.pdf   (committed, served by the site)
 * Private PDFs (w/ phone) -> cv-private/*.pdf  (git-ignored; only if cv.private.json exists)
 *
 * cv.private.json (git-ignored): { "phone": "+52 ..." }
 * Browser: set CHROME_PATH or it falls back to the default Chrome/Edge install paths.
 */
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
if (!existsSync(join(dist, 'cv', 'index.html'))) {
  console.error('dist/cv/ not found. Run "npm run build" first.');
  process.exit(1);
}

const TARGETS = [
  {
    lang: 'en',
    path: '/cv/',
    file: 'Guillermo-Riano-NET-Developer-CV-EN.pdf',
    title: 'Guillermo Riaño Melchor – Senior .NET Full Stack Developer – CV',
    subject: 'Curriculum Vitae / Resume',
    phoneLabel: 'Phone',
  },
  {
    lang: 'es',
    path: '/es/cv/',
    file: 'Guillermo-Riano-Desarrollador-NET-CV-ES.pdf',
    title: 'Guillermo Riaño Melchor – Desarrollador .NET Full Stack Sr. – CV',
    subject: 'Currículum Vitae',
    phoneLabel: 'Tel.',
  },
];

const KEYWORDS = [
  '.NET', 'C#', 'ASP.NET', 'ASP.NET Core', '.NET Core', 'Entity Framework', 'SQL Server', 'REST API', 'WCF', 'SOAP',
  'Next.js', 'Angular', 'JavaScript', 'TypeScript', 'Full Stack', 'Legacy Migration', 'AS400', 'CI/CD', 'Git', 'Scrum',
];

const chromePath =
  process.env.CHROME_PATH ??
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find(existsSync);
if (!chromePath) {
  console.error('No Chrome/Edge found. Set CHROME_PATH.');
  process.exit(1);
}

const privateCfgPath = join(root, 'cv.private.json');
const privateCfg = existsSync(privateCfgPath) ? JSON.parse(readFileSync(privateCfgPath, 'utf8')) : null;

// Minimal static server for dist/
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = join(dist, p);
  if (!file.startsWith(dist) || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });

async function render(target, phone) {
  const page = await browser.newPage();
  await page.goto(base + target.path, { waitUntil: 'networkidle0' });
  if (phone) {
    await page.evaluate(
      (phone, label) => {
        const el = document.querySelector('[data-phone]');
        const value = el?.querySelector('[data-phone-value]');
        if (!el || !value) return;
        value.textContent = `${label}: ${phone}`;
        el.hidden = false;
      },
      phone,
      target.phoneLabel,
    );
  }
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 0) console.warn(`  ! ${target.file}: content overflows by ${overflow}px (PDF would be scaled down)`);
  const raw = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
  await page.close();

  const pdf = await PDFDocument.load(raw);
  pdf.setTitle(target.title, { showInWindowTitleBar: true });
  pdf.setAuthor('Guillermo Riaño Melchor');
  pdf.setSubject(target.subject);
  pdf.setKeywords(KEYWORDS);
  pdf.setLanguage(target.lang === 'en' ? 'en-US' : 'es-MX');
  pdf.setCreator('darkygr.github.io');
  pdf.setProducer('darkygr.github.io (Astro + Chrome)');
  pdf.setCreationDate(new Date());
  pdf.setModificationDate(new Date());
  return { bytes: await pdf.save(), pages: pdf.getPageCount() };
}

const outPublic = join(root, 'public', 'cv');
mkdirSync(outPublic, { recursive: true });
for (const t of TARGETS) {
  const { bytes, pages } = await render(t);
  writeFileSync(join(outPublic, t.file), bytes);
  console.log(`public  ${t.file}  (${pages} pages, ${(bytes.length / 1024).toFixed(0)} KB)`);

  if (privateCfg?.phone) {
    const outPrivate = join(root, 'cv-private');
    mkdirSync(outPrivate, { recursive: true });
    const priv = await render(t, privateCfg.phone);
    writeFileSync(join(outPrivate, t.file), priv.bytes);
    console.log(`private ${t.file}  (${priv.pages} pages, with phone)`);
  }
}

await browser.close();
server.close();
