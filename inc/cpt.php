<?php
/**
 * Register custom post types for the plugin
 *
 * @package WP_Peeps
 */

namespace WP_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the 'people' custom post type
 *
 * @return void
 */
function register_people_post_type() {
	$is_public = get_option( 'wp_peeps_public_cpt', true );
	$is_public = filter_var( $is_public, FILTER_VALIDATE_BOOLEAN );
	$has_archive = get_option( 'wp_peeps_has_archive', true );
	$has_archive = filter_var( $has_archive, FILTER_VALIDATE_BOOLEAN );
	$slug = get_option( 'wp_peeps_cpt_slug', 'people' );
	$menu_position = get_option( 'wp_peeps_menu_position', 25 );

	$labels = array(
		'name'                  => _x( 'People', 'Post type general name', 'wp-peeps' ),
		'singular_name'         => _x( 'Person', 'Post type singular name', 'wp-peeps' ),
		'menu_name'             => _x( 'People', 'Admin Menu text', 'wp-peeps' ),
		'add_new'               => __( 'Add New', 'wp-peeps' ),
		'add_new_item'          => __( 'Add New Person', 'wp-peeps' ),
		'edit_item'             => __( 'Edit Person', 'wp-peeps' ),
		'new_item'              => __( 'New Person', 'wp-peeps' ),
		'view_item'             => __( 'View Person', 'wp-peeps' ),
		'view_items'            => __( 'View People', 'wp-peeps' ),
		'search_items'          => __( 'Search People', 'wp-peeps' ),
		'not_found'             => __( 'No people found', 'wp-peeps' ),
		'not_found_in_trash'    => __( 'No people found in Trash', 'wp-peeps' ),
		'all_items'             => __( 'All People', 'wp-peeps' ),
		'featured_image'        => __( 'Profile Picture', 'wp-peeps' ),
		'set_featured_image'    => __( 'Set profile picture', 'wp-peeps' ),
		'remove_featured_image' => __( 'Remove profile picture', 'wp-peeps' ),
	);

	$args = array(
		'labels'             => $labels,
		'public'             => $is_public,
		'publicly_queryable' => $is_public,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => $slug ),
		'capability_type'    => 'post',
		'has_archive'        => $has_archive,
		'hierarchical'       => false,
		'menu_position'      => (int) $menu_position,
		'menu_icon'          => 'dashicons-groups',
		'supports'           => array(
			'title',
			'editor',
			'thumbnail',
			'excerpt',
			'custom-fields',
		),
		'show_in_rest'       => true,
	);

	register_post_type( 'wp_peeps_people', $args );
}
add_action( 'init', __NAMESPACE__ . '\register_people_post_type' );
