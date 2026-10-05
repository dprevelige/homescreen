/*
 * Advanced Tabs Block
 * Turns the sections that follow the block into tab panels.
 * The block holds an unordered list; each list item is the label for one section.
 * Ported from https://github.com/aemsites/author-kit
 */

function buildTabList(tabs, panels, blockId) {
  const tabList = document.createElement('div');
  tabList.className = 'tab-list';
  tabList.role = 'tablist';

  const buttons = [...tabs.querySelectorAll(':scope > li')].slice(0, panels.length).map((tab, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.role = 'tab';
    btn.id = `${blockId}-tab-${idx + 1}`;
    btn.textContent = tab.textContent.trim();
    btn.setAttribute('aria-controls', panels[idx].id);
    panels[idx].setAttribute('aria-labelledby', btn.id);
    tabList.append(btn);
    return btn;
  });

  const select = (idx) => {
    buttons.forEach((b, i) => {
      b.classList.toggle('is-active', i === idx);
      b.setAttribute('aria-selected', i === idx);
      b.tabIndex = i === idx ? 0 : -1;
    });
    panels.forEach((p, i) => p.classList.toggle('is-visible', i === idx));
  };

  buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => select(idx));
    btn.addEventListener('keydown', (e) => {
      let next;
      if (e.key === 'ArrowRight') next = (idx + 1) % buttons.length;
      if (e.key === 'ArrowLeft') next = (idx - 1 + buttons.length) % buttons.length;
      if (next === undefined) return;
      e.preventDefault();
      select(next);
      buttons[next].focus();
    });
  });

  if (buttons.length) select(0);
  return tabList;
}

export default function decorate(block) {
  const parent = block.closest('.section')?.parentElement;
  const currSection = block.closest('.section');
  const tabs = block.querySelector('ul');
  if (!parent || !tabs) {
    // eslint-disable-next-line no-console
    console.warn('advanced-tabs: add an unordered list of tab labels to the block.');
    return;
  }

  const blockId = `advanced-tabs-${[...document.querySelectorAll('.advanced-tabs')].indexOf(block) + 1}`;
  const panels = [...parent.querySelectorAll(':scope > .section')]
    .filter((section) => section !== currSection)
    .slice(0, tabs.querySelectorAll(':scope > li').length);

  panels.forEach((section, idx) => {
    section.id = section.id || `${blockId}-panel-${idx + 1}`;
    section.role = 'tabpanel';
    section.classList.add('advanced-tabs-panel');
  });

  const tabList = buildTabList(tabs, panels, blockId);
  block.replaceChildren(tabList, ...panels);
}
