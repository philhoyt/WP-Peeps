# Peeps – People Directory — Audit Report

**Date:** 2026-11-04
**Plugin version:** 2.3.1
**WordPress latest stable:** 7.1.4 (dev site `peepsdev.local` runs 7.0-RC4)
**Scanned:** 15 PHP files · 4 blocks · 17 JS source files · 3 SCSS files
**Tooling:** phpcs 3.11.1 + WPCS 3.1.0 ✓ · wp-scripts 32.2.0 ✓ · eslint.config.js ✓ · phpunit ✗ · theme.json n/a (plugin)
**Lint results:** phpcs 0 errors / 8 warnings · ESLint clean · Stylelint clean · Jest 49/49 passing

Previous audit (2026-05-15) is backed up at `/private/tmp/claude-501/-Users-philhoyt--claude-spares-spare-HpNiJx/801e0852-8946-4475-881a-8f7c0bfdb795/scratchpad/AUDIT-2026-05-15-backup.md`. Note that `AUDIT.md` is in `.gitignore`, so audit history is not tracked.

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 (2 fixed 2026-11-04) |
| Warning  | 0 (13 fixed 2026-11-04) |
| Info     | 0 (6 fixed 2026-11-04) |

---

## Status

| ID | Issue | Status |
|----|-------|--------|
| BUG-01 | `wp_is_block_editor()` does not exist — fatal on every front-end social-links render | ✅ Fixed 2026-11-04 (`wp_is_serving_rest_request()` via `ph_peeps_is_editor_request()`) |
| BUG-02 | Meta sanitize callbacks return `WP_Error`, which gets stored and later fatals the phone/email blocks | ✅ Fixed 2026-11-04 (callbacks return `''`/`array()`, sidebar validates phone, render files guard with `is_string()`) |
| PRIV-01 | "Make People Directory Public" off still exposes all people, emails and phones via REST | ✅ Fixed 2026-11-04 (re-scoped: the toggle was never access control; renamed "Enable Individual Profile Pages", people excluded from sitemap and search when off, PR #18) |
| DOC-01 | readme FAQ says private directory is visible to logged-in users; code 404s everyone | ✅ Fixed 2026-11-04 (readme FAQ rewritten; profiles 404 for everyone by design, PR #18) |
| STD-01 | `__experimentalSelector` in social-links block.json should be `selectors.root` | ✅ Fixed 2026-11-04 (`selectors.root`, PR #19) |
| STD-02 | No `wp_set_script_translations()` for editor and admin scripts | ✅ Fixed 2026-11-04 (`wp_set_script_translations()` for both handles, `languages/` with .pot) |
| STD-03 | Template prefix strings "Phone:" / "Email:" are not translatable | ✅ Fixed 2026-11-04 (prefixes built with `wp_json_encode( __() )`) |
| STD-04 | 8 phpcs warnings (unguarded `error_log`, alignment, unused params, `is_writable`) | ✅ Fixed 2026-11-04 (0 errors / 0 warnings) |
| STD-05 | `get_current_screen()` not null-checked in `enqueue_editor_assets()` | ✅ Fixed 2026-11-04 (null-checked, Yoda comparisons) |
| BLK-01 | `className` collapsed by `sanitize_html_class()`; `is-style-default` hard-coded | ✅ Fixed 2026-11-04 (classes sanitized token by token; `is-style-default` only without another style, PR #19) |
| BLK-02 | Social-links block ignores block context (`postId`) and declares no `usesContext` | ✅ Fixed 2026-11-04 (`usesContext`, `$block->context['postId']`, PR #19) |
| BLK-03 | Render callbacks defined three ways: block.json `render`, `render_callback` override, `require_once` | ✅ Fixed 2026-11-04 (render functions in `inc/block-render.php` loaded once; block.json `render` is the only registration path, PR #19) |
| BLK-04 | block.json declares style files that do not exist in `build/` | ✅ Fixed 2026-11-04 (stale email `style` and phone `editorStyle` removed, PR #19) |
| BLK-05 | `tagName` attribute not allow-listed in three render.php files | ✅ Fixed 2026-11-04 (`ph_peeps_validate_tag_name()` allow-lists per block, PR #19) |
| ADM-01 | Settings page render callback has no capability re-check | ✅ Fixed 2026-11-04 (`current_user_can()` + `wp_die()` in `render_admin_page()`) |
| TST-01 | No PHPUnit suite; sanitize callbacks and render.php untested | ✅ Fixed 2026-11-04 (CI with lint, two wp-env smoke jobs and PHPUnit; 10 PHP tests for sanitizers and the social-links block, PRs #17 and #19) |
| DEP-01 | 10 npm packages one or more majors behind; runtime `dependencies` are unused by the build | ✅ Fixed 2026-11-04 (wp-scripts 37.1, eslint-plugin 28.1, runtime `dependencies` moved to devDependencies, PR #21) |
| DEP-02 | Composer dev tools behind (phpcs 4.x, composer-installer 1.x, WPCS 3.4) | ✅ Fixed 2026-11-04 (phpcs 3.13.6, WPCS 3.4.1, composer-installer 1.2.1; `composer audit` clean. phpcs stays on 3.x because WPCS 3.4.1 requires it, PR #21) |
| INF-01 | No `uninstall.php`; options persist after deletion | ✅ Fixed 2026-11-04 (`uninstall.php` deletes the five options; posts and meta kept) |
| INF-02 | `Tested up to: 7.0` while 7.1.4 is stable | ✅ Fixed 2026-11-04 (`Tested up to: 7.1`; CI latest-WordPress job) |
| INF-03 | `AUDIT.md` and `composer.lock` are gitignored | ✅ Fixed 2026-11-04 (`AUDIT.md` tracked; `composer.lock` was already tracked) |

---

## Critical

### [BUG-01] `wp_is_block_editor()` is not a WordPress function — fatal error on the front end
**File:** `src/blocks/social-links/render.php:46` and `src/blocks/social-links/render.php:90` (identical in `build/`)
**Code:**
```php
$is_editor = wp_is_block_editor();
```
**Details:** The May 2026 audit recommended replacing the `REST_REQUEST` check with `wp_is_block_editor()`, and commit `dc4ded6` did so. That function does not exist in core: the developer reference returns 404 for it, and a grep of `wp-includes` and `wp-admin` on the 7.0-RC4 dev site finds no definition. The change shipped in 2.3.0 and 2.3.1. Every front-end render of the social-links block throws `Call to undefined function PH_Peeps\Blocks\wp_is_block_editor()`. Both plugin-registered templates (single person and people archive in `inc/templates.php`) include this block, so the whole directory is down on any site running 2.3.x. The editor still works because `ServerSideRender` only surfaces the error as an empty placeholder.

The function is called twice: once in `ph_peeps_render_social_links_block()` and again in `ph_peeps_get_social_links()`. The first call's result is only used after `ph_peeps_get_social_links()` has already returned, so the editor-vs-frontend check is also duplicated.

**Fix:** Use `wp_is_serving_rest_request()` (core since 6.5; the plugin requires 6.7). The editor renders this block through the `/wp/v2/block-renderer` REST endpoint, which is what the check is for.
```php
$is_editor = wp_is_serving_rest_request();
```
Add a helper so the check lives in one place, then rebuild (`npm run build`) so `build/blocks/social-links/render.php` is updated, and correct the 2.3.0 changelog line that claims this as a fix.

---

### [BUG-02] Meta sanitize callbacks return `WP_Error`, which WordPress stores as the meta value
**File:** `inc/meta.php:33`, `inc/meta.php:57`, `inc/meta.php:77`
**Code:**
```php
return new \WP_Error( 'invalid_phone', __( 'Phone number must be empty or contain between 10 and 15 digits.', ... ) );
```
**Details:** `register_post_meta()`'s `sanitize_callback` runs through `sanitize_meta()` inside `update_metadata()` (`wp-includes/meta.php:223`), and whatever it returns is passed straight to `maybe_serialize()` and written to the database (`meta.php:271`). There is no `is_wp_error()` check on that path, and the REST meta layer (`class-wp-rest-meta-fields.php`, `update_meta_value()`) does not check either. So a rejected value is not rejected: a serialized `WP_Error` object is stored instead.

The editor sidebar validates required names and email format but never validates phone length (`src/editor/index.js:110-131`). Typing a 1–9 digit phone and saving stores a `WP_Error`. On the next front-end render, `ph_peeps_format_phone_number()` calls `preg_replace()` with that object as the subject (`src/blocks/phone/render.php:109`), which is a `TypeError` on PHP 8 and a second fatal error. The email path has the same shape: `esc_attr()` on a `WP_Error` throws "could not be converted to string". The REST schema (`type: string`) does not prevent any of this.

**Fix:** Sanitize callbacks must return a storable value. Return `''` (or the cleaned digits) for an invalid phone, `''` for an invalid email, and `array()` for a non-array social links value. Enforce the 10–15 digit rule where it can actually reject input: in the REST schema (`'pattern' => '^[0-9]{10,15}$'` via the `show_in_rest` schema) and in the sidebar (`validateFields()`), mirroring what is already done for email. Also guard the render files: `is_string( $phone )` / `is_string( $email )` before use, so an already-corrupted row degrades to empty output instead of a fatal. A one-off cleanup for existing rows: delete `ph_peeps_phone` / `ph_peeps_email` meta whose value begins with `O:8:"WP_Error"`.

---

## Warnings

### [PRIV-01] Private directory setting does not restrict the REST API
**File:** `inc/cpt.php:50`, `inc/cpt.php:67`, `inc/meta.php:114` (and each `show_in_rest => true` below it)
**Details:** The CPT is always registered with `publicly_queryable => true` and `show_in_rest => true`, and every meta field (first/middle/last name, phone, extension, email, social links) is `show_in_rest => true`. The `auth_callback` on each field only gates writes. `is_post_type_viewable()` returns true for the type, so an anonymous `GET /wp-json/wp/v2/ph_peeps_people` lists every published person with their email and phone number even when "Make People Directory Public" is off. `template_redirect` 404s single pages (`inc/cpt.php:85-101`), but that does nothing for REST, and `?post_type=ph_peeps_people` queries still resolve. The settings page's Developer Docs tab even advertises the REST endpoint. The toggle currently gives a false sense of privacy.
**Fix:** When `ph_peeps_public_cpt` is false, require authentication for the REST collection and item routes, for example a `rest_pre_dispatch` filter (or `rest_request_before_callbacks`) that returns a `WP_Error` with status 401 for `/wp/v2/ph_peeps_people` routes when `! is_user_logged_in()`, or a `rest_prepare_ph_peeps_people` filter that strips `meta` for anonymous requests. Decide whether `publicly_queryable` should also follow the setting (see DOC-01) and document the REST behaviour in the readme FAQ.

---

### [DOC-01] readme promises logged-in access to a private directory; code returns 404 to everyone
**File:** `readme.txt:48` (FAQ "Can I make the directory private?") vs `inc/cpt.php:85-101`
**Details:** The FAQ says disabling the public option makes the directory "visible only to logged-in users". `block_single_profile_access()` sets a 404 for every request regardless of login state. One of the two is wrong.
**Fix:** Either add `if ( is_user_logged_in() ) { return; }` (or a capability check) before the 404, or rewrite the FAQ to say single profiles are hidden entirely. Pair this with PRIV-01 so REST, single pages and the archive all follow the same rule.

---

### [STD-01] `__experimentalSelector` should be the stable `selectors` field
**File:** `src/blocks/social-links/block.json:31`
**Code:**
```json
"__experimentalSelector": ".wp-block-ph-peeps-social-links"
```
**Details:** The Block Selectors reference (published April 2023, WP 6.3 era) documents `selectors.root` and does not mention `__experimentalSelector`. The plugin requires 6.7, so the stable key is safe. The `__experimentalFontFamily` / `__experimentalFontStyle` etc. typography keys in the other three block.json files were checked against the Block Supports reference; the page does not list either spelling, so those are **not flagged** per the audit rules.
**Fix:**
```json
"selectors": { "root": ".wp-block-ph-peeps-social-links" }
```

---

### [STD-02] Editor and admin scripts never call `wp_set_script_translations()`
**File:** `inc/editor.php:39-45`, `inc/admin.php:61-70`
**Details:** `src/editor/index.js` and `src/admin/settings.js` contain dozens of `__()` strings, but neither handle (`ph-peeps-editor`, `ph-peeps-admin`) is registered for JS translations, so they can never be localised. The four block scripts are fine because `register_block_type()` with a block.json `textdomain` handles it automatically.
**Fix:** After each `wp_enqueue_script()`:
```php
wp_set_script_translations( 'ph-peeps-editor', 'peeps-people-directory', PH_PEEPS_PLUGIN_DIR . 'languages' );
```

---

### [STD-03] Hard-coded English in registered block templates
**File:** `inc/templates.php:46`, `inc/templates.php:48`
**Code:**
```php
<!-- wp:ph-peeps/phone {"makeLink":true,"prefix":"<strong>Phone:</strong> "} /-->
```
**Details:** The `prefix` attribute values "Phone:" and "Email:" ship untranslated in the single-person template, while "No people found." on line 110 is correctly wrapped. Block attribute JSON must be built with `wp_json_encode()` of a translated string to be safe.
**Fix:** Build those two block comments with `sprintf()` and `wp_json_encode( '<strong>' . __( 'Phone:', 'peeps-people-directory' ) . '</strong> ' )`.

---

### [STD-04] phpcs reports 8 warnings
**Files and lines:**
- `src/blocks/full-name/render.php:30`, `src/blocks/email/render.php:32`, `src/blocks/phone/render.php:32` — `error_log()` without a `// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log` (the calls are WP_DEBUG-guarded, so this is only the annotation; `inc/meta.php` already does it correctly)
- `src/blocks/email/render.php:60`, `src/blocks/phone/render.php:58` — assignment alignment (auto-fixable with `phpcbf`)
- `inc/blocks.php:24` — unused `$block_editor_context` parameter
- `inc/meta.php:241` — unused `$meta_value` parameter
- `bin/generate-test-data.php:28` — `is_writable()` instead of `WP_Filesystem`
**Fix:** Run `composer lint-fix` for the two alignment warnings; add the phpcs:ignore annotations; drop the unused parameters (and the matching `4` accepted-args in `add_action` for `update_title_from_name`) or annotate them.

---

### [STD-05] `get_current_screen()` used without a null check
**File:** `inc/editor.php:32`
**Code:**
```php
$current_post_type = get_current_screen()->post_type;
```
**Details:** `enqueue_editor_ui_styles()` in the same file guards against a null screen (line 70); `enqueue_editor_assets()` does not. `enqueue_block_editor_assets` can fire where no screen object exists.
**Fix:** Mirror line 70: `$screen = get_current_screen(); if ( ! $screen || 'ph_peeps_people' !== $screen->post_type ) { return; }`. While there, the two comparisons on lines 33 and 70 are not Yoda conditions (the ruleset excludes that sniff, but CLAUDE.md asks for them).

---

### [BLK-01] `className` collapsed by `sanitize_html_class()`; `is-style-default` always added
**File:** `src/blocks/social-links/render.php:116`, `src/blocks/social-links/render.php:140`
**Code:**
```php
'className' => sanitize_html_class( $attributes['className'] ?? '' ),
...
'is-style-default',
```
**Details:** `sanitize_html_class()` strips spaces, so a `className` of `is-style-logos-only my-class` becomes the single bogus class `is-style-logos-onlymy-class`. The block also hard-codes `is-style-default` into the class list, so selecting the "Logos Only" style renders both `is-style-default` and `is-style-logos-only`, and core's social-links CSS matches on the first.
**Fix:** Split on whitespace, sanitize each token, and implode: `implode( ' ', array_map( 'sanitize_html_class', preg_split( '/\s+/', $attributes['className'] ?? '' ) ) )`. Remove the hard-coded `is-style-default` and only add it when no `is-style-*` class is present.

---

### [BLK-02] Social-links render ignores block context
**File:** `src/blocks/social-links/render.php:41`, `src/blocks/social-links/render.php:85`, `src/blocks/social-links/block.json`
**Details:** The other three blocks read `$block->context['postId']` and declare `"usesContext": ["postId", "postType"]`. This block's callback takes only `$attributes` and calls `get_the_ID()`, which depends on the global post being set up. It works today inside Query Loop and the single template, but will silently render the wrong person (or nothing) anywhere the global post differs from the block context, such as a pattern that sets `postId` explicitly.
**Fix:** Add `usesContext` to block.json, accept `( $attributes, $content, $block )`, and pass the resolved post ID into `ph_peeps_get_social_links( $post_id )`.

---

### [BLK-03] Render callbacks are wired three different ways
**File:** `peeps-people-directory.php:38-41`, `inc/blocks.php:61-90`, each `block.json` `"render": "file:./render.php"`
**Details:** Each render.php declares named functions and is `require_once`'d from the main file. `inc/blocks.php` then passes those function names as `render_callback`, which overrides the block.json `render` entry (so `render` is dead config). If the override were ever removed, core would `require` the file on every render and the second render would fatal on a function redeclaration. It also means `build/` PHP is loaded on every request, including requests that never render a block.
**Fix:** Pick one mechanism. Simplest: drop the four `require_once` lines and the `render_callback` args, and have each render.php `return ph_peeps_render_…( $attributes, $content, $block )` with the helper functions guarded by `function_exists()`, or move the helpers into `inc/` and keep only a thin render.php per block.

---

### [BLK-04] block.json declares style files that are not built
**File:** `src/blocks/email/block.json:65` (`"style": "file:./style.css"`), `src/blocks/phone/block.json:67` (`"editorStyle": "file:./index.css"`)
**Details:** `build/blocks/email/` has no `style.css` and `build/blocks/phone/` has no `index.css` (neither block imports an SCSS file). Core silently skips the missing handle, but the declarations are misleading and would hide a real missing stylesheet later.
**Fix:** Remove the two entries, or add the SCSS files if styling was intended.

---

### [BLK-05] `tagName` is not allow-listed before output
**File:** `src/blocks/full-name/render.php:39`, `src/blocks/email/render.php:46`, `src/blocks/phone/render.php:44`
**Code:**
```php
$tag_name = sanitize_key( $attributes['tagName'] ?? 'h2' );
...
tag_escape( $tag_name ),
```
**Details:** `sanitize_key()` + `tag_escape()` guarantee a syntactically valid tag name, not a sensible one. Anyone with `edit_posts` can set `tagName` to `script`, `style`, `iframe` or `textarea` in block markup. The content inside is escaped, so this is not a direct XSS, but a `<style>` or `<textarea>` wrapper breaks page rendering and it is cheap to close.
**Fix:** Validate against the same lists the editor offers: `h1`–`h6`, `p`, `div` for full-name; `p`, `div`, `span` for phone and email. Fall back to the default when the value is not in the list.

---

### [ADM-01] Settings page callback does not re-check capability
**File:** `inc/admin.php:37-39`
**Details:** `add_submenu_page()` enforces `manage_options` for the menu, and the page only outputs an empty mount div, so the exposure is nil today. The audit rule still asks for a `current_user_can( 'manage_options' )` guard inside the callback so a future change that echoes data is safe by default.
**Fix:** Add the check and `wp_die()` at the top of `render_admin_page()`.

---

## Info

### [TST-01] No PHP tests; one JS test file
**Details:** There is no `phpunit.xml`, no `tests/` directory and no Playwright spec. The only test file is `src/editor/__tests__/utils.test.js` (49 passing tests for the pure helpers). Nothing covers `validate_phone()`, `validate_email()`, `validate_social_links()`, the four render callbacks, or `ph_peeps_format_phone_number()`. BUG-02 is exactly the kind of regression a `WP_UnitTestCase` that calls `update_post_meta( $id, 'ph_peeps_phone', '123' )` and asserts the stored value would have caught.
**Recommendation:** Add a `wp-env` + PHPUnit setup (`/wp-setup` scaffolds it) with tests for the three sanitize callbacks and one render test per block, then a single Playwright smoke test that opens a person on the front end and asserts no PHP fatal.

### [DEP-01] npm dependencies well behind; runtime `dependencies` are unused by the build
**Details:** No package is marked deprecated on the registry. Installed vs latest for packages ≥1 major behind:

| Package | Installed | Latest |
|---------|-----------|--------|
| @wordpress/scripts | 32.2.0 | 37.1.0 |
| @wordpress/eslint-plugin | 21.4.0 | 28.1.0 |
| @wordpress/stylelint-config | 23.38.0 | 27.1.0 |
| eslint | 8.57.1 | 10.14.0 |
| stylelint | 16.10.0 | 18.0.0 |
| stylelint-scss | 6.9.0 | 7.4.0 |
| @wordpress/block-editor | 14.6.0 | 20.0.0 |
| @wordpress/blocks | 14.0.0 | 17.1.0 |
| @wordpress/components | 25.16.0 | 44.0.0 |
| @wordpress/core-data | 6.35.0 | 9.1.0 |
| @wordpress/data | 9.28.0 | 11.1.0 |
| @wordpress/editor | 13.35.0 | 16.1.0 |
| @wordpress/element | 5.35.0 | 10.1.0 |
| @wordpress/i18n | 4.58.0 | 7.1.0 |
| @wordpress/icons | 10.11.0 | 20.0.0 |
| @wordpress/plugins | 6.26.0 | 8.1.0 |

The `@wordpress/*` entries under `dependencies` are externalised by wp-scripts to the `wp.*` globals WordPress ships, so the versions in `package.json` never reach the browser. They only affect Jest and editor tooling. Also, `src/editor/index.js:14` imports `@wordpress/edit-post`, which is not listed at all (it resolves transitively). Browserslist data is 6 months old.
**Recommendation:** Move the `@wordpress/*` runtime entries to `devDependencies` (or remove them), bump `@wordpress/scripts` to 37 (which brings ESLint 10 and matching `@wordpress/eslint-plugin`), run `npx update-browserslist-db@latest`, rebuild, and re-run lint + Jest.

### [DEP-02] Composer dev tools behind
**Details:** None is abandoned on Packagist. `squizlabs/php_codesniffer` 3.11.1 → 4.0.4, `dealerdirect/phpcodesniffer-composer-installer` 0.7.2 → 1.2.1, `wp-coding-standards/wpcs` 3.1.0 → 3.4.1, `phpcompatibility/phpcompatibility-wp` 2.1.5 (latest stable; 3.0 is alpha).
**Recommendation:** `composer require --dev squizlabs/php_codesniffer:^4.0 wp-coding-standards/wpcs:^3.4 dealerdirect/phpcodesniffer-composer-installer:^1.2` and re-run `composer lint`.

### [INF-01] No `uninstall.php`
**Details:** Five options (`ph_peeps_public_cpt`, `ph_peeps_has_archive`, `ph_peeps_phone_format`, `ph_peeps_cpt_slug`, `ph_peeps_menu_position`) stay in `wp_options` after the plugin is deleted. Deleting people posts on uninstall would be destructive and should stay opt-in, but options can be removed.
**Recommendation:** Add `uninstall.php` that deletes the five options (and `flush_rewrite_rules()`), leaving posts and meta in place.

### [INF-02] `Tested up to: 7.0` while 7.1.4 is stable
**Details:** `readme.txt:4` says 7.0. That is within the allowed window (not more than one major behind) so it is not a defect. The dev site runs 7.0-RC4, so the plugin has not been exercised on a 7.1 release build.
**Recommendation:** Once BUG-01 is fixed, update the dev site to 7.1.4, smoke test, and bump `Tested up to` to 7.1 (`/wp-compat`).

### [INF-03] `AUDIT.md` and `composer.lock` are gitignored
**Details:** `.gitignore:44` ignores `AUDIT.md`, so audit history is lost between sessions and the May report was only on disk. `composer.lock` is also ignored, so CI and other machines can resolve different phpcs/WPCS versions than the ones that produced these results.
**Recommendation:** Track `AUDIT.md` (it is already in `.distignore`, so it never ships) and consider tracking `composer.lock` for reproducible linting.

---

## Quick Wins

All quick wins resolved as of 2026-11-04.

---

## Already Fixed / Clean

- **Security scan:** no `$_GET`/`$_POST`/`$_REQUEST` handling, no `$wpdb` queries, no AJAX handlers, no custom REST routes, no hard-coded secrets. All output in render files is escaped (`esc_html`, `esc_attr`, `esc_url`, `tag_escape`, `wp_kses` with a tight allow-list, `wp_json_encode` for block attributes). `error_log()` calls are WP_DEBUG-guarded. **Zero findings.**
- **Architecture:** CPT, meta, settings and templates all register on `init`; `show_in_rest` set; every `register_setting()` has a `sanitize_callback`; no `query_posts()`, no direct table names, no `curl`/`file_get_contents` (the test-data script uses `wp_remote_get()` and `WP_Filesystem`).
- **Standards:** every PHP file has an ABSPATH guard and no closing `?>`; all functions, hooks, options and meta keys are `ph_peeps_`-prefixed; every `__()` call carries the `peeps-people-directory` text domain; assets are enqueued through `wp_enqueue_*` with asset-file versions; `Requires at least` (6.7) ≤ `Tested up to` (7.0).
- **Blocks:** all four use `apiVersion: 3`, `$schema`, `"html": false`, `get_block_wrapper_attributes()`, dynamic rendering with no JS `save()`, no `__experimental*` component imports in JS, and block scripts are registered via block.json (no manual enqueues).
- **Admin UI:** React via `@wordpress/element` with `createRoot()`, settings saved through `core-data` `saveEntityRecord` (no `wp_localize_script` nonces, no AJAX).
- **Previously resolved (May 2026 audit):** SEC-01 settings link escaping, SEC-02 `linkRel` sanitization, WCS-02 text domains, WCS-03 prefix RichText HTML, WCS-04/INFO-08 ESLint flat config, CSS-01 SCSS duplicate selector, INFO-01 `error_log` guards, INFO-02 CLAUDE.md cleanup, INFO-07 `createRoot()`. Still deferred from that report: WCS-01/INFO-06 job-title remnants (now removed per the 2.3.0 changelog), INFO-03 `add_settings_link` living in `activation.php`, INFO-04 no PHP tests (now TST-01).

---

## Revision Log

| Date | Changes |
|------|---------|
| 2026-11-04 | Re-checked 11 open findings after PRs #17, #18, #19, #21 and #22 and releases 2.3.2 through 2.6.0: 11 fixed, 0 still open, 0 deployment tasks. Report moved from the project root to `plans/AUDIT.md`. |
