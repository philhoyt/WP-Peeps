<?php
function wp_peeps_render_full_name_block( $attributes, $content ) {
	$post_id = get_the_ID();

	// Get name parts.
	$first_name = get_post_meta( $post_id, 'wp_peeps_first_name', true );
	$middle_name = get_post_meta( $post_id, 'wp_peeps_middle_name', true );
	$last_name = get_post_meta( $post_id, 'wp_peeps_last_name', true );

	$name_parts = array();
	if ( ! empty( $attributes['showFirst'] ) && $first_name ) {
		$name_parts[] = $first_name;
	}
	if ( ! empty( $attributes['showMiddle'] ) && $middle_name ) {
		$name_parts[] = $middle_name;
	}
	if ( ! empty( $attributes['showLast'] ) && $last_name ) {
		$name_parts[] = $last_name;
	}

	$tag_name = $attributes['tagName'] ?? 'h2';
	$full_name = implode( ' ', $name_parts );

	// Get the classes.
	$wrapper_attributes = get_block_wrapper_attributes();

	if ( ! empty( $attributes['makeLink'] ) ) {
		$full_name = sprintf(
			'<a href="%1$s"%2$s%3$s>%4$s</a>',
			esc_url( get_permalink( $post_id ) ),
			! empty( $attributes['openInNewTab'] ) ? ' target="_blank"' : '',
			! empty( $attributes['linkRel'] ) ? ' rel="' . esc_attr( $attributes['linkRel'] ) . '"' : '',
			esc_html( $full_name )
		);
	}

	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		esc_html( $tag_name ),
		$wrapper_attributes,
		$full_name
	);
}
