import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { TextControl } from '@wordpress/components';

function SettingsPage() {
	const { saveEntityRecord } = useDispatch(coreStore);
	
	const { isPublic, phoneFormat, isSaving } = useSelect((select) => ({
		isPublic: select(coreStore).getEditedEntityRecord(
			'root',
			'site',
			undefined
		).wp_peeps_public_cpt,
		phoneFormat: select(coreStore).getEditedEntityRecord(
			'root',
			'site',
			undefined
		).wp_peeps_phone_format,
		isSaving: select(coreStore).isSavingEntityRecord(
			'root',
			'site'
		),
	}));

	const updateSetting = async (value, setting) => {
		try {
			await saveEntityRecord('root', 'site', {
				[setting]: value
			});
			window.location.reload();
		} catch (error) {
			console.error('Failed to save setting:', error);
		}
	};

	return (
		<div className="wrap">
			<h1>{ __('WP Peeps Settings', 'wp-peeps') }</h1>
			
			<div className="wp-peeps-settings">
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __('Make People Directory Public', 'wp-peeps') }
					help={ __('When enabled, the people directory will be visible to the public.', 'wp-peeps') }
					checked={ isPublic }
					onChange={ (value) => updateSetting(value, 'wp_peeps_public_cpt') }
					disabled={ isSaving }
				/>

				<TextControl
					__nextHasNoMarginBottom
					label={ __('Phone Number Format', 'wp-peeps') }
					help={ __('Use # for digits. Example: (###) ###-####', 'wp-peeps') }
					value={ phoneFormat }
					onChange={ (value) => updateSetting(value, 'wp_peeps_phone_format') }
					disabled={ isSaving }
				/>
			</div>
		</div>
	);
}

export default SettingsPage;
