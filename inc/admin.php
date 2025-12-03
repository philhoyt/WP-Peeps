<?php
/**
 * Admin functionality
 *
 * @package PH_Peeps
 */

namespace PH_Peeps\Inc;

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
		'edit.php?post_type=ph_peeps_people',
		__( 'WP Peeps Settings', 'peeps-people-directory' ),
		__( 'Settings', 'peeps-people-directory' ),
		'manage_options',
		'ph-peeps-settings',
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
	echo '<div id="ph-peeps-settings-root"></div>';
}

/**
 * Enqueue admin scripts
 *
 * @param string $hook The current admin page.
 * @return void
 */
function enqueue_admin_scripts( $hook ) {
	if ( 'ph_peeps_people_page_ph-peeps-settings' !== $hook ) {
		return;
	}

	$asset_file = include PH_PEEPS_PLUGIN_DIR . 'build/admin/index.asset.php';

	wp_enqueue_style(
		'ph-peeps-admin',
		plugins_url( 'build/admin/style-index.css', PH_PEEPS_PLUGIN_FILE ),
		array( 'wp-components' ),
		$asset_file['version']
	);

	wp_enqueue_script(
		'ph-peeps-admin',
		plugins_url( 'build/admin/index.js', PH_PEEPS_PLUGIN_FILE ),
		array_merge(
			$asset_file['dependencies'],
			array( 'wp-components', 'wp-element', 'wp-data', 'wp-core-data', 'wp-api-fetch' )
		),
		$asset_file['version'],
		true
	);
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_admin_scripts' );
