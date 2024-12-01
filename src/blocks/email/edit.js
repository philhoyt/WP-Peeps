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
 * Email block edit function.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set block attributes.
 * @param {boolean}  props.isSelected    Whether block is selected.
 * @param {Object}   props.context       Block context.
 * @return {JSX.Element}              The edit component.
 */
export default function Edit({ attributes, setAttributes, isSelected, context }) {
	const { tagName, makeLink, prefix, textAlign } = attributes;
	const { postType, postId } = context;

	const blockProps = useBlockProps({
		className: textAlign ? `has-text-align-${textAlign}` : undefined,
	});

	// Get post data from context
	const post = useSelect(
		(select) => {
			if (!postId) {return null;}
			return select(coreStore).getEntityRecord('postType', postType || 'wp_peeps_people', postId);
		},
		[postId, postType]
	);

	const email = post?.meta?.wp_peeps_email || 'name@domain.com';

	const TagName = tagName;

	// Create content elements
	const emailLink =
		email && email !== 'name@domain.com' ? (
			<a href={`mailto:${email}`}>{email}</a>
		) : (
			email
		);

	const content = (
		<>
			{(isSelected || prefix) && (
				<RichText
					identifier="prefix"
					allowedFormats={ALLOWED_FORMATS}
					className="wp-block-wp-peeps-email__prefix"
					aria-label={__('Prefix')}
					placeholder={__('Prefix', 'wp-peeps') + ' '}
					value={prefix}
					onChange={(value) => setAttributes({ prefix: value })}
					tagName="span"
				/>
			)}
			{makeLink ? emailLink : email}
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
						label={__('HTML element', 'wp-peeps')}
						controls={HTML_TAGS.map(
							({ title, value, icon: tagIcon }) => ({
								title,
								icon: tagIcon,
								isActive: tagName === value,
								onClick: () =>
									setAttributes({ tagName: value }),
							}),
						)}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Settings', 'wp-peeps')}>
					<ToggleControl
						label={__('Make email clickable', 'wp-peeps')}
						checked={makeLink}
						onChange={() => setAttributes({ makeLink: !makeLink })}
						help={
							makeLink
								? __('Email address will be clickable', 'wp-peeps')
								: __('Email address will be plain text', 'wp-peeps')
						}
					/>
				</PanelBody>
			</InspectorControls>
			<TagName {...blockProps}>{content}</TagName>
		</>
	);
}
