/*
 * Section Metadata Block
 * Applies styles and layout options to the section that contains it.
 * Supported keys: style, grid, gap, spacing, container, layout, background.
 * Other keys are added to the section as data attributes.
 * Ported from https://github.com/aemsites/author-kit
 */

import { readBlockConfig, toCamelCase } from '../../scripts/aem.js';
import { applySectionSetting, wrapBlockContent } from '../../scripts/section.js';

export { setColorScheme } from '../../scripts/section.js';

export default function decorate(block) {
  const section = block.closest('.section');
  const config = readBlockConfig(block);
  const wrapper = block.parentElement;
  block.remove();
  if (wrapper && !wrapper.children.length) wrapper.remove();
  if (!section) return;

  Object.entries(config).forEach(([key, value]) => {
    const val = String(value).trim();
    if (!val) return;
    if (!applySectionSetting(section, key, val)) section.dataset[toCamelCase(key)] = val;
  });

  wrapBlockContent(section);
}
