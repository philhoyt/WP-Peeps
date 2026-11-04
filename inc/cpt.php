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
	$is_public     = get_option( 'ph_peeps_public_cpt', true );
	$is_public     = filter_var( $is_public, FILTER_VALIDATE_BOOLEAN );
	$has_archive   = get_option( 'ph_peeps_has_archive', true );
	$has_archive   = filter_var( $has_archive, FILTER_VALIDATE_BOOLEAN );
	$slug          = get_option( 'ph_peeps_cpt_slug', PH_PEEPS_DEFAULT_CPT_SLUG );
	$menu_position = get_option( 'ph_peeps_menu_position', PH_PEEPS_DEFAULT_MENU_POSITION );

	$labels = array(
		'name'                  => _x( 'People', 'Post type general name', 'peeps-people-directory' ),
		'singular_name'         => _x( 'Person', 'Post type singular name', 'peeps-people-directory' ),
		'menu_name'             => _x( 'People', 'Admin Menu text', 'peeps-people-directory' ),
		'add_new'               => __( 'Add New', 'peeps-people-directory' ),
		'add_new_item'          => __( 'Add New Person', 'peeps-people-directory' ),
		'edit_item'             => __( 'Edit Person', 'peeps-people-directory' ),
		'new_item'              => __( 'New Person', 'peeps-people-directory' ),
		'view_item'             => __( 'View Person', 'peeps-people-directory' ),
		'view_items'            => __( 'View People', 'peeps-people-directory' ),
		'search_items'          => __( 'Search People', 'peeps-people-directory' ),
		'not_found'             => __( 'No people found', 'peeps-people-directory' ),
		'not_found_in_trash'    => __( 'No people found in Trash', 'peeps-people-directory' ),
		'all_items'             => __( 'All People', 'peeps-people-directory' ),
		'featured_image'        => __( 'Profile Picture', 'peeps-people-directory' ),
		'set_featured_image'    => __( 'Set profile picture', 'peeps-people-directory' ),
		'remove_featured_image' => __( 'Remove profile picture', 'peeps-people-directory' ),
	);

	$args = array(
		'labels'              => $labels,
		'public'              => $is_public,
		'publicly_queryable'  => true,
		'exclude_from_search' => ! $is_public,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'query_var'           => true,
		'rewrite'             => array( 'slug' => $slug ),
		'capability_type'     => 'post',
		'has_archive'         => $has_archive,
		'hierarchical'        => false,
		'menu_position'       => (int) $menu_position,
		'menu_icon'           => 'dashicons-groups',
		'supports'            => array(
			'title',
			'editor',
			'thumbnail',
			'excerpt',
			'custom-fields',
		),
		'show_in_rest'        => true,
	);

	register_post_type( 'ph_peeps_people', $args );
}
add_action( 'init', __NAMESPACE__ . '\register_people_post_type' );

/**
 * Whether individual profile pages are enabled.
 *
 * Reads the "Enable Individual Profile Pages" setting (option key
 * ph_peeps_public_cpt). This is not access control: people are always
 * queryable and listable; the toggle only decides whether each person
 * has a page of their own.
 *
 * @return bool
 */
function profile_pages_enabled() {
	return filter_var( get_option( 'ph_peeps_public_cpt', true ), FILTER_VALIDATE_BOOLEAN );
}

/**
 * Return a 404 for single person profiles when profile pages are disabled.
 *
 * The CPT is always registered with publicly_queryable: true so it remains
 * available in the Query Loop block regardless of the setting. This
 * function enforces the "Enable Individual Profile Pages" toggle by
 * returning a 404 for any direct request to a single person profile when
 * the toggle is off, for all visitors.
 *
 * @return void
 */
function block_single_profile_access() {
	if ( ! is_singular( 'ph_peeps_people' ) ) {
		return;
	}

	if ( profile_pages_enabled() ) {
		return;
	}

	global $wp_query;
	$wp_query->set_404();
	status_header( 404 );
	nocache_headers();
}
add_action( 'template_redirect', __NAMESPACE__ . '\block_single_profile_access' );

/**
 * Exclude people from core sitemaps when profile pages are disabled.
 *
 * Without a page of their own, people have nothing to list in the sitemap.
 *
 * @param WP_Post_Type[] $post_types Post types included in the sitemap, keyed by name.
 * @return WP_Post_Type[]
 */
function exclude_people_from_sitemaps( $post_types ) {
	if ( ! profile_pages_enabled() ) {
		unset( $post_types['ph_peeps_people'] );
	}

	return $post_types;
}
add_filter( 'wp_sitemaps_post_types', __NAMESPACE__ . '\exclude_people_from_sitemaps' );
