<?php
/**
 * Register plugin settings
 */
function register_plugin_settings() {
    register_setting(
        'wp_peeps',                  // Option group
        'wp_peeps_public_cpt',       // Option name
        array(
            'type'         => 'boolean',
            'default'      => true,
            'show_in_rest' => array(
                'name' => 'wp_peeps_public_cpt',
                'schema' => array(
                    'type'    => 'boolean',
                    'default' => true,
                ),
            ),
            'description' => __('Whether the People CPT is public', 'wp-peeps'),
        )
    );
}
add_action('init', 'register_plugin_settings');
