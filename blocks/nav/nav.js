/*
 * Nav Block
 * Row 1: "HOMESCREEN" heading and the signed-in user's org name. The ownerOrg from the
 * AEM admin profile is looked up in the orgs sheet; unmatched IDs are shown as is.
 * Row 2: links from a sheet, displayed inline.
 */

const PROFILE_URL = 'https://admin.hlx.page/profile';
const LINKS_URL = 'https://main--homescreen--dprevelige.aem.page/data/sheets/links.json';
const ORGS_URL = 'https://main--homescreen--dprevelige.aem.page/data/sheets/orgs.json';
const NO_ORG = 'No Organization';

async function fetchOwnerOrg() {
  try {
    // credentials are required so the admin.hlx.page auth cookie is sent
    const resp = await fetch(PROFILE_URL, { credentials: 'include' });
    if (resp.status !== 200) return null;
    const json = await resp.json();
    return json?.profile?.ownerOrg || null;
  } catch {
    return null;
  }
}

async function fetchSheet(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`${resp.status}`);
  return resp.json();
}

async function fetchSheetRows(url) {
  const source = new URL(url);
  // aem.page sheets send no CORS headers, so off-origin pages read the same path locally first
  const sources = source.origin === window.location.origin
    ? [url]
    : [source.pathname, url];

  for (let i = 0; i < sources.length; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const json = await fetchSheet(sources[i]);
      return Array.isArray(json?.data) ? json.data : [];
    } catch { /* try next source */ }
  }
  return [];
}

async function fetchLinks() {
  const rows = await fetchSheetRows(LINKS_URL);
  return rows
    .map((row) => (row?.link || '').trim())
    .filter(Boolean);
}

async function resolveOrgName(ownerOrg) {
  if (!ownerOrg || ownerOrg === NO_ORG) return NO_ORG;
  const rows = await fetchSheetRows(ORGS_URL);
  const match = rows.find((row) => (row?.key || '').trim() === ownerOrg);
  return (match?.value || '').trim() || ownerOrg;
}

function toUrl(link) {
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

export default async function decorate(block) {
  block.textContent = '';

  const top = document.createElement('div');
  top.className = 'nav-top';

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const heading = document.createElement('h2');
  heading.textContent = 'HOMESCREEN';
  brand.append(heading);

  const org = document.createElement('div');
  org.className = 'nav-org';
  top.append(brand, org);

  const linksRow = document.createElement('ul');
  linksRow.className = 'nav-links';

  block.append(top, linksRow);

  const [orgName, links] = await Promise.all([
    fetchOwnerOrg().then(resolveOrgName),
    fetchLinks(),
  ]);

  org.textContent = orgName;

  links.forEach((link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = toUrl(link);
    a.textContent = link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    li.append(a);
    linksRow.append(li);
  });
}
