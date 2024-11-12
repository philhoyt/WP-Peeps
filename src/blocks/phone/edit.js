import { __ } from '@wordpress/i18n';

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const { tagName, makeLink, prefix } = attributes;
	
	const [meta] = useEntityProp('postType', 'people', 'meta');
	const format = useSelect(select => 
		select(coreStore).getEntityRecord('root', 'site')?.wp_peeps_phone_format
	) || '(###) ###-####';

	const formatPhoneNumber = (phoneNumber, format) => {
		// Return format if no phone number
		if (!phoneNumber || typeof phoneNumber !== 'string') {
			return format;
		}

		// Only use digits from the phone number
		const digits = phoneNumber.replace(/\D/g, '');
		if (!digits) {
			return format;
		}

		let formattedPhone = format;
		for (let i = 0; i < digits.length && i < 10; i++) {
			formattedPhone = formattedPhone.replace('#', digits[i]);
		}
		return formattedPhone;
	};

	const phone = formatPhoneNumber(meta?.wp_peeps_phone, format);
	const displayNumber = prefix ? `${prefix} ${phone}` : phone;
	const TagName = tagName;

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
