<?php
/**
 * Render callback for the social-links block.
 *
 * @param array $attributes The block attributes.
 * @return string
 */
function wp_peeps_render_social_links_block( $attributes ) {
	$post_id      = get_the_ID();
	$social_links = get_post_meta( $post_id, 'wp_peeps_social_links', true );

	// If no meta or post ID, use default links
	if ( empty( $social_links ) || ! is_array( $social_links ) ) {
		$social_links = array(
			array(
				'platform' => 'linkedin',
				'url'     => '#',
			),
			array(
				'platform' => 'github',
				'url'     => '#',
			),
			array(
				'platform' => 'facebook',
				'url'     => '#',
			),
		);
	}

	// Get block attributes
	$size          = $attributes['size'] ?? 'has-normal-icon-size';
	$icon_color    = $attributes['iconColor'] ?? null;
	$icon_bg_color = $attributes['iconBackgroundColor'] ?? null;
	$orientation   = $attributes['layout']['orientation'] ?? 'horizontal';
	$justify       = $attributes['layout']['justifyContent'] ?? null;
	$vertical_align = $attributes['layout']['verticalAlignment'] ?? null;
	$gap           = $attributes['style']['spacing']['blockGap'] ?? null;
	$class_name    = $attributes['className'] ?? '';

	// Build class list
	$classes = array(
		'wp-block-social-links',
		'wp-peeps-social-links',
		$size,
		$class_name
	);

	if ( $orientation === 'vertical' ) {
		$classes[] = 'is-vertical';
	}

	if ( ! empty( $attributes['showLabels'] ) ) {
		$classes[] = 'has-visible-labels';
	}

	// Add color classes
	if ( $icon_color ) {
		$classes[] = 'has-icon-color';
	}

	if ( $icon_bg_color ) {
		$classes[] = 'has-icon-background-color';
	}

	// Build style attribute
	$styles = array();
	
	// Handle alignment based on orientation
	if ($orientation === 'vertical') {
		// Vertical alignment (top, middle, bottom, space-between)
		if ($vertical_align) {
			switch ($vertical_align) {
				case 'top':
					$styles[] = 'justify-content: flex-start';
					break;
				case 'middle':
					$styles[] = 'justify-content: center';
					break;
				case 'bottom':
					$styles[] = 'justify-content: flex-end';
					break;
				case 'space-between':
					$styles[] = 'justify-content: space-between';
					break;
			}
		}
		// Item justification (left, center, right, stretch)
		if ($justify) {
			switch ($justify) {
				case 'left':
					$styles[] = 'align-items: flex-start';
					break;
				case 'center':
					$styles[] = 'align-items: center';
					break;
				case 'right':
					$styles[] = 'align-items: flex-end';
					break;
				case 'stretch':
					$styles[] = 'align-items: stretch';
					break;
			}
		}
	} else {
		// Horizontal layout uses justify-content
		if ($justify) {
			switch ($justify) {
				case 'left':
					$styles[] = 'justify-content: flex-start';
					break;
				case 'center':
					$styles[] = 'justify-content: center';
					break;
				case 'right':
					$styles[] = 'justify-content: flex-end';
					break;
				case 'space-between':
					$styles[] = 'justify-content: space-between';
					break;
			}
		}
	}

	// Add gap if set
	if ($gap) {
		$gap_value = $gap;
		// Handle preset spacing format
		if (strpos($gap, 'var:preset|spacing|') === 0) {
			$preset = str_replace('var:preset|spacing|', '', $gap);
			$gap_value = "var(--wp--preset--spacing--{$preset})";
		}
		$styles[] = "gap: $gap_value";
	}

	// Get block wrapper attributes with styles
	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => implode(' ', array_filter($classes)),
			'style' => implode('; ', $styles),
		)
	);

	// Start building the social links block
	$block_content = sprintf(
		'<!-- wp:social-links {"openInNewTab":%s,"showLabels":%s,"className":"%s","iconColor":"%s","iconBackgroundColor":"%s","layout":{"type":"flex","orientation":"%s","justifyContent":"%s","verticalAlignment":"%s"}} -->',
		! empty( $attributes['openInNewTab'] ) ? 'true' : 'false',
		! empty( $attributes['showLabels'] ) ? 'true' : 'false',
		implode(' ', array_filter($classes)),
		esc_attr($icon_color),
		esc_attr($icon_bg_color),
		esc_attr($orientation),
		esc_attr($justify),
		esc_attr($vertical_align)
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

	// Parse and render the block
	$parsed_blocks = parse_blocks( $block_content );

	if ( ! empty( $parsed_blocks ) ) {
		return render_block( $parsed_blocks[0] );
	}

	return '';
}
