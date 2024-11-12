/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const { tagName, makeLink, prefix } = attributes;
	
	const [meta] = useEntityProp('postType', 'wp_peeps', 'meta');
	const phone = meta?.wp_peeps_phone || __('Phone Number', 'wp-peeps');

	const TagName = tagName;
	const displayNumber = prefix ? `${prefix} ${phone}` : phone;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Phone Settings', 'wp-peeps')}>
					<TextControl
						label={__('Prefix', 'wp-peeps')}
						value={prefix}
						onChange={(value) => setAttributes({ prefix: value })}
						placeholder={__('e.g., Phone:', 'wp-peeps')}
					/>
					<SelectControl
						label={__('HTML Tag', 'wp-peeps')}
						value={tagName}
						options={[
							{ label: 'Paragraph', value: 'p' },
							{ label: 'Div', value: 'div' },
							{ label: 'Span', value: 'span' },
						]}
						onChange={(value) => setAttributes({ tagName: value })}
					/>
					<ToggleControl
						label={__('Make Phone Link', 'wp-peeps')}
						checked={makeLink}
						onChange={() => setAttributes({ makeLink: !makeLink })}
					/>
				</PanelBody>
			</InspectorControls>
			<TagName {...blockProps}>
				{makeLink ? (
					<>
						{prefix && <span>{prefix} </span>}
						<a href={`tel:${phone.replace(/[^0-9]/g, '')}`}>
							{phone}
						</a>
					</>
				) : displayNumber}
			</TagName>
		</>
	);
}
