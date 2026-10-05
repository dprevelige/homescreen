---
title: "Auto-Block Rewrite Contract"
entity_type: pattern
confidence: 0.76
created: 2026-09-29T15:46:14Z
last_accessed: 2026-09-29T15:46:14Z
last_reinforced: 2026-09-29T15:46:14Z
access_count: 1
sources:
  - "scripts/scripts.js:52-109"
  - "AGENTS.md:7-9"
relationships:
  - type: depends_on
    target: "Page Decoration and Loading Lifecycle"
tags: ["auto-block-rewrite-contract", "build-auto-blocks", "build-widget-auto-blocks", "build-link-auto-blocks", "autoblocking", "synthetic-blocks", "authored-links"]
tier: knowledge
source: inferred
---

# Auto-Block Rewrite Contract

`buildAutoBlocks` rewrites authored links before normal block decoration: widget links become `widget` blocks, standalone schedule/YouTube links become named blocks, and fragment links are asynchronously replaced by loaded fragment children unless already inside a fragment. Block code therefore cannot assume it receives the backend's original link markup; defensive handling is required because authors may also omit or add cells.
Aliases / also known as: Auto-Block Rewrite Contract, buildAutoBlocks, buildWidgetAutoBlocks, buildLinkAutoBlocks, autoblocking, synthetic blocks
