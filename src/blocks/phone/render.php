<?php
/**
 * Phone Block Render File
 *
 * This file contains rendering logic for the Phone block in the WP Peeps plugin.
 * It handles retrieving and formatting phone information for a specific post.
 *
 * @package PH_Peeps
 * @subpackage Blocks
 */

namespace PH_Peeps\Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render the Phone block.
 *
 * @param array    $attributes The block attributes containing phone-related settings.
 * @param WP_Block $block      Block instance.
 * @return string             The rendered HTML for the phone block.
 */
function ph_peeps_render_phone_block( $attributes, $block ) {
	$post_id = isset( $block->context['postId'] ) ? $block->context['postId'] : get_the_ID();

	// Bail early if no post ID or user can't read the post.
	if ( empty( $post_id ) ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'WP Peeps: Phone block - No post ID available' );
		}
		return '';
	}

	// Get and sanitize phone number.
	$phone = get_post_meta( $post_id, 'ph_peeps_phone', true );
	if ( empty( $phone ) ) {
		return '';
	}

	// Get and sanitize attributes.
	$tag_name = sanitize_key( $attributes['tagName'] ?? 'p' );

	// Strip all HTML from prefix - only allow plain text.
	$prefix = ! empty( $attributes['prefix'] ) ? esc_html( wp_strip_all_tags( $attributes['prefix'] ) ) . ' ' : '';

	// Format phone number.
	$format          = get_option( 'ph_peeps_phone_format', PH_PEEPS_DEFAULT_PHONE_FORMAT );
	$formatted_phone = ph_peeps_format_phone_number( $phone, $format );

	// Get extension.
	$ext        = sanitize_text_field( get_post_meta( $post_id, 'ph_peeps_phone_ext', true ) );
	$ext_suffix = ! empty( $ext ) ? ' x' . esc_html( $ext ) : '';

	// Get block wrapper attributes.
	$wrapper_attributes = get_block_wrapper_attributes();

	// Build the tel: href (RFC 3966 extension format).
	$tel_digits = preg_replace( '/[^0-9+]/', '', $phone );
	$tel_href   = ! empty( $ext ) ? $tel_digits . ';ext=' . rawurlencode( $ext ) : $tel_digits;

	// Build phone content.
	if ( ! empty( $attributes['makeLink'] ) ) {
		$phone_content = sprintf(
			'%1$s<a href="tel:%2$s">%3$s</a>',
			$prefix,
			esc_attr( $tel_href ),
			esc_html( $formatted_phone . $ext_suffix )
		);
	} else {
		$phone_content = $prefix . esc_html( $formatted_phone . $ext_suffix );
	}

	// Build and return the final HTML.
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
function ph_peeps_format_phone_number( $phone, $format ) {
	if ( empty( $phone ) || empty( $format ) ) {
		return '';
	}

	$formatted_phone   = $format;
	$digits            = preg_replace( '/[^0-9]/', '', $phone );
	$placeholder_count = substr_count( $format, '#' );

	$digits_length = strlen( $digits );
	for ( $i = 0; $i < $digits_length && $i < $placeholder_count; $i++ ) {
		$formatted_phone = preg_replace( '/#/', $digits[ $i ], $formatted_phone, 1 );
	}

	// If we have more digits than format placeholders, append them.
	if ( $digits_length > $placeholder_count ) {
		$formatted_phone .= substr( $digits, $placeholder_count );
	}

	// Remove any remaining placeholders.
	$formatted_phone = preg_replace( '/#/', '', $formatted_phone );

	return trim( $formatted_phone );
}
