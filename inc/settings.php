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
 * Validate phone format
 *
 * @param string $format Phone format to validate.
 * @return string|WP_Error
 */
function validate_phone_format( $format ) {
	// Count number of # characters.
	$digit_count = substr_count( $format, '#' );

	if ( $digit_count !== 10 ) {
		return new \WP_Error(
			'invalid_phone_format',
			__( 'Phone format must contain exactly 10 # characters.', 'wp-peeps' )
		);
	}

	return $format;
}

/**
 * Clear phone number cache when format is updated
 *
 * @param mixed  $old_value The old option value.
 * @param mixed  $value     The new option value.
 * @param string $option    Option name.
 */
function clear_phone_cache( $old_value, $value, $option ) {
	if ( $old_value === $value ) {
		return;
	}

	// Delete all cached phone numbers by deleting the entire cache group.
	wp_cache_delete_group( 'wp_peeps' );
}

/**
 * Register plugin settings
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
			'sanitize_callback' => 'sanitize_text_field',
			'validate_callback' => __NAMESPACE__ . '\validate_phone_format',
			'description'       => __( 'Phone number format (use # for digits)', 'wp-peeps' ),
		)
	);

	add_action( 'update_option_wp_peeps_phone_format', __NAMESPACE__ . '\clear_phone_cache', 10, 3 );

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
}
add_action( 'init', __NAMESPACE__ . '\register_plugin_settings' );
