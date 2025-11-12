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
 * Register block category
 *
 * Registers the "People Directory" block category.
 *
 * @param array    $categories Array of block categories.
 * @param WP_Block_Editor_Context $block_editor_context The current block editor context.
 * @return array Modified array of block categories.
 */
function register_block_category( $categories, $block_editor_context ) {
	// Check if category already exists.
	$category_exists = false;
	foreach ( $categories as $category ) {
		if ( isset( $category['slug'] ) && 'wp-peeps' === $category['slug'] ) {
			$category_exists = true;
			break;
		}
	}

	// Add category if it doesn't exist.
	if ( ! $category_exists ) {
		$categories = array_merge(
			array(
				array(
					'slug'  => 'wp-peeps',
					'title' => __( 'WP Peeps', 'wp-peeps' ),
					'icon'  => 'groups',
				),
			),
			$categories
		);
	}

	return $categories;
}
add_filter( 'block_categories_all', __NAMESPACE__ . '\register_block_category', 10, 2 );

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