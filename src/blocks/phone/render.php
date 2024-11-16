<?php
/**
 * Render the Phone block
 *
 * @package WP_Peeps
 * @since 0.1.0
 *
 * @param array  $attributes The block attributes.
 * @param string $content    The block default content.
 * @return string           The block HTML.
 */
function wp_peeps_render_phone_block( $attributes, $content ) {
	$post_id = get_the_ID();

	// Bail early if no post ID or user can't read the post
	if ( empty( $post_id ) || ! current_user_can( 'read_post', $post_id ) ) {
		return '';
	}

	// Get and sanitize phone number
	$phone = get_post_meta( $post_id, 'wp_peeps_phone', true );
	if ( empty( $phone ) ) {
		return '';
	}

	// Get and sanitize attributes
	$tag_name = sanitize_key( $attributes['tagName'] ?? 'p' );
	$prefix   = ! empty( $attributes['prefix'] ) ? sanitize_text_field( $attributes['prefix'] ) . ' ' : '';

	// Format phone number
	$format = get_option( 'wp_peeps_phone_format', '(###) ###-####' );
	$formatted_phone = wp_peeps_format_phone_number( $phone, $format );

	// Get block wrapper attributes
	$wrapper_attributes = get_block_wrapper_attributes();

	// Build phone content
	if ( ! empty( $attributes['makeLink'] ) ) {
		$phone_content = sprintf(
			'%1$s<a href="tel:%2$s">%3$s</a>',
			$prefix,
			esc_attr( preg_replace( '/[^0-9+]/', '', $phone ) ),
			esc_html( $formatted_phone )
		);
	} else {
		$phone_content = $prefix . esc_html( $formatted_phone );
	}

	// Build and return the final HTML
	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		tag_escape( $tag_name ),
		$wrapper_attributes,
		$phone_content
	);
}

/**
 * Format a phone number according to the given format.
 *
 * @param string $phone  The phone number to format.
 * @param string $format The format template.
 * @return string       The formatted phone number.
 */
function wp_peeps_format_phone_number( $phone, $format ) {
	if ( empty( $phone ) || empty( $format ) ) {
		return '';
	}

	$formatted_phone = $format;
	$digits = preg_replace( '/[^0-9]/', '', $phone );
	
	for ( $i = 0; $i < strlen( $digits ) && $i < substr_count( $format, '#' ); $i++ ) {
		$formatted_phone = preg_replace( '/#/', $digits[ $i ], $formatted_phone, 1 );
	}

	// Remove any remaining placeholders
	$formatted_phone = preg_replace( '/#/', '', $formatted_phone );

	return trim( $formatted_phone );
}
