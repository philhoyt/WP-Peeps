import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	ToolbarGroup,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { paragraph, grid, tag } from '@wordpress/icons';

// Allowed formats for the prefix field
const ALLOWED_FORMATS = [
	'core/bold',
	'core/image',
	'core/italic',
	'core/link',
	'core/strikethrough',
	'core/text-color',
];

const HTML_TAGS = [
	{
		title: __('Paragraph', 'wp-peeps'),
		value: 'p',
		icon: paragraph,
	},
	{
		title: __('Div', 'wp-peeps'),
		value: 'div',
		icon: grid,
	},
	{
		title: __('Span', 'wp-peeps'),
		value: 'span',
		icon: tag,
	},
];

/**
 * Format a phone number according to the given format.
 *
 * @param {string} phoneNumber The phone number to format.
 * @param {string} format      The format template.
 * @return {string}          The formatted phone number.
 */
const formatPhoneNumber = (phoneNumber, format) => {
	if (!phoneNumber || !format) {
		return format || '';
	}

	const digits = phoneNumber.replace(/[^0-9]/g, '');
	let formattedPhone = format;

	for (
		let i = 0;
		i < digits.length && i < (format.match(/#/g) || []).length;
		i++
	) {
		formattedPhone = formattedPhone.replace('#', digits[i]);
	}

	// Remove any remaining placeholders
	return formattedPhone.replace(/#/g, '');
};

/**
 * Phone block edit component.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set block attributes.
 * @param {boolean}  props.isSelected    Whether block is selected.
 * @param {Object}   props.context       Block context.
 * @return {JSX.Element}              The edit component.
 */
export default function Edit({
	attributes,
	setAttributes,
	isSelected,
	context,
}) {
	const { tagName, makeLink, prefix, textAlign } = attributes;
	const { postType, postId } = context;

	const blockProps = useBlockProps({
		className: textAlign ? `has-text-align-${textAlign}` : undefined,
	});

	// Get post data from context
	const post = useSelect(
		(select) => {
			if (!postId) {
				return null;
			}
			return select(coreStore).getEntityRecord(
				'postType',
				postType || 'wp_peeps_people',
				postId,
			);
		},
		[postId, postType],
	);

	// Get phone format from site settings
	const format = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('root', 'site')
				?.wp_peeps_phone_format || '(###) ###-####',
		[],
	);

	const phoneNumber = post?.meta?.wp_peeps_phone;
	const formattedPhone = formatPhoneNumber(phoneNumber || '', format);

	// Create content elements
	const TagName = tagName;
	const phoneLink = phoneNumber ? (
		<a href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}>
			{formattedPhone}
		</a>
	) : (
		formattedPhone
	);

	const content = (
		<>
			{(isSelected || prefix) && (
				<RichText
					identifier="prefix"
					allowedFormats={ALLOWED_FORMATS}
					className="wp-block-wp-peeps-phone__prefix"
					aria-label={__('Prefix')}
					placeholder={__('Prefix', 'wp-peeps') + ' '}
					value={prefix}
					onChange={(value) => setAttributes({ prefix: value })}
					tagName="span"
				/>
			)}
			{makeLink ? phoneLink : formattedPhone}
		</>
	);

	// Get current tag info
	const currentTag = HTML_TAGS.find((htmlTag) => htmlTag.value === tagName);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={currentTag?.icon}
						label={__('Change text element', 'wp-peeps')}
						controls={HTML_TAGS.map((htmlTag) => ({
							title: htmlTag.title,
							icon: htmlTag.icon,
							isActive: htmlTag.value === tagName,
							onClick: () =>
								setAttributes({ tagName: htmlTag.value }),
						}))}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Phone Settings', 'wp-peeps')}>
					<ToggleControl
						label={__('Make Phone Link', 'wp-peeps')}
						checked={makeLink}
						onChange={() => setAttributes({ makeLink: !makeLink })}
						help={
							makeLink
								? __(
										'Phone number will be clickable',
										'wp-peeps',
									)
								: __(
										'Phone number will be plain text',
										'wp-peeps',
									)
						}
					/>
				</PanelBody>
			</InspectorControls>
			<TagName {...blockProps}>{content}</TagName>
		</>
	);
}
