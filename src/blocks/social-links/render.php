<?php
/**
 * Render callback for the social-links block.
 *
 * @package WP_Peeps
 * @since 1.0.0
 *
 * @param array $attributes The block attributes.
 * @return string The rendered block content.
 */

// Define default social links.
const DEFAULT_SOCIAL_LINKS = [
	[
		'platform' => 'linkedin',
		'url'     => '#',
	],
	[
		'platform' => 'github',
		'url'     => '#',
	],
	[
		'platform' => 'facebook',
		'url'     => '#',
	],
];

function wp_peeps_render_social_links_block( $attributes ) {
	// Get social links based on context
	$social_links = wp_peeps_get_social_links();
	
	// Extract and sanitize block attributes
	$block_attrs = wp_peeps_get_social_block_attributes( $attributes );
	
	// Build block classes and styles
	$classes = wp_peeps_get_social_block_classes( $block_attrs );
	$styles  = wp_peeps_get_social_block_styles( $block_attrs );

	// Get block wrapper attributes
	$wrapper_attributes = get_block_wrapper_attributes(
		[
			'class' => implode( ' ', array_filter( $classes ) ),
			'style' => implode( '; ', $styles ),
		]
	);

	// Build block content
	$block_content = wp_peeps_build_social_block_content( 
		$social_links, 
		$block_attrs, 
		$wrapper_attributes 
	);

	// Parse and render the block
	$parsed_blocks = parse_blocks( $block_content );

	return ! empty( $parsed_blocks ) ? render_block( $parsed_blocks[0] ) : '';
}

/**
 * Get social links based on context.
 *
 * @return array Array of social links.
 */
function wp_peeps_get_social_links() {
	// Check if we're in a post context
	$post_id = get_the_ID();
	
	// If we're not in a post context (e.g., site editor) or don't have permission
	if ( empty( $post_id ) || ! current_user_can( 'read_post', $post_id ) ) {
		return DEFAULT_SOCIAL_LINKS;
	}

	// Get social links from post meta
	$social_links = get_post_meta( $post_id, 'wp_peeps_social_links', true );
	
	// Return default links if meta is empty or invalid
	return ( ! empty( $social_links ) && is_array( $social_links ) ) 
		? $social_links 
		: DEFAULT_SOCIAL_LINKS;
}

/**
 * Get sanitized block attributes.
 *
 * @param array $attributes Raw block attributes.
 * @return array Sanitized attributes.
 */
function wp_peeps_get_social_block_attributes( $attributes ) {
	return [
		'size'          => sanitize_html_class( $attributes['size'] ?? 'has-normal-icon-size' ),
		'iconColor'    => sanitize_hex_color( $attributes['iconColor'] ?? '' ),
		'iconBackgroundColor' => sanitize_hex_color( $attributes['iconBackgroundColor'] ?? '' ),
		'orientation'   => sanitize_text_field( $attributes['layout']['orientation'] ?? 'horizontal' ),
		'justify'       => sanitize_text_field( $attributes['layout']['justifyContent'] ?? '' ),
		'verticalAlign' => sanitize_text_field( $attributes['layout']['verticalAlignment'] ?? '' ),
		'gap'           => sanitize_text_field( $attributes['style']['spacing']['blockGap'] ?? '' ),
		'className'    => sanitize_html_class( $attributes['className'] ?? '' ),
		'showLabels'   => rest_sanitize_boolean( $attributes['showLabels'] ?? false ),
		'openInNewTab' => rest_sanitize_boolean( $attributes['openInNewTab'] ?? false ),
		'flexWrap'     => sanitize_text_field( $attributes['layout']['flexWrap'] ?? 'nowrap' ),
	];
}

/**
 * Get block classes.
 *
 * @param array $block_attrs Sanitized block attributes.
 * @return array Block classes.
 */
function wp_peeps_get_social_block_classes( $block_attrs ) {
	$classes = [
		'wp-block-social-links',
		'wp-peeps-social-links',
		$block_attrs['size'],
		$block_attrs['className'],
		'is-style-default'
	];

	// Add orientation class
	if ( $block_attrs['orientation'] === 'vertical' ) {
		$classes[] = 'is-vertical';
	}

	if ( $block_attrs['showLabels'] ) {
		$classes[] = 'has-visible-labels';
	}

	if ( $block_attrs['iconColor'] ) {
		$classes[] = 'has-icon-color';
	}

	if ( $block_attrs['iconBackgroundColor'] ) {
		$classes[] = 'has-icon-background-color';
	}

	// Add flex wrap class
	if ( isset( $block_attrs['flexWrap'] ) ) {
		$classes[] = $block_attrs['flexWrap'] === 'wrap' ? 'is-wrap' : 'is-nowrap';
	}

	// Add layout classes
	$classes[] = 'is-layout-flex';
	$classes[] = 'wp-block-social-links-is-layout-flex';
	$classes[] = sprintf( 'is-content-justification-%s', $block_attrs['justify'] ?: 'left' );

	return $classes;
}

/**
 * Get block styles.
 *
 * @param array $block_attrs Sanitized block attributes.
 * @return array Block styles.
 */
function wp_peeps_get_social_block_styles( $block_attrs ) {
	$styles = [];

	if ( $block_attrs['orientation'] === 'vertical' ) {
		$styles = array_merge( $styles, wp_peeps_get_vertical_styles( $block_attrs ) );
	} else {
		$styles = array_merge( $styles, wp_peeps_get_horizontal_styles( $block_attrs ) );
	}

	$gap_style = wp_peeps_get_gap_style( $block_attrs['gap'] );
	if ( $gap_style ) {
		$styles[] = $gap_style;
	}

	return $styles;
}

/**
 * Get vertical alignment styles.
 *
 * @param array $block_attrs Block attributes.
 * @return array Array of CSS styles.
 */
function wp_peeps_get_vertical_styles( $block_attrs ) {
	$styles = [];
	
	$vertical_align_map = [
		'top'           => 'flex-start',
		'middle'        => 'center',
		'bottom'        => 'flex-end',
		'space-between' => 'space-between',
	];

	$justify_map = [
		'left'    => 'flex-start',
		'center'  => 'center',
		'right'   => 'flex-end',
		'stretch' => 'stretch',
	];

	// Set flex direction for vertical orientation
	$styles[] = 'flex-direction: column';

	if ( ! empty( $block_attrs['verticalAlign'] ) && isset( $vertical_align_map[ $block_attrs['verticalAlign'] ] ) ) {
		$styles[] = sprintf( 'justify-content: %s', $vertical_align_map[ $block_attrs['verticalAlign'] ] );
	}

	if ( ! empty( $block_attrs['justify'] ) && isset( $justify_map[ $block_attrs['justify'] ] ) ) {
		$styles[] = sprintf( 'align-items: %s', $justify_map[ $block_attrs['justify'] ] );
	}

	// Apply flex wrap
	if ( isset( $block_attrs['flexWrap'] ) ) {
		$styles[] = sprintf( 'flex-wrap: %s', $block_attrs['flexWrap'] );
	}

	return $styles;
}

/**
 * Get horizontal alignment styles.
 *
 * @param array $block_attrs Block attributes.
 * @return array Array of CSS styles.
 */
function wp_peeps_get_horizontal_styles( $block_attrs ) {
	$styles = [];
	
	$justify_map = [
		'left'          => 'flex-start',
		'center'        => 'center',
		'right'         => 'flex-end',
		'space-between' => 'space-between',
	];

	// Set flex direction for horizontal orientation
	$styles[] = 'flex-direction: row';

	if ( ! empty( $block_attrs['justify'] ) && isset( $justify_map[ $block_attrs['justify'] ] ) ) {
		$styles[] = sprintf( 'justify-content: %s', $justify_map[ $block_attrs['justify'] ] );
	}

	if ( ! empty( $block_attrs['verticalAlign'] ) ) {
		$styles[] = sprintf( 'align-items: %s', $block_attrs['verticalAlign'] === 'top' ? 'flex-start' : $block_attrs['verticalAlign'] );
	}

	// Apply flex wrap
	if ( isset( $block_attrs['flexWrap'] ) ) {
		$styles[] = sprintf( 'flex-wrap: %s', $block_attrs['flexWrap'] );
	}

	return $styles;
}

/**
 * Get gap styles.
 *
 * @param string $gap Gap value.
 * @return string|null Gap style or null if not set.
 */
function wp_peeps_get_gap_style( $gap ) {
	if ( empty( $gap ) ) {
		return null;
	}

	$gap_value = $gap;

	// Handle preset values
	if ( str_starts_with( $gap, 'var:preset|spacing|' ) ) {
		$preset = str_replace( 'var:preset|spacing|', '', $gap );
		$gap_value = sprintf( 'var(--wp--preset--spacing--%s)', sanitize_html_class( $preset ) );
	}

	return sprintf( 'gap: %s;', esc_attr( $gap_value ) );
}

/**
 * Build block content.
 *
 * @param array $social_links Social links.
 * @param array $block_attrs Sanitized block attributes.
 * @param string $wrapper_attributes Block wrapper attributes.
 * @return string Block content.
 */
function wp_peeps_build_social_block_content( $social_links, $block_attrs, $wrapper_attributes ) {
	$block_content = sprintf(
		'<!-- wp:social-links {"openInNewTab":%s,"showLabels":%s,"className":"%s","iconColor":"%s","iconBackgroundColor":"%s","layout":{"type":"flex","orientation":"%s","justifyContent":"%s","verticalAlignment":"%s","flexWrap":"%s"}} -->',
		$block_attrs['openInNewTab'] ? 'true' : 'false',
		$block_attrs['showLabels'] ? 'true' : 'false',
		implode( ' ', array_filter( wp_peeps_get_social_block_classes( $block_attrs ) ) ),
		esc_attr( $block_attrs['iconColor'] ),
		esc_attr( $block_attrs['iconBackgroundColor'] ),
		esc_attr( $block_attrs['orientation'] ),
		esc_attr( $block_attrs['justify'] ),
		esc_attr( $block_attrs['verticalAlign'] ),
		esc_attr( $block_attrs['flexWrap'] )
	) . "\n";

	$block_content .= sprintf(
		'<ul %s>',
		$wrapper_attributes
	);

	// Add each social link
	foreach ( $social_links as $link ) {
		$service = strtolower( $link['platform'] );
		$url     = esc_url( $link['url'] );

		$block_content .= sprintf(
			'<!-- wp:social-link {"url":"%s","service":"%s"} /-->',
			$url,
			$service
		);
	}

	// Close the social links block
	$block_content .= '</ul>' . "\n";
	$block_content .= '<!-- /wp:social-links -->';

	return $block_content;
}
