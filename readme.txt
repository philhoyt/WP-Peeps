=== Peeps – People Directory ===
Contributors:      philhoyt
Tags:              directory, people, staff, team, employees
Requires at least: 6.7.2
Requires PHP:      8.0
Tested up to:      7.1
Stable tag:        2.6.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Adds a People post type with name, phone, email and social link fields, plus blocks that display them

== Description ==

Peeps adds a People post type for staff pages, team rosters and similar directories. Each person has first, middle and last name fields, a phone number with extension, an email address, a list of social links and a featured image. The post title is filled in from the name fields.

The plugin ships four blocks that read those fields: Full Name, Phone Number, Email Address and Social Links. They work inside the single person template, the people archive template and Query Loop blocks. Both templates are registered by the plugin and can be edited in the Site Editor.

Settings (People > Settings):

* Directory slug for person URLs (default `people`).
* Phone number format, written with `#` for each digit (default `(###) ###-####`).
* Whether the people archive page exists.
* Whether each person has a profile page of their own.
* Position of the People menu in the admin sidebar.

The settings page also has a Developer Docs tab listing the post type key, meta keys, block names and option keys.

Updates are delivered from GitHub releases. The plugin is not listed on WordPress.org.

== Installation ==

1. Download `peeps-people-directory.zip` from the latest GitHub release.
2. In the WordPress admin, go to Plugins > Add New Plugin > Upload Plugin and choose the zip.
3. Activate the plugin.
4. Go to People > Settings to change the slug, phone format or archive options.

== Screenshots ==

1. A person post on the front end.
2. The name, contact and social link fields in the editor sidebar.
3. The Peeps blocks in the block inserter.
4. The settings page.
5. The Developer Docs tab with the post type key, meta keys, blocks and options.

== Frequently Asked Questions ==

= How do I change the URL of person pages? =

Go to People > Settings and change the Directory Slug. After saving, open Settings > Permalinks and click Save Changes so the new URLs take effect; the settings page shows a reminder with a link.

= Can I list people without giving each one a page? =

Yes. In People > Settings, turn off "Enable Individual Profile Pages". People can still be listed and queried (Query Loop, REST API), but no person has a page of their own: their URLs return 404, they are left out of the core sitemap and site search, and the Full Name block renders without a link. This is not access control; the data is still readable over the REST API.

= How do phone numbers work? =

A phone number must contain 10 to 15 digits; the editor rejects anything else and nothing invalid is stored. The digits are stored on their own and formatted for display using the Phone Number Format setting. Write the format with one `#` per digit, for example `(###) ###-####` or `+## ### ### ####`.

= Which social networks does the Social Links block recognise? =

The block picks an icon by matching the URL against 47 patterns: the networks the core Social Icons block covers, plus Discord, TikTok, Threads, Patreon, VK, 500px, Gravatar, RSS and Atom feed URLs, and `mailto:` links.

= What happens when I delete the plugin? =

Deleting the plugin removes its five settings. People posts and their fields are kept.

== Changelog ==

= 2.6.0 =
* Added translation loading for the editor sidebar and the settings page, with a `languages/peeps-people-directory.pot` template.
* Made the "Phone:" and "Email:" labels in the default single person template translatable.
* Deleting the plugin now removes its five settings. People and their details are kept.
* Tested with WordPress 7.1.

= 2.5.1 =
* Fixed the Social Links block keeping both the Default and Logos Only style classes when Logos Only was selected, and merging a custom class with the style class into one name.
* Fixed the Social Links block reading the wrong person inside Query Loop patterns that set a post explicitly. It now reads the post from block context like the other blocks.
* Fixed the Full Name, Phone and Email blocks accepting HTML tags their toolbar does not offer.
* Block rendering is now loaded once at startup instead of through overlapping registration paths.

= 2.5.0 =
* Renamed the "Make People Directory Public" setting to "Enable Individual Profile Pages". It was never access control: people stay listable and queryable either way, and the setting only decides whether each person has a page of their own. The stored option key is unchanged.
* When profile pages are off, people are now left out of the core sitemap and site search, the Full Name block renders without a link even when "Make a Link" is on, and the "View" row action is hidden on the People list.
* Raised the minimum WordPress version to 6.7.2. Versions 6.7.0 and 6.7.1 could not register the plugin's single and archive templates.

= 2.4.0 =
* Updates are now delivered from GitHub releases instead of the WordPress.org directory. The plugin checks GitHub for new versions and offers them on the Plugins screen.

= 2.3.2 =
* Fixed a fatal error on person pages and the people archive in 2.3.0 and 2.3.1. The Social Links block called a function that does not exist in WordPress.
* Fixed phone numbers with fewer than 10 or more than 15 digits being stored as an error object, which broke the Phone block on the front end. Invalid numbers are now rejected in the editor and never stored.
* Fixed the Phone and Email blocks breaking the page when a stored value is not text.

= 2.3.1 =
* Fixed the plugin zip missing from the 2.3.0 GitHub release.
* Removed uncompiled source files from the plugin zip, matching what the WordPress.org build excluded.

= 2.3.0 =
* Fixed output escaping on the plugin settings action link.
* Fixed `linkRel` attribute sanitization in the Full Name block.
* Fixed editor context detection in the Social Links block to use `wp_is_block_editor()`.
* Fixed prefix field HTML being stripped on the front end; bold and italic now render.
* Fixed missing text domain on translatable strings in the blocks.
* Fixed a duplicate SCSS selector in the admin styles.
* Upgraded `@wordpress/scripts` to v32 and moved to the ESLint flat config.
* Replaced the deprecated `render()` with `createRoot()` on the settings page.
* Added a GitHub Actions workflow for WordPress.org SVN deployment.
* Removed dead job title taxonomy code.

= 2.2.2 =
* Added a Developer Docs tab to the settings page with the post type key, meta keys, block names and option keys.
* Fixed the Phone block showing nothing in the editor when no number is set; it now shows the configured format as a placeholder.

= 2.2.0 =
* Added icon detection for Discord, TikTok, Threads, Patreon, VK, 500px, RSS and Atom feeds, Gravatar and `mailto:` links.
* The Full Name block keeps at least one name part enabled and warns in the editor when none is selected.
* Fixed email validation to trim whitespace before checking the address.
* Removed a text alignment class that the Phone and Email blocks applied by hand; block supports handle it.
* Fixed the Email block placeholder check comparing against a hardcoded string.
* Moved the default phone format, slug and menu position into one place.
* Merged several `useSelect` calls in the editor panel into one.
* Removed duplicate constants and helpers across block files.

= 2.1.0 =
* The People post type is now always available in the Query Loop block, regardless of the public setting.
* Single person pages return 404 when the directory is set to private.
* The Social Links block preview now updates when links are added, removed or reordered, without saving the post.
* Fixed editor sidebar styles not applying on the settings page.
* Fixed spacing between fields in the Person Name, Contact Information and Social Links panels.
* Fixed `TextControl` deprecation warnings for WordPress 7.
* Added a phone extension field to the Contact Information panel.

= 2.0.0 =
* BREAKING: Changed all prefixes from `wp_peeps` to `ph_peeps` for WordPress directory compliance.
* BREAKING: Post type changed from `wp_peeps_people` to `ph_peeps_people`.
* BREAKING: Meta keys changed from `wp_peeps_*` to `ph_peeps_*`.
* BREAKING: Option names changed from `wp_peeps_*` to `ph_peeps_*`.
* BREAKING: Block names changed from `wp-peeps/*` to `ph-peeps/*`.
* Renamed the plugin to "Peeps – People Directory".
* Changed the PHP namespace from `WP_Peeps` to `PH_Peeps`.
* Changed the text domain from `wp-peeps` to `peeps-people-directory`.
* Added sanitization callbacks for boolean settings.
* Existing posts and settings need to be migrated or re-entered.

= 1.3.1 =
* Renamed the plugin from "WP Peeps" to "Peeps" for WordPress directory compliance.

= 1.3.0 =
* Added a block template for the people archive with featured image, name, contact information and social links.

= 1.2.0 =
* Flush rewrite rules on activation and deactivation.
* Added a notice when a setting that affects permalinks changes (slug, public status, archive).

= 1.1.0 =
* Added a block template for single person posts with featured image, full name, contact information and social links. The template can be edited in the Site Editor.

= 1.0.0 =
* Stable release.
* Fixed XSS issues found in a code audit.
* Added validation and sanitization for inputs.
* Improved error handling and logging.
* Reduced database queries.

= 0.1.1 =
* Disabled post title editing; the title comes from the name fields.

= 0.1.0 =
* Initial release with the People post type, settings page, phone number formatting, required name fields and contact fields.
