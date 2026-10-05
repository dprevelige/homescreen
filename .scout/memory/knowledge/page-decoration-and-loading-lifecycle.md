---
title: "Page Decoration and Loading Lifecycle"
entity_type: observation
confidence: 0.78
created: 2026-09-29T15:46:14Z
last_accessed: 2026-09-29T15:46:14Z
last_reinforced: 2026-09-29T15:46:14Z
access_count: 1
sources:
  - "scripts/scripts.js:171-234"
relationships:
  - type: relates_to
    target: "Architecture Overview"
tags: ["page-decoration-and-loading-lifecycle", "decorate-main", "load-eager", "load-lazy", "build-auto-blocks", "decorate-sections", "decorate-blocks", "lcp"]
tier: knowledge
source: inferred
---

# Page Decoration and Loading Lifecycle

`loadEager` calls `decorateMain` before exposing the body and loads only the first section through the LCP path; `loadLazy` then loads all sections sequentially, header, footer, lazy styles, and fonts. Inside `decorateMain`, icons and auto-block rewrites run before section/block decoration, and button decoration runs last. Changes to raw authored markup must account for those rewrites before block decorators observe the DOM.
Aliases / also known as: Page Decoration and Loading Lifecycle, decorateMain, loadEager, loadLazy, buildAutoBlocks, LCP path
