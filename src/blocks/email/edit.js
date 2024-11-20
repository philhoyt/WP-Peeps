import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	ToolbarGroup,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { paragraph, grid, tag } from '@wordpress/icons';

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
 * @return {JSX.Element}              The edit component.
 */
export default function Edit({ attributes, setAttributes }) {
	const { tagName, makeLink, prefix, textAlign } = attributes;
	const blockProps = useBlockProps({
		className: textAlign ? `has-text-align-${textAlign}` : undefined,
	});

	// Get email from meta
	const [meta] = useEntityProp('postType', 'wp_peeps_people', 'meta');
	const email = meta?.wp_peeps_email || 'name@domain.com';

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
			{prefix && <span>{prefix} </span>}
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
						controls={HTML_TAGS.map(({ title, value, icon: tagIcon }) => ({
							title,
							icon: tagIcon,
							isActive: tagName === value,
							onClick: () => setAttributes({ tagName: value }),
						}))}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Settings', 'wp-peeps')}>
					<TextControl
						label={__('Prefix text', 'wp-peeps')}
						value={prefix}
						onChange={(value) => setAttributes({ prefix: value })}
						placeholder={__('e.g., Phone:', 'wp-peeps')}
						help={__(
							'Text to display before the email address.',
							'wp-peeps',
						)}
					/>
					<ToggleControl
						label={__('Make email clickable', 'wp-peeps')}
						checked={makeLink}
						onChange={() => setAttributes({ makeLink: !makeLink })}
						help={
							makeLink
								? __(
										'Email address will be clickable',
										'wp-peeps',
									)
								: __(
										'Email address will be plain text',
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
