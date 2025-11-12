<?php
/**
 * Block registration and related functionality
 *
 * @package WP_Peeps
 */

namespace WP_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Initialize blocks
 *
 * Register block types and any related functionality.
 *
 * @return void
 */
function register_blocks() {
	// Register the full name block.
	register_block_type(
		WP_PEEPS_PLUGIN_DIR . 'build/blocks/full-name',
		array(
			'render_callback' => 'WP_Peeps\Blocks\wp_peeps_render_full_name_block',
		)
	);

	// Register the phone block.
	register_block_type(
		WP_PEEPS_PLUGIN_DIR . 'build/blocks/phone',
		array(
			'render_callback' => 'WP_Peeps\Blocks\wp_peeps_render_phone_block',
		)
	);

	// Register the social links block.
	register_block_type(
		WP_PEEPS_PLUGIN_DIR . 'build/blocks/social-links',
		array(
			'render_callback' => 'WP_Peeps\Blocks\wp_peeps_render_social_links_block',
		)
	);

	// Register the email block.
	register_block_type(
		WP_PEEPS_PLUGIN_DIR . 'build/blocks/email',
		array(
			'render_callback' => 'WP_Peeps\Blocks\wp_peeps_render_email_block',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_blocks' );