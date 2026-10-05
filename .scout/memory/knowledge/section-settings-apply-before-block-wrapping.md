---
title: "Section Settings Apply Before Block Wrapping"
entity_type: observation
confidence: 0.72
created: 2026-09-29T15:46:14Z
last_accessed: 2026-09-29T15:46:14Z
last_reinforced: 2026-09-29T15:46:14Z
access_count: 1
sources:
  - "scripts/section.js:92-102"
  - "scripts/scripts.js:226-234"
relationships:
  - type: depends_on
    target: "Page Decoration and Loading Lifecycle"
tags: ["section-settings-apply-before-block-wrapping", "decorate-section", "apply-section-setting", "wrap-block-content", "section-dataset", "section-loading"]
tier: knowledge
source: inferred
---

# Section Settings Apply Before Block Wrapping

`decorateSection` applies every section dataset setting except the internal `sectionStatus` marker, then calls `wrapBlockContent`. The page and fragment loading paths pass this callback into section loading. Section-level behavior and wrapper assumptions should therefore be changed in `scripts/section.js`, not duplicated inside individual block decorators.
Aliases / also known as: Section Settings Apply Before Block Wrapping, decorateSection, applySectionSetting, wrapBlockContent, section dataset, section loading
