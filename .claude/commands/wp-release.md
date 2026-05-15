---
description: Cut a release for this WordPress.org plugin — bump version, update readme.txt changelog, and set up the GitHub Actions workflow that deploys to the WordPress.org SVN on every tag push.
---

Set up and run the release process for this WordPress.org plugin. Check what is already present before making changes.

## Step 1 — Detect existing setup

Check for:
- `.github/workflows/release.yml` — is a release workflow already present?
- `.distignore` — does it exist?
- `readme.txt` — does it have a `Stable tag` and a `== Changelog ==` section?
- The main plugin `.php` file — what is the current `Version:` header?

Report what is missing and skip what is already done.

---

## Step 2 — .distignore

Create `.distignore` in the project root if it doesn't exist. This tells `10up/action-wordpress-plugin-deploy` which files and directories to exclude from the SVN deploy:

```
.git
.github
.claude
.gitignore
.distignore
.editorconfig
.eslintrc
eslint.config.js
.prettierrc
.stylelintrc
.vscode
node_modules
vendor
src
tests
bin
*.zip
package-lock.json
composer.lock
phpcs.xml
phpunit.xml.dist
CLAUDE.md
AUDIT.md
README.md
webpack.config.js
```

Adjust entries to match what actually exists in the project root.

---

## Step 3 — GitHub Actions release workflow

Create `.github/workflows/release.yml`:

```yaml
name: Deploy to WordPress.org

on:
  push:
    tags:
      - '[0-9]+.[0-9]+.[0-9]+'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install JS dependencies
        run: npm ci

      - name: Build assets
        run: npm run build

      - name: Deploy to WordPress.org SVN
        uses: 10up/action-wordpress-plugin-deploy@stable
        env:
          WPORG_USERNAME: ${{ secrets.WPORG_USERNAME }}
          WPORG_PASSWORD: ${{ secrets.WPORG_PASSWORD }}
          SLUG: peeps-people-directory
```

**Notes:**
- The tag pattern `[0-9]+.[0-9]+.[0-9]+` matches bare version tags (`2.3.0`) not `v`-prefixed ones. WordPress.org SVN tags must match the version string in the plugin header.
- `SLUG` must match the plugin's WordPress.org slug exactly.
- If the plugin has no JS build step, remove the Node setup, `npm ci`, and `npm run build` steps.

---

## Step 4 — Add GitHub secrets

Tell the user to add these two secrets to the GitHub repository (Settings → Secrets → Actions):

| Secret | Value |
|--------|-------|
| `WPORG_USERNAME` | WordPress.org username (the plugin owner) |
| `WPORG_PASSWORD` | WordPress.org password or application password |

---

## Step 5 — Bump the version

When cutting a release, update the version in two places:

1. **Main plugin file header:**
```php
 * Version: 2.3.0
```

2. **`readme.txt` Stable tag:**
```
Stable tag: 2.3.0
```

Then add a changelog entry at the top of `== Changelog ==` in `readme.txt`:

```
= 2.3.0 =
* Brief description of what changed.
```

Confirm `Stable tag` in `readme.txt` matches `Version:` in the plugin header — a mismatch will cause WordPress.org to serve the wrong version.

---

## Step 6 — Verify before tagging

Run:
```bash
composer run lint
npm run build
npm run lint:js
npm run lint:css
```

Fix any errors before pushing the tag. Once the tag is pushed, the release is live.

---

## Step 7 — Cut the release

```bash
git add -A
git commit -m "Release 2.3.0"
git tag 2.3.0
git push origin main --tags
```

The GitHub Actions workflow will:
1. Build JS/CSS assets
2. Deploy the plugin to WordPress.org SVN (trunk and a new SVN tag)

Sites using the plugin will see the update notification within a few hours once WordPress.org processes the new tag.
