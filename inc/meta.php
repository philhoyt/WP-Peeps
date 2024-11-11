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
			'auth_callback'     => function() {
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
			'auth_callback'     => function() {
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
			'auth_callback'     => function() {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_people_meta' );

/**
 * Update post title when meta is saved
 */
function update_title_from_name( $meta_id, $post_id, $meta_key, $meta_value ) {
	// Only proceed for our meta keys
	if ( ! in_array( $meta_key, array( 'first_name', 'last_name' ), true ) ) {
		return;
	}

	// Only proceed for our post type
	if ( 'people' !== get_post_type( $post_id ) ) {
		return;
	}

	// Get both name values
	$first_name = get_post_meta( $post_id, 'first_name', true );
	$last_name = get_post_meta( $post_id, 'last_name', true );

	// Only proceed if we have both names
	if ( empty( $first_name ) || empty( $last_name ) ) {
		return;
	}

	// Update the post title
	wp_update_post( array(
		'ID'         => $post_id,
		'post_title' => trim( $first_name ) . ' ' . trim( $last_name ),
		'post_name'  => sanitize_title( trim( $first_name ) . ' ' . trim( $last_name ) ),
	) );
}
add_action( 'updated_post_meta', __NAMESPACE__ . '\update_title_from_name', 10, 4 );
add_action( 'added_post_meta', __NAMESPACE__ . '\update_title_from_name', 10, 4 );
