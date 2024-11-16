# WP Peeps

A WordPress plugin for managing and displaying people profiles.

![WordPress Plugin: Required WP Version](https://img.shields.io/wordpress/plugin/wp-version/wp-peeps)
![License](https://img.shields.io/badge/license-GPL--2.0%2B-blue)

## Description

WP Peeps is a WordPress plugin that helps you create and manage a directory of people on your website. Perfect for displaying staff members, team rosters, or employee directories.

### Features

- Custom post type for managing people profiles
- Configurable phone number formatting
- Custom URL structure for people profiles
- Public/private directory option

## Installation

1. Upload the plugin files to the `/wp-content/plugins/wp-peeps` directory
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Go to People → Settings to configure the plugin options

## Frequently Asked Questions

### How do I change the URL structure for people profiles?

Go to People → Settings and update the "Directory Slug" field. After saving, visit the WordPress Permalinks page and click "Save Changes" to update your URLs.

### Can I make the directory private?

Yes, in People → Settings you can disable the "Make People Directory Public" option to make the directory visible only to logged-in users.

### How do I format phone numbers?

Go to People → Settings and update the "Phone Number Format" field. Use # symbols where you want digits to appear. For example: (###) ###-####

## Development

### Generate Test Data

To generate test people profiles with random data:

```bash
# Generate 20 test profiles
wp eval-file wp-content/plugins/wp-peeps/bin/generate-test-data.php 20

# Or specify a different number
wp eval-file wp-content/plugins/wp-peeps/bin/generate-test-data.php 5
```

This will create test profiles with:

- Random first, middle, and last names
- Generated email addresses
- Random phone numbers
- Random job titles
- 2-4 random social media links
- Gender-appropriate avatars based on the person's name

## Changelog

### 0.1.0

- Initial release
- People directory custom post type
- Admin settings page
- Phone number formatting
- Required name fields
- Contact information fields

## Credits

Contributors: Phil Hoyt
Tags: directory, people, staff, team, employees
Tested up to: 6.7
Stable tag: 0.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
