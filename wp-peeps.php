<?php
/**
 * Plugin Name:       WP Peeps
 * Description:       A directory of people for your WordPress site.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            Phil Hoyt
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-peeps
 *
 * @package WP-Peeps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Include custom post type registration.
require_once plugin_dir_path( __FILE__ ) . 'inc/cpt.php';

// Include meta field registration.
require_once plugin_dir_path( __FILE__ ) . 'inc/meta.php';

// Include editor registration.
require_once plugin_dir_path( __FILE__ ) . 'inc/editor.php';

// Include admin registration.
require_once plugin_dir_path( __FILE__ ) . 'inc/admin.php';

// Include settings registration.
require_once plugin_dir_path( __FILE__ ) . 'inc/settings.php';

/**
 * Add activation hook to set a transient
 */
register_activation_hook( __FILE__, 'wp_peeps_activation' );
function wp_peeps_activation() {
	set_transient( 'wp_peeps_show_permalink_notice', true, 5 * MINUTE_IN_SECONDS );
}

/**
 * Display admin notice if transient is set
 */
add_action( 'admin_notices', 'wp_peeps_admin_notices' );
function wp_peeps_admin_notices() {
	if ( get_transient( 'wp_peeps_show_permalink_notice' ) ) {
		?>
		<div class="notice notice-warning is-dismissible">
			<p><?php _e( 'Please visit the Permalinks page and click "Save Changes" to update your URLs.', 'wp-peeps' ); ?></p>
			<p><a href="<?php echo admin_url( 'options-permalink.php' ); ?>" class="button button-secondary"><?php _e( 'Visit Permalinks Page', 'wp-peeps' ); ?></a></p>
		</div>
		<?php
		delete_transient( 'wp_peeps_show_permalink_notice' );
	}
}

/**
 * Add settings link to plugins page
 *
 * @param array $links Plugin action links
 * @return array Modified plugin action links
 */
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'wp_peeps_add_settings_link' );
function wp_peeps_add_settings_link( $links ) {
	$settings_link = '<a href="' . admin_url( 'edit.php?post_type=people&page=wp-peeps-settings' ) . '">' . __( 'Settings', 'wp-peeps' ) . '</a>';
	array_unshift( $links, $settings_link );
	return $links;
}

function wp_peeps_init() {
	// Register the full name block
	register_block_type(
		__DIR__ . '/build/blocks/full-name',
		array(
			'render_callback' => 'wp_peeps_render_full_name_block',
		)
	);

	// Register the phone block
	register_block_type(
		__DIR__ . '/build/blocks/phone',
		array(
			'render_callback' => 'wp_peeps_render_phone_block',
		)
	);
}

// Use init hook to register blocks
add_action('init', 'wp_peeps_init');

// Include render callbacks
require_once __DIR__ . '/src/blocks/full-name/render.php';
require_once __DIR__ . '/src/blocks/phone/render.php';
