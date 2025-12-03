import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	TextControl,
	Button,
	Notice,
	Card,
	CardHeader,
	CardBody,
	SelectControl,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import { useState } from '@wordpress/element';
import './style.scss';

function SettingsPage() {
	const { saveEntityRecord } = useDispatch(coreStore);

	// Local state for tracking changes
	const [localSettings, setLocalSettings] = useState({});
	const [hasChanges, setHasChanges] = useState(false);
	const [showRewriteNotice, setShowRewriteNotice] = useState(false);
	const [error, setError] = useState(null);
	const [phoneFormatError, setPhoneFormatError] = useState('');

	const {
		isPublic,
		hasArchive,
		phoneFormat,
		cptSlug,
		menuPosition,
		isSaving,
	} = useSelect((select) => {
		const record = select(coreStore).getEditedEntityRecord(
			'root',
			'site',
			undefined,
		);
		return {
			isPublic: record.ph_peeps_public_cpt,
			hasArchive: record.ph_peeps_has_archive,
			phoneFormat: record.ph_peeps_phone_format,
			cptSlug: record.ph_peeps_cpt_slug,
			menuPosition: record.ph_peeps_menu_position,
			isSaving: select(coreStore).isSavingEntityRecord('root', 'site'),
		};
	});

	// Menu position options
	const menuPositions = [
		{ value: '5', label: __('Below Posts (5)', 'peeps-people-directory') },
		{ value: '10', label: __('Below Media (10)', 'peeps-people-directory') },
		{ value: '15', label: __('Below Links (15)', 'peeps-people-directory') },
		{ value: '20', label: __('Below Pages (20)', 'peeps-people-directory') },
		{ value: '25', label: __('Below Comments (25)', 'peeps-people-directory') },
		{ value: '60', label: __('Below First Separator (60)', 'peeps-people-directory') },
		{ value: '65', label: __('Below Plugins (65)', 'peeps-people-directory') },
		{ value: '70', label: __('Below Users (70)', 'peeps-people-directory') },
		{ value: '75', label: __('Below Tools (75)', 'peeps-people-directory') },
		{ value: '80', label: __('Below Settings (80)', 'peeps-people-directory') },
		{ value: '100', label: __('Below Second Separator (100)', 'peeps-people-directory') },
	];

	const updateLocalSetting = (value, setting) => {
		setLocalSettings((prev) => ({
			...prev,
			[setting]: value,
		}));
		setHasChanges(true);
	};

	const saveSettings = async () => {
		// Prevent saving if there's a phone format error
		if (phoneFormatError) {
			setError(phoneFormatError);
			return;
		}

		// Only validate phone format if it's being changed
		if (localSettings.ph_peeps_phone_format !== undefined) {
			const formatPlaceholders = (
				localSettings.ph_peeps_phone_format.match(/#/g) || []
			).length;
			if (formatPlaceholders < 10 || formatPlaceholders > 15) {
				setPhoneFormatError(
					__(
						'Format must contain between 10 and 15 # symbols.',
						'peeps-people-directory',
					),
				);
				setError(
					__(
						'Phone format must contain between 10 and 15 # symbols.',
						'peeps-people-directory',
					),
				);
				return;
			}
		}

		try {
			await saveEntityRecord('root', 'site', localSettings);
			setHasChanges(false);
			setError(null); // Clear any existing errors
			// Show notice if slug or public status was changed
			if (
				localSettings.ph_peeps_cpt_slug ||
				localSettings.ph_peeps_public_cpt !== undefined ||
				localSettings.ph_peeps_has_archive !== undefined
			) {
				setShowRewriteNotice(true);
			}
		} catch (err) {
			setError(
				err?.message || 'Failed to save settings. Please try again.',
			);
		}
	};

	return (
		<div>
			{error && (
				<Notice
					status="error"
					isDismissible={true}
					onDismiss={() => setError(null)}
				>
					{error}
				</Notice>
			)}
			{showRewriteNotice && (
				<Notice
					status="warning"
					isDismissible={true}
					onDismiss={() => setShowRewriteNotice(false)}
					className="ph-peeps-notice"
				>
					{__(
						'You changed the directory slug or public status. Please visit the Permalinks page and click "Save Changes" to update your URLs.',
						'peeps-people-directory',
					)}
					<p>
						<a
							href="options-permalink.php"
							className="button button-secondary"
						>
							{__('Visit Permalinks Page', 'peeps-people-directory')}
						</a>
					</p>
				</Notice>
			)}
			<div className="wrap ph-peeps-admin">
				<div className="ph-peeps-header">
					<h1>{__('WP Peeps Settings', 'peeps-people-directory')}</h1>
				</div>

				<Card className="ph-peeps-card">
					<CardHeader>
						<h2 className="ph-peeps-card__title">
							{__('Directory Settings', 'peeps-people-directory')}
						</h2>
					</CardHeader>
					<CardBody>
						<div className="ph-peeps-settings">
							<div className="ph-peeps-setting-row">
								<ToggleControl
									__nextHasNoMarginBottom
									label={__(
										'Make People Directory Public',
										'peeps-people-directory',
									)}
									help={__(
										'When enabled, the people directory will be visible to the public.',
										'peeps-people-directory',
									)}
									checked={
										localSettings.ph_peeps_public_cpt ??
										isPublic
									}
									onChange={(value) =>
										updateLocalSetting(
											value,
											'ph_peeps_public_cpt',
										)
									}
									disabled={isSaving}
								/>
							</div>

							<div className="ph-peeps-setting-row">
								<ToggleControl
									__nextHasNoMarginBottom
									label={__(
										'Enable People Archive Page',
										'peeps-people-directory',
									)}
									help={__(
										'When enabled, a page listing all people will be available.',
										'peeps-people-directory',
									)}
									checked={
										(localSettings.ph_peeps_public_cpt ??
										isPublic)
											? (localSettings.ph_peeps_has_archive ??
												hasArchive)
											: false
									}
									onChange={(value) =>
										updateLocalSetting(
											value,
											'ph_peeps_has_archive',
										)
									}
									disabled={
										isSaving ||
										!(
											localSettings.ph_peeps_public_cpt ??
											isPublic
										)
									}
								/>
							</div>

							<div className="ph-peeps-setting-row">
								<SelectControl
									__nextHasNoMarginBottom
									label={__('Menu Position', 'peeps-people-directory')}
									help={__(
										'Choose where the People menu appears in the admin sidebar.',
										'peeps-people-directory',
									)}
									value={String(
										localSettings.ph_peeps_menu_position ??
											menuPosition ??
											'25',
									)}
									options={menuPositions}
									onChange={(value) =>
										updateLocalSetting(
											parseInt(value, 10),
											'ph_peeps_menu_position',
										)
									}
									disabled={isSaving}
								/>
							</div>

							<div className="ph-peeps-setting-row">
								<TextControl
									__nextHasNoMarginBottom
									label={__('Directory Slug', 'peeps-people-directory')}
									help={
										<>
											{__(
												'The URL slug for the people directory (e.g., "staff" would make URLs like /staff/john-doe). Defaults to "',
												'peeps-people-directory',
											)}
											<button
												type="button"
												className="button-link"
												onClick={() =>
													updateLocalSetting(
														'people',
														'ph_peeps_cpt_slug',
													)
												}
											>
												people
											</button>
											{__('"', 'peeps-people-directory')} .
										</>
									}
									value={
										localSettings.ph_peeps_cpt_slug ??
										cptSlug
									}
									onChange={(value) =>
										updateLocalSetting(
											value,
											'ph_peeps_cpt_slug',
										)
									}
									disabled={isSaving}
								/>
							</div>

							<div className="ph-peeps-setting-row">
								<TextControl
									__nextHasNoMarginBottom
									label={__(
										'Phone Number Format',
										'peeps-people-directory',
									)}
									help={
										<>
											{__(
												'Use # for digits (10–15 digits). Example:',
												'peeps-people-directory',
											)}
											<button
												type="button"
												className="button-link"
												onClick={() =>
													updateLocalSetting(
														'(###) ###-####',
														'ph_peeps_phone_format',
													)
												}
											>
												(###) ###-####
											</button>
										</>
									}
									value={
										localSettings.ph_peeps_phone_format ??
										phoneFormat
									}
									onChange={(value) => {
										const placeholderCount = (
											value.match(/#/g) || []
										).length;
										if (
											placeholderCount < 10 ||
											placeholderCount > 15
										) {
											setPhoneFormatError(
												__(
													'Format must contain between 10 and 15 # symbols.',
													'peeps-people-directory',
												),
											);
										} else {
											setPhoneFormatError('');
										}
										updateLocalSetting(
											value,
											'ph_peeps_phone_format',
										);
									}}
									disabled={isSaving}
								/>
								{phoneFormatError && (
									<Notice
										status="error"
										isDismissible={false}
										className="ph-peeps-field-error"
									>
										{phoneFormatError}
									</Notice>
								)}
							</div>
						</div>

						<div className="ph-peeps-settings__footer">
							<Button
								variant="primary"
								onClick={saveSettings}
								disabled={!hasChanges || isSaving}
								isBusy={isSaving}
							>
								{isSaving
									? __('Saving…', 'peeps-people-directory')
									: __('Save Changes', 'peeps-people-directory')}
							</Button>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

export default SettingsPage;
