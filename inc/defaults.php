<?php
/**
 * Plugin default values
 *
 * Single source of truth for all default setting values used across
 * PHP and referenced by JavaScript constants in src/blocks/constants.js.
 *
 * @package PH_Peeps
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PH_PEEPS_DEFAULT_PHONE_FORMAT', '(###) ###-####' );
define( 'PH_PEEPS_DEFAULT_CPT_SLUG', 'people' );
define( 'PH_PEEPS_DEFAULT_MENU_POSITION', 25 );
