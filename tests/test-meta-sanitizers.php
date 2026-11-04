<?php
/**
 * Tests for the post meta sanitize callbacks in inc/meta.php.
 *
 * A sanitize_callback's return value is written straight to the database, so
 * every callback must return a storable string or array and never a WP_Error.
 *
 * @package PH_Peeps
 */

use PH_Peeps\Inc;

/**
 * Meta sanitizer tests.
 */
class Test_Meta_Sanitizers extends WP_UnitTestCase {

	/**
	 * Valid phone numbers are reduced to digits.
	 *
	 * @return void
	 */
	public function test_validate_phone_keeps_digits_of_valid_number() {
		$this->assertSame( '5551234567', Inc\validate_phone( '(555) 123-4567' ) );
		$this->assertSame( '15551234567', Inc\validate_phone( '+1 555 123 4567' ) );
	}

	/**
	 * Invalid phone numbers become an empty string, never a WP_Error.
	 *
	 * @return void
	 */
	public function test_validate_phone_returns_empty_string_for_invalid_input() {
		$this->assertSame( '', Inc\validate_phone( '123' ) );
		$this->assertSame( '', Inc\validate_phone( '1234567890123456' ) );
		$this->assertSame( '', Inc\validate_phone( 'not a number' ) );
		$this->assertSame( '', Inc\validate_phone( '' ) );
		$this->assertSame( '', Inc\validate_phone( null ) );
		$this->assertSame( '', Inc\validate_phone( array( '5551234567' ) ) );
	}

	/**
	 * Valid email addresses are returned sanitized.
	 *
	 * @return void
	 */
	public function test_validate_email_returns_sanitized_address() {
		$this->assertSame( 'ada@example.com', Inc\validate_email( ' ada@example.com ' ) );
	}

	/**
	 * Invalid email addresses become an empty string, never a WP_Error.
	 *
	 * @return void
	 */
	public function test_validate_email_returns_empty_string_for_invalid_input() {
		$this->assertSame( '', Inc\validate_email( 'not-an-email' ) );
		$this->assertSame( '', Inc\validate_email( '' ) );
		$this->assertSame( '', Inc\validate_email( null ) );
		$this->assertSame( '', Inc\validate_email( array( 'ada@example.com' ) ) );
	}

	/**
	 * Valid social links are kept as { platform, url } pairs.
	 *
	 * @return void
	 */
	public function test_validate_social_links_keeps_valid_links() {
		$links = array(
			array(
				'platform' => 'github',
				'url'      => 'https://github.com/example',
			),
		);

		$this->assertSame( $links, Inc\validate_social_links( $links ) );
	}

	/**
	 * Malformed entries are dropped and non-array input becomes an empty array.
	 *
	 * @return void
	 */
	public function test_validate_social_links_drops_invalid_entries() {
		$links = array(
			array( 'platform' => 'github' ),
			array(
				'platform' => 'x',
				'url'      => '',
			),
			array(
				'platform' => 'linkedin',
				'url'      => 'https://linkedin.com/in/example',
			),
		);

		$this->assertSame(
			array(
				array(
					'platform' => 'linkedin',
					'url'      => 'https://linkedin.com/in/example',
				),
			),
			Inc\validate_social_links( $links )
		);

		$this->assertSame( array(), Inc\validate_social_links( 'https://github.com/example' ) );
		$this->assertSame( array(), Inc\validate_social_links( null ) );
	}

	/**
	 * The callbacks are wired to the registered meta so saving goes through them.
	 *
	 * @return void
	 */
	public function test_registered_meta_uses_sanitizers_on_save() {
		$post_id = self::factory()->post->create( array( 'post_type' => 'ph_peeps_people' ) );

		update_post_meta( $post_id, 'ph_peeps_phone', '(555) 123-4567' );
		update_post_meta( $post_id, 'ph_peeps_email', 'not-an-email' );
		update_post_meta(
			$post_id,
			'ph_peeps_social_links',
			array(
				array(
					'platform' => 'github',
					'url'      => 'https://github.com/example',
				),
			)
		);

		$this->assertSame( '5551234567', get_post_meta( $post_id, 'ph_peeps_phone', true ) );
		$this->assertSame( '', get_post_meta( $post_id, 'ph_peeps_email', true ) );
		$this->assertSame(
			array(
				array(
					'platform' => 'github',
					'url'      => 'https://github.com/example',
				),
			),
			get_post_meta( $post_id, 'ph_peeps_social_links', true )
		);
	}
}
