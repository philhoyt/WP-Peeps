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

	// Check if we have between 10 and 15 digits.
	$length = strlen( $digits );
	if ( $length < 10 || $length > 15 ) {
		return new \WP_Error(
			'invalid_phone',
			__( 'Phone number must be empty or contain between 10 and 15 digits.', 'wp-peeps' )
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
	// Only proceed if we're updating first, middle, or last name.
	if ( ! in_array( $meta_key, array( 'wp_peeps_first_name', 'wp_peeps_middle_name', 'wp_peeps_last_name' ), true ) ) {
		return;
	}

	// Prevent infinite loops by checking if we're already updating.
	static $updating = array();
	if ( isset( $updating[ $post_id ] ) ) {
		return;
	}

	// Get the post.
	$post = get_post( $post_id );

	if ( ! $post || 'wp_peeps_people' !== $post->post_type ) {
		return;
	}

	// Prevent recursion during save_post.
	if ( doing_action( 'save_post' ) || doing_action( 'wp_insert_post' ) ) {
		return;
	}

	// Mark as updating to prevent recursion.
	$updating[ $post_id ] = true;

	try {
		// Get all name parts in a single query (optimized).
		$all_meta    = get_post_meta( $post_id );
		$first_name  = isset( $all_meta['wp_peeps_first_name'][0] ) ? $all_meta['wp_peeps_first_name'][0] : '';
		$middle_name = isset( $all_meta['wp_peeps_middle_name'][0] ) ? $all_meta['wp_peeps_middle_name'][0] : '';
		$last_name   = isset( $all_meta['wp_peeps_last_name'][0] ) ? $all_meta['wp_peeps_last_name'][0] : '';

		// Only update title if we have at least first and last name to avoid partial updates during import.
		if ( empty( $first_name ) || empty( $last_name ) ) {
			unset( $updating[ $post_id ] );
			return;
		}

		// Build the full name.
		$name_parts = array_filter( array( $first_name, $middle_name, $last_name ) );
		$full_name  = trim( implode( ' ', $name_parts ) );

		if ( empty( $full_name ) ) {
			error_log( sprintf( 'WP Peeps: Empty full name for post %d', $post_id ) );
			unset( $updating[ $post_id ] );
			return;
		}

		// Only update if the title is different to avoid unnecessary database writes.
		if ( $post->post_title === $full_name ) {
			unset( $updating[ $post_id ] );
			return;
		}

		// Temporarily remove our hooks to prevent recursion.
		remove_action( 'updated_post_meta', __NAMESPACE__ . '\update_title_from_name', 10 );
		remove_action( 'added_post_meta', __NAMESPACE__ . '\update_title_from_name', 10 );

		// Update the post title.
		wp_update_post(
			array(
				'ID'         => $post_id,
				'post_title' => $full_name,
			)
		);

		// Re-add our hooks.
		add_action( 'updated_post_meta', __NAMESPACE__ . '\update_title_from_name', 10, 4 );
		add_action( 'added_post_meta', __NAMESPACE__ . '\update_title_from_name', 10, 4 );
	} catch ( \Exception $e ) {
		error_log( sprintf( 'WP Peeps: Error updating title for post %d: %s', $post_id, $e->getMessage() ) );
	} finally {
		// Always unset the updating flag, even if an error occurred.
		unset( $updating[ $post_id ] );
	}
}
add_action( 'updated_post_meta', __NAMESPACE__ . '\update_title_from_name', 10, 4 );
add_action( 'added_post_meta', __NAMESPACE__ . '\update_title_from_name', 10, 4 );
