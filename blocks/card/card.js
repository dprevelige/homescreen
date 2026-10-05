/*
 * Card Block
 * A single card with optional image, content and call to action.
 * Ported from https://github.com/aemsites/author-kit
 */

export default function decorate(block) {
  const inner = block.querySelector(':scope > div');
  if (!inner) return;
  inner.classList.add('card-inner');

  const pic = block.querySelector('picture');
  if (pic) {
    const picDiv = document.createElement('div');
    picDiv.className = 'card-picture-container';
    const picParent = pic.closest('p') || pic.parentElement;
    picDiv.append(pic);
    inner.prepend(picDiv);
    const emptyParent = picParent && picParent !== inner
      && !picParent.textContent.trim() && !picParent.children.length;
    if (emptyParent) picParent.remove();
  }

  const con = [...inner.querySelectorAll(':scope > div:not([class])')]
    .find((div) => div.textContent.trim());
  if (!con) return;
  con.classList.add('card-content-container');
  inner.querySelectorAll(':scope > div:not([class])').forEach((div) => {
    if (!div.textContent.trim() && !div.querySelector('picture')) div.remove();
  });

  const ctaPara = con.querySelector(':scope > p:last-of-type');
  const cta = ctaPara?.querySelector('a');
  if (!cta || ctaPara.textContent.trim() !== cta.textContent.trim()) return;
  if (block.classList.contains('hash-aware')) {
    cta.href = `${cta.getAttribute('href')}${window.location.hash}`;
  }
  ctaPara.classList.add('card-cta-container');
  inner.append(ctaPara);
}
