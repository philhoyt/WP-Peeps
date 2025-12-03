<?php
/**
 * Activation functionality
 *
 * @package PH_Peeps
 */

namespace PH_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Plugin activation hook callback
 *
 * Registers the custom post type and flushes rewrite rules.
 *
 * @return void
 */
function activation() {
	// Register the custom post type first (since init hasn't fired yet).
	register_people_post_type();

	// Flush rewrite rules to make permalinks work immediately.
	flush_rewrite_rules();
}
register_activation_hook( PH_PEEPS_PLUGIN_FILE, __NAMESPACE__ . '\activation' );

/**
 * Plugin deactivation hook callback
 *
 * Flushes rewrite rules to clean up permalinks when the plugin is deactivated.
 *
 * @return void
 */
function deactivation() {
	flush_rewrite_rules();
}
register_deactivation_hook( PH_PEEPS_PLUGIN_FILE, __NAMESPACE__ . '\deactivation' );

/**
 * Add settings link to plugin action links
 *
 * Adds a "Settings" link to the plugin's action links on the plugins page.
 *
 * @param array $links Existing plugin action links.
 * @return array Modified plugin action links with settings link added.
 */
function add_settings_link( $links ) {
	$settings_link = '<a href="' . admin_url( 'edit.php?post_type=ph_peeps_people&page=ph-peeps-settings' ) . '">' . __( 'Settings', 'peeps-people-directory' ) . '</a>';
	array_unshift( $links, $settings_link );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( PH_PEEPS_PLUGIN_FILE ), __NAMESPACE__ . '\add_settings_link' );
