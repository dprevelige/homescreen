/*
 * Links Block
 * Reads URL data (orgs and repos) from a JSON endpoint.
 * Authors may supply a different endpoint as a link or text in the first cell;
 * otherwise DEFAULT_SOURCE is used.
 */

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

function createLink(href, text) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
}

function buildColumn({ key, title, base }, entries) {
  const col = document.createElement('div');
  col.className = `links-column links-${key}`;

  const heading = document.createElement('h2');
  heading.textContent = title;
  col.append(heading);

  entries.forEach(({ org, repos } = {}) => {
    if (!org) return;
    const orgPath = encodeURIComponent(org);
    const group = document.createElement('div');
    group.className = 'links-org';

    const orgHeading = document.createElement('h3');
    orgHeading.append(createLink(`${base}${orgPath}`, org));
    group.append(orgHeading);

    const list = document.createElement('ul');
    (Array.isArray(repos) ? repos : []).filter(Boolean).forEach((repo) => {
      const li = document.createElement('li');
      li.append(createLink(`${base}${orgPath}/${encodeURIComponent(repo)}`, repo));
      list.append(li);
    });
    if (list.children.length) group.append(list);

    col.append(group);
  });

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
