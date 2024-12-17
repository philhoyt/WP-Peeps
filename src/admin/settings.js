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

	const { isPublic, hasArchive, phoneFormat, cptSlug, menuPosition, isSaving } = useSelect(
		(select) => {
			const record = select(coreStore).getEditedEntityRecord(
				'root',
				'site',
				undefined,
			);
			return {
				isPublic: record.wp_peeps_public_cpt,
				hasArchive: record.wp_peeps_has_archive,
				phoneFormat: record.wp_peeps_phone_format,
				cptSlug: record.wp_peeps_cpt_slug,
				menuPosition: record.wp_peeps_menu_position,
				isSaving: select(coreStore).isSavingEntityRecord('root', 'site'),
			};
		},
	);

	// Menu position options
	const menuPositions = [
		{ value: '5', label: __('Below Posts (5)', 'wp-peeps') },
		{ value: '10', label: __('Below Media (10)', 'wp-peeps') },
		{ value: '15', label: __('Below Links (15)', 'wp-peeps') },
		{ value: '20', label: __('Below Pages (20)', 'wp-peeps') },
		{ value: '25', label: __('Below Comments (25)', 'wp-peeps') },
		{ value: '60', label: __('Below First Separator (60)', 'wp-peeps') },
		{ value: '65', label: __('Below Plugins (65)', 'wp-peeps') },
		{ value: '70', label: __('Below Users (70)', 'wp-peeps') },
		{ value: '75', label: __('Below Tools (75)', 'wp-peeps') },
		{ value: '80', label: __('Below Settings (80)', 'wp-peeps') },
		{ value: '100', label: __('Below Second Separator (100)', 'wp-peeps') },
	];

	const updateLocalSetting = (value, setting) => {
		setLocalSettings((prev) => ({
			...prev,
			[setting]: value,
		}));
		setHasChanges(true);
	};

	const saveSettings = async () => {
		// Only validate phone format if it's being changed
		if (localSettings.wp_peeps_phone_format !== undefined) {
			const formatPlaceholders = (localSettings.wp_peeps_phone_format.match(/#/g) || []).length;
			if (formatPlaceholders < 10 || formatPlaceholders > 15) {
				setError(__('Phone format must contain between 10 and 15 # symbols.', 'wp-peeps'));
				return;
			}
		}

		try {
			await saveEntityRecord('root', 'site', localSettings);
			setHasChanges(false);
			setError(null); // Clear any existing errors
			// Show notice if slug or public status was changed
			if (
				localSettings.wp_peeps_cpt_slug ||
				localSettings.wp_peeps_public_cpt !== undefined ||
				localSettings.wp_peeps_has_archive !== undefined
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
					className="wp-peeps-notice"
				>
					{__(
						'You changed the directory slug or public status. Please visit the Permalinks page and click "Save Changes" to update your URLs.',
						'wp-peeps',
					)}
					<p>
						<a
							href="options-permalink.php"
							className="button button-secondary"
						>
							{__('Visit Permalinks Page', 'wp-peeps')}
						</a>
					</p>
				</Notice>
			)}
			<div className="wrap wp-peeps-admin">
				<div className="wp-peeps-header">
					<h1>{__('WP Peeps Settings', 'wp-peeps')}</h1>
				</div>

				<Card className="wp-peeps-card">
					<CardHeader>
						<h2 className="wp-peeps-card__title">
							{__('Directory Settings', 'wp-peeps')}
						</h2>
					</CardHeader>
					<CardBody>
						<div className="wp-peeps-settings">
							<div className="wp-peeps-setting-row">
								<ToggleControl
									__nextHasNoMarginBottom
									label={__(
										'Make People Directory Public',
										'wp-peeps',
									)}
									help={__(
										'When enabled, the people directory will be visible to the public.',
										'wp-peeps',
									)}
									checked={
										localSettings.wp_peeps_public_cpt ??
										isPublic
									}
									onChange={(value) =>
										updateLocalSetting(
											value,
											'wp_peeps_public_cpt',
										)
									}
									disabled={isSaving}
								/>
							</div>

							<div className="wp-peeps-setting-row">
								<ToggleControl
									__nextHasNoMarginBottom
									label={__(
										'Enable People Archive Page',
										'wp-peeps',
									)}
									help={__(
										'When enabled, a page listing all people will be available.',
										'wp-peeps',
									)}
									checked={
										(localSettings.wp_peeps_public_cpt ??
										isPublic)
											? (localSettings.wp_peeps_has_archive ??
												hasArchive)
											: false
									}
									onChange={(value) =>
										updateLocalSetting(
											value,
											'wp_peeps_has_archive',
										)
									}
									disabled={
										isSaving ||
										!(localSettings.wp_peeps_public_cpt ??
										isPublic)
									}
								/>
							</div>
	
							<div className="wp-peeps-setting-row">
								<SelectControl
									__nextHasNoMarginBottom
									label={__('Menu Position', 'wp-peeps')}
									help={__(
										'Choose where the People menu appears in the admin sidebar.',
										'wp-peeps',
									)}
									value={String(
										localSettings.wp_peeps_menu_position ??
										menuPosition ??
										'25'
									)}
									options={menuPositions}
									onChange={(value) =>
										updateLocalSetting(
											parseInt(value, 10),
											'wp_peeps_menu_position',
										)
									}
									disabled={isSaving}
								/>
							</div>

							<div className="wp-peeps-setting-row">
								<TextControl
									__nextHasNoMarginBottom
									label={__('Directory Slug', 'wp-peeps')}
									help={
										<>
											{__(
												'The URL slug for the people directory (e.g., "staff" would make URLs like /staff/john-doe). Defaults to "',
												'wp-peeps',
											)}
											<button
												type="button"
												className="button-link"
												onClick={() =>
													updateLocalSetting(
														'people',
														'wp_peeps_cpt_slug',
													)
												}
											>
												people
											</button>
											{__('"', 'wp-peeps')} .
										</>
									}
									value={
										localSettings.wp_peeps_cpt_slug ??
										cptSlug
									}
									onChange={(value) =>
										updateLocalSetting(
											value,
											'wp_peeps_cpt_slug',
										)
									}
									disabled={isSaving}
								/>
							</div>

							<div className="wp-peeps-setting-row">
								<TextControl
									__nextHasNoMarginBottom
									label={__(
										'Phone Number Format',
										'wp-peeps',
									)}
									help={
										<>
											{__(
												'Use # for digits (10–15 digits). Example:',
												'wp-peeps',
											)}
											<button
												type="button"
												className="button-link"
												onClick={() =>
													updateLocalSetting(
														'(###) ###-####',
														'wp_peeps_phone_format',
													)
												}
											>
												(###) ###-####
											</button>
										</>
									}
									value={
										localSettings.wp_peeps_phone_format ??
										phoneFormat
									}
									onChange={(value) => {
										const placeholderCount = (value.match(/#/g) || []).length;
										if (placeholderCount < 10 || placeholderCount > 15) {
											setPhoneFormatError(
												__('Format must contain between 10 and 15 # symbols.', 'wp-peeps')
											);
										} else {
											setPhoneFormatError('');
										}
										updateLocalSetting(
											value,
											'wp_peeps_phone_format',
										);
									}}
									disabled={isSaving}
								/>
								{phoneFormatError && (
									<Notice
										status="error"
										isDismissible={false}
										className="wp-peeps-field-error"
									>
										{phoneFormatError}
									</Notice>
								)}
							</div>
						</div>

						<div className="wp-peeps-settings__footer">
							<Button
								variant="primary"
								onClick={saveSettings}
								disabled={!hasChanges || isSaving}
								isBusy={isSaving}
							>
								{isSaving
									? __('Saving…', 'wp-peeps')
									: __('Save Changes', 'wp-peeps')}
							</Button>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

export default SettingsPage;
