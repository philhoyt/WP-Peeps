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
		{ value: '5', label: __('Below Posts (5)', 'ph-peeps') },
		{ value: '10', label: __('Below Media (10)', 'ph-peeps') },
		{ value: '15', label: __('Below Links (15)', 'ph-peeps') },
		{ value: '20', label: __('Below Pages (20)', 'ph-peeps') },
		{ value: '25', label: __('Below Comments (25)', 'ph-peeps') },
		{ value: '60', label: __('Below First Separator (60)', 'ph-peeps') },
		{ value: '65', label: __('Below Plugins (65)', 'ph-peeps') },
		{ value: '70', label: __('Below Users (70)', 'ph-peeps') },
		{ value: '75', label: __('Below Tools (75)', 'ph-peeps') },
		{ value: '80', label: __('Below Settings (80)', 'ph-peeps') },
		{ value: '100', label: __('Below Second Separator (100)', 'ph-peeps') },
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
						'ph-peeps',
					),
				);
				setError(
					__(
						'Phone format must contain between 10 and 15 # symbols.',
						'ph-peeps',
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
						'ph-peeps',
					)}
					<p>
						<a
							href="options-permalink.php"
							className="button button-secondary"
						>
							{__('Visit Permalinks Page', 'ph-peeps')}
						</a>
					</p>
				</Notice>
			)}
			<div className="wrap ph-peeps-admin">
				<div className="ph-peeps-header">
					<h1>{__('WP Peeps Settings', 'ph-peeps')}</h1>
				</div>

				<Card className="ph-peeps-card">
					<CardHeader>
						<h2 className="ph-peeps-card__title">
							{__('Directory Settings', 'ph-peeps')}
						</h2>
					</CardHeader>
					<CardBody>
						<div className="ph-peeps-settings">
							<div className="ph-peeps-setting-row">
								<ToggleControl
									__nextHasNoMarginBottom
									label={__(
										'Make People Directory Public',
										'ph-peeps',
									)}
									help={__(
										'When enabled, the people directory will be visible to the public.',
										'ph-peeps',
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
										'ph-peeps',
									)}
									help={__(
										'When enabled, a page listing all people will be available.',
										'ph-peeps',
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
									label={__('Menu Position', 'ph-peeps')}
									help={__(
										'Choose where the People menu appears in the admin sidebar.',
										'ph-peeps',
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
									label={__('Directory Slug', 'ph-peeps')}
									help={
										<>
											{__(
												'The URL slug for the people directory (e.g., "staff" would make URLs like /staff/john-doe). Defaults to "',
												'ph-peeps',
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
											{__('"', 'ph-peeps')} .
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
										'ph-peeps',
									)}
									help={
										<>
											{__(
												'Use # for digits (10–15 digits). Example:',
												'ph-peeps',
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
													'ph-peeps',
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
									? __('Saving…', 'ph-peeps')
									: __('Save Changes', 'ph-peeps')}
							</Button>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

export default SettingsPage;
