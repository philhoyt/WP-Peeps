<?php
/**
 * Formatting functions for WP Peeps
 *
 * @package WP_Peeps
 */

/**
 * Format a phone number according to the plugin settings
 *
 * @param string $phone Raw phone number (digits only).
 * @return string Formatted phone number.
 */
function wp_peeps_format_phone_number( $phone ) {
	// If empty or not a string, return as is
	if ( empty( $phone ) || ! is_string( $phone ) ) {
		return $phone;
	}

	// Get format from settings
	$format = get_option( 'wp_peeps_phone_format', '(###) ###-####' );

	// If we don't have 10 digits, return original
	if ( strlen( $phone ) !== 10 ) {
		return $phone;
	}

	$formatted = $format;
	for ( $i = 0; $i < strlen( $phone ); $i++ ) {
		$formatted = preg_replace( '/#/', $phone[$i], $formatted, 1 );
	}

	return $formatted;
}