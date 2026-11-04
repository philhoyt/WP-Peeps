---
paths:
  - "**/*.php"
  - "**/*.js"
  - "**/*.jsx"
  - "**/*.scss"
  - "**/*.css"
  - "**/block.json"
  - "**/composer.json"
  - "**/package.json"
---
# Project: Peeps – People Directory

- Slug: `peeps-people-directory`
- Text domain: `peeps-people-directory`
- PHP minimum: 8.0
- WP minimum: 6.7.2 (6.7.0 and 6.7.1 reject underscores in block template names, so the plugin templates never register there)
- Distribution: GitHub releases via Plugin Update Checker (bundled in `lib/`); tags are lowercase v-prefixed; `.github/workflows/release.yml` builds and attaches the zip. The WordPress.org listing was closed 2026-11-04 (author request); 2.3.2 was its last version.
- Main file: `peeps-people-directory.php`
- Version constant: none (version in plugin header only)
