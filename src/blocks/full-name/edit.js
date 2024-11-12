import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const { showFirst, showMiddle, showLast, tagName } = attributes;
	
	const [meta] = useEntityProp('postType', 'wp_peeps', 'meta');
	const firstName = meta?.wp_peeps_first_name || '';
	const middleName = meta?.wp_peeps_middle_name || '';
	const lastName = meta?.wp_peeps_last_name || '';

	const TagName = tagName;

	const fullName = [
		showFirst ? firstName : '',
		showMiddle ? middleName : '',
		showLast ? lastName : '',
	].filter(Boolean).join(' ');

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
			</InspectorControls>
			<TagName {...blockProps}>
				{fullName || __('Full Name', 'wp-peeps')}
			</TagName>
		</>
	);
}
