<?php
/**
 * Activation functionality
 */

// Use the main plugin file for activation hook
register_activation_hook( WP_PEEPS_PLUGIN_FILE, 'wp_peeps_activation' );
function wp_peeps_activation() {
	set_transient( 'wp_peeps_show_permalink_notice', true, 5 * MINUTE_IN_SECONDS );
}

// Use plugin_basename with the main plugin file
add_filter( 'plugin_action_links_' . plugin_basename( WP_PEEPS_PLUGIN_FILE ), 'wp_peeps_add_settings_link' );
function wp_peeps_add_settings_link( $links ) {
	$settings_link = '<a href="' . admin_url( 'edit.php?post_type=wp_peeps_people&page=wp-peeps-settings' ) . '">' . __( 'Settings', 'wp-peeps' ) . '</a>';
	array_unshift( $links, $settings_link );
	return $links;
}
