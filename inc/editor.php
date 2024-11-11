<?php
/**
 * Enqueue editor assets
 */
function wp_peeps_enqueue_editor_assets() {
	$asset_file = include plugin_dir_path( dirname( __DIR__ ) ) . '/wp-peeps/build/editor/index.asset.php';

	wp_enqueue_script(
		'wp-peeps-editor',
		plugins_url( 'wp-peeps/build/editor/index.js', dirname( __DIR__ ) ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'wp_peeps_enqueue_editor_assets' );
