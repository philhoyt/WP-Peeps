<?php
/**
 * Plugin Name:       WP Peeps
 * Plugin URI:        https://github.com/philhoyt/WP-Peeps
 * Description:       A directory of people for your WordPress site.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.1
 * Author:            Phil Hoyt
 * Author URI:        https://philhoyt.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-peeps
 *
 * @package WP-Peeps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// At the top of the file, after the ABSPATH check.
define( 'WP_PEEPS_PLUGIN_FILE', __FILE__ );
define( 'WP_PEEPS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

// Core includes.
require_once plugin_dir_path( __FILE__ ) . 'inc/cpt.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/meta.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/editor.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/admin.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/settings.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/activation.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/notices.php';
require_once plugin_dir_path( __FILE__ ) . 'inc/blocks.php';

// Block render callbacks.
require_once __DIR__ . '/src/blocks/full-name/render.php';
require_once __DIR__ . '/src/blocks/phone/render.php';
require_once __DIR__ . '/src/blocks/social-links/render.php';
require_once __DIR__ . '/src/blocks/email/render.php';
