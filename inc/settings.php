<?php
/**
 * Register plugin settings
 */

namespace WP_Peeps\Inc;

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
			'type'         => 'string',
			'default'      => '(###) ###-####',
			'show_in_rest' => array(
				'name' => 'wp_peeps_phone_format',
				'schema' => array(
					'type'    => 'string',
					'default' => '(###) ###-####',
				),
			),
			'description' => __( 'Phone number format (use # for digits)', 'wp-peeps' ),
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_plugin_settings' );
