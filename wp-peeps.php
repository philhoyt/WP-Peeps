<?php
/**
 * Plugin Name:       WP Peeps
 * Plugin URI:        https://github.com/philhoyt/WP-Peeps
 * Description:       A directory of people for your WordPress site.
 * Requires at least: 6.6
 * Requires PHP:      8.0
 * Version:           1.0.0
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
define( 'WP_PEEPS_PLUGIN_DIR', __DIR__ . '/' );

// Core includes.
require_once __DIR__ . '/inc/cpt.php';
require_once __DIR__ . '/inc/meta.php';
require_once __DIR__ . '/inc/editor.php';
require_once __DIR__ . '/inc/admin.php';
require_once __DIR__ . '/inc/settings.php';
require_once __DIR__ . '/inc/activation.php';
require_once __DIR__ . '/inc/notices.php';
require_once __DIR__ . '/inc/blocks.php';

// Block render callbacks.
require_once __DIR__ . '/build/blocks/full-name/render.php';
require_once __DIR__ . '/build/blocks/phone/render.php';
require_once __DIR__ . '/build/blocks/social-links/render.php';
require_once __DIR__ . '/build/blocks/email/render.php';
