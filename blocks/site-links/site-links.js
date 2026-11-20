/*
 * Site Links Block
 * Reads a multi-sheet JSON endpoint. Each sheet becomes a section,
 * each row becomes a site with GitHub and DA links.
 * Rows with Exists = "No" get href="#".
 * Authors may supply a different endpoint as a link or text in the first cell.
 */
import createExternalLink from '../../scripts/external-link.js';

// Same-origin path: served by the CDN in production and proxied by `aem up` locally (no CORS).
const DEFAULT_SOURCE = '/data/sheets/sites.json';

const LINKS = [
  { key: 'Github', label: 'GitHub' },
  { key: 'DA', label: 'DA' },
  { key: 'Site', label: 'Site' },
];

function getSiteUrl(daUrl) {
  const [repo, org] = String(daUrl || '').split('/').filter(Boolean).reverse();
  return repo && org ? `https://main--${repo}--${org}.aem.page` : '';
}

function getSource(block) {
  const link = block.querySelector('a[href]');
  if (link) return link.href;
  const text = block.textContent.trim();
  return /^https?:\/\//.test(text) ? text : DEFAULT_SOURCE;
}

async function fetchSheets(source) {
  try {
    const resp = await fetch(source);
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

function buildLink(href, label, exists) {
  if (!exists || !href) {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = label;
    a.className = 'site-links-link site-links-missing';
    a.setAttribute('aria-disabled', 'true');
    return a;
  }
  return createExternalLink(href, label, 'site-links-link');
}

function buildSection(title, rows, index) {
  const section = document.createElement('section');
  section.className = 'site-links-section';

  const heading = document.createElement('h2');
  heading.id = `site-links-${index}`;
  heading.textContent = title;
  section.setAttribute('aria-labelledby', heading.id);

  const list = document.createElement('ul');
  list.className = 'site-links-sites';

  rows.forEach((row = {}) => {
    if (!row.Name) return;
    const exists = String(row.Exists || '').trim().toLowerCase() !== 'no';

    const li = document.createElement('li');
    li.className = 'site-links-site';
    if (!exists) li.classList.add('site-links-site-missing');

    const name = document.createElement('h3');
    name.textContent = row.Name;

    const actions = document.createElement('div');
    actions.className = 'site-links-actions';
    const urls = { ...row, Site: getSiteUrl(row.DA) };
    LINKS.forEach(({ key, label }) => actions.append(buildLink(urls[key], label, exists)));

    li.append(name, actions);
    list.append(li);
  });

  section.append(heading, list);
  return section;
}

export default async function decorate(block) {
  const source = getSource(block);
  block.textContent = '';

  const json = await fetchSheets(source);
  if (!json || typeof json !== 'object') return;

  Object.entries(json)
    .filter(([key, sheet]) => !key.startsWith(':') && Array.isArray(sheet?.data))
    .forEach(([title, sheet], i) => block.append(buildSection(title, sheet.data, i)));

  block.addEventListener('click', (e) => {
    if (e.target.closest('.site-links-missing')) e.preventDefault();
  });
}
