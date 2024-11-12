<?php

function wp_peeps_render_phone_block( $attributes, $content ) {
    $post_id = get_the_ID();
    $phone = get_post_meta( $post_id, 'wp_peeps_phone', true );
    
    if ( empty( $phone ) ) {
        return '';
    }

    $tag_name = $attributes['tagName'] ?? 'p';
    $wrapper_attributes = get_block_wrapper_attributes();
    $prefix = ! empty( $attributes['prefix'] ) ? esc_html( $attributes['prefix'] ) . ' ' : '';
    
    if ( ! empty( $attributes['makeLink'] ) ) {
        $phone_number = preg_replace( '/[^0-9]/', '', $phone );
        $phone_content = sprintf(
            '%1$s<a href="tel:%2$s">%3$s</a>',
            $prefix,
            esc_attr( $phone_number ),
            esc_html( $phone )
        );
    } else {
        $phone_content = $prefix . esc_html( $phone );
    }

    return sprintf(
        '<%1$s %2$s>%3$s</%1$s>',
        esc_html( $tag_name ),
        $wrapper_attributes,
        $phone_content
    );
} 