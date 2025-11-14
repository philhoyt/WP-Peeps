<?php
/**
 * Admin notices functionality
 *
 * @package WP_Peeps
 */
namespace WP_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Display admin notices
 *
 * Shows admin notices for plugin configuration.
 *
 * @return void
 */
function admin_notices() {
	// Permalink notice removed - rewrite rules are now flushed automatically on activation.
}
add_action( 'admin_notices', __NAMESPACE__ . '\admin_notices' );
