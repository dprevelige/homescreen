/*
 * YouTube Block
 * Privacy-friendly YouTube embed that only loads the player when scrolled into view.
 * Also built automatically from standalone YouTube links (see scripts.js).
 * Ported from https://github.com/aemsites/author-kit
 */

function getEmbedUrl(link) {
  const url = new URL(link.href);
  const params = new URLSearchParams(url.search);
  const id = params.get('v') || url.pathname.split('/').filter(Boolean).pop();
  if (!id) return null;
  params.delete('v');
  params.set('rel', '0');
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params.toString()}`;
}

function loadPlayer(container, title) {
  const iframe = document.createElement('iframe');
  iframe.src = container.dataset.src;
  iframe.title = title;
  iframe.allow = 'encrypted-media; accelerometer; gyroscope; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  iframe.loading = 'lazy';
  container.replaceChildren(iframe);
}

export default function decorate(block) {
  const link = block.querySelector('a[href]');
  const src = link && getEmbedUrl(link);
  if (!src) return;

  const title = link.title && link.title !== link.href ? link.title : 'YouTube video';
  const container = document.createElement('div');
  container.className = 'youtube-video';
  container.dataset.src = src;
  block.replaceChildren(container);

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadPlayer(container, title);
    }
  }, { rootMargin: '200px' });
  observer.observe(container);
}
