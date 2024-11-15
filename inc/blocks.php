<?php
/**
 * Block registration and related functionality
 *
 * @package WP_Peeps
 */

/**
 * Initialize blocks
 *
 * Register block types and any related functionality.
 *
 * @return void
 */
add_action( 'init', 'wp_peeps_init' );
function wp_peeps_init() {
	// Register the full name block.
	register_block_type(
		WP_PEEPS_PLUGIN_DIR . 'build/blocks/full-name',
		array(
			'render_callback' => 'wp_peeps_render_full_name_block',
		)
	);

	// Register the phone block.
	register_block_type(
		WP_PEEPS_PLUGIN_DIR . 'build/blocks/phone',
		array(
			'render_callback' => 'wp_peeps_render_phone_block',
		)
	);

	// Register the social links block.
	register_block_type(
		WP_PEEPS_PLUGIN_DIR . 'build/blocks/social-links',
		array(
			'render_callback' => 'wp_peeps_render_social_links_block',
		)
	);
}
