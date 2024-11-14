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

	if ( ! empty( $social_links ) && is_array( $social_links ) ) {
		// Get block attributes
		$size          = $attributes['size'] ?? 'has-normal-icon-size';
		$icon_color    = $attributes['iconColor'] ?? null;
		$icon_bg_color = $attributes['iconBackgroundColor'] ?? null;
		$orientation   = $attributes['layout']['orientation'] ?? 'horizontal';
		$justify       = $attributes['layout']['justifyContent'] ?? null;

		// Build class list
		$classes = array(
			'wp-block-social-links',
			'wp-peeps-social-links',
			$size,
		);

		if ( $orientation === 'vertical' ) {
			$classes[] = 'is-vertical';
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
		if ($justify) {
			$property = $orientation === 'vertical' ? 'align-items' : 'justify-content';
			switch ($justify) {
				case 'left':
					$styles[] = "$property: flex-start";
					break;
				case 'center':
					$styles[] = "$property: center";
					break;
				case 'right':
					$styles[] = "$property: flex-end";
					break;
				case 'space-between':
					$styles[] = 'justify-content: space-between';
					break;
			}
		}
		$style_attr = ! empty( $styles ) ? ' style="' . esc_attr( implode( '; ', $styles ) ) . '"' : '';

		// Start building the social links block
		$block_content = sprintf(
			'<!-- wp:social-links {"className":"%s","iconColor":"%s","iconBackgroundColor":"%s","layout":{"type":"flex","orientation":"%s","justifyContent":"%s"}} -->',
			implode( ' ', array_filter( $classes ) ),
			esc_attr( $icon_color ),
			esc_attr( $icon_bg_color ),
			esc_attr( $orientation ),
			esc_attr( $justify )
		) . "\n";

		$block_content .= sprintf(
			'<ul class="%s"%s>',
			implode( ' ', array_filter( $classes ) ),
			$style_attr
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
	}

	return '';
}
