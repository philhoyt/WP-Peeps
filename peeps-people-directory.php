<?php
/**
 * Plugin Name:       Peeps – People Directory
 * Plugin URI:        https://github.com/philhoyt/WP-Peeps
 * Description:       A directory of people for your WordPress site.
 * Requires at least: 6.7.2
 * Requires PHP:      8.0
 * Version:           2.6.0
 * Author:            Phil Hoyt
 * Author URI:        https://philhoyt.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       peeps-people-directory
 *
 * @package PH_Peeps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// At the top of the file, after the ABSPATH check.
define( 'PH_PEEPS_PLUGIN_FILE', __FILE__ );
define( 'PH_PEEPS_PLUGIN_DIR', __DIR__ . '/' );

// Core includes.
require_once __DIR__ . '/inc/defaults.php';
require_once __DIR__ . '/inc/cpt.php';
require_once __DIR__ . '/inc/meta.php';
require_once __DIR__ . '/inc/editor.php';
require_once __DIR__ . '/inc/admin.php';
require_once __DIR__ . '/inc/settings.php';
require_once __DIR__ . '/inc/activation.php';
require_once __DIR__ . '/inc/block-render.php';
require_once __DIR__ . '/inc/blocks.php';
require_once __DIR__ . '/inc/templates.php';

// Updates are delivered from GitHub releases via Plugin Update Checker.
// The library is copied into lib/ by Composer (see composer.json copy-puc);
// a source checkout without it simply gets no update checks.
$ph_peeps_puc_file = PH_PEEPS_PLUGIN_DIR . 'lib/plugin-update-checker/plugin-update-checker.php';
if ( file_exists( $ph_peeps_puc_file ) ) {
	require_once $ph_peeps_puc_file;

	$ph_peeps_update_checker = \YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
		'https://github.com/philhoyt/WP-Peeps/',
		__FILE__,
		'peeps-people-directory'
	);

	// Only ever install the zip the release workflow attaches. Without
	// REQUIRE_RELEASE_ASSETS a release missing its asset would fall back to
	// GitHub's source archive, which extracts to WP-Peeps-x.y.z/.
	$ph_peeps_update_api = $ph_peeps_update_checker->getVcsApi();
	$ph_peeps_update_api->enableReleaseAssets( '/\.zip$/', $ph_peeps_update_api::REQUIRE_RELEASE_ASSETS );
}
