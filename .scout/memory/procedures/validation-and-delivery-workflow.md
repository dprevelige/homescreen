---
title: "Validation and Delivery Workflow"
entity_type: procedure
confidence: 0.78
created: 2026-09-29T15:45:48Z
last_accessed: 2026-09-29T15:45:48Z
last_reinforced: 2026-09-29T15:45:48Z
access_count: 1
sources:
  - "package.json:6-29"
  - "AGENTS.md:14-23"
  - "README.md:4-28"
relationships:
  - type: applies_to
    target: "Architecture Overview"
tags: ["validation-and-delivery-workflow", "npm-run-lint", "eslint", "stylelint", "aem-page", "aem-live", "main-branch", "code-sync", "no-build-step"]
tier: procedures
source: inferred
---

# Validation and Delivery Workflow

Validation is lint-only: `npm run lint` runs ESLint across the repository and Stylelint over block/style CSS; there is no build script. Code delivery occurs when `main` merges, while content publishes separately. PR verification requires a branch preview URL in the `{branch}--{repo}--{owner}.aem.page/{path}` form; all committed files are served unless excluded via `.hlxignore`.
Aliases / also known as: Validation and Delivery Workflow, npm run lint, ESLint, Stylelint, AEM preview, AEM live, main branch delivery
