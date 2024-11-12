<?php
/**
 * Admin functionality
 *
 * @package WP_Peeps
 */

namespace WP_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the admin page
 *
 * @return void
 */
function register_admin_page() {
	add_submenu_page(
		'edit.php?post_type=people',
		__( 'WP Peeps Settings', 'wp-peeps' ),
		__( 'Settings', 'wp-peeps' ),
		'manage_options',
		'wp-peeps-settings',
		__NAMESPACE__ . '\render_admin_page'
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\register_admin_page' );

/**
 * Render the admin page
 *
 * @return void
 */
function render_admin_page() {
	echo '<div id="wp-peeps-settings-root"></div>';
}

/**
 * Enqueue admin scripts
 *
 * @param string $hook The current admin page.
 * @return void
 */
function enqueue_admin_scripts( $hook ) {
	if ( 'people_page_wp-peeps-settings' !== $hook ) {
		return;
	}

	$asset_file = include plugin_dir_path( dirname( __FILE__ ) ) . 'build/admin/index.asset.php';

	wp_enqueue_style(
		'wp-peeps-admin',
		plugins_url( 'build/style-admin.css', dirname( __FILE__ ) ),
		[ 'wp-components' ],
		$asset_file['version']
	);

	wp_enqueue_script(
		'wp-peeps-admin',
		plugins_url( 'build/admin/index.js', dirname( __FILE__ ) ),
		array_merge(
			$asset_file['dependencies'],
			[ 'wp-components', 'wp-element', 'wp-data', 'wp-core-data', 'wp-api-fetch' ]
		),
		$asset_file['version'],
		true
	);
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_admin_scripts' ); 
