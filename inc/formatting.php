<?php
/**
 * Formatting functions for WP Peeps
 *
 * @package WP_Peeps
 */

/**
 * Format a phone number according to the plugin settings
 *
 * @param string $phone_number Raw phone number (digits only).
 * @param string $format Phone number format.
 * @return string Formatted phone number.
 */
function wp_peeps_format_phone_number( $phone_number, $format ) {
	// If phone number is empty, return empty string.
	if ( empty( $phone_number ) ) {
		return '';
	}

	// Remove any non-numeric characters.
	$phone_number = preg_replace( '/[^0-9]/', '', $phone_number );

	// If format is empty, return raw phone number.
	if ( empty( $format ) ) {
		return $phone_number;
	}

	$formatted_phone = $format;
	$phone_length    = strlen( $phone_number );

	// Replace each # in format with corresponding digit.
	for ( $i = 0; $i < $phone_length; $i++ ) {
		$formatted_phone = preg_replace( '/#/', $phone_number[ $i ], $formatted_phone, 1 );
	}

	return $formatted_phone;
}
