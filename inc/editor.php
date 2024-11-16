<?php
/**
 * Editor functionality
 *
 * @package WP_Peeps
 */

namespace WP_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue editor assets
 *
 * @return void
 */
function enqueue_editor_assets() {
	// Check the current post type
	$current_post_type = get_current_screen()->post_type;
	if ( $current_post_type !== 'wp_peeps_people' ) {
		return; // Bail out if not editing the `wp_peeps_people` post type
	}

	$base_path  = dirname( __DIR__ );
	$asset_file = include $base_path . '/build/editor/index.asset.php';

	// Enqueue the editor JavaScript
	wp_enqueue_script(
		'wp-peeps-editor',
		plugins_url( 'wp-peeps/build/editor/index.js', $base_path ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// Enqueue the editor-specific styles
	wp_enqueue_style(
		'wp-peeps-editor',
		plugins_url( 'wp-peeps/build/editor/style-index.css', $base_path ),
		array(),
		$asset_file['version']
	);
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_assets' );
