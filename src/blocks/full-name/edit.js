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
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	paragraph,
	grid,
	headingLevel1,
	headingLevel2,
	headingLevel3,
	headingLevel4,
	headingLevel5,
	headingLevel6,
} from '@wordpress/icons';

const HTML_TAGS = [
	{
		title: __('Heading 1', 'peeps-people-directory'),
		value: 'h1',
		icon: headingLevel1,
		isHeading: true,
	},
	{
		title: __('Heading 2', 'peeps-people-directory'),
		value: 'h2',
		icon: headingLevel2,
		isHeading: true,
	},
	{
		title: __('Heading 3', 'peeps-people-directory'),
		value: 'h3',
		icon: headingLevel3,
		isHeading: true,
	},
	{
		title: __('Heading 4', 'peeps-people-directory'),
		value: 'h4',
		icon: headingLevel4,
		isHeading: true,
	},
	{
		title: __('Heading 5', 'peeps-people-directory'),
		value: 'h5',
		icon: headingLevel5,
		isHeading: true,
	},
	{
		title: __('Heading 6', 'peeps-people-directory'),
		value: 'h6',
		icon: headingLevel6,
		isHeading: true,
	},
	{
		title: __('Paragraph', 'peeps-people-directory'),
		value: 'p',
		icon: paragraph,
	},
	{
		title: __('Div', 'peeps-people-directory'),
		value: 'div',
		icon: grid,
	},
];

/**
 * Full Name block edit component.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set block attributes.
 * @param {Object}   props.context       Block context.
 * @return {JSX.Element}              The edit component.
 */
export default function Edit({ attributes, setAttributes, context }) {
	const {
		showFirst,
		showMiddle,
		showLast,
		tagName,
		makeLink,
		openInNewTab,
		linkRel,
	} = attributes;

	const blockProps = useBlockProps();
	const { postType, postId } = context;

	const post = useSelect(
		(select) => {
			if (!postId) {
				return null;
			}
			return select(coreStore).getEntityRecord(
				'postType',
				postType || 'ph_peeps_people',
				postId,
			);
		},
		[postId, postType],
	);

	// Get meta values either from context post or current post
	const firstName = post?.meta?.ph_peeps_first_name || 'First';
	const middleName = post?.meta?.ph_peeps_middle_name || 'Middle';
	const lastName = post?.meta?.ph_peeps_last_name || 'Last';

	// Build the preview text based on toggle settings
	const nameParts = [
		showFirst ? firstName : '',
		showMiddle ? middleName : '',
		showLast ? lastName : '',
	].filter(Boolean);

	// If no parts are selected, show a placeholder
	const fullName =
		nameParts.length > 0
			? nameParts.join(' ')
			: __('Select name parts to display', 'peeps-people-directory');

	const TagName = tagName;

	// Get current tag info
	const currentTag = HTML_TAGS.find((tag) => tag.value === tagName);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={currentTag?.icon}
						label={__('Change text element', 'peeps-people-directory')}
						controls={HTML_TAGS.map((tag) => ({
							title: tag.title,
							icon: tag.icon,
							isActive: tag.value === tagName,
							onClick: () =>
								setAttributes({ tagName: tag.value }),
						}))}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Name Settings', 'peeps-people-directory')}>
					<ToggleControl
						label={__('Show First Name', 'peeps-people-directory')}
						checked={showFirst}
						onChange={() =>
							setAttributes({ showFirst: !showFirst })
						}
					/>
					<ToggleControl
						label={__('Show Middle Name', 'peeps-people-directory')}
						checked={showMiddle}
						onChange={() =>
							setAttributes({ showMiddle: !showMiddle })
						}
					/>
					<ToggleControl
						label={__('Show Last Name', 'peeps-people-directory')}
						checked={showLast}
						onChange={() => setAttributes({ showLast: !showLast })}
					/>
				</PanelBody>
				<PanelBody title={__('Link Settings', 'peeps-people-directory')}>
					<ToggleControl
						label={__('Make a Link', 'peeps-people-directory')}
						checked={makeLink}
						onChange={() => setAttributes({ makeLink: !makeLink })}
						help={
							makeLink
								? __('Name will be clickable', 'peeps-people-directory')
								: __('Name will be plain text', 'peeps-people-directory')
						}
					/>
					{makeLink && (
						<>
							<ToggleControl
								label={__('Open in New Tab', 'peeps-people-directory')}
								checked={openInNewTab}
								onChange={() =>
									setAttributes({
										openInNewTab: !openInNewTab,
									})
								}
							/>
							<TextControl
								label={__('Link Rel', 'peeps-people-directory')}
								value={linkRel}
								onChange={(value) =>
									setAttributes({ linkRel: value })
								}
								help={__(
									'Add rel attributes for the link',
									'peeps-people-directory',
								)}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
			<TagName {...blockProps}>{fullName}</TagName>
		</>
	);
}
