<?php
/**
 * Enqueue editor assets
 */
function wp_peeps_enqueue_editor_assets() {
	wp_enqueue_script(
		'wp-peeps-editor',
		plugins_url('build/editor/index.js', dirname(__FILE__)),
		array('wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data')
	);
}
add_action( 'enqueue_block_editor_assets', 'wp_peeps_enqueue_editor_assets' );
