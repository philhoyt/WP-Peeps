<?php
/**
 * Tests for the social-links block render function in inc/block-render.php.
 *
 * @package PH_Peeps
 */

/**
 * Social links block render tests.
 */
class Test_Social_Links_Block extends WP_UnitTestCase {

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
				'blockName'    => 'ph-peeps/social-links',
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
	 * Create a published person with two social links.
	 *
	 * @return int Post ID.
	 */
	private function create_person_with_two_links() {
		$post_id = self::factory()->post->create(
			array(
				'post_type'   => 'ph_peeps_people',
				'post_status' => 'publish',
				'post_title'  => 'Ada Lovelace',
			)
		);

		update_post_meta(
			$post_id,
			'ph_peeps_social_links',
			array(
				array(
					'platform' => 'github',
					'url'      => 'https://github.com/ada',
				),
				array(
					'platform' => 'linkedin',
					'url'      => 'https://www.linkedin.com/in/ada',
				),
			)
		);

		return $post_id;
	}

	/**
	 * Each stored link renders as a core social-link item for its platform,
	 * for the post named by the block context rather than the global post.
	 *
	 * @return void
	 */
	public function test_renders_one_item_per_platform_from_block_context() {
		$post_id = $this->create_person_with_two_links();

		$html = $this->render_for_person( $post_id );

		$this->assertStringContainsString( 'wp-block-ph-peeps-social-links', $html );
		$this->assertStringContainsString( 'wp-social-link-github', $html );
		$this->assertStringContainsString( 'wp-social-link-linkedin', $html );
		$this->assertStringContainsString( 'https://github.com/ada', $html );
		$this->assertStringContainsString( 'https://www.linkedin.com/in/ada', $html );
		$this->assertSame( 2, substr_count( $html, 'class="wp-social-link wp-social-link-' ) );
	}

	/**
	 * The default style is only added when no style class was chosen.
	 *
	 * @return void
	 */
	public function test_default_style_class_is_only_added_when_no_style_is_chosen() {
		$post_id = $this->create_person_with_two_links();

		$default_html = $this->render_for_person( $post_id );
		$this->assertStringContainsString( 'is-style-default', $default_html );

		$logos_html = $this->render_for_person( $post_id, array( 'className' => 'is-style-logos-only my-class' ) );
		$this->assertStringContainsString( 'is-style-logos-only', $logos_html );
		$this->assertStringContainsString( ' my-class', $logos_html );
		$this->assertStringNotContainsString( 'is-style-default', $logos_html );
		$this->assertStringNotContainsString( 'is-style-logos-onlymy-class', $logos_html );
	}

	/**
	 * On the front end a person without links renders nothing.
	 *
	 * @return void
	 */
	public function test_renders_nothing_without_links_on_front_end() {
		$post_id = self::factory()->post->create( array( 'post_type' => 'ph_peeps_people' ) );

		$this->assertSame( '', $this->render_for_person( $post_id ) );
	}
}
