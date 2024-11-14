<?php
/**
 * Formatting functions for WP Peeps
 *
 * @package WP_Peeps
 */

namespace WP_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Clear all cached phone numbers
 */
function clear_phone_cache() {
	global $wp_object_cache;

	if ( function_exists( 'wp_cache_delete_group' ) ) {
		wp_cache_delete_group( 'wp_peeps' );
		return;
	}

	// Fallback for WordPress < 6.1.
	if ( isset( $wp_object_cache->cache['wp_peeps'] ) ) {
		foreach ( array_keys( $wp_object_cache->cache['wp_peeps'] ) as $key ) {
			wp_cache_delete( $key, 'wp_peeps' );
		}
	}
}

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

	// Check cache first.
	$cache_key = 'wp_peeps_formatted_phone_' . $phone_number . '_' . md5( $format );
	$cached    = wp_cache_get( $cache_key, 'wp_peeps' );

	if ( false !== $cached ) {
		return $cached;
	}

	$formatted_phone = $format;
	$phone_length    = strlen( $phone_number );

	// Replace each # in format with corresponding digit.
	for ( $i = 0; $i < $phone_length; $i++ ) {
		$formatted_phone = preg_replace( '/#/', $phone_number[ $i ], $formatted_phone, 1 );
	}

	// Cache the result.
	wp_cache_set( $cache_key, $formatted_phone, 'wp_peeps', HOUR_IN_SECONDS );

	return $formatted_phone;
}
