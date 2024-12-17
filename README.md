# WP Peeps

A WordPress plugin for managing and displaying people profiles.

## Description

WP Peeps is a WordPress plugin that helps you create and manage a directory of people on your website. Perfect for displaying leadership, team rosters, or employee directories.

### Requirements

-   WordPress 6.6 or higher
-   PHP 7.2 or higher

### Features

-   Custom post type for managing people profiles
-   Configurable phone number formatting
-   Custom URL structure for people profiles
-   Public/private directory option
-   Full Name block
-   Phone Number block
-   Email Address block
-   Social Links block

## Installation

1. Upload the plugin files to the `/wp-content/plugins/wp-peeps` directory
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Go to People → Settings to configure the plugin options

## Beta Testing

This plugin is currently in beta. To help test:

1. Download the latest beta release from GitHub
2. Install and activate the plugin
3. Report any issues on the GitHub repository
4. Note: This is a pre-release version, not recommended for production sites

## Development

-   `npm install` - Installs dependencies

#### Available Scripts

-   `npm start` - Starts the development build process with hot reloading
-   `npm run build` - Creates a production build
-   `npm run format` - Formats JavaScript files using Prettier
-   `npm run lint:css` - Lints CSS/SCSS files
-   `npm run lint:js` - Lints JavaScript files
-   `npm run plugin-zip` - Creates a distributable plugin zip file

#### Testing

To generate test data for development:

```bash
wp eval-file wp-content/plugins/wp-peeps/bin/generate-test-data.php 20
```

This will create 20 test people profiles in your WordPress installation.

## Changelog

### 0.1.0-beta.3

-   Fixed issue with social links styling
-   Adjust phone number formatting to all betwen 10 and 15 digits
-   Added toggle to disable archive view
-   Added settings for menu position

### 0.1.0-beta.2

-   Removed Job Title field
-   Improved editor experience
-   Added inline editing for prefixing phone and email
-   Improved social links functionality
-   Full Name, Email, and Phone now display data in query loop editor
-   Various code cleanup and optimizations

### 0.1.0-beta.1

-   Initial beta release
-   Added Full Name block
-   Added Phone Number block
-   Added Email Address block
-   Added Social Links block
-   Custom phone number formatting

### 0.1.0

-   Initial release
-   People directory custom post type
-   Admin settings page
-   Phone number formatting
-   Required name fields
-   Contact information fields

## Credits

Contributors: Phil Hoyt
Tags: directory, people, staff, team, employees
Tested up to: 6.7
Stable tag: 0.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
