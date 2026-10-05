/*
 * Header Block
 * Row 1: "HOMESCREEN" heading and the signed-in user's org name. The ownerOrg comes from
 * the AEM Sidekick profile and is looked up in the orgs sheet; unmatched IDs are shown as is.
 * "Change" opens the admin account picker in a popup.
 * Row 2: links from a sheet, displayed inline.
 */

const LINKS_URL = 'https://main--homescreen--dprevelige.aem.page/data/sheets/links.json';
const ORGS_URL = 'https://main--homescreen--dprevelige.aem.page/data/sheets/orgs.json';
const LOGIN_URL = 'https://admin.hlx.page/auth/adobe?selectAccount=true';
const LOGIN_TIMEOUT = 5 * 60 * 1000;
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
 * Opens the admin login in a popup (the IMS login page cannot be framed) and resolves
 * once the popup is closed. The auth_token cookie is HttpOnly on admin.hlx.page, so it
 * stays with the browser and is never readable here.
 * @returns {Promise<boolean>} false if the popup was blocked
 */
function openAccountPicker() {
  const width = 600;
  const height = 700;
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
  const popup = window.open(
    LOGIN_URL,
    'aem-login',
    `popup,width=${width},height=${height},left=${left},top=${top}`,
  );
  if (!popup) return Promise.resolve(false);
  popup.focus();

  return new Promise((resolve) => {
    let timeout;
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve(true);
      }
    }, 500);
    timeout = setTimeout(() => {
      clearInterval(interval);
      resolve(true);
    }, LOGIN_TIMEOUT);
  });
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

  const top = document.createElement('div');
  top.className = 'nav-top';

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const heading = document.createElement('h2');
  heading.textContent = 'HOMESCREEN';
  brand.append(heading);

  const account = document.createElement('div');
  account.className = 'nav-account';

  const org = document.createElement('div');
  org.className = 'nav-org';
  org.textContent = NO_ORG;

  const change = document.createElement('button');
  change.type = 'button';
  change.className = 'button nav-change';
  change.textContent = 'Change';

  account.append(org, change);
  top.append(brand, account);

  // ignore lookups that finish after a newer profile has arrived
  let profileVersion = 0;
  watchSidekickProfile(async (profile) => {
    profileVersion += 1;
    const version = profileVersion;
    const name = await resolveOrgName(profile?.ownerOrg);
    if (version === profileVersion) org.textContent = name;
  });

  change.addEventListener('click', async () => {
    change.disabled = true;
    await openAccountPicker();
    change.disabled = false;
  });

  const linksRow = document.createElement('ul');
  linksRow.className = 'nav-links';

  nav.append(top, linksRow);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const links = await fetchLinks();

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
