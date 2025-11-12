<?php
/**
 * Email Block Render Template
 *
 * This file provides the rendering logic for the Email block in the WP Peeps plugin.
 * It handles retrieving and displaying email information for a specific post.
 *
 * @package WP_Peeps
 * @subpackage Blocks
 */

namespace WP_Peeps\Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render the Email block.
 *
 * @param array    $attributes The block attributes containing email-related settings.
 * @param WP_Block $block      Block instance.
 * @return string             The rendered HTML for the email block.
 */
function wp_peeps_render_email_block( $attributes, $block ) {
	$post_id = isset( $block->context['postId'] ) ? $block->context['postId'] : get_the_ID();

	// Bail early if no post ID.
	if ( empty( $post_id ) ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'WP Peeps: Email block - No post ID available' );
		}
		return '';
	}

	// Get email from post meta.
	$email = get_post_meta( $post_id, 'wp_peeps_email', true );

	// Return early if no email exists.
	if ( empty( $email ) ) {
		return '';
	}

	// Get and sanitize attributes.
	$tag_name = sanitize_key( $attributes['tagName'] ?? 'p' );

	// Strip all HTML from prefix - only allow plain text.
	$prefix = ! empty( $attributes['prefix'] ) ? esc_html( wp_strip_all_tags( $attributes['prefix'] ) ) . ' ' : '';

	// Get block wrapper attributes.
	$wrapper_attributes = get_block_wrapper_attributes();

	// Build email content.
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

	// Return the email wrapped in its HTML tag.
	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		tag_escape( $tag_name ),
		$wrapper_attributes,
		$email_content
	);
}
