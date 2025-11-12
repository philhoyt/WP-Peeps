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
			'type'         => 'string',
			'default'      => '(###) ###-####',
			'show_in_rest' => array(
				'name'   => 'wp_peeps_phone_format',
				'schema' => array(
					'type'    => 'string',
					'default' => '(###) ###-####',
				),
			),
			'description'  => __( 'Phone number format (use # for digits)', 'wp-peeps' ),
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
			'type'         => 'integer',
			'default'      => 25,
			'show_in_rest' => array(
				'name'   => 'wp_peeps_menu_position',
				'schema' => array(
					'type'    => 'integer',
					'default' => 25,
				),
			),
			'description'  => __( 'Position in admin menu where People should appear', 'wp-peeps' ),
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_plugin_settings' );
