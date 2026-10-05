/*
 * Links Block
 * Reads URL data (orgs and repos) from a JSON endpoint.
 * Authors may supply a different endpoint as a link or text in the first cell;
 * otherwise DEFAULT_SOURCE is used.
 * Each column (GitHub, DA Live) shows its destination host and counts, then one tile
 * per org with its repos as chips.
 */
import createExternalLink from '../../scripts/external-link.js';

const DEFAULT_SOURCE = 'https://da-sc.adobeaem.workers.dev/preview/dprevelige/homescreen/data/forms/urldata';

function getSource(block) {
  const link = block.querySelector('a[href]');
  if (link) return link.href;
  const text = block.textContent.trim();
  return /^https?:\/\//.test(text) ? text : DEFAULT_SOURCE;
}

export async function fetchLinkData(source = DEFAULT_SOURCE) {
  try {
    const resp = await fetch(source);
    if (!resp.ok) return null;
    const json = await resp.json();
    return json?.data?.pagedata || null;
  } catch {
    return null;
  }
}

const COLUMNS = [
  { key: 'github', title: 'GitHub', base: 'https://github.com/' },
  { key: 'dalive', title: 'DA Live', base: 'https://da.live/#/' },
];

function plural(count, noun) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function buildColumn({ key, title, base }, entries) {
  const col = document.createElement('section');
  col.className = `links-column links-${key}`;

  const head = document.createElement('div');
  head.className = 'links-column-head';
  const heading = document.createElement('h2');
  heading.id = `links-${key}-title`;
  heading.textContent = title;
  const meta = document.createElement('p');
  meta.className = 'links-column-meta';
  const host = document.createElement('span');
  host.className = 'links-column-host';
  host.textContent = new URL(base).host;
  meta.append(host);
  head.append(heading, meta);
  col.setAttribute('aria-labelledby', heading.id);

  const orgs = document.createElement('div');
  orgs.className = 'links-orgs';
  let orgCount = 0;
  let repoCount = 0;

  entries.forEach(({ org, repos } = {}) => {
    if (!org) return;
    orgCount += 1;
    const orgPath = encodeURIComponent(org);
    const group = document.createElement('div');
    group.className = 'links-org';

    const orgHeading = document.createElement('h3');
    orgHeading.append(createExternalLink(`${base}${orgPath}`, org, 'links-org-link'));
    group.append(orgHeading);

    const list = document.createElement('ul');
    list.className = 'links-repos';
    (Array.isArray(repos) ? repos : []).filter(Boolean).forEach((repo) => {
      const li = document.createElement('li');
      li.append(createExternalLink(`${base}${orgPath}/${encodeURIComponent(repo)}`, repo, 'links-repo'));
      list.append(li);
    });
    repoCount += list.children.length;
    if (list.children.length) group.append(list);

    orgs.append(group);
  });

  meta.append(` · ${plural(orgCount, 'org')} · ${plural(repoCount, 'repo')}`);
  col.append(head, orgs);
  return col;
}

export default async function decorate(block) {
  const source = getSource(block);
  block.textContent = '';

  const data = await fetchLinkData(source);
  if (!data) return;

  COLUMNS.forEach((column) => {
    const entries = data[column.key];
    if (Array.isArray(entries)) block.append(buildColumn(column, entries));
  });
}
