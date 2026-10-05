---
title: "Header and Footer Are Fragment Consumers"
entity_type: pattern
confidence: 0.78
created: 2026-09-29T15:46:14Z
last_accessed: 2026-09-29T15:46:14Z
last_reinforced: 2026-09-29T15:46:14Z
access_count: 1
sources:
  - "blocks/header/header.js:115-171"
  - "blocks/footer/footer.js:7-20"
relationships:
  - type: depends_on
    target: "Fragment Full-Decoration Pipeline"
tags: ["header-and-footer-are-fragment-consumers", "header", "footer", "navigation", "nav-fragment", "footer-fragment", "metadata-path", "load-fragment"]
tier: knowledge
source: inferred
---

# Header and Footer Are Fragment Consumers

Header and footer content is loaded through `loadFragment`, with metadata-selected paths and `/nav` or `/footer` defaults. Each consumer clears its block and moves already decorated fragment children into component-specific wrappers; header additionally assigns positional `brand`, `sections`, and `tools` roles only when those children exist. Changes to navigation/footer authoring therefore cross both fragment decoration and consumer-specific DOM assumptions.
Aliases / also known as: Header and Footer Are Fragment Consumers, header, footer, navigation, nav fragment, footer fragment, metadata path
