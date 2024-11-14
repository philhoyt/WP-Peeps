<?php
/**
 * Admin notices functionality
 *
 * @package WP_Peeps
 */

add_action( 'admin_notices', 'wp_peeps_admin_notices' );

/**
 * Display admin notices
 *
 * Shows admin notices for plugin configuration.
 *
 * @return void
 */
function wp_peeps_admin_notices() {
	if ( get_transient( 'wp_peeps_show_permalink_notice' ) ) {
		?>
		<div class="notice notice-warning is-dismissible">
			<p>
				<?php
				esc_html_e( 'Please visit the Permalinks page and click "Save Changes" to update your URLs.', 'wp-peeps' );
				?>
			</p>
			<p>
				<a href="<?php echo esc_url( admin_url( 'options-permalink.php' ) ); ?>" class="button button-secondary">
					<?php esc_html_e( 'Visit Permalinks Page', 'wp-peeps' ); ?>
				</a>
			</p>
		</div>
		<?php
		delete_transient( 'wp_peeps_show_permalink_notice' );
	}
}
