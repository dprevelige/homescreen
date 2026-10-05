/*
 * Schedule Block
 * Swaps in a fragment based on the current date and time.
 * Links to a sheet (e.g. /schedules/promo.json) with columns: name, start, end, fragment.
 * A row without start/end is used as the default.
 * Preview environments can simulate a date with ?schedule=<unix-seconds>
 * or localStorage 'aem-schedule'.
 * Ported from https://github.com/aemsites/author-kit
 */

import { loadFragment } from '../fragment/fragment.js';

const isProd = () => window.location.hostname.endsWith('.aem.live')
  || !/(\.aem\.page|localhost|127\.0\.0\.1)$/.test(window.location.hostname);

function log(msg) {
  // eslint-disable-next-line no-console
  if (!isProd()) console.warn(`schedule: ${msg}`);
}

function getNow() {
  const now = Date.now();
  if (isProd()) return now;
  let sim = new URL(window.location.href).searchParams.get('schedule');
  try {
    sim = sim || localStorage.getItem('aem-schedule');
  } catch { /* ignore */ }
  return Number(sim) * 1000 || now;
}

async function fetchFragment(event) {
  if (!event?.fragment) return null;
  try {
    const { pathname } = new URL(event.fragment, window.location.href);
    return await loadFragment(pathname.replace(/(\.plain)?\.html$/, ''));
  } catch {
    log(`could not load fragment ${event.fragment}`);
    return null;
  }
}

function removeBlock(block) {
  const wrapper = block.parentElement;
  block.remove();
  if (wrapper && !wrapper.children.length) wrapper.remove();
}

export default async function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) {
    log('no schedule link found');
    removeBlock(block);
    return;
  }

  let data;
  try {
    const resp = await fetch(link.href);
    if (!resp.ok) throw new Error(resp.status);
    ({ data } = await resp.json());
  } catch {
    log(`could not load ${link.href}`);
    removeBlock(block);
    return;
  }

  const now = getNow();
  const found = [...(data || [])].reverse().find((evt) => {
    const start = Date.parse(evt.start);
    const end = Date.parse(evt.end);
    return now > start && now < end;
  });
  const defEvent = (data || []).find((evt) => !(evt.start && evt.end));
  const event = found || defEvent;

  if (!event || !event.fragment) {
    removeBlock(block);
    return;
  }

  let fragment = await fetchFragment(event);
  if (!fragment && event !== defEvent) fragment = await fetchFragment(defEvent);
  if (!fragment) {
    removeBlock(block);
    return;
  }

  const fragSections = fragment.querySelectorAll(':scope > .section');
  if (fragSections.length === 1) {
    block.replaceChildren(...fragSections[0].childNodes);
  } else {
    block.replaceChildren(...fragment.childNodes);
  }
}
