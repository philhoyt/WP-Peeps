import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { TextControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { useSelect } from '@wordpress/data';
import { store as coreStore, useEntityProp } from '@wordpress/core-data';

function NameFieldsPanel() {
	const [ meta, setMeta ] = useEntityProp( 'postType', 'wp_peeps_people', 'meta' );
	const [ , setTitle ] = useEntityProp( 'postType', 'wp_peeps_people', 'title' );
	const [ , setSlug ] = useEntityProp( 'postType', 'wp_peeps_people', 'slug' );
	const { lockPostSaving, unlockPostSaving, editPost } =
		dispatch( 'core/editor' );

	// Get phone format from settings
	const phoneFormat = useSelect(
		( select ) =>
			select( coreStore ).getEntityRecord( 'root', 'site' )
				?.wp_peeps_phone_format || '(###) ###-####'
	);

	const formatPhoneNumber = ( value ) => {
		// Strip all non-digits
		const digits = value.replace( /\D/g, '' );

		if ( ! digits ) return '';

		// Get the format template
		let format = phoneFormat;

		// Replace each # with a digit
		let formatted = format;
		for ( let i = 0; i < digits.length && i < 10; i++ ) {
			formatted = formatted.replace( '#', digits[ i ] );
		}

		// Remove any remaining # placeholders
		formatted = formatted.replace( /#/g, '' );

		return formatted;
	};

	const handlePhoneChange = ( value ) => {
		// Strip all non-digits and limit to 10
		const digits = value.replace( /\D/g, '' ).slice( 0, 10 );
		setMeta( {
			...meta,
			wp_peeps_phone: digits,
		} );
	};

	useEffect( () => {
		if ( ! meta ) return;

		const firstName = meta?.wp_peeps_first_name?.trim() || '';
		const middleName = meta?.wp_peeps_middle_name?.trim() || '';
		const lastName = meta?.wp_peeps_last_name?.trim() || '';

		if ( ! firstName || ! lastName ) {
			lockPostSaving( 'requiredNameFields' );
			return;
		}

		unlockPostSaving( 'requiredNameFields' );

		// Create the full name with middle name if present
		const fullName = middleName
			? `${ firstName } ${ middleName } ${ lastName }`
			: `${ firstName } ${ lastName }`;

		// Update both title and slug
		setTitle( fullName );
		editPost( { title: fullName } );

		// Update slug
		const newSlug = fullName
			.toLowerCase()
			.replace( /[^a-z0-9]+/g, '-' )
			.replace( /^-+|-+$/g, '' );
		setSlug( newSlug );
	}, [ meta?.wp_peeps_first_name, meta?.wp_peeps_middle_name, meta?.wp_peeps_last_name ] );

	return (
		<PluginDocumentSettingPanel
			name="wp-peeps-name-fields"
			title={ __( 'Name Details', 'wp-peeps' ) }
			className="wp-peeps-name-fields"
			initialOpen={ true }
		>
			<TextControl
				label={ __( 'First Name', 'wp-peeps' ) + ' *' }
				value={ meta?.wp_peeps_first_name || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						wp_peeps_first_name: newValue,
					} )
				}
				help={
					! meta?.wp_peeps_first_name?.trim()
						? __( 'First name is required', 'wp-peeps' )
						: ''
				}
			/>
			<TextControl
				label={ __( 'Middle Name', 'wp-peeps' ) }
				value={ meta?.wp_peeps_middle_name || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						wp_peeps_middle_name: newValue,
					} )
				}
			/>
			<TextControl
				label={ __( 'Last Name', 'wp-peeps' ) + ' *' }
				value={ meta?.wp_peeps_last_name || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						wp_peeps_last_name: newValue,
					} )
				}
				help={
					! meta?.wp_peeps_last_name?.trim()
						? __( 'Last name is required', 'wp-peeps' )
						: ''
				}
			/>
			<TextControl
				label={ __( 'Job Title', 'wp-peeps' ) }
				value={ meta?.wp_peeps_job_title || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						wp_peeps_job_title: newValue,
					} )
				}
			/>
			<TextControl
				label={ __( 'Phone', 'wp-peeps' ) }
				value={ meta?.wp_peeps_phone ? formatPhoneNumber(meta.wp_peeps_phone) : '' }
				onChange={ handlePhoneChange }
				help={ __( 'Enter 10 digit phone number', 'wp-peeps' ) }
				type="tel"
			/>
			<TextControl
				type="email"
				label={ __( 'Email', 'wp-peeps' ) }
				value={ meta?.wp_peeps_email || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						wp_peeps_email: newValue,
					} )
				}
				help={ __( 'Enter valid email address', 'wp-peeps' ) }
			/>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin( 'wp-peeps-name-fields-panel', { render: NameFieldsPanel } );
