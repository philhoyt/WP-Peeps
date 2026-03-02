# WP Peeps – People Directory

## Project Overview

A WordPress plugin that provides a people directory via a custom post type, block editor sidebar panels, and custom Gutenberg blocks.

- **Plugin file:** `peeps-people-directory.php`
- **Package:** `PH_Peeps`
- **Text domain:** `peeps-people-directory`
- **Requires:** WordPress 6.7+, PHP 8.0+

## Key Identifiers

- **PHP prefix:** `ph_peeps_` (all functions and variables)
- **Constants:** `PH_PEEPS_PLUGIN_FILE`, `PH_PEEPS_PLUGIN_DIR`
- **Post type:** `ph_peeps_people`
- **CSS class prefix:** `ph-peeps-` (BEM, e.g. `.ph-peeps-name-panel`)
- **Meta keys:** `ph_peeps_first_name`, `ph_peeps_middle_name`, `ph_peeps_last_name`, `ph_peeps_job_title`, `ph_peeps_phone`, `ph_peeps_phone_ext`, `ph_peeps_email`, `ph_peeps_social_links`

## Project Structure

```
peeps-people-directory.php  # Main plugin entry point
inc/                        # PHP includes
  cpt.php                   # Custom post type registration
  meta.php                  # Post meta field registration
  editor.php                # Editor assets/scripts
  admin.php                 # Admin area
  settings.php              # Plugin settings
  activation.php            # Activation hooks
  notices.php               # Admin notices
  blocks.php                # Block registration
  templates.php             # Frontend templates
src/                        # JS/CSS source (edit these)
  editor/                   # Block editor sidebar panels
    index.js                # PersonDetailsPanel + SocialLinksPanel
    utils.js                # Shared helpers (phone format, slug, URL detection)
    style.scss
  blocks/                   # Custom Gutenberg blocks
    full-name/
    phone/
    email/
    social-links/
  admin/                    # Admin settings page
build/                      # Compiled output — do not edit directly
bin/
  generate-test-data.php    # WP-CLI test data generator
```

## Build & Development

```bash
npm run build       # Production build
npm run start       # Watch mode for development
npm run lint:js     # Lint JavaScript
npm run lint:css    # Lint CSS/SCSS
npm test            # Run Jest unit tests
```

Always run `npm run build` after editing any file in `src/`.

## Test Data

Generate test people via WP-CLI:

```bash
wp eval-file wp-content/plugins/peeps/bin/generate-test-data.php 20
```

Avatars use the DiceBear Lorelei style (SVG). Requires the Safe SVG plugin to be active for featured image support.

## Git Commits

- Never include `Co-Authored-By: Claude` or any Claude/AI co-author lines in commit messages.

## Coding Standards

Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/) throughout.

### PHP
- [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- Tabs for indentation
- Yoda conditions
- Space before opening parenthesis on control structures (`if ( $foo )`, not `if($foo)`)
- Snake_case for functions and variables, prefixed with `ph_peeps_`

### JavaScript
- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- Single quotes
- Tabs for indentation
- Use `@wordpress/*` packages rather than third-party equivalents
- React via `@wordpress/element`

### CSS
- [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
- SCSS source in `src/`, compiled to `build/`
- BEM naming with `ph-peeps-` prefix (e.g. `.ph-peeps-name-panel__field`)
