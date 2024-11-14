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
		// Start building the social links block
		$block_content  = '<!-- wp:social-links {"className":"wp-peeps-social-links"} -->' . "\n";
		$block_content .= '<ul class="wp-block-social-links wp-peeps-social-links">';

		// Add each social link
		foreach ( $social_links as $link ) {
			$service        = strtolower( $link['platform'] );
			$url            = esc_url( $link['url'] );
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
