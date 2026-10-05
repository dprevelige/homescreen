---
title: "Fragment Is the Cross-Block Composition Boundary"
entity_type: decision
confidence: 0.76
created: 2026-09-29T15:45:47Z
last_accessed: 2026-09-29T15:46:14Z
last_reinforced: 2026-09-29T15:46:14Z
access_count: 2
sources:
  - "AGENTS.md:5-12"
  - "blocks/fragment/fragment.js:7-16"
relationships:
  - type: applies_to
    target: "Fragment Full-Decoration Pipeline"
tags: ["fragment-is-the-cross-block-composition-boundary", "fragment", "load-fragment", "cross-block-import", "shared-composition", "scripts-import-boundary", "import-cycle"]
tier: knowledge
source: inferred
---

# Fragment Is the Cross-Block Composition Boundary

Repository guidance permits `fragment/fragment.js` as the only cross-block import; other reusable behavior should come from `/scripts/`. The fragment module intentionally imports site decoration back from `scripts/scripts.js` (with an explicit cycle suppression), while `scripts/scripts.js` dynamically imports the fragment loader for auto-blocks. Preserve this narrow cycle and avoid introducing additional block-to-block dependencies.
Aliases / also known as: Fragment Is the Cross-Block Composition Boundary, fragment, loadFragment, cross-block import, shared composition, scripts import boundary
