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
	$base_path = dirname( dirname( __FILE__ ) );
	$asset_file = include $base_path . '/build/editor/index.asset.php';

	wp_enqueue_script(
		'wp-peeps-editor',
		plugins_url( 'wp-peeps/build/editor/index.js', $base_path ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_assets' );
