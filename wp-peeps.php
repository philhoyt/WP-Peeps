<?php
/**
 * Plugin Name:       WP-Peeps
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            Phil Hoyt
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-peeps
 *
 * @package WP-Peeps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function create_block_wp_peeps_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_wp_peeps_block_init' );

// Include custom post type registration.
require_once plugin_dir_path( __FILE__ ) . 'inc/cpt.php';

// Include meta field registration.
require_once plugin_dir_path( __FILE__ ) . 'inc/meta.php';

// Include editor registration.
require_once plugin_dir_path( __FILE__ ) . 'inc/editor.php';

// Include admin registration.
require_once plugin_dir_path( __FILE__ ) . 'inc/admin.php';

// Include settings registration.
require_once plugin_dir_path( __FILE__ ) . 'inc/settings.php';
