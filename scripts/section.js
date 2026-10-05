/*
 * Section decoration shared by the section-metadata block and the section loader.
 * Supported keys: style, grid, gap, spacing, container, layout, background.
 */

import { toClassName } from './aem.js';

function getRelativeLuminance({ r, g, b }) {
  const [rl, gl, bl] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

export function setColorScheme(section) {
  const match = getComputedStyle(section).backgroundColor
    .match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match || match[4] === '0') return;
  const [, r, g, b] = match.map(Number);
  const scheme = getRelativeLuminance({ r, g, b }) > 0.5 ? 'light-scheme' : 'dark-scheme';
  section.classList.remove('light-scheme', 'dark-scheme');
  section.classList.add(scheme);
}

function handleBackground(background, section) {
  if (/^(https?:)?\/|^\.\//.test(background)) {
    const url = new URL(background, window.location.href);
    if (url.pathname.endsWith('.mp4')) return;
    const pic = document.createElement('picture');
    pic.className = 'section-background';
    const img = document.createElement('img');
    img.src = url.href;
    img.alt = '';
    img.loading = 'lazy';
    pic.append(img);
    section.classList.add('has-background');
    section.prepend(pic);
    return;
  }

  section.style.backgroundColor = background.startsWith('color-token')
    ? `var(${background.replace('color-token', '--color')})`
    : background;
  setColorScheme(section);
}

export function wrapBlockContent(section) {
  if (!section.matches('.grid, .container, [class*="layout-"]')) return;
  // skip an existing .block-content so a second pass does not nest it
  const wrappers = [...section.querySelectorAll(':scope > div:not(.default-content-wrapper, .block-content)')];
  if (!wrappers.length) return;
  const blockContent = section.querySelector(':scope > .block-content') || document.createElement('div');
  if (!blockContent.parentElement) {
    blockContent.className = 'block-content';
    wrappers[0].before(blockContent);
  }
  blockContent.append(...wrappers);
}

/**
 * Applies a single section setting.
 * @param {Element} section The section element
 * @param {string} key The setting name
 * @param {string} value The setting value
 * @returns {boolean} Whether the key is a supported setting
 */
export function applySectionSetting(section, key, value) {
  const val = String(value).trim();
  switch (key) {
    case 'style':
      val.split(',').map((s) => toClassName(s.trim())).filter(Boolean)
        .forEach((cls) => section.classList.add(cls));
      return true;
    case 'grid':
    case 'gap':
    case 'spacing':
    case 'container':
    case 'layout':
      if (!val || val === '0') return true;
      if (key === 'grid' || key === 'container') section.classList.add(key);
      section.classList.add(`${key}-${toClassName(val)}`);
      return true;
    case 'background':
      if (val) handleBackground(val, section);
      return true;
    default:
      return false;
  }
}

/**
 * Applies the section's data- attributes as section settings.
 * @param {Element} section The section element
 */
export function decorateSection(section) {
  Object.entries(section.dataset).forEach(([key, value]) => {
    if (key === 'sectionStatus') return;
    applySectionSetting(section, key, value);
  });
  wrapBlockContent(section);
}
