import { __ } from '@wordpress/i18n';
import { ToggleControl, TextControl, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

function SettingsPage() {
	const { saveEntityRecord } = useDispatch(coreStore);
	
	// Local state for tracking changes
	const [localSettings, setLocalSettings] = useState({});
	const [hasChanges, setHasChanges] = useState(false);
	
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

	const updateLocalSetting = (value, setting) => {
		setLocalSettings(prev => ({
			...prev,
			[setting]: value
		}));
		setHasChanges(true);
	};

	const saveSettings = async () => {
		try {
			await saveEntityRecord('root', 'site', localSettings);
			setHasChanges(false);
			window.location.reload();
		} catch (error) {
			console.error('Failed to save settings:', error);
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
					checked={ localSettings.wp_peeps_public_cpt ?? isPublic }
					onChange={ (value) => updateLocalSetting(value, 'wp_peeps_public_cpt') }
					disabled={ isSaving }
				/>

				<TextControl
					__nextHasNoMarginBottom
					label={ __('Phone Number Format', 'wp-peeps') }
						help={ __('Use # for digits. Example: (###) ###-####', 'wp-peeps') }
					value={ localSettings.wp_peeps_phone_format ?? phoneFormat }
					onChange={ (value) => updateLocalSetting(value, 'wp_peeps_phone_format') }
					disabled={ isSaving }
				/>

				{hasChanges && (
					<div className="wp-peeps-settings__footer" style={{ marginTop: '20px' }}>
						<Button
							variant="primary"
							onClick={ saveSettings }
							disabled={ isSaving }
						>
							{ isSaving ? __('Saving...', 'wp-peeps') : __('Save Changes', 'wp-peeps') }
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

export default SettingsPage;
