<?php
/**
 * Tests for the full-name block render function in inc/block-render.php.
 *
 * @package PH_Peeps
 */

/**
 * Full name block render tests.
 */
class Test_Full_Name_Block extends WP_UnitTestCase {

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
				'blockName'    => 'ph-peeps/full-name',
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
	 * Create a published person with the given name parts.
	 *
	 * @param string $first  First name.
	 * @param string $middle Middle name.
	 * @param string $last   Last name.
	 * @return int Post ID.
	 */
	private function create_person( $first = 'Ada', $middle = 'King', $last = 'Lovelace' ) {
		$post_id = self::factory()->post->create(
			array(
				'post_type'   => 'ph_peeps_people',
				'post_status' => 'publish',
				'post_title'  => trim( "{$first} {$middle} {$last}" ),
			)
		);

		update_post_meta( $post_id, 'ph_peeps_first_name', $first );
		update_post_meta( $post_id, 'ph_peeps_middle_name', $middle );
		update_post_meta( $post_id, 'ph_peeps_last_name', $last );

		return $post_id;
	}

	/**
	 * By default all three name parts render inside an h2 with the block class.
	 *
	 * @return void
	 */
	public function test_renders_all_name_parts_in_h2_by_default() {
		$post_id = $this->create_person();

		$html = $this->render_for_person( $post_id );

		$this->assertStringStartsWith( '<h2 ', $html );
		$this->assertStringEndsWith( '</h2>', $html );
		$this->assertStringContainsString( 'wp-block-ph-peeps-full-name', $html );
		$this->assertStringContainsString( '>Ada King Lovelace</h2>', $html );
		$this->assertStringNotContainsString( '<a', $html );
	}

	/**
	 * Turning showMiddle off drops the middle name.
	 *
	 * @return void
	 */
	public function test_show_middle_false_drops_middle_name() {
		$post_id = $this->create_person();

		$html = $this->render_for_person( $post_id, array( 'showMiddle' => false ) );

		$this->assertStringContainsString( '>Ada Lovelace</h2>', $html );
		$this->assertStringNotContainsString( 'King', $html );
	}

	/**
	 * An empty middle name is skipped without leaving a double space.
	 *
	 * @return void
	 */
	public function test_empty_middle_name_is_skipped_without_double_space() {
		$post_id = $this->create_person( 'Ada', '', 'Lovelace' );

		$html = $this->render_for_person( $post_id );

		$this->assertStringContainsString( '>Ada Lovelace</h2>', $html );
		$this->assertStringNotContainsString( '  ', wp_strip_all_tags( $html ) );
	}

	/**
	 * The tagName attribute picks the wrapper element.
	 *
	 * @return void
	 */
	public function test_tag_name_h3_renders_an_h3() {
		$post_id = $this->create_person();

		$html = $this->render_for_person( $post_id, array( 'tagName' => 'h3' ) );

		$this->assertStringStartsWith( '<h3 ', $html );
		$this->assertStringEndsWith( '</h3>', $html );
		$this->assertStringNotContainsString( '<h2', $html );
	}

	/**
	 * A tagName outside the allow-list falls back to h2.
	 *
	 * @return void
	 */
	public function test_invalid_tag_name_falls_back_to_h2() {
		$post_id = $this->create_person();

		$html = $this->render_for_person( $post_id, array( 'tagName' => 'script' ) );

		$this->assertStringStartsWith( '<h2 ', $html );
		$this->assertStringEndsWith( '</h2>', $html );
		$this->assertStringNotContainsString( 'script', $html );
	}

	/**
	 * The makeLink attribute wraps the name in a link to the person's permalink.
	 *
	 * @return void
	 */
	public function test_make_link_wraps_name_in_permalink() {
		$post_id = $this->create_person();

		$html = $this->render_for_person( $post_id, array( 'makeLink' => true ) );

		$this->assertStringContainsString( '<a href="' . esc_url( get_permalink( $post_id ) ) . '">Ada King Lovelace</a>', $html );
		$this->assertStringNotContainsString( 'target=', $html );
		$this->assertStringNotContainsString( 'rel=', $html );
	}

	/**
	 * The openInNewTab attribute adds target="_blank" and a rel that always carries noopener,
	 * merged with any linkRel the block set.
	 *
	 * @return void
	 */
	public function test_open_in_new_tab_adds_target_blank_and_merges_rel() {
		$post_id = $this->create_person();

		$html = $this->render_for_person(
			$post_id,
			array(
				'makeLink'     => true,
				'openInNewTab' => true,
			)
		);
		$this->assertStringContainsString( 'target="_blank"', $html );
		$this->assertStringContainsString( 'rel="noopener"', $html );

		$html = $this->render_for_person(
			$post_id,
			array(
				'makeLink'     => true,
				'openInNewTab' => true,
				'linkRel'      => 'nofollow',
			)
		);
		$this->assertStringContainsString( 'target="_blank"', $html );
		$this->assertMatchesRegularExpression( '/rel="[^"]*\bnofollow\b[^"]*"/', $html );
		$this->assertMatchesRegularExpression( '/rel="[^"]*\bnoopener\b[^"]*"/', $html );
	}

	/**
	 * A linkRel on its own is passed through without a target.
	 *
	 * @return void
	 */
	public function test_link_rel_without_new_tab_is_passed_through() {
		$post_id = $this->create_person();

		$html = $this->render_for_person(
			$post_id,
			array(
				'makeLink' => true,
				'linkRel'  => 'nofollow',
			)
		);

		$this->assertStringContainsString( 'rel="nofollow"', $html );
		$this->assertStringNotContainsString( 'target=', $html );
		$this->assertStringNotContainsString( 'noopener', $html );
	}

	/**
	 * When individual profile pages are disabled the name is never linked,
	 * since the permalink would 404.
	 *
	 * @return void
	 */
	public function test_make_link_renders_no_link_when_profile_pages_are_disabled() {
		update_option( 'ph_peeps_public_cpt', false );
		$post_id = $this->create_person();

		$html = $this->render_for_person(
			$post_id,
			array(
				'makeLink'     => true,
				'openInNewTab' => true,
			)
		);

		$this->assertStringContainsString( '>Ada King Lovelace</h2>', $html );
		$this->assertStringNotContainsString( '<a', $html );
		$this->assertStringNotContainsString( 'href=', $html );
	}

	/**
	 * A person without any name meta renders an empty string.
	 *
	 * @return void
	 */
	public function test_renders_empty_string_without_name_meta() {
		$post_id = self::factory()->post->create( array( 'post_type' => 'ph_peeps_people' ) );

		$this->assertSame( '', $this->render_for_person( $post_id ) );
	}
}
