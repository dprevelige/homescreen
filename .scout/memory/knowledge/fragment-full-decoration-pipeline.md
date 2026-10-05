---
title: "Fragment Full-Decoration Pipeline"
entity_type: observation
confidence: 0.80
created: 2026-09-29T15:46:14Z
last_accessed: 2026-09-29T15:46:14Z
last_reinforced: 2026-09-29T15:46:14Z
access_count: 1
sources:
  - "blocks/fragment/fragment.js:21-47"
  - "scripts/scripts.js:171-177"
relationships:
  - type: relates_to
    target: "Architecture Overview"
  - type: depends_on
    target: "Page Decoration and Loading Lifecycle"
tags: ["fragment-full-decoration-pipeline", "load-fragment", "fragment-block", "plain-html", "decorate-main", "load-section", "decorate-section", "media-base-reset"]
tier: knowledge
source: inferred
---

# Fragment Full-Decoration Pipeline

`loadFragment(path)` accepts only local absolute paths, fetches `${path}.plain.html`, rebases relative media URLs to the fragment path, runs the same `decorateMain` pipeline used by pages, and then awaits each fragment section through `loadSection(..., decorateSection)`. Consumers receive a fully decorated `<main>`, not raw fragment markup; failures return `null`, so callers that immediately dereference the result rely on successful fragment delivery.
Aliases / also known as: Fragment Full-Decoration Pipeline, loadFragment, fragment block, plain HTML fragment, fragment loader, media base reset
