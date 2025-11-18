=== Peeps ===
Contributors:      Phil Hoyt
Tags:              directory, people, staff, team, employees
Tested up to:      6.9
Stable tag:        1.3.1
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A WordPress plugin for managing and displaying people profiles.

== Description ==

Peeps is a WordPress plugin that helps you create and manage a directory of people on your website. Perfect for displaying staff members, team rosters, or employee directories.

Features:

* Custom post type for managing people profiles
* Block templates for single person posts and archive pages
* Configurable phone number formatting
* Custom URL structure for people profiles
* Public/private directory option

== Installation ==

1. Download the latest release from GitHub
2. Upload the plugin files to the `/wp-content/plugins/wp-peeps` directory
3. Activate the plugin through the 'Plugins' screen in WordPress
4. Go to People → Settings to configure the plugin options

== Screenshots ==

1. Example of a person post displayed on the frontend
2. Fields available when editing a person post
3. Available Peeps blocks in the block inserter
4. Peeps settings page

== Frequently Asked Questions ==

= How do I change the URL structure for people profiles? =

Go to People → Settings and update the "Directory Slug" field. After saving, visit the WordPress Permalinks page and click "Save Changes" to update your URLs.

= Can I make the directory private? =

Yes, in People → Settings you can disable the "Make People Directory Public" option to make the directory visible only to logged-in users.

= How do I format phone numbers? =

Go to People → Settings and update the "Phone Number Format" field. Use # symbols where you want digits to appear. For example: (###) ###-####

== Changelog ==

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