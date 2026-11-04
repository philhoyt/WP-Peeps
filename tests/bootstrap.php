<?php
/**
 * PHPUnit bootstrap file.
 *
 * Loads the WordPress test suite (WP_UnitTestCase) and this plugin.
 *
 * @package PH_Peeps
 */

$ph_peeps_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( ! $ph_peeps_tests_dir ) {
	$ph_peeps_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

// Point the WordPress test suite at the PHPUnit Polyfills from this plugin's
// Composer dependencies unless the environment names another copy.
$ph_peeps_polyfills_path = getenv( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH' );
if ( false === $ph_peeps_polyfills_path ) {
	$ph_peeps_polyfills_path = dirname( __DIR__ ) . '/vendor/yoast/phpunit-polyfills';
}
if ( ! defined( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH' ) && is_dir( $ph_peeps_polyfills_path ) ) {
	define( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH', $ph_peeps_polyfills_path );
}

if ( ! file_exists( "{$ph_peeps_tests_dir}/includes/functions.php" ) ) {
	echo "Could not find {$ph_peeps_tests_dir}/includes/functions.php. Run the tests through wp-env: npm run test:php" . PHP_EOL; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	exit( 1 );
}

// Give access to tests_add_filter() function.
require_once "{$ph_peeps_tests_dir}/includes/functions.php";

/**
 * Manually load the plugin being tested.
 *
 * @return void
 */
function ph_peeps_tests_load_plugin() {
	require dirname( __DIR__ ) . '/peeps-people-directory.php';
}
tests_add_filter( 'muplugins_loaded', 'ph_peeps_tests_load_plugin' );

// Start up the WP testing environment.
require "{$ph_peeps_tests_dir}/includes/bootstrap.php";
