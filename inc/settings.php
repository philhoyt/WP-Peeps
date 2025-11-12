<?php
/**
 * Register plugin settings
 *
 * @package WP_Peeps
 */

namespace WP_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Sanitize phone format setting
 *
 * Validates that the phone format contains between 10 and 15 # symbols,
 * matching the JavaScript validation in the settings page.
 *
 * @param string $format The phone format string to sanitize.
 * @return string The sanitized format, or default if invalid.
 */
function sanitize_phone_format( $format ) {
	// Sanitize the format string.
	$format = sanitize_text_field( $format );

	// Count the number of # symbols.
	$placeholder_count = substr_count( $format, '#' );

	// Validate that we have between 10 and 15 placeholders.
	if ( $placeholder_count < 10 || $placeholder_count > 15 ) {
		// Return the default format if validation fails.
		return '(###) ###-####';
	}

	return $format;
}

/**
 * Sanitize menu position setting
 *
 * Validates that the menu position is a valid integer within a reasonable range.
 * WordPress menu positions are typically between 0 and 100, but we allow up to 999
 * for flexibility while preventing unreasonably large values.
 *
 * @param mixed $position The menu position value to sanitize.
 * @return int The sanitized position, or default (25) if invalid.
 */
function sanitize_menu_position( $position ) {
	// Convert to integer.
	$position = (int) $position;

	// Validate range: 0-999 (WordPress menu positions are typically 0-100, but allow more flexibility).
	if ( $position < 0 || $position > 999 ) {
		// Return the default position if validation fails.
		return 25;
	}

	return $position;
}

/**
 * Register plugin settings
 *
 * Registers all plugin settings with WordPress Settings API,
 * including REST API support for block editor integration.
 *
 * @return void
 */
function register_plugin_settings() {
	register_setting(
		'wp_peeps',
		'wp_peeps_public_cpt',
		array(
			'type'         => 'boolean',
			'default'      => true,
			'show_in_rest' => array(
				'name'   => 'wp_peeps_public_cpt',
				'schema' => array(
					'type'    => 'boolean',
					'default' => true,
				),
			),
			'description'  => __( 'Whether the People CPT is public', 'wp-peeps' ),
		)
	);

	register_setting(
		'wp_peeps',
		'wp_peeps_has_archive',
		array(
			'type'         => 'boolean',
			'default'      => true,
			'show_in_rest' => array(
				'name'   => 'wp_peeps_has_archive',
				'schema' => array(
					'type'    => 'boolean',
					'default' => true,
				),
			),
			'description'  => __( 'Whether to enable the archive page for people', 'wp-peeps' ),
		)
	);

	register_setting(
		'wp_peeps',
		'wp_peeps_phone_format',
		array(
			'type'              => 'string',
			'default'           => '(###) ###-####',
			'show_in_rest'      => array(
				'name'   => 'wp_peeps_phone_format',
				'schema' => array(
					'type'    => 'string',
					'default' => '(###) ###-####',
				),
			),
			'description'       => __( 'Phone number format (use # for digits, must contain 10-15 # symbols)', 'wp-peeps' ),
			'sanitize_callback' => __NAMESPACE__ . '\sanitize_phone_format',
		)
	);

	register_setting(
		'wp_peeps',
		'wp_peeps_cpt_slug',
		array(
			'type'              => 'string',
			'default'           => 'people',
			'show_in_rest'      => array(
				'name'   => 'wp_peeps_cpt_slug',
				'schema' => array(
					'type'    => 'string',
					'default' => 'people',
				),
			),
			'description'       => __( 'Custom post type slug for People directory', 'wp-peeps' ),
			'sanitize_callback' => function ( $slug ) {
				return empty( $slug ) ? 'people' : sanitize_title( $slug );
			},
		)
	);

	register_setting(
		'wp_peeps',
		'wp_peeps_menu_position',
		array(
			'type'              => 'integer',
			'default'           => 25,
			'show_in_rest'      => array(
				'name'   => 'wp_peeps_menu_position',
				'schema' => array(
					'type'    => 'integer',
					'default' => 25,
					'minimum' => 0,
					'maximum' => 999,
				),
			),
			'description'       => __( 'Position in admin menu where People should appear (0-999)', 'wp-peeps' ),
			'sanitize_callback' => __NAMESPACE__ . '\sanitize_menu_position',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_plugin_settings' );
