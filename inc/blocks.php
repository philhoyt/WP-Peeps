<?php
/**
 * Block registration and related functionality
 *
 * @package PH_Peeps
 */

namespace PH_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register block category
 *
 * Registers the "People Directory" block category.
 *
 * @param array                   $categories Array of block categories.
 * @param WP_Block_Editor_Context $block_editor_context The current block editor context.
 * @return array Modified array of block categories.
 */
function register_block_category( $categories, $block_editor_context ) {
	// Check if category already exists.
	$category_exists = false;
	foreach ( $categories as $category ) {
		if ( isset( $category['slug'] ) && 'peeps-people-directory' === $category['slug'] ) {
			$category_exists = true;
			break;
		}
	}

	// Add category if it doesn't exist.
	if ( ! $category_exists ) {
		$categories = array_merge(
			array(
				array(
					'slug'  => 'peeps-people-directory',
					'title' => __( 'WP Peeps', 'peeps-people-directory' ),
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
 * Registers each block from its build/blocks/<name>/block.json. The
 * "render": "file:./render.php" entry there is the only render wiring: core
 * requires that template on every render of the block, and the template
 * echoes the output of its render function from inc/block-render.php. No
 * render_callback is passed here, so the file-based entry is never overridden,
 * and the templates declare nothing, so requiring one repeatedly cannot fatal.
 *
 * @return void
 */
function register_blocks() {
	$blocks = array( 'full-name', 'phone', 'social-links', 'email' );

	foreach ( $blocks as $block ) {
		register_block_type( PH_PEEPS_PLUGIN_DIR . 'build/blocks/' . $block );
	}
}
add_action( 'init', __NAMESPACE__ . '\register_blocks' );
