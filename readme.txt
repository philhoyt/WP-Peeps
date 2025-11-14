=== WP Peeps ===
Contributors:      Phil Hoyt
Tags:              directory, people, staff, team, employees
Tested up to:      6.9
Stable tag:        1.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A WordPress plugin for managing and displaying people profiles.

== Description ==

WP Peeps is a WordPress plugin that helps you create and manage a directory of people on your website. Perfect for displaying staff members, team rosters, or employee directories.

Features:

* Custom post type for managing people profiles
* Block template for single person posts
* Configurable phone number formatting
* Custom URL structure for people profiles
* Public/private directory option

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/wp-peeps` directory
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Go to People → Settings to configure the plugin options

== Frequently Asked Questions ==

= How do I change the URL structure for people profiles? =

Go to People → Settings and update the "Directory Slug" field. After saving, visit the WordPress Permalinks page and click "Save Changes" to update your URLs.

= Can I make the directory private? =

Yes, in People → Settings you can disable the "Make People Directory Public" option to make the directory visible only to logged-in users.

= How do I format phone numbers? =

Go to People → Settings and update the "Phone Number Format" field. Use # symbols where you want digits to appear. For example: (###) ###-####

== Changelog ==

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