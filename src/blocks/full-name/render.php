<?php
/**
 * Render callback for the full-name block.
 *
 * @package WP_Peeps
 * @since 1.0.0
 *
 * @param array  $attributes The block attributes.
 * @param string $content    The block default content.
 * @return string The block content.
 */
function wp_peeps_render_full_name_block( $attributes, $content ) {
	$post_id = get_the_ID();

	// Bail early if no post ID or user can't read the post
	if ( empty( $post_id ) || ! current_user_can( 'read_post', $post_id ) ) {
		return '';
	}

	// Get and sanitize attributes
	$show_first  = ! empty( $attributes['showFirst'] );
	$show_middle = ! empty( $attributes['showMiddle'] );
	$show_last   = ! empty( $attributes['showLast'] );
	$tag_name    = sanitize_key( $attributes['tagName'] ?? 'h2' );
	$make_link   = ! empty( $attributes['makeLink'] );

	// Get name parts from meta
	$first_name  = get_post_meta( $post_id, 'wp_peeps_first_name', true );
	$middle_name = get_post_meta( $post_id, 'wp_peeps_middle_name', true );
	$last_name   = get_post_meta( $post_id, 'wp_peeps_last_name', true );

	// Build name parts array
	$name_parts = array();
	if ( $show_first && ! empty( $first_name ) ) {
		$name_parts[] = sanitize_text_field( $first_name );
	}
	if ( $show_middle && ! empty( $middle_name ) ) {
		$name_parts[] = sanitize_text_field( $middle_name );
	}
	if ( $show_last && ! empty( $last_name ) ) {
		$name_parts[] = sanitize_text_field( $last_name );
	}

	// Return early if no name parts
	if ( empty( $name_parts ) ) {
		return '';
	}

	$full_name = implode( ' ', $name_parts );

	// Get block wrapper attributes
	$wrapper_attributes = get_block_wrapper_attributes();

	// Handle link if enabled
	if ( $make_link ) {
		$link_attrs = array(
			'href' => esc_url( get_permalink( $post_id ) ),
		);

		if ( ! empty( $attributes['openInNewTab'] ) ) {
			$link_attrs['target'] = '_blank';
			// Add rel="noopener" for security when target="_blank" is used
			$link_rel = ! empty( $attributes['linkRel'] ) ? $attributes['linkRel'] . ' noopener' : 'noopener';
			$link_attrs['rel'] = trim( $link_rel );
		} elseif ( ! empty( $attributes['linkRel'] ) ) {
			$link_attrs['rel'] = esc_attr( $attributes['linkRel'] );
		}

		// Build link attributes string
		$link_attrs_str = '';
		foreach ( $link_attrs as $key => $value ) {
			$link_attrs_str .= sprintf( ' %s="%s"', esc_attr( $key ), esc_attr( $value ) );
		}

		$full_name = sprintf( '<a%s>%s</a>', $link_attrs_str, esc_html( $full_name ) );
	}

	// Build and return the final HTML
	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		tag_escape( $tag_name ),
		$wrapper_attributes,
		$full_name
	);
}
