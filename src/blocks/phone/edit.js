import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

const HTML_TAGS = [
	{ label: __('Paragraph', 'wp-peeps'), value: 'p' },
	{ label: __('Div', 'wp-peeps'), value: 'div' },
	{ label: __('Span', 'wp-peeps'), value: 'span' },
];

/**
 * Format a phone number according to the given format.
 *
 * @param {string} phoneNumber The phone number to format.
 * @param {string} format     The format template.
 * @return {string}          The formatted phone number.
 */
const formatPhoneNumber = (phoneNumber, format) => {
	if (!phoneNumber || !format) {
		return format || '';
	}

	const digits = phoneNumber.replace(/[^0-9]/g, '');
	let formattedPhone = format;

	for (let i = 0; i < digits.length && i < (format.match(/#/g) || []).length; i++) {
		formattedPhone = formattedPhone.replace('#', digits[i]);
	}

	// Remove any remaining placeholders
	return formattedPhone.replace(/#/g, '');
};

/**
 * Phone block edit component.
 *
 * @param {Object} props               Block props.
 * @param {Object} props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set block attributes.
 * @return {JSX.Element}              The edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const { tagName, makeLink, prefix, textAlign } = attributes;
	const blockProps = useBlockProps({
		className: textAlign ? `has-text-align-${textAlign}` : undefined,
	});
	
	// Get phone number from meta
	const [meta] = useEntityProp('postType', 'wp_peeps_people', 'meta');
	
	// Get phone format from site settings
	const format = useSelect(
		select => select(coreStore).getEntityRecord('root', 'site')?.wp_peeps_phone_format || '(###) ###-####',
		[]
	);

	const phoneNumber = meta?.wp_peeps_phone;
	const formattedPhone = formatPhoneNumber(phoneNumber, format);
	
	// Create content elements
	const TagName = tagName;
	const phoneLink = phoneNumber && (
		<a href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}>
			{formattedPhone}
		</a>
	);
	
	const content = (
		<>
			{prefix && <span>{prefix} </span>}
			{makeLink ? phoneLink : formattedPhone}
		</>
	);

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={textAlign}
					onChange={(value) => setAttributes({ textAlign: value })}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Phone Settings', 'wp-peeps')}>
					<TextControl
						label={__('Prefix', 'wp-peeps')}
						value={prefix}
						onChange={(value) => setAttributes({ prefix: value })}
						placeholder={__('e.g., Phone:', 'wp-peeps')}
						help={__('Text to display before the phone number', 'wp-peeps')}
					/>
					<SelectControl
						label={__('HTML Tag', 'wp-peeps')}
						value={tagName}
						options={HTML_TAGS}
						onChange={(value) => setAttributes({ tagName: value })}
					/>
					<ToggleControl
						label={__('Make Phone Link', 'wp-peeps')}
						checked={makeLink}
						onChange={() => setAttributes({ makeLink: !makeLink })}
						help={makeLink 
							? __('Phone number will be clickable', 'wp-peeps')
							: __('Phone number will be plain text', 'wp-peeps')
						}
					/>
				</PanelBody>
			</InspectorControls>
			<TagName {...blockProps}>
				{content}
			</TagName>
		</>
	);
}
