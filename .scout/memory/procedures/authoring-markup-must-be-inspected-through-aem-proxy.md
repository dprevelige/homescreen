---
title: "Authoring Markup Must Be Inspected Through AEM Proxy"
entity_type: procedure
confidence: 0.78
created: 2026-09-29T15:45:48Z
last_accessed: 2026-09-29T15:46:15Z
last_reinforced: 2026-09-29T15:46:15Z
access_count: 2
sources:
  - "AGENTS.md:5-12"
  - "README.md:22-35"
relationships:
  - type: applies_to
    target: "Auto-Block Rewrite Contract"
tags: ["authoring-markup-must-be-inspected-through-aem-proxy", "aem-cli", "aem-up", "plain-html", "backend-markup", "localhost-3000", "block-authoring", "defensive-decoration"]
tier: procedures
source: inferred
---

# Authoring Markup Must Be Inspected Through AEM Proxy

Before changing a block, inspect the backend-delivered markup at `http://localhost:3000/<path>.plain.html` while running the AEM CLI proxy. There is no build step, and authors can vary row/cell counts, so block decorators should be derived from delivered markup and remain defensive rather than assuming a fixed local fixture shape.
Aliases / also known as: Authoring Markup Must Be Inspected Through AEM Proxy, AEM CLI, aem up, plain HTML, backend markup, localhost 3000
