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
	// Check if user can edit posts.
	if ( ! current_user_can( 'edit_posts' ) ) {
		return;
	}

	// Check the current post type
	$current_post_type = get_current_screen()->post_type;
	if ( $current_post_type !== 'wp_peeps_people' ) {
		return; // Bail out if not editing the `wp_peeps_people` post type
	}

	$base_path  = dirname( __DIR__ );
	$asset_file = include $base_path . '/build/editor/index.asset.php';

	// Enqueue the editor JavaScript.
	wp_enqueue_script(
		'wp-peeps-editor',
		plugins_url( 'wp-peeps/build/editor/index.js', $base_path ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// This is for UI elements OUTSIDE the content area
	// wp_enqueue_style(
	// 	'wp-peeps-editor-ui',
	// 	plugins_url( 'wp-peeps/build/editor/style-index.css', $base_path ),
	// 	array(),
	// 	$asset_file['version']
	// );
	
	// This is for styling INSIDE the editor content area.
	add_theme_support( 'editor-styles' );
	add_editor_style( plugins_url( 'wp-peeps/build/editor/style-index.css', $base_path ) );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_assets' );
