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
 * Validate and format phone number
 *
 * @param string $phone Phone number to validate.
 * @return string|WP_Error
 */
function validate_phone( $phone ) {
	// Allow empty values.
	if ( empty( $phone ) ) {
		return '';
	}

	// Remove everything except digits.
	$digits = preg_replace( '/[^0-9]/', '', $phone );

	// Check if we have 10 digits.
	if ( strlen( $digits ) !== 10 ) {
		return new \WP_Error(
			'invalid_phone',
			__( 'Phone number must be empty or contain exactly 10 digits.', 'wp-peeps' )
		);
	}

	// Get format from settings.
	$format = get_option( 'wp_peeps_phone_format', '(###) ###-####' );

	// Replace # with digits.
	$formatted = $format;
	for ( $i = 0; $i < strlen( $digits ); $i++ ) {
		$formatted = preg_replace( '/#/', $digits[$i], $formatted, 1 );
	}

	return $formatted;
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
 * Register meta fields for the people post type
 *
 * @return void
 */
function register_people_meta() {
	register_post_meta(
		'people',
		'first_name',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'people',
		'middle_name',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'people',
		'last_name',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'people',
		'job_title',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'people',
		'phone',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => __NAMESPACE__ . '\validate_phone',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'people',
		'email',
		array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'sanitize_callback' => __NAMESPACE__ . '\validate_email',
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
 */
function update_title_from_name( $meta_id, $post_id, $meta_key, $meta_value ) {
	// Only proceed for our meta keys.
	if ( ! in_array( $meta_key, array( 'first_name', 'middle_name', 'last_name' ), true ) ) {
		return;
	}

	// Only proceed for our post type.
	if ( 'people' !== get_post_type( $post_id ) ) {
		return;
	}

	// Get all name values.
	$first_name  = get_post_meta( $post_id, 'first_name', true );
	$middle_name = get_post_meta( $post_id, 'middle_name', true );
	$last_name   = get_post_meta( $post_id, 'last_name', true );

	// Only proceed if we have required names.
	if ( empty( $first_name ) || empty( $last_name ) ) {
		return;
	}

	// Create the full name.
	$full_name = trim( $first_name );
	if ( ! empty( $middle_name ) ) {
		$full_name .= ' ' . trim( $middle_name );
	}
	$full_name .= ' ' . trim( $last_name );

	// Update the post.
	wp_update_post(
		array(
			'ID'         => $post_id,
			'post_title' => $full_name,
			'post_name'  => sanitize_title( $full_name ),
		)
	);
}
add_action( 'updated_post_meta', __NAMESPACE__ . '\update_title_from_name', 10, 4 );
add_action( 'added_post_meta', __NAMESPACE__ . '\update_title_from_name', 10, 4 );
