<?php
/**
 * Register custom meta fields for the plugin
 *
 * @package WP_Peeps
 */

namespace WP_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Validate phone number
 *
 * @param string $phone Phone number to validate.
 * @return string|WP_Error
 */
function validate_phone( $phone ) {
	// Allow empty values.
	if ( empty( $phone ) ) {
		return '';
	}

	// Should already be digits only, but sanitize just in case.
	$digits = preg_replace( '/[^0-9]/', '', $phone );

	// Check if we have exactly 10 digits.
	if ( strlen( $digits ) !== 10 ) {
		return new \WP_Error(
			'invalid_phone',
			__( 'Phone number must be empty or contain exactly 10 digits.', 'wp-peeps' )
		);
	}

	return $digits;
}

/**
 * Validate email address
 *
 * @param string $email Email to validate.
 * @return string|WP_Error
 */
function validate_email( $email ) {
	// Allow empty values.
	if ( empty( $email ) ) {
		return '';
	}

	if ( ! is_email( $email ) ) {
		return new \WP_Error(
			'invalid_email',
			__( 'Please enter a valid email address or leave empty.', 'wp-peeps' )
		);
	}
	return sanitize_email( $email );
}

/**
 * Validate social links array
 *
 * @param array $links Array of social links.
 * @return array|WP_Error
 */
function validate_social_links( $links ) {
	if ( empty( $links ) ) {
		return array();
	}

	if ( ! is_array( $links ) ) {
		return new \WP_Error(
			'invalid_social_links',
			__( 'Social links must be an array.', 'wp-peeps' )
		);
	}

	$valid_links = array();
	foreach ( $links as $link ) {
		if ( ! isset( $link['platform'], $link['url'] ) ) {
			continue;
		}

		// Validate URL.
		$url = esc_url_raw( $link['url'] );
		if ( empty( $url ) ) {
			continue;
		}

		$valid_links[] = array(
			'platform' => sanitize_text_field( $link['platform'] ),
			'url'      => $url,
		);
	}

	return $valid_links;
}

/**
 * Register meta fields for the people post type
 *
 * @return void
 */
function register_people_meta() {
	register_post_meta(
		'wp_peeps_people',
		'wp_peeps_first_name',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'label'             => __( 'First Name', 'wp-peeps' ),
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'wp_peeps_people',
		'wp_peeps_middle_name',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'label'             => __( 'Middle Name', 'wp-peeps' ),
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'wp_peeps_people',
		'wp_peeps_last_name',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'label'             => __( 'Last Name', 'wp-peeps' ),
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'wp_peeps_people',
		'wp_peeps_phone',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'label'             => __( 'Phone Number', 'wp-peeps' ),
			'sanitize_callback' => __NAMESPACE__ . '\validate_phone',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'wp_peeps_people',
		'wp_peeps_email',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'label'             => __( 'Email Address', 'wp-peeps' ),
			'sanitize_callback' => __NAMESPACE__ . '\validate_email',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'wp_peeps_people',
		'wp_peeps_social_links',
		array(
			'show_in_rest'      => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type'       => 'object',
						'properties' => array(
							'platform' => array(
								'type' => 'string',
							),
							'url'      => array(
								'type' => 'string',
							),
						),
					),
				),
			),
			'single'            => true,
			'type'              => 'array',
			'label'             => __( 'Social Links', 'wp-peeps' ),
			'sanitize_callback' => __NAMESPACE__ . '\validate_social_links',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_people_meta' );

/**
 * Update post title when meta is saved
 *
 * @param int    $meta_id    ID of updated metadata entry.
 * @param int    $post_id    Post ID.
 * @param string $meta_key   Metadata key.
 * @param mixed  $meta_value Metadata value.
 * @return void
 */
function update_title_from_name( $meta_id, $post_id, $meta_key, $meta_value ) {
	// Only proceed if we're updating first or last name.
	if ( ! in_array( $meta_key, array( 'wp_peeps_first_name', 'wp_peeps_middle_name', 'wp_peeps_last_name' ), true ) ) {
		return;
	}

	// Get the post.
	$post = get_post( $post_id );

	if ( ! $post || 'wp_peeps_people' !== $post->post_type ) {
		return;
	}

	try {
		// Get both names.
		$first_name  = get_post_meta( $post_id, 'wp_peeps_first_name', true );
		$middle_name = get_post_meta( $post_id, 'wp_peeps_middle_name', true );
		$last_name   = get_post_meta( $post_id, 'wp_peeps_last_name', true );

		// Build the full name.
		$full_name = trim( sprintf( '%s %s %s', $first_name, $middle_name, $last_name ) );

		if ( empty( $full_name ) ) {
			error_log( sprintf( 'WP Peeps: Empty full name for post %d', $post_id ) );
			return;
		}

		// Update the post title.
		wp_update_post(
			array(
				'ID'         => $post_id,
				'post_title' => $full_name,
			)
		);
	} catch ( \Exception $e ) {
		error_log( sprintf( 'WP Peeps: Error updating title for post %d: %s', $post_id, $e->getMessage() ) );
	}
}
add_action( 'updated_post_meta', __NAMESPACE__ . '\update_title_from_name', 10, 4 );
add_action( 'added_post_meta', __NAMESPACE__ . '\update_title_from_name', 10, 4 );
