<?php
/**
 * Render the email block on the front end.
 *
 * @param array $attributes The block attributes.
 * @return string Returns the block content.
 */
function wp_peeps_render_email_block( $attributes ) {
	$post_id = get_the_ID();

	// Bail early if no post ID or user can't read the post
	if ( empty( $post_id ) || ! current_user_can( 'read_post', $post_id ) ) {
		return '';
	}

	// Get email from post meta
	$email = get_post_meta( $post_id, 'wp_peeps_email', true );

	// Return early if no email exists
	if ( empty( $email ) ) {
		return '';
	}

	// Get and sanitize attributes
	$tag_name = sanitize_key( $attributes['tagName'] ?? 'p' );
	$prefix = ! empty( $attributes['prefix'] ) ? sanitize_text_field( $attributes['prefix'] ) . ' ' : '';

	// Get block wrapper attributes
	$wrapper_attributes = get_block_wrapper_attributes();

	// Build email content
	if ( ! empty( $attributes['makeLink'] ) ) {
		$email_content = sprintf(
			'%1$s<a href="mailto:%2$s">%3$s</a>',
			$prefix,
			esc_attr( $email ),
			esc_html( $email )
		);
	} else {
		$email_content = $prefix . esc_html( $email );
	}

	// Return the email wrapped in its HTML tag
	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		$tag_name,
		$wrapper_attributes,
		$email_content
	);
}
