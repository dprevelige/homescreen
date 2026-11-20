// Adapted from adobe/da-nx nx2/blocks/profile, rewritten without Lit.
import { loadIms, handleSignIn, handleSignOut } from './ims.js';
import createExternalLink from './external-link.js';

const FALLBACK_AVATAR = '/icons/user.svg';
const LINKS = [
  ['Account', 'https://account.adobe.com/'],
  ['Preferences', 'https://experience.adobe.com/#/preferences'],
  ['Admin Console', 'https://adminconsole.adobe.com'],
];

let menuCount = 0;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function button(className, text) {
  const btn = el('button', className, text);
  btn.type = 'button';
  return btn;
}

function avatarImg(src, alt) {
  const img = el('img');
  img.src = src;
  img.alt = alt;
  img.addEventListener('error', () => { img.src = FALLBACK_AVATAR; }, { once: true });
  return img;
}

function renderSignIn(root) {
  const btn = button('profile-signin', 'Sign in');
  btn.addEventListener('click', handleSignIn);
  root.replaceChildren(btn);
}

function renderOrgs(menu, ims, orgs) {
  const current = orgs.find((o) => o.userId === ims.userId);
  if (!current) return;

  const section = el('div', 'profile-org');
  const toggle = button('profile-org-toggle');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.append(el('span', 'profile-label', 'Organization'), el('span', 'profile-org-name', current.description));

  const list = el('div', 'profile-org-list');
  list.hidden = true;
  orgs.forEach((org) => {
    const opt = button('profile-org-switch', org.description);
    opt.addEventListener('click', async () => {
      await window.adobeIMS.switchProfile(org.userId);
      window.location.reload();
    });
    list.append(opt);
  });

  toggle.addEventListener('click', () => {
    list.hidden = !list.hidden;
    toggle.setAttribute('aria-expanded', String(!list.hidden));
  });

  section.append(toggle, list);
  menu.append(section);
}

function renderMenu(root, ims, avatar, orgs) {
  menuCount += 1;
  const menuId = `profile-menu-${menuCount}`;

  const trigger = button('profile-trigger');
  trigger.setAttribute('aria-label', 'Open profile menu');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', menuId);
  trigger.append(avatarImg(avatar, ''));

  const menu = el('div', 'profile-menu');
  menu.id = menuId;
  menu.hidden = true;

  const details = button('profile-details');
  details.title = 'Copy user ID';
  const name = el('span', 'profile-name-wrap');
  name.append(el('span', 'profile-name', ims.displayName), el('span', 'profile-email', ims.email));
  details.append(avatarImg(avatar, ''), name);
  const notice = el('span', 'profile-notice', 'User ID copied');
  notice.setAttribute('role', 'status');
  details.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(ims.userId);
      notice.classList.add('is-visible');
      setTimeout(() => notice.classList.remove('is-visible'), 3000);
    } catch { /* clipboard unavailable */ }
  });
  const detailsWrap = el('div', 'profile-details-wrap');
  detailsWrap.append(details, notice);
  menu.append(detailsWrap);

  if (orgs?.length) renderOrgs(menu, ims, orgs);

  const links = el('div', 'profile-links');
  const ul = el('ul');
  LINKS.forEach(([text, href]) => {
    const li = el('li');
    li.append(createExternalLink(href, text));
    ul.append(li);
  });
  links.append(el('p', 'profile-label', 'Links'), ul);
  menu.append(links);

  const signOut = button('profile-signout', 'Sign out');
  signOut.addEventListener('click', handleSignOut);
  menu.append(signOut);

  const setOpen = (open) => {
    menu.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
  };
  trigger.addEventListener('click', () => setOpen(menu.hidden));
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !root.contains(e.target)) setOpen(false);
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      trigger.focus();
    }
  });

  root.replaceChildren(trigger, menu);
}

/**
 * Builds the Adobe IMS profile control (sign-in button or avatar menu).
 * @returns {HTMLElement}
 */
export default function createProfile() {
  const root = el('div', 'profile');

  (async () => {
    let ims;
    try {
      ims = await loadIms();
    } catch {
      root.remove();
      return;
    }
    if (ims.anonymous) {
      renderSignIn(root);
      return;
    }
    const [io, orgs] = await Promise.all([ims.getIo(), ims.getOrgs()]);
    renderMenu(root, ims, io?.user?.avatar || FALLBACK_AVATAR, orgs?.data);
  })();

  return root;
}
