<?php
/**
 * Editor functionality
 *
 * @package PH_Peeps
 */

namespace PH_Peeps\Inc;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue editor JavaScript and canvas styles.
 *
 * Runs on enqueue_block_editor_assets. Styles added here via add_editor_style()
 * target the editor canvas iframe. The sidebar/admin-page styles are loaded
 * separately via enqueue_editor_ui_styles() to avoid being injected into the
 * iframe in WordPress 7+.
 *
 * @return void
 */
function enqueue_editor_assets() {
	// Check if user can edit posts.
	if ( ! current_user_can( 'edit_posts' ) ) {
		return;
	}

	// Check the current post type.
	$current_post_type = get_current_screen()->post_type;
	if ( $current_post_type !== 'ph_peeps_people' ) {
		return;
	}

	$asset_file = include PH_PEEPS_PLUGIN_DIR . 'build/editor/index.asset.php';

	wp_enqueue_script(
		'ph-peeps-editor',
		plugins_url( 'build/editor/index.js', PH_PEEPS_PLUGIN_FILE ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// Load styles inside the editor canvas iframe (e.g. post title override).
	add_theme_support( 'editor-styles' );
	add_editor_style( plugins_url( 'build/editor/style-index.css', PH_PEEPS_PLUGIN_FILE ) );
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_assets' );

/**
 * Enqueue sidebar/admin-page styles for the editor UI.
 *
 * Uses wp_add_inline_style() rather than wp_enqueue_style() so the styles are
 * output as an inline <style> block. In WordPress 7+, <link> stylesheets on
 * the admin page are copied into the editor canvas iframe and trigger a
 * deprecation warning. Inline styles are not copied, keeping sidebar-only
 * rules out of the iframe.
 *
 * @return void
 */
function enqueue_editor_ui_styles() {
	if ( ! current_user_can( 'edit_posts' ) ) {
		return;
	}

	$screen = get_current_screen();
	if ( ! $screen || $screen->post_type !== 'ph_peeps_people' ) {
		return;
	}

	wp_add_inline_style(
		'wp-edit-post',
		'.components-panel__body.ph-peeps-name-panel .components-base-control + .components-base-control,
		.components-panel__body.ph-peeps-contact-panel .components-base-control + .components-base-control,
		.components-panel__body.ph-peeps-social-links .components-base-control + .components-base-control {
			margin-top: 16px;
		}'
	);
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_editor_ui_styles' );
