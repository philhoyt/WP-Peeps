<?php
/**
 * Tests for the email block render function in inc/block-render.php.
 *
 * @package PH_Peeps
 */

/**
 * Email block render tests.
 */
class Test_Email_Block extends WP_UnitTestCase {

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
				'blockName'    => 'ph-peeps/email',
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
	 * Create a published person with an email address.
	 *
	 * @param string $email Email address.
	 * @return int Post ID.
	 */
	private function create_person_with_email( $email = 'ada@example.com' ) {
		$post_id = self::factory()->post->create(
			array(
				'post_type'   => 'ph_peeps_people',
				'post_status' => 'publish',
				'post_title'  => 'Ada Lovelace',
			)
		);

		update_post_meta( $post_id, 'ph_peeps_email', $email );

		return $post_id;
	}

	/**
	 * makeLink wraps the address in a mailto: link inside a p tag.
	 *
	 * @return void
	 */
	public function test_make_link_renders_mailto_link() {
		$post_id = $this->create_person_with_email();

		$html = $this->render_for_person( $post_id, array( 'makeLink' => true ) );

		$this->assertStringStartsWith( '<p ', $html );
		$this->assertStringEndsWith( '</p>', $html );
		$this->assertStringContainsString( 'wp-block-ph-peeps-email', $html );
		$this->assertStringContainsString( '<a href="mailto:ada@example.com">ada@example.com</a>', $html );
	}

	/**
	 * Without makeLink the address is plain text.
	 *
	 * @return void
	 */
	public function test_make_link_false_renders_plain_text() {
		$post_id = $this->create_person_with_email();

		$html = $this->render_for_person( $post_id );

		$this->assertStringContainsString( '>ada@example.com</p>', $html );
		$this->assertStringNotContainsString( '<a', $html );
		$this->assertStringNotContainsString( 'mailto:', $html );
	}

	/**
	 * The stored address is escaped on output. The meta sanitizer normally
	 * rejects an address like this, so it is removed for this test to get the
	 * bad value into the database.
	 *
	 * @return void
	 */
	public function test_text_is_escaped() {
		$post_id = $this->create_person_with_email();

		remove_filter( 'sanitize_post_meta_ph_peeps_email_for_ph_peeps_people', 'PH_Peeps\Inc\validate_email' );
		update_post_meta( $post_id, 'ph_peeps_email', '<b>ada</b>@example.com' );

		$html = $this->render_for_person( $post_id );

		$this->assertStringContainsString( '&lt;b&gt;ada&lt;/b&gt;@example.com', $html );
		$this->assertStringNotContainsString( '<b>', $html );
	}

	/**
	 * A non-string meta value degrades to an empty string instead of a fatal
	 * error.
	 *
	 * @return void
	 */
	public function test_non_string_meta_renders_empty_string() {
		$post_id = $this->create_person_with_email();

		remove_filter( 'sanitize_post_meta_ph_peeps_email_for_ph_peeps_people', 'PH_Peeps\Inc\validate_email' );
		update_post_meta( $post_id, 'ph_peeps_email', array( 'ada@example.com' ) );

		$this->assertIsArray( get_post_meta( $post_id, 'ph_peeps_email', true ) );
		$this->assertSame( '', $this->render_for_person( $post_id, array( 'makeLink' => true ) ) );
	}

	/**
	 * A person without an email address renders an empty string.
	 *
	 * @return void
	 */
	public function test_renders_empty_string_without_email() {
		$post_id = self::factory()->post->create( array( 'post_type' => 'ph_peeps_people' ) );

		$this->assertSame( '', $this->render_for_person( $post_id ) );
	}

	/**
	 * Allowed inline markup in the prefix survives and is followed by a space.
	 *
	 * @return void
	 */
	public function test_prefix_keeps_allowed_inline_markup() {
		$post_id = $this->create_person_with_email();

		$html = $this->render_for_person( $post_id, array( 'prefix' => '<strong>Email:</strong>' ) );

		$this->assertStringContainsString( '><strong>Email:</strong> ada@example.com</p>', $html );
	}

	/**
	 * Script tags in the prefix are stripped.
	 *
	 * @return void
	 */
	public function test_prefix_strips_script_tags() {
		$post_id = $this->create_person_with_email();

		$html = $this->render_for_person( $post_id, array( 'prefix' => '<script>alert(1)</script>Email:' ) );

		$this->assertStringNotContainsString( '<script', $html );
		$this->assertStringContainsString( 'Email: ada@example.com', $html );
	}

	/**
	 * The tagName attribute picks the wrapper element.
	 *
	 * @return void
	 */
	public function test_tag_name_div_renders_a_div() {
		$post_id = $this->create_person_with_email();

		$html = $this->render_for_person( $post_id, array( 'tagName' => 'div' ) );

		$this->assertStringStartsWith( '<div ', $html );
		$this->assertStringEndsWith( '</div>', $html );
	}

	/**
	 * A tagName outside the allow-list falls back to p.
	 *
	 * @return void
	 */
	public function test_invalid_tag_name_falls_back_to_p() {
		$post_id = $this->create_person_with_email();

		$html = $this->render_for_person( $post_id, array( 'tagName' => 'script' ) );

		$this->assertStringStartsWith( '<p ', $html );
		$this->assertStringEndsWith( '</p>', $html );
		$this->assertStringNotContainsString( 'script', $html );
	}
}
