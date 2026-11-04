<?php
/**
 * Tests for the phone block render function in inc/block-render.php.
 *
 * @package PH_Peeps
 */

/**
 * Phone block render tests.
 */
class Test_Phone_Block extends WP_UnitTestCase {

	/**
	 * Render the block for a person, the way core does from block.json "render".
	 *
	 * @param int   $post_id    The person's post ID, passed as block context.
	 * @param array $attributes Block attributes.
	 * @return string Rendered HTML.
	 */
	private function render_for_person( $post_id, $attributes = array() ) {
		$block = new WP_Block(
			array(
				'blockName'    => 'ph-peeps/phone',
				'attrs'        => $attributes,
				'innerBlocks'  => array(),
				'innerHTML'    => '',
				'innerContent' => array(),
			),
			array(
				'postId'   => $post_id,
				'postType' => 'ph_peeps_people',
			)
		);

		return $block->render();
	}

	/**
	 * Create a published person with a phone number and optional extension.
	 *
	 * @param string $phone Digits-only phone number.
	 * @param string $ext   Extension.
	 * @return int Post ID.
	 */
	private function create_person_with_phone( $phone = '5551234567', $ext = '' ) {
		$post_id = self::factory()->post->create(
			array(
				'post_type'   => 'ph_peeps_people',
				'post_status' => 'publish',
				'post_title'  => 'Ada Lovelace',
			)
		);

		update_post_meta( $post_id, 'ph_peeps_phone', $phone );
		if ( '' !== $ext ) {
			update_post_meta( $post_id, 'ph_peeps_phone_ext', $ext );
		}

		return $post_id;
	}

	/**
	 * The stored digits render through the default phone format in a p tag.
	 *
	 * @return void
	 */
	public function test_renders_default_format_in_p_tag() {
		$post_id = $this->create_person_with_phone();

		$html = $this->render_for_person( $post_id );

		$this->assertStringStartsWith( '<p ', $html );
		$this->assertStringEndsWith( '</p>', $html );
		$this->assertStringContainsString( 'wp-block-ph-peeps-phone', $html );
		$this->assertStringContainsString( '>(555) 123-4567</p>', $html );
		$this->assertStringNotContainsString( '<a', $html );
	}

	/**
	 * The phone format option changes the rendered number.
	 *
	 * @return void
	 */
	public function test_renders_with_phone_format_option() {
		update_option( 'ph_peeps_phone_format', '###-###-####' );
		$post_id = $this->create_person_with_phone();

		$html = $this->render_for_person( $post_id );

		$this->assertStringContainsString( '>555-123-4567</p>', $html );
		$this->assertStringNotContainsString( '(555)', $html );
	}

	/**
	 * An extension renders as " x100" and goes into the tel: href as ";ext=100".
	 *
	 * @return void
	 */
	public function test_extension_renders_in_text_and_tel_href() {
		$post_id = $this->create_person_with_phone( '5551234567', '100' );

		$html = $this->render_for_person( $post_id, array( 'makeLink' => true ) );

		$this->assertStringContainsString( '<a href="tel:5551234567;ext=100">(555) 123-4567 x100</a>', $html );
	}

	/**
	 * makeLink wraps the number in a tel: link.
	 *
	 * @return void
	 */
	public function test_make_link_renders_tel_link() {
		$post_id = $this->create_person_with_phone();

		$html = $this->render_for_person( $post_id, array( 'makeLink' => true ) );

		$this->assertStringContainsString( '<a href="tel:5551234567">(555) 123-4567</a>', $html );
	}

	/**
	 * Without makeLink the number is plain text.
	 *
	 * @return void
	 */
	public function test_make_link_false_renders_plain_text() {
		$post_id = $this->create_person_with_phone( '5551234567', '100' );

		$html = $this->render_for_person( $post_id, array( 'makeLink' => false ) );

		$this->assertStringContainsString( '>(555) 123-4567 x100</p>', $html );
		$this->assertStringNotContainsString( '<a', $html );
		$this->assertStringNotContainsString( 'tel:', $html );
	}

	/**
	 * A non-string meta value degrades to an empty string instead of a fatal
	 * error. The meta sanitizer normally rejects arrays, so it is removed for
	 * this test to get the bad value into the database.
	 *
	 * @return void
	 */
	public function test_non_string_meta_renders_empty_string() {
		$post_id = $this->create_person_with_phone();

		remove_filter( 'sanitize_post_meta_ph_peeps_phone_for_ph_peeps_people', 'PH_Peeps\Inc\validate_phone' );
		update_post_meta( $post_id, 'ph_peeps_phone', array( '5551234567' ) );

		$this->assertIsArray( get_post_meta( $post_id, 'ph_peeps_phone', true ) );
		$this->assertSame( '', $this->render_for_person( $post_id, array( 'makeLink' => true ) ) );
	}

	/**
	 * A person without a phone number renders an empty string.
	 *
	 * @return void
	 */
	public function test_renders_empty_string_without_phone() {
		$post_id = self::factory()->post->create( array( 'post_type' => 'ph_peeps_people' ) );

		$this->assertSame( '', $this->render_for_person( $post_id ) );
	}

	/**
	 * Allowed inline markup in the prefix survives and is followed by a space.
	 *
	 * @return void
	 */
	public function test_prefix_keeps_allowed_inline_markup() {
		$post_id = $this->create_person_with_phone();

		$html = $this->render_for_person( $post_id, array( 'prefix' => '<strong>Phone:</strong>' ) );

		$this->assertStringContainsString( '><strong>Phone:</strong> (555) 123-4567</p>', $html );
	}

	/**
	 * Script tags in the prefix are stripped.
	 *
	 * @return void
	 */
	public function test_prefix_strips_script_tags() {
		$post_id = $this->create_person_with_phone();

		$html = $this->render_for_person( $post_id, array( 'prefix' => '<script>alert(1)</script>Phone:' ) );

		$this->assertStringNotContainsString( '<script', $html );
		$this->assertStringContainsString( 'Phone: (555) 123-4567', $html );
	}

	/**
	 * The tagName attribute picks the wrapper element.
	 *
	 * @return void
	 */
	public function test_tag_name_span_renders_a_span() {
		$post_id = $this->create_person_with_phone();

		$html = $this->render_for_person( $post_id, array( 'tagName' => 'span' ) );

		$this->assertStringStartsWith( '<span ', $html );
		$this->assertStringEndsWith( '</span>', $html );
	}

	/**
	 * A tagName outside the allow-list falls back to p.
	 *
	 * @return void
	 */
	public function test_invalid_tag_name_falls_back_to_p() {
		$post_id = $this->create_person_with_phone();

		$html = $this->render_for_person( $post_id, array( 'tagName' => 'script' ) );

		$this->assertStringStartsWith( '<p ', $html );
		$this->assertStringEndsWith( '</p>', $html );
		$this->assertStringNotContainsString( 'script', $html );
	}
}
