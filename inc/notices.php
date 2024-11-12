<?php
/**
 * Admin notices functionality
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