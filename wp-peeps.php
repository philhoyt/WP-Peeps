<?php
/**
 * Plugin Name:       WP Peeps
 * Description:       A directory of people for your WordPress site.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            Phil Hoyt
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-peeps
 *
 * @package WP_Peeps
 *
 * This plugin provides a customizable people directory for WordPress sites.
 *
 * Features:
 * - Custom post type for people entries
 * - Block editor support with custom blocks
 * - Phone number formatting with customizable format
 * - Email validation and linking
 * - Automatic name-based title generation
 * - Public/private directory option
 * - Customizable URL structure
 *
 * Usage:
 * 1. Add people entries in the WordPress admin
 * 2. Use the provided blocks to display contact information
 * 3. Configure settings under Settings > WP Peeps
 *
 * For developers:
 * - Uses WordPress coding standards
 * - Follows modern WordPress development practices
 * - Extensible through filters and actions
 * - Built with performance and security in mind
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Plugin constants.
define( 'WP_PEEPS_PLUGIN_FILE', __FILE__ );
define( 'WP_PEEPS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'WP_PEEPS_VERSION', '0.1.0' );

// Core includes.
require_once plugin_dir_path( __FILE__ ) . 'inc/cpt.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/meta.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/editor.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/admin.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/settings.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/activation.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/notices.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/blocks.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/formatting.php';

// Block render callbacks.
require_once __DIR__ . '/src/blocks/full-name/render.php';
require_once __DIR__ . '/src/blocks/phone/render.php';
