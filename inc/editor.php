<?php
/**
 * Editor functionality
 *
 * @package PH_Peeps
 */

namespace PH_Peeps\Inc;

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

	// Check the current post type.
	$current_post_type = get_current_screen()->post_type;
	if ( $current_post_type !== 'ph_peeps_people' ) {
		return; // Bail out if not editing the `ph_peeps_people` post type.
	}

	$asset_file = include PH_PEEPS_PLUGIN_DIR . 'build/editor/index.asset.php';

	// Enqueue the editor JavaScript.
	wp_enqueue_script(
		'ph-peeps-editor',
		plugins_url( 'build/editor/index.js', PH_PEEPS_PLUGIN_FILE ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// This is for styling INSIDE the editor content area.
	add_theme_support( 'editor-styles' );
	add_editor_style( plugins_url( 'build/editor/style-index.css', PH_PEEPS_PLUGIN_FILE ) );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_assets' );
