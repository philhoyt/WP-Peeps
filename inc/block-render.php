<?php
/**
 * Render functions for the plugin's dynamic blocks.
 *
 * Every block declares `"render": "file:./render.php"` in its block.json, so
 * core requires build/blocks/<name>/render.php on each render of that block.
 * Those templates therefore hold no declarations: they only echo the output of
 * the functions below, which load once with the rest of inc/.
 *
 * @package PH_Peeps
 */

namespace PH_Peeps\Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Resolve the post a block renders for.
 *
 * Prefers the block context (Query Loop, patterns with an explicit postId) and
 * falls back to the global post.
 *
 * @param \WP_Block|null $block Block instance.
 * @return int Post ID, or 0 when none is available.
 */
function ph_peeps_get_block_post_id( $block ) {
	if ( isset( $block->context['postId'] ) ) {
		return (int) $block->context['postId'];
	}

	return (int) get_the_ID();
}

/**
 * Keep a tagName attribute within the tags the block's editor offers.
 *
 * @param mixed    $tag_name     The raw tagName attribute.
 * @param string[] $allowed_tags Tags the block may render.
 * @param string   $default_tag  Tag used when the attribute is missing or not allowed.
 * @return string A tag from the allowed list.
 */
function ph_peeps_validate_tag_name( $tag_name, $allowed_tags, $default_tag ) {
	return in_array( $tag_name, $allowed_tags, true ) ? $tag_name : $default_tag;
}

/**
 * Sanitize a space-separated class list token by token.
 *
 * Running sanitize_html_class() on the whole string strips the spaces, collapsing
 * "is-style-logos-only my-class" into one bogus class.
 *
 * @param mixed $class_list Space-separated class names.
 * @return string Sanitized class names joined by single spaces.
 */
function ph_peeps_sanitize_class_list( $class_list ) {
	if ( ! is_string( $class_list ) || '' === trim( $class_list ) ) {
		return '';
	}

	$classes = preg_split( '/\s+/', trim( $class_list ) );
	$classes = array_filter( array_map( 'sanitize_html_class', $classes ) );

	return implode( ' ', $classes );
}

/**
 * Inline HTML allowed in the phone and email prefix (matches the editor's
 * RichText ALLOWED_FORMATS: bold, italic, strikethrough, links).
 *
 * @return array wp_kses() allowed HTML.
 */
function ph_peeps_get_prefix_allowed_html() {
	return array(
		'strong' => array(),
		'em'     => array(),
		'a'      => array(
			'href'   => array(),
			'rel'    => array(),
			'target' => array(),
		),
		's'      => array(),
		'span'   => array( 'style' => array() ),
	);
}

/**
 * Render the Full Name block.
 *
 * @param array     $attributes The block attributes containing name display settings.
 * @param string    $content    The block default content.
 * @param \WP_Block $block      Block instance.
 * @return string              The rendered HTML for the full name block.
 */
function ph_peeps_render_full_name_block( $attributes, $content, $block ) {
	$post_id = ph_peeps_get_block_post_id( $block );

	// Bail early if no post ID.
	if ( empty( $post_id ) ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'WP Peeps: Full Name block - No post ID available' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
		return '';
	}

	// Get and sanitize attributes.
	$show_first  = ! empty( $attributes['showFirst'] );
	$show_middle = ! empty( $attributes['showMiddle'] );
	$show_last   = ! empty( $attributes['showLast'] );
	$tag_name    = ph_peeps_validate_tag_name(
		$attributes['tagName'] ?? 'h2',
		array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ),
		'h2'
	);
	$make_link   = ! empty( $attributes['makeLink'] );

	// Never link when individual profile pages are disabled: the link would 404.
	if ( $make_link && ! filter_var( get_option( 'ph_peeps_public_cpt', true ), FILTER_VALIDATE_BOOLEAN ) ) {
		$make_link = false;
	}

	// Get name parts from meta.
	$first_name  = get_post_meta( $post_id, 'ph_peeps_first_name', true );
	$middle_name = get_post_meta( $post_id, 'ph_peeps_middle_name', true );
	$last_name   = get_post_meta( $post_id, 'ph_peeps_last_name', true );

	// Build name parts array.
	$name_parts = array();
	if ( $show_first && ! empty( $first_name ) ) {
		$name_parts[] = sanitize_text_field( $first_name );
	}
	if ( $show_middle && ! empty( $middle_name ) ) {
		$name_parts[] = sanitize_text_field( $middle_name );
	}
	if ( $show_last && ! empty( $last_name ) ) {
		$name_parts[] = sanitize_text_field( $last_name );
	}

	// Return early if no name parts.
	if ( empty( $name_parts ) ) {
		return '';
	}

	$full_name = implode( ' ', $name_parts );

	// Get block wrapper attributes.
	$wrapper_attributes = get_block_wrapper_attributes();

	// Handle link if enabled.
	if ( $make_link ) {
		$link_attrs = array(
			'href' => esc_url( get_permalink( $post_id ) ),
		);

		if ( ! empty( $attributes['openInNewTab'] ) ) {
			$link_attrs['target'] = '_blank';
			// Add rel="noopener" for security when target="_blank" is used.
			$raw_rel           = ! empty( $attributes['linkRel'] ) ? sanitize_text_field( $attributes['linkRel'] ) : '';
			$link_rel          = ! empty( $raw_rel ) ? $raw_rel . ' noopener' : 'noopener';
			$link_attrs['rel'] = trim( $link_rel );
		} elseif ( ! empty( $attributes['linkRel'] ) ) {
			$link_attrs['rel'] = sanitize_text_field( $attributes['linkRel'] );
		}

		// Build link attributes string.
		$link_attrs_str = '';
		foreach ( $link_attrs as $key => $value ) {
			$link_attrs_str .= sprintf( ' %s="%s"', esc_attr( $key ), esc_attr( $value ) );
		}

		$full_name = sprintf( '<a%s>%s</a>', $link_attrs_str, esc_html( $full_name ) );
	}

	// Build and return the final HTML.
	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		tag_escape( $tag_name ),
		$wrapper_attributes,
		$full_name
	);
}

/**
 * Render the Phone block.
 *
 * @param array     $attributes The block attributes containing phone-related settings.
 * @param string    $content    The block default content.
 * @param \WP_Block $block      Block instance.
 * @return string              The rendered HTML for the phone block.
 */
function ph_peeps_render_phone_block( $attributes, $content, $block ) {
	$post_id = ph_peeps_get_block_post_id( $block );

	// Bail early if no post ID.
	if ( empty( $post_id ) ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'WP Peeps: Phone block - No post ID available' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
		return '';
	}

	// Get and sanitize phone number. Guard against non-string meta so a bad
	// stored value degrades to empty output instead of a fatal error.
	$phone = get_post_meta( $post_id, 'ph_peeps_phone', true );
	if ( empty( $phone ) || ! is_string( $phone ) ) {
		return '';
	}

	// Get and sanitize attributes.
	$tag_name = ph_peeps_validate_tag_name( $attributes['tagName'] ?? 'p', array( 'p', 'div', 'span' ), 'p' );
	$prefix   = ! empty( $attributes['prefix'] ) ? wp_kses( $attributes['prefix'], ph_peeps_get_prefix_allowed_html() ) . ' ' : '';

	// Format phone number.
	$format          = get_option( 'ph_peeps_phone_format', PH_PEEPS_DEFAULT_PHONE_FORMAT );
	$formatted_phone = ph_peeps_format_phone_number( $phone, $format );

	// Get extension.
	$ext        = get_post_meta( $post_id, 'ph_peeps_phone_ext', true );
	$ext        = is_string( $ext ) ? sanitize_text_field( $ext ) : '';
	$ext_suffix = ! empty( $ext ) ? ' x' . esc_html( $ext ) : '';

	// Get block wrapper attributes.
	$wrapper_attributes = get_block_wrapper_attributes();

	// Build the tel: href (RFC 3966 extension format).
	$tel_digits = preg_replace( '/[^0-9+]/', '', $phone );
	$tel_href   = ! empty( $ext ) ? $tel_digits . ';ext=' . rawurlencode( $ext ) : $tel_digits;

	// Build phone content.
	if ( ! empty( $attributes['makeLink'] ) ) {
		$phone_content = sprintf(
			'%1$s<a href="tel:%2$s">%3$s</a>',
			$prefix,
			esc_attr( $tel_href ),
			esc_html( $formatted_phone . $ext_suffix )
		);
	} else {
		$phone_content = $prefix . esc_html( $formatted_phone . $ext_suffix );
	}

	// Build and return the final HTML.
	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		tag_escape( $tag_name ),
		$wrapper_attributes,
		$phone_content
	);
}

/**
 * Format a phone number according to the given format.
 *
 * @param string $phone  The phone number to format.
 * @param string $format The format template.
 * @return string       The formatted phone number.
 */
function ph_peeps_format_phone_number( $phone, $format ) {
	if ( empty( $phone ) || empty( $format ) ) {
		return '';
	}

	$formatted_phone   = $format;
	$digits            = preg_replace( '/[^0-9]/', '', $phone );
	$placeholder_count = substr_count( $format, '#' );

	$digits_length = strlen( $digits );
	for ( $i = 0; $i < $digits_length && $i < $placeholder_count; $i++ ) {
		$formatted_phone = preg_replace( '/#/', $digits[ $i ], $formatted_phone, 1 );
	}

	// If we have more digits than format placeholders, append them.
	if ( $digits_length > $placeholder_count ) {
		$formatted_phone .= substr( $digits, $placeholder_count );
	}

	// Remove any remaining placeholders.
	$formatted_phone = preg_replace( '/#/', '', $formatted_phone );

	return trim( $formatted_phone );
}

/**
 * Render the Email block.
 *
 * @param array     $attributes The block attributes containing email-related settings.
 * @param string    $content    The block default content.
 * @param \WP_Block $block      Block instance.
 * @return string              The rendered HTML for the email block.
 */
function ph_peeps_render_email_block( $attributes, $content, $block ) {
	$post_id = ph_peeps_get_block_post_id( $block );

	// Bail early if no post ID.
	if ( empty( $post_id ) ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'WP Peeps: Email block - No post ID available' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
		return '';
	}

	// Get email from post meta.
	$email = get_post_meta( $post_id, 'ph_peeps_email', true );

	// Return early if no email exists. Guard against non-string meta so a bad
	// stored value degrades to empty output instead of a fatal error.
	if ( empty( $email ) || ! is_string( $email ) ) {
		return '';
	}

	// Get and sanitize attributes.
	$tag_name = ph_peeps_validate_tag_name( $attributes['tagName'] ?? 'p', array( 'p', 'div', 'span' ), 'p' );
	$prefix   = ! empty( $attributes['prefix'] ) ? wp_kses( $attributes['prefix'], ph_peeps_get_prefix_allowed_html() ) . ' ' : '';

	// Get block wrapper attributes.
	$wrapper_attributes = get_block_wrapper_attributes();

	// Build email content.
	if ( ! empty( $attributes['makeLink'] ) ) {
		$email_content = sprintf(
			'%1$s<a href="mailto:%2$s">%3$s</a>',
			$prefix,
			esc_attr( $email ),
			esc_html( $email )
		);
	} else {
		$email_content = $prefix . esc_html( $email );
	}

	// Return the email wrapped in its HTML tag.
	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		tag_escape( $tag_name ),
		$wrapper_attributes,
		$email_content
	);
}

/**
 * Placeholder links shown in the editor when a person has none yet.
 *
 * @return array List of { platform, url } pairs.
 */
function ph_peeps_get_default_social_links() {
	return [
		[
			'platform' => 'linkedin',
			'url'      => '#',
		],
		[
			'platform' => 'github',
			'url'      => '#',
		],
		[
			'platform' => 'facebook',
			'url'      => '#',
		],
	];
}

/**
 * Render the social links block.
 *
 * @param array     $attributes The block attributes.
 * @param string    $content    The block default content.
 * @param \WP_Block $block      Block instance.
 * @return string The rendered block content.
 */
function ph_peeps_render_social_links_block( $attributes, $content, $block ) {
	$post_id = ph_peeps_get_block_post_id( $block );

	// Get social links based on context.
	$social_links = ph_peeps_get_social_links( $post_id );

	// Only return empty on frontend when no social links exist.
	if ( empty( $social_links ) && ! ph_peeps_is_editor_request() ) {
		return '';
	}

	// Extract and sanitize block attributes.
	$block_attrs = ph_peeps_get_social_block_attributes( $attributes );

	// Build block classes and styles.
	$classes = ph_peeps_get_social_block_classes( $block_attrs );
	$styles  = ph_peeps_get_social_block_styles( $block_attrs );

	// Get block wrapper attributes.
	$wrapper_attributes = get_block_wrapper_attributes(
		[
			'class' => implode( ' ', array_filter( $classes ) ),
			'style' => implode( '; ', $styles ),
		]
	);

	// Build block content.
	$block_content = ph_peeps_build_social_block_content(
		$social_links,
		$block_attrs,
		$wrapper_attributes,
	);

	// Parse and render the block.
	$parsed_blocks = parse_blocks( $block_content );
	return ! empty( $parsed_blocks ) ? render_block( $parsed_blocks[0] ) : '';
}

/**
 * Whether the block is being rendered for the editor.
 *
 * The editor previews this block through the block-renderer REST endpoint
 * (ServerSideRender), so a REST request is the editor context.
 *
 * @return bool True when serving a REST request.
 */
function ph_peeps_is_editor_request() {
	return wp_is_serving_rest_request();
}

/**
 * Get social links for a person.
 *
 * @param int $post_id The person's post ID.
 * @return array|null Array of social links or null if no links exist on frontend.
 */
function ph_peeps_get_social_links( $post_id ) {
	// Get social links from post meta.
	$social_links     = $post_id ? get_post_meta( $post_id, 'ph_peeps_social_links', true ) : null;
	$has_social_links = ! empty( $social_links ) && is_array( $social_links );

	// If we have social links, return them regardless of context.
	if ( $has_social_links ) {
		return $social_links;
	}

	// If we're in editor and don't have social links, return defaults.
	if ( ph_peeps_is_editor_request() ) {
		return ph_peeps_get_default_social_links();
	}

	// If we're on frontend and don't have social links, return null.
	return null;
}

/**
 * Get sanitized block attributes.
 *
 * @param array $attributes Raw block attributes.
 * @return array Sanitized attributes.
 */
function ph_peeps_get_social_block_attributes( $attributes ) {
	return [
		'size'                => sanitize_html_class( $attributes['size'] ?? 'has-normal-icon-size' ),
		'iconColor'           => sanitize_hex_color( $attributes['iconColorValue'] ?? '' ),
		'iconBackgroundColor' => sanitize_hex_color( $attributes['iconBackgroundColorValue'] ?? '' ),
		'orientation'         => sanitize_text_field( $attributes['layout']['orientation'] ?? 'horizontal' ),
		'justify'             => sanitize_text_field( $attributes['layout']['justifyContent'] ?? '' ),
		'verticalAlign'       => sanitize_text_field( $attributes['layout']['verticalAlignment'] ?? '' ),
		'gap'                 => sanitize_text_field( $attributes['style']['spacing']['blockGap'] ?? '' ),
		'className'           => ph_peeps_sanitize_class_list( $attributes['className'] ?? '' ),
		'showLabels'          => rest_sanitize_boolean( $attributes['showLabels'] ?? false ),
		'openInNewTab'        => rest_sanitize_boolean( $attributes['openInNewTab'] ?? false ),
		'flexWrap'            => sanitize_text_field( $attributes['layout']['flexWrap'] ?? 'nowrap' ),
	];
}

/**
 * Get block classes.
 *
 * @param array $block_attrs Sanitized block attributes.
 * @return array Block classes.
 */
function ph_peeps_get_social_block_classes( $block_attrs ) {
	$classes = [
		'wp-block-social-links',
		'ph-peeps-social-links',
		$block_attrs['size'],
		$block_attrs['className'],
	];

	// Core's social-links CSS keys off the style class, so fall back to the
	// default style only when the block has not chosen one.
	if ( ! preg_match( '/(^|\s)is-style-/', $block_attrs['className'] ) ) {
		$classes[] = 'is-style-default';
	}

	// Add orientation class.
	if ( $block_attrs['orientation'] === 'vertical' ) {
		$classes[] = 'is-vertical';
	}

	if ( $block_attrs['showLabels'] ) {
		$classes[] = 'has-visible-labels';
	}

	if ( $block_attrs['iconColor'] ) {
		$classes[] = 'has-icon-color';
	}

	if ( $block_attrs['iconBackgroundColor'] ) {
		$classes[] = 'has-icon-background-color';
	}

	// Add flex wrap class.
	if ( isset( $block_attrs['flexWrap'] ) ) {
		$classes[] = $block_attrs['flexWrap'] === 'wrap' ? 'is-wrap' : 'is-nowrap';
	}

	// Add layout classes.
	$classes[] = 'is-layout-flex';
	$classes[] = 'wp-block-social-links-is-layout-flex';
	$classes[] = sprintf( 'is-content-justification-%s', ! empty( $block_attrs['justify'] ) ? $block_attrs['justify'] : 'left' );

	return $classes;
}

/**
 * Get block styles.
 *
 * @param array $block_attrs Sanitized block attributes.
 * @return array Block styles.
 */
function ph_peeps_get_social_block_styles( $block_attrs ) {
	$styles = [];

	if ( $block_attrs['orientation'] === 'vertical' ) {
		$styles = array_merge( $styles, ph_peeps_get_vertical_styles( $block_attrs ) );
	} else {
		$styles = array_merge( $styles, ph_peeps_get_horizontal_styles( $block_attrs ) );
	}

	$gap_style = ph_peeps_get_gap_style( $block_attrs['gap'] );
	if ( $gap_style ) {
		$styles[] = $gap_style;
	}

	return $styles;
}

/**
 * Get vertical alignment styles.
 *
 * @param array $block_attrs Block attributes.
 * @return array Array of CSS styles.
 */
function ph_peeps_get_vertical_styles( $block_attrs ) {
	$styles = [];

	$vertical_align_map = [
		'top'           => 'flex-start',
		'middle'        => 'center',
		'bottom'        => 'flex-end',
		'space-between' => 'space-between',
	];

	$justify_map = [
		'left'    => 'flex-start',
		'center'  => 'center',
		'right'   => 'flex-end',
		'stretch' => 'stretch',
	];

	// Set flex direction for vertical orientation.
	$styles[] = 'flex-direction: column';

	if ( ! empty( $block_attrs['verticalAlign'] ) && isset( $vertical_align_map[ $block_attrs['verticalAlign'] ] ) ) {
		$styles[] = sprintf( 'justify-content: %s', $vertical_align_map[ $block_attrs['verticalAlign'] ] );
	}

	if ( ! empty( $block_attrs['justify'] ) && isset( $justify_map[ $block_attrs['justify'] ] ) ) {
		$styles[] = sprintf( 'align-items: %s', $justify_map[ $block_attrs['justify'] ] );
	}

	// Apply flex wrap.
	if ( isset( $block_attrs['flexWrap'] ) ) {
		$styles[] = sprintf( 'flex-wrap: %s', $block_attrs['flexWrap'] );
	}

	return $styles;
}

/**
 * Get horizontal alignment styles.
 *
 * @param array $block_attrs Block attributes.
 * @return array Array of CSS styles.
 */
function ph_peeps_get_horizontal_styles( $block_attrs ) {
	$styles = [];

	$justify_map = [
		'left'          => 'flex-start',
		'center'        => 'center',
		'right'         => 'flex-end',
		'space-between' => 'space-between',
	];

	// Set flex direction for horizontal orientation.
	$styles[] = 'flex-direction: row';

	if ( ! empty( $block_attrs['justify'] ) && isset( $justify_map[ $block_attrs['justify'] ] ) ) {
		$styles[] = sprintf( 'justify-content: %s', $justify_map[ $block_attrs['justify'] ] );
	}

	if ( ! empty( $block_attrs['verticalAlign'] ) ) {
		$styles[] = sprintf( 'align-items: %s', $block_attrs['verticalAlign'] === 'top' ? 'flex-start' : $block_attrs['verticalAlign'] );
	}

	// Apply flex wrap.
	if ( isset( $block_attrs['flexWrap'] ) ) {
		$styles[] = sprintf( 'flex-wrap: %s', $block_attrs['flexWrap'] );
	}

	return $styles;
}

/**
 * Get the gap declaration.
 *
 * Returned without a trailing semicolon: the caller joins declarations with
 * "; " itself.
 *
 * @param string $gap Gap value.
 * @return string|null Gap declaration or null if not set.
 */
function ph_peeps_get_gap_style( $gap ) {
	if ( empty( $gap ) ) {
		return null;
	}

	$gap_value = $gap;

	// Handle preset values.
	if ( str_starts_with( $gap, 'var:preset|spacing|' ) ) {
		$preset    = str_replace( 'var:preset|spacing|', '', $gap );
		$gap_value = sprintf( 'var(--wp--preset--spacing--%s)', sanitize_html_class( $preset ) );
	}

	return sprintf( 'gap: %s', esc_attr( $gap_value ) );
}

/**
 * Build block content.
 *
 * @param array  $social_links Social links.
 * @param array  $block_attrs Sanitized block attributes.
 * @param string $wrapper_attributes Block wrapper attributes.
 * @return string Block content.
 */
function ph_peeps_build_social_block_content( $social_links, $block_attrs, $wrapper_attributes ) {
	$block_content = sprintf(
		'<!-- wp:social-links {"openInNewTab":%s,"showLabels":%s,"className":"%s","iconColorValue":"%s","iconBackgroundColorValue":"%s","layout":{"type":"flex","orientation":"%s","justifyContent":"%s","verticalAlignment":"%s","flexWrap":"%s"}} -->',
		$block_attrs['openInNewTab'] ? 'true' : 'false',
		$block_attrs['showLabels'] ? 'true' : 'false',
		implode( ' ', array_filter( ph_peeps_get_social_block_classes( $block_attrs ) ) ),
		esc_attr( $block_attrs['iconColor'] ),
		esc_attr( $block_attrs['iconBackgroundColor'] ),
		esc_attr( $block_attrs['orientation'] ),
		esc_attr( $block_attrs['justify'] ),
		esc_attr( $block_attrs['verticalAlign'] ),
		esc_attr( $block_attrs['flexWrap'] )
	) . "\n";

	$block_content .= sprintf(
		'<ul %s>',
		$wrapper_attributes
	);

	// Add each social link.
	foreach ( $social_links as $link ) {
		$service = sanitize_key( strtolower( $link['platform'] ) ); // Sanitize platform name.
		$url     = esc_url_raw( $link['url'] ); // Use esc_url_raw for JSON encoding.

		// Build JSON attributes properly to prevent XSS.
		$block_attributes = wp_json_encode(
			array(
				'url'     => $url,
				'service' => $service,
			),
			JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
		);

		$block_content .= sprintf(
			'<!-- wp:social-link %s /-->',
			$block_attributes
		);
	}

	// Close the social links block.
	$block_content .= '</ul>' . "\n";
	$block_content .= '<!-- /wp:social-links -->';

	return $block_content;
}
