<?php
/**
 * Register block templates for the plugin
 *
 * @package PH_Peeps
 */

namespace PH_Peeps\Inc;

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
		'ph-peeps//single-ph_peeps_people',
		array(
			'title'       => __( 'Single Person', 'ph-peeps' ),
			'description' => __( 'Default template for displaying a single person profile.', 'ph-peeps' ),
			'content'     => '
				<!-- wp:template-part {"slug":"header","tagName":"header","area":"header"} /-->
				
				<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
				<main class="wp-block-group"><!-- wp:post-featured-image {"aspectRatio":"1"} /-->
				
				<!-- wp:group {"layout":{"type":"constrained"}} -->
				<div class="wp-block-group"><!-- wp:group {"layout":{"type":"constrained"}} -->
				<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
				<div class="wp-block-group"><!-- wp:ph-peeps/full-name {"tagName":"h1","className":"wp-block-ph-peeps-full-name"} /--></div>
				<!-- /wp:group -->
				
				<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
				<div class="wp-block-group"><!-- wp:ph-peeps/phone {"makeLink":true,"prefix":"<strong>Phone:</strong> "} /-->
				
				<!-- wp:ph-peeps/email {"makeLink":true,"prefix":"<strong>Email:</strong> "} /--></div>
				<!-- /wp:group -->
				
				<!-- wp:ph-peeps/social-links {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"className":"is-style-default","openInNewTab":true,"layout":{"type":"flex","orientation":"horizontal","verticalAlignment":"center","justifyContent":"left"}} /-->
				
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

	// Register archive template.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
	register_block_template(
		'ph-peeps//archive-ph_peeps_people',
		array(
			'title'       => __( 'People Archive', 'ph-peeps' ),
			'description' => __( 'Default template for displaying the people archive page.', 'ph-peeps' ),
			'content'     => '
				<!-- wp:template-part {"slug":"header","tagName":"header","area":"header"} /-->
				
				<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
				<main class="wp-block-group"><!-- wp:query-title {"type":"archive","align":"wide"} /-->
				
				<!-- wp:query {"queryId":0,"query":{"perPage":12,"pages":0,"offset":0,"postType":"ph_peeps_people","order":"asc","orderBy":"title","author":"","search":"","exclude":[],"sticky":"","inherit":true},"align":"wide","layout":{"type":"constrained"}} -->
				<div class="wp-block-query alignwide"><!-- wp:post-template {"align":"wide","layout":{"type":"grid","columnCount":3}} -->
				<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"}},"border":{"width":"1px","style":"solid","radius":"1rem"}},"layout":{"type":"constrained"}} -->
				<div class="wp-block-group" style="border-style:solid;border-width:1px;border-radius:1rem;padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"1"} /-->

				<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"constrained"}} -->
				<div class="wp-block-group"><!-- wp:ph-peeps/full-name {"className":"wp-block-ph-peeps-full-name"} /-->

				<!-- wp:spacer {"height":"var:preset|spacing|20"} -->
				<div style="height:var(--wp--preset--spacing--20)" aria-hidden="true" class="wp-block-spacer"></div>
				<!-- /wp:spacer -->

				<!-- wp:ph-peeps/email {"makeLink":true,"fontSize":"small"} /-->

				<!-- wp:ph-peeps/phone {"makeLink":true,"fontSize":"small"} /-->

				<!-- wp:ph-peeps/social-links {"size":"has-small-icon-size","style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} /--></div>
				<!-- /wp:group --></div>
				<!-- /wp:group -->
				<!-- /wp:post-template -->
				
				<!-- wp:query-pagination {"align":"wide","layout":{"type":"flex","justifyContent":"center"}} -->
				<!-- wp:query-pagination-previous /-->
				
				<!-- wp:query-pagination-numbers /-->
				
				<!-- wp:query-pagination-next /-->
				<!-- /wp:query-pagination -->
				
				<!-- wp:query-no-results -->
				<!-- wp:paragraph {"placeholder":"Add text or blocks that will display when a query returns no results."} -->
				<p>' . esc_html__( 'No people found.', 'ph-peeps' ) . '</p>
				<!-- /wp:paragraph -->
				<!-- /wp:query-no-results --></div>
				<!-- /wp:query --></main>
				<!-- /wp:group -->
				
				<!-- wp:template-part {"slug":"footer","tagName":"footer","area":"footer"} /-->',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block_templates' );
