<?php
/**
 * Activation functionality
 */
namespace WP_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Use the main plugin file for activation hook
function activation() {
	set_transient( 'wp_peeps_show_permalink_notice', true, 5 * MINUTE_IN_SECONDS );
}
register_activation_hook( WP_PEEPS_PLUGIN_FILE, __NAMESPACE__ . '\activation' );

// Use plugin_basename with the main plugin file
function add_settings_link( $links ) {
	$settings_link = '<a href="' . admin_url( 'edit.php?post_type=wp_peeps_people&page=wp-peeps-settings' ) . '">' . __( 'Settings', 'wp-peeps' ) . '</a>';
	array_unshift( $links, $settings_link );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( WP_PEEPS_PLUGIN_FILE ), __NAMESPACE__ . '\add_settings_link' );