=== Peeps – People Directory ===
Contributors:      philhoyt
Tags:              directory, people, staff, team, employees
Tested up to:      7.0
Stable tag:        2.4.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A WordPress plugin for managing and displaying people profiles.

== Description ==

Peeps – People Directory is a WordPress plugin that helps you create and manage a directory of people on your website. Perfect for displaying staff members, team rosters, or employee directories.

Features:

* Custom post type for managing people profiles
* Block templates for single person posts and archive pages
* Configurable phone number formatting
* Custom URL structure for people profiles
* Optional individual profile pages (people can be listed and queried without having a page of their own)

== Installation ==

1. Download the latest release from GitHub
2. Upload the plugin files to the `/wp-content/plugins/peeps-people-directory` directory
3. Activate the plugin through the 'Plugins' screen in WordPress
4. Go to People → Settings to configure the plugin options

== Screenshots ==

1. Example of a person post displayed on the frontend
2. Fields available when editing a person post
3. Available Peeps blocks in the block inserter
4. Peeps – People Directory settings page

== Frequently Asked Questions ==

= How do I change the URL structure for people profiles? =

Go to People → Settings and update the "Directory Slug" field. After saving, visit the WordPress Permalinks page and click "Save Changes" to update your URLs.

= Can I show people without giving each one a page? =

Yes. In People → Settings, turn off "Enable Individual Profile Pages". People can still be listed and queried (Query Loop, taxonomies, modals, REST), but no person has a page of their own: their URLs return 404 for everyone, they are left out of the sitemap and site search, and the Full Name block renders without a link. This is not an access-control feature; it is for sites that want a staff grid without per-person pages, often for SEO reasons.

= How do I format phone numbers? =

Go to People → Settings and update the "Phone Number Format" field. Use # symbols where you want digits to appear. For example: (###) ###-####

== Changelog ==

= 2.5.0 =
* Change: The "Make People Directory Public" setting is now "Enable Individual Profile Pages". It was never an access-control feature: people remain listable and queryable either way, and the setting only decides whether each person has a page of their own. The stored option key is unchanged, so existing sites keep their value.
* Change: When profile pages are off, people are left out of the core sitemap and site search, the Full Name block renders without a link even when "Make a Link" is on, and the "View" row action is hidden on the People list.

= 2.4.0 =
* Change: Updates are now delivered from GitHub releases instead of the WordPress.org directory. The plugin checks GitHub for new versions and offers them on the Plugins screen.

= 2.3.2 =
* Fix: Person pages and the people archive showed a fatal error on the front end in 2.3.0 and 2.3.1. The social links block called a function that does not exist in WordPress.
* Fix: Saving a phone number with fewer than 10 or more than 15 digits stored an error object instead of the number, which then broke the phone block on the front end. Invalid numbers are now rejected in the editor and never stored.
* Fix: The phone and email blocks no longer break the page if a stored value is not text.

= 2.3.1 =
* Fix: The installable plugin zip is attached to the GitHub release again — it was missing from the 2.3.0 release.
* Change: The plugin zip no longer includes uncompiled source files, matching what the WordPress.org build has always excluded.

= 2.3.0 =
* Fixed output escaping on plugin settings action link
* Fixed linkRel attribute sanitization in full-name block
* Fixed editor context detection in social-links block to use wp_is_block_editor()
* Fixed prefix field HTML being stripped on the frontend — bold and italic formatting now renders correctly
* Fixed missing text domain on translatable strings across all blocks
* Fixed duplicate SCSS selector in admin styles
* Upgraded @wordpress/scripts to v32 and migrated to ESLint flat config
* Replaced deprecated render() with createRoot() in admin settings page
* Added GitHub Actions workflow for WordPress.org SVN deployment
* Removed dead job title taxonomy code

= 2.2.2 =
* Added Developer Docs tab to the settings page with reference tables for the post type key, meta keys, available blocks, and settings options
* Fixed phone block displaying empty in the editor when no phone number is set — now shows the configured format as a placeholder

= 2.2.0 =
* Added 9 missing social platform detections: Discord, TikTok, Threads, Patreon, VK, 500px, RSS/Atom feeds, Gravatar, and mailto links
* Full Name block now prevents disabling the last active name part
* Full Name block now shows an editor warning when no name parts are selected
* Fixed email meta validation to trim whitespace before checking validity
* Fixed redundant text alignment class being manually applied in phone and email blocks (now handled automatically by WordPress block supports)
* Fixed brittle email block placeholder check (was comparing against a hardcoded string)
* Centralized default values for phone format, CPT slug, and menu position into a single source of truth
* Consolidated multiple useSelect calls in the editor panel into one
* Removed duplicate constants and utility functions across block files

= 2.1.0 =
* People post type is now always available in the Query Loop block, regardless of the "Make People Directory Public" setting
* Single person profile pages return 404 when the directory is set to private
* Social links block preview now updates immediately when links are added, removed, or reordered without requiring a post save
* Fixed editor sidebar styles not applying correctly in the admin page
* Fixed spacing between fields in the Person Name, Contact Information, and Social Links editor panels
* Fixed TextControl deprecation warnings for WordPress 7 compatibility
* Added phone extension field to the Contact Information panel

= 2.0.0 =
* BREAKING: Updated all prefixes from "wp_peeps" to "ph_peeps" for WordPress Directory compliance
* BREAKING: Post type changed from "wp_peeps_people" to "ph_peeps_people"
* BREAKING: All meta keys changed from "wp_peeps_*" to "ph_peeps_*"
* BREAKING: All option names changed from "wp_peeps_*" to "ph_peeps_*"
* BREAKING: Block names changed from "wp-peeps/*" to "ph-peeps/*"
* Updated plugin name to "Peeps – People Directory"
* Updated namespaces from "WP_Peeps" to "PH_Peeps"
* Updated text domain from "wp-peeps" to "peeps-people-directory"
* Added sanitization callbacks for boolean settings
* Note: Existing posts and settings will need to be migrated or re-entered

= 1.3.1 =
* Updated plugin name from "WP Peeps" to "Peeps" for WordPress Directory compliance

= 1.3.0 =
* Added block template for archive pages
* Archive template includes featured image, name, contact information, and social links

= 1.2.0 =
* Automatic permalink flush on plugin activation
* Automatic permalink flush on plugin deactivation
* Added notice when changing settings that affect permalinks (slug, public status, archive)

= 1.1.0 =
* Added block template registration for single person posts
* Default template includes featured image, full name, contact information, and social links
* Template is customizable through the Site Editor

= 1.0.0 =
* Stable release
* Comprehensive code audit and security improvements
* Fixed XSS vulnerabilities
* Added proper validation and sanitization
* Improved error handling and logging
* Code quality improvements and documentation
* Performance optimizations

= 0.1.1 =
* Disable post title editing

= 0.1.0 =
* Initial release
* People directory custom post type
* Admin settings page
* Phone number formatting
* Required name fields
* Contact information fields