<?php
/**
 * Render template for the Email block.
 *
 * Core requires this file on every render of the block (block.json "render"),
 * so it declares nothing: it only echoes the output of the render function in
 * inc/block-render.php, which is loaded once by the plugin.
 *
 * @package PH_Peeps
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

echo \PH_Peeps\Blocks\ph_peeps_render_email_block( $attributes, $content, $block ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by the render function.
