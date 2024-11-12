import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const { showFirst, showMiddle, showLast, tagName, makeLink, openInNewTab, linkRel } = attributes;
	
	const [meta] = useEntityProp('postType', 'wp_peeps', 'meta');
	const firstName = meta?.wp_peeps_first_name || 'First';
	const middleName = meta?.wp_peeps_middle_name || 'Middle';
	const lastName = meta?.wp_peeps_last_name || 'Last';

	const TagName = tagName;

	// Build the preview text based on toggle settings
	const nameParts = [
		showFirst ? firstName : '',
		showMiddle ? middleName : '',
		showLast ? lastName : '',
	].filter(Boolean);

	// If no parts are selected, show a placeholder
	const fullName = nameParts.length > 0 ? nameParts.join(' ') : __('Select name parts to display', 'wp-peeps');

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Name Settings', 'wp-peeps')}>
					<ToggleControl
						label={__('Show First Name', 'wp-peeps')}
						checked={showFirst}
						onChange={() => setAttributes({ showFirst: !showFirst })}
					/>
					<ToggleControl
						label={__('Show Middle Name', 'wp-peeps')}
						checked={showMiddle}
						onChange={() => setAttributes({ showMiddle: !showMiddle })}
					/>
					<ToggleControl
						label={__('Show Last Name', 'wp-peeps')}
						checked={showLast}
						onChange={() => setAttributes({ showLast: !showLast })}
					/>
					<SelectControl
						label={__('HTML Tag', 'wp-peeps')}
						value={tagName}
						options={[
							{ label: 'Heading 1', value: 'h1' },
							{ label: 'Heading 2', value: 'h2' },
							{ label: 'Heading 3', value: 'h3' },
							{ label: 'Heading 4', value: 'h4' },
							{ label: 'Heading 5', value: 'h5' },
							{ label: 'Heading 6', value: 'h6' },
							{ label: 'Paragraph', value: 'p' },
							{ label: 'Div', value: 'div' },
						]}
						onChange={(value) => setAttributes({ tagName: value })}
					/>
				</PanelBody>
				<PanelBody title={__('Link Settings', 'wp-peeps')}>
					<ToggleControl
						label={__('Make a Link', 'wp-peeps')}
						checked={makeLink}
						onChange={() => setAttributes({ makeLink: !makeLink })}
					/>
					{makeLink && (
						<>
							<ToggleControl
								label={__('Open in New Tab', 'wp-peeps')}
								checked={openInNewTab}
								onChange={() => setAttributes({ openInNewTab: !openInNewTab })}
							/>
							<TextControl
								label={__('Link Rel', 'wp-peeps')}
								value={linkRel}
								onChange={(value) => setAttributes({ linkRel: value })}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
			<TagName {...blockProps}>
				{fullName}
			</TagName>
		</>
	);
}
