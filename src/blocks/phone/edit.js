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
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { ALLOWED_FORMATS, HTML_TAGS, DEFAULT_PHONE_FORMAT } from '../constants';
import { formatPhoneNumber } from '../../editor/utils';

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
				postType || 'ph_peeps_people',
				postId,
			);
		},
		[postId, postType],
	);

	// Get phone format from site settings
	const format = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('root', 'site')
				?.ph_peeps_phone_format || DEFAULT_PHONE_FORMAT,
		[],
	);

	const phoneNumber = post?.meta?.ph_peeps_phone;
	const phoneExt = post?.meta?.ph_peeps_phone_ext;
	const formattedPhone = formatPhoneNumber(phoneNumber || '', format);
	const extSuffix = phoneExt ? ` x${phoneExt}` : '';

	// Create content elements
	const TagName = tagName;
	const telHref = phoneNumber
		? `tel:${phoneNumber.replace(/[^0-9+]/g, '')}${phoneExt ? `;ext=${phoneExt}` : ''}`
		: '';
	const phoneLink = phoneNumber ? (
		<a href={telHref}>{formattedPhone + extSuffix}</a>
	) : (
		formattedPhone
	);

	const content = (
		<>
			{(isSelected || prefix) && (
				<RichText
					identifier="prefix"
					allowedFormats={ALLOWED_FORMATS}
					className="wp-block-ph-peeps-phone__prefix"
					aria-label={__('Prefix')}
					placeholder={__('Prefix', 'peeps-people-directory') + ' '}
					value={prefix}
					onChange={(value) => setAttributes({ prefix: value })}
					tagName="span"
				/>
			)}
			{makeLink ? phoneLink : formattedPhone + extSuffix}
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
						label={__('Change text element', 'peeps-people-directory')}
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
				<PanelBody title={__('Phone Settings', 'peeps-people-directory')}>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Make Phone Link', 'peeps-people-directory')}
						checked={makeLink}
						onChange={() => setAttributes({ makeLink: !makeLink })}
						help={
							makeLink
								? __(
										'Phone number will be clickable',
										'peeps-people-directory',
									)
								: __(
										'Phone number will be plain text',
										'peeps-people-directory',
									)
						}
					/>
				</PanelBody>
			</InspectorControls>
			<TagName {...blockProps}>{content}</TagName>
		</>
	);
}
