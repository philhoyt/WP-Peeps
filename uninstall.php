<?php
/**
 * Uninstall handler
 *
 * Runs when the plugin is deleted from the Plugins screen. It removes the
 * plugin's own options and nothing else: people posts and their meta are
 * intentionally kept, since deleting a site's directory content on uninstall
 * would be destructive and is not something the plugin should decide.
 *
 * @package PH_Peeps
 */

// Exit if not called by WordPress during plugin deletion.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

$ph_peeps_options = array(
	'ph_peeps_public_cpt',
	'ph_peeps_has_archive',
	'ph_peeps_phone_format',
	'ph_peeps_cpt_slug',
	'ph_peeps_menu_position',
);

foreach ( $ph_peeps_options as $ph_peeps_option ) {
	delete_option( $ph_peeps_option );
}
