---
title: "Modal Uses Runtime Block Loading"
entity_type: observation
confidence: 0.76
created: 2026-09-29T15:46:14Z
last_accessed: 2026-09-29T15:46:14Z
last_reinforced: 2026-09-29T15:46:14Z
access_count: 1
sources:
  - "blocks/modal/modal.js:1-51"
  - "blocks/modal/modal.js:63-70"
  - "scripts/scripts.js:207-220"
relationships:
  - type: depends_on
    target: "Fragment Full-Decoration Pipeline"
  - type: relates_to
    target: "Page Decoration and Loading Lifecycle"
tags: ["modal-uses-runtime-block-loading", "modal", "create-modal", "open-modal", "autolink-modals", "dialog", "dynamic-block", "load-fragment"]
tier: knowledge
source: inferred
---

# Modal Uses Runtime Block Loading

Modal is not decorated from authored block markup. Click delegation dynamically imports it for `/modals/` links; `openModal` loads fragment content, and `createModal` builds, decorates, and loads a synthetic modal block before inserting a native `<dialog>`. Closing removes both the body state and runtime block, so modal changes must preserve this create/show/cleanup lifecycle.
Aliases / also known as: Modal Uses Runtime Block Loading, modal, createModal, openModal, autolinkModals, dynamic dialog block
