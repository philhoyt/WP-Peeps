<?php
/**
 * Admin functionality
 *
 * @package WP_Peeps
 */

/**
 * Register the admin page
 */
function register_admin_page() {
	add_submenu_page(
		'edit.php?post_type=people',
		__('WP Peeps Settings', 'wp-peeps'),
		__('Settings', 'wp-peeps'),
		'manage_options',
		'wp-peeps-settings',
		'render_admin_page'
	);
}
add_action('admin_menu', 'register_admin_page');

/**
 * Render the admin page
 */
function render_admin_page() {
	echo '<div id="wp-peeps-settings-root"></div>';
}

/**
 * Enqueue admin scripts
 *
 * @param string $hook The current admin page.
 */
function enqueue_admin_scripts( $hook ) {
	if ( 'people_page_wp-peeps-settings' !== $hook ) {
		return;
	}

	$asset_file = include plugin_dir_path( dirname( __FILE__ ) ) . 'build/admin/index.asset.php';

	// Add wp-components styles
	wp_enqueue_style(
		'wp-components'
	);

	wp_enqueue_script(
		'wp-peeps-admin',
		plugins_url( 'build/admin/index.js', dirname( __FILE__ ) ),
		array_merge(
			$asset_file['dependencies'],
			['wp-components', 'wp-element', 'wp-data', 'wp-core-data', 'wp-api-fetch']
		),
		$asset_file['version'],
		true
	);
}
add_action( 'admin_enqueue_scripts', 'enqueue_admin_scripts' ); 