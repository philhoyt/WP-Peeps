<?php
/**
 * Register block templates for the plugin
 *
 * @package WP_Peeps
 */

namespace WP_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register block templates for WP Peeps
 *
 * @return void
 */
function register_block_templates() {
	// Check if register_block_template function exists (WordPress 6.7+).
	if ( ! function_exists( 'register_block_template' ) ) {
		return;
	}

	// Register single person template.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
	register_block_template(
		'wp-peeps//single-wp_peeps_people',
		array(
			'title'       => __( 'Single Person', 'wp-peeps' ),
			'description' => __( 'Default template for displaying a single person profile.', 'wp-peeps' ),
			'content'     => '
				<!-- wp:template-part {"slug":"header","tagName":"header","area":"header"} /-->
				
				<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
				<main class="wp-block-group"><!-- wp:post-featured-image {"aspectRatio":"1"} /-->
				
				<!-- wp:group {"layout":{"type":"constrained"}} -->
				<div class="wp-block-group"><!-- wp:group {"layout":{"type":"constrained"}} -->
				<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
				<div class="wp-block-group"><!-- wp:wp-peeps/full-name {"tagName":"h1","className":"wp-block-wp-peeps-full-name"} /--></div>
				<!-- /wp:group -->
				
				<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
				<div class="wp-block-group"><!-- wp:wp-peeps/phone {"makeLink":true,"prefix":"<strong>Phone:</strong> "} /-->
				
				<!-- wp:wp-peeps/email {"makeLink":true,"prefix":"<strong>Email:</strong> "} /--></div>
				<!-- /wp:group -->
				
				<!-- wp:wp-peeps/social-links {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"className":"is-style-default","openInNewTab":true,"layout":{"type":"flex","orientation":"horizontal","verticalAlignment":"center","justifyContent":"left"}} /-->
				
				<!-- wp:spacer {"height":"var:preset|spacing|30"} -->
				<div style="height:var(--wp--preset--spacing--30)" aria-hidden="true" class="wp-block-spacer"></div>
				<!-- /wp:spacer --></div>
				<!-- /wp:group --></div>
				<!-- /wp:group -->
				
				<!-- wp:post-content {"align":"full","layout":{"type":"constrained"}} /--></main>
				<!-- /wp:group -->
				
				<!-- wp:template-part {"slug":"footer","tagName":"footer","area":"footer"} /-->',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_templates' );

/**
 * Filter block template ID to ensure correct template matching
 *
 * This ensures that the template registered as 'single-wp_peeps_people'
 * is correctly matched to the 'wp_peeps_people' post type in the template hierarchy.
 *
 * @param string $template_id The template ID.
 * @param string $template_type The template type (e.g., 'single').
 * @param string $post_type The post type.
 * @return string The filtered template ID.
 */
function filter_block_template_id( $template_id, $template_type, $post_type ) {
	// Ensure our template is matched for the wp_peeps_people post type.
	if ( 'single' === $template_type && 'wp_peeps_people' === $post_type ) {
		$template_id_to_check = 'wp-peeps//single-wp_peeps_people';
		// Check if the registry class exists (WordPress 6.7+).
		if ( class_exists( 'WP_Block_Templates_Registry' ) ) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedClassFound
			$registry = \WP_Block_Templates_Registry::get_instance();
			if ( $registry->get_registered( $template_id_to_check ) ) {
				return $template_id_to_check;
			}
		}
	}
	return $template_id;
}
add_filter( 'get_block_template_id', __NAMESPACE__ . '\filter_block_template_id', 10, 3 );
