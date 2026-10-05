---
title: "Architecture Overview"
entity_type: project
confidence: 0.78
created: 2026-09-29T15:45:47Z
last_accessed: 2026-09-29T15:45:47Z
last_reinforced: 2026-09-29T15:45:47Z
access_count: 1
sources:
  - "scripts/scripts.js:171-234"
  - "blocks/fragment/fragment.js:21-47"
  - "AGENTS.md:5-23"
tags: ["architecture-overview", "edge-delivery-services", "eds", "decorate-main", "load-fragment", "page-lifecycle", "block-runtime"]
tier: knowledge
source: inferred
---

# Architecture Overview

This Edge Delivery Services site has a thin site-owned orchestration layer in `scripts/scripts.js`, block implementations under `blocks/`, and one intentional cross-block composition boundary in `blocks/fragment/fragment.js`. Start page-lifecycle changes at `decorateMain`/`loadEager`/`loadLazy`; start reusable-content changes at `loadFragment`. `scripts/aem.js` supplies the runtime primitives but is vendored and must not be edited. This boundary matters because changing decoration order or fragment handling can affect every block before its own decorator runs.
Aliases / also known as: Architecture Overview, Edge Delivery Services, EDS, decorateMain, loadFragment, page lifecycle, block runtime
