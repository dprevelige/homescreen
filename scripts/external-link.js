const HINT_ID = 'new-tab-hint';

/**
 * Creates a link that opens in a new tab and tells assistive tech so via a shared hint.
 * @param {string} href Link target
 * @param {string} text Link text
 * @param {string} [className] Optional class
 * @returns {HTMLAnchorElement}
 */
export default function createExternalLink(href, text, className) {
  if (!document.getElementById(HINT_ID)) {
    const hint = document.createElement('span');
    hint.id = HINT_ID;
    hint.className = 'visually-hidden';
    hint.textContent = 'Opens in a new tab';
    document.body.append(hint);
  }

  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-describedby', HINT_ID);
  if (className) a.className = className;
  return a;
}
