<?php
/**
 * Register custom post types for the plugin
 *
 * @package PH_Peeps
 */

namespace PH_Peeps\Inc;

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
	$is_public = get_option( 'ph_peeps_public_cpt', true );
	$is_public = filter_var( $is_public, FILTER_VALIDATE_BOOLEAN );
	$has_archive = get_option( 'ph_peeps_has_archive', true );
	$has_archive = filter_var( $has_archive, FILTER_VALIDATE_BOOLEAN );
	$slug = get_option( 'ph_peeps_cpt_slug', 'people' );
	$menu_position = get_option( 'ph_peeps_menu_position', 25 );

	$labels = array(
		'name'                  => _x( 'People', 'Post type general name', 'ph-peeps' ),
		'singular_name'         => _x( 'Person', 'Post type singular name', 'ph-peeps' ),
		'menu_name'             => _x( 'People', 'Admin Menu text', 'ph-peeps' ),
		'add_new'               => __( 'Add New', 'ph-peeps' ),
		'add_new_item'          => __( 'Add New Person', 'ph-peeps' ),
		'edit_item'             => __( 'Edit Person', 'ph-peeps' ),
		'new_item'              => __( 'New Person', 'ph-peeps' ),
		'view_item'             => __( 'View Person', 'ph-peeps' ),
		'view_items'            => __( 'View People', 'ph-peeps' ),
		'search_items'          => __( 'Search People', 'ph-peeps' ),
		'not_found'             => __( 'No people found', 'ph-peeps' ),
		'not_found_in_trash'    => __( 'No people found in Trash', 'ph-peeps' ),
		'all_items'             => __( 'All People', 'ph-peeps' ),
		'featured_image'        => __( 'Profile Picture', 'ph-peeps' ),
		'set_featured_image'    => __( 'Set profile picture', 'ph-peeps' ),
		'remove_featured_image' => __( 'Remove profile picture', 'ph-peeps' ),
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

	register_post_type( 'ph_peeps_people', $args );
}
add_action( 'init', __NAMESPACE__ . '\register_people_post_type' );
