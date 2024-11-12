<?php
/**
 * Render the Phone block
 *
 * @package WP_Peeps
 * @param array  $attributes The block attributes.
 */
function wp_peeps_render_phone_block( $attributes ) {
	$post_id = get_the_ID();
	$phone   = get_post_meta( $post_id, 'wp_peeps_phone', true );

	if ( empty( $phone ) ) {
		return '';
	}

	$format = get_option( 'wp_peeps_phone_format', '(###) ###-####' );
	$formatted_phone = $format;
	for ( $i = 0; $i < strlen( $phone ); $i++ ) {
		$formatted_phone = preg_replace( '/#/', $phone[ $i ], $formatted_phone, 1 );
	}

	$tag_name = $attributes['tagName'] ?? 'p';
	$wrapper_attributes = get_block_wrapper_attributes();
	$prefix = ! empty( $attributes['prefix'] ) ? esc_html( $attributes['prefix'] ) . ' ' : '';

	if ( ! empty( $attributes['makeLink'] ) ) {
		$phone_content = sprintf(
			'%1$s<a href="tel:%2$s">%3$s</a>',
			$prefix,
			esc_attr( $phone ),
			esc_html( $formatted_phone )
		);
	} else {
		$phone_content = $prefix . esc_html( $formatted_phone );
	}

	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		esc_html( $tag_name ),
		$wrapper_attributes,
		$phone_content
	);
}
