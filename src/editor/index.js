import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { useEntityProp } from '@wordpress/core-data';
import { TextControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

function NameFieldsPanel() {
	const [ meta, setMeta ] = useEntityProp('postType', 'people', 'meta');
	const [ , setTitle ] = useEntityProp('postType', 'people', 'title');
	const [ , setSlug ] = useEntityProp('postType', 'people', 'slug');
	const { lockPostSaving, unlockPostSaving, editPost } = dispatch('core/editor');

	// Get phone format from settings
	const phoneFormat = useSelect(select => 
		select(coreStore).getEntityRecord(
			'root',
			'site'
		)?.wp_peeps_phone_format || '(###) ###-####'
	);

	const formatPhoneNumber = (value) => {
		// Strip all non-digits
		const digits = value.replace(/\D/g, '');
		
		if (!digits) return '';

		// Get the format template
		let format = phoneFormat;
		
		// Replace each # with a digit
		let formatted = format;
		for (let i = 0; i < digits.length && i < 10; i++) {
			formatted = formatted.replace('#', digits[i]);
		}
		
		// Remove any remaining # placeholders
		formatted = formatted.replace(/#/g, '');
		
		return formatted;
	};

	const handlePhoneChange = (value) => {
		const formatted = formatPhoneNumber(value);
		setMeta({
			...meta,
			phone: formatted,
		});
	};

	useEffect(() => {
		if (!meta) return;

		const firstName = meta?.first_name?.trim() || '';
		const middleName = meta?.middle_name?.trim() || '';
		const lastName = meta?.last_name?.trim() || '';
		
		if (!firstName || !lastName) {
			lockPostSaving('requiredNameFields');
			return;
		}

		unlockPostSaving('requiredNameFields');

		// Create the full name with middle name if present
		const fullName = middleName 
			? `${firstName} ${middleName} ${lastName}`
			: `${firstName} ${lastName}`;
		
		// Update both title and slug
		setTitle(fullName);
		editPost({ title: fullName });
		
		// Update slug
		const newSlug = fullName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
		setSlug(newSlug);

	}, [meta?.first_name, meta?.middle_name, meta?.last_name]);

	return (
		<PluginDocumentSettingPanel
			name="wp-peeps-name-fields"
			title={ __('Name Details', 'wp-peeps') }
			className="wp-peeps-name-fields"
			initialOpen={ true }
		>
			<TextControl
				label={ __('First Name', 'wp-peeps') + ' *' }
				value={ meta?.first_name || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						first_name: newValue,
					} )
				}
				help={ !meta?.first_name?.trim() ? __('First name is required', 'wp-peeps') : '' }
			/>
			<TextControl
				label={ __('Middle Name', 'wp-peeps') }
				value={ meta?.middle_name || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						middle_name: newValue,
					} )
				}
			/>
			<TextControl
				label={ __('Last Name', 'wp-peeps') + ' *' }
				value={ meta?.last_name || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						last_name: newValue,
					} )
				}
				help={ !meta?.last_name?.trim() ? __('Last name is required', 'wp-peeps') : '' }
			/>
			<TextControl
				label={ __('Job Title', 'wp-peeps') }
				value={ meta?.job_title || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						job_title: newValue,
					} )
				}
			/>
			<TextControl
				label={ __('Phone', 'wp-peeps') }
				value={ meta?.phone || '' }
				onChange={ handlePhoneChange }
				help={ __('Enter 10 digit phone number', 'wp-peeps') }
			/>
			<TextControl
				type="email"
				label={ __('Email', 'wp-peeps') }
				value={ meta?.email || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						email: newValue,
					} )
				}
				help={ __('Enter valid email address', 'wp-peeps') }
			/>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin('wp-peeps-name-fields-panel', { render: NameFieldsPanel });