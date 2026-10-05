/*
 * Header Block
 * Masthead: "HOMESCREEN" wordmark, quick links from a sheet, and the signed-in user's org.
 * The ownerOrg comes from the AEM Sidekick profile and is looked up in the orgs sheet;
 * unmatched IDs are shown as is. "Change" opens the project admin tool in a new tab.
 */
import createExternalLink from '../../scripts/external-link.js';

const LINKS_URL = 'https://main--homescreen--dprevelige.aem.page/data/sheets/links.json';
const ORGS_URL = 'https://main--homescreen--dprevelige.aem.page/data/sheets/orgs.json';
const CHANGE_URL = 'https://tools.aem.live/tools/project-admin/index.html';
const NO_ORG = 'No Organization';

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

let orgRows;

async function resolveOrgName(ownerOrg) {
  if (!ownerOrg || ownerOrg === NO_ORG) return NO_ORG;
  orgRows = orgRows || fetchSheetRows(ORGS_URL);
  const rows = await orgRows;
  const match = rows.find((row) => (row?.key || '').trim() === ownerOrg);
  return (match?.value || '').trim() || ownerOrg;
}

/**
 * Reports the Sidekick profile (or null when signed out) to the callback.
 * logged-in only fires after an interactive Sidekick login, so status-fetched
 * (fired on every page load) provides the profile of an existing session.
 * @param {Function} onProfile Called with the profile object or null
 */
function watchSidekickProfile(onProfile) {
  const attach = (sk) => {
    sk.addEventListener('logged-in', ({ detail }) => onProfile(detail || null));
    sk.addEventListener('logged-out', () => onProfile(null));
    sk.addEventListener('status-fetched', ({ detail }) => onProfile(detail?.profile || null));
  };

  const sk = document.querySelector('aem-sidekick');
  if (sk) {
    attach(sk);
  } else {
    document.addEventListener('sidekick-ready', () => {
      const ready = document.querySelector('aem-sidekick');
      if (ready) attach(ready);
    }, { once: true });
  }
}

function toUrl(link) {
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

/**
 * Decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');

  // the wordmark is the page title unless the authored content brings its own h1
  const brand = document.createElement(document.querySelector('main h1') ? 'p' : 'h1');
  brand.className = 'nav-brand';
  brand.textContent = 'HOMESCREEN';

  const linksRow = document.createElement('ul');
  linksRow.className = 'nav-links';
  linksRow.setAttribute('aria-label', 'Quick links');

  const account = document.createElement('div');
  account.className = 'nav-account';

  const org = document.createElement('div');
  org.className = 'nav-org';
  org.dataset.state = 'none';
  org.setAttribute('role', 'status');
  const dot = document.createElement('span');
  dot.className = 'nav-org-dot';
  dot.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'visually-hidden';
  label.textContent = 'Sidekick organization: ';
  const orgName = document.createElement('span');
  orgName.className = 'nav-org-name';
  orgName.textContent = NO_ORG;
  org.append(dot, label, orgName);

  const change = createExternalLink(CHANGE_URL, 'Change', 'nav-change');

  account.append(org, change);
  nav.append(brand, linksRow, account);

  // ignore lookups that finish after a newer profile has arrived
  let profileVersion = 0;
  watchSidekickProfile(async (profile) => {
    profileVersion += 1;
    const version = profileVersion;
    const name = await resolveOrgName(profile?.ownerOrg);
    if (version !== profileVersion) return;
    orgName.textContent = name;
    org.dataset.state = name === NO_ORG ? 'none' : 'resolved';
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const links = await fetchLinks();

  links.forEach((link) => {
    const li = document.createElement('li');
    li.append(createExternalLink(toUrl(link), link));
    linksRow.append(li);
  });
}
