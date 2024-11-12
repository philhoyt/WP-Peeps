import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	TextControl,
	Button,
	Notice,
	Card,
	CardHeader,
	CardBody,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useState } from '@wordpress/element';
import './style.scss';

function SettingsPage() {
	const { saveEntityRecord } = useDispatch( coreStore );
	const { createNotice } = useDispatch(noticesStore);

	// Local state for tracking changes
	const [ localSettings, setLocalSettings ] = useState( {} );
	const [ hasChanges, setHasChanges ] = useState( false );
	const [ showRewriteNotice, setShowRewriteNotice ] = useState( false );

	const { isPublic, phoneFormat, cptSlug, isSaving } = useSelect(
		( select ) => ( {
			isPublic: select( coreStore ).getEditedEntityRecord(
				'root',
				'site',
				undefined
			).wp_peeps_public_cpt,
			phoneFormat: select( coreStore ).getEditedEntityRecord(
				'root',
				'site',
				undefined
			).wp_peeps_phone_format,
			cptSlug: select( coreStore ).getEditedEntityRecord(
				'root',
				'site',
				undefined
			).wp_peeps_cpt_slug,
			isSaving: select( coreStore ).isSavingEntityRecord(
				'root',
				'site'
			),
		} )
	);

	const updateLocalSetting = ( value, setting ) => {
		setLocalSettings( ( prev ) => ( {
			...prev,
			[ setting ]: value,
		} ) );
		setHasChanges( true );
	};

	const saveSettings = async () => {
		try {
			await saveEntityRecord( 'root', 'site', localSettings );
			setHasChanges( false );
			// Show notice if slug or public status was changed
			if ( localSettings.wp_peeps_cpt_slug || localSettings.wp_peeps_public_cpt !== undefined ) {
				setShowRewriteNotice( true );
			}
		} catch ( error ) {
			console.error( 'Failed to save settings:', error );
		}
	};

	return (
		<div>
			{ showRewriteNotice && (
				<Notice
					status="warning"
					isDismissible={ true }
					onDismiss={ () => setShowRewriteNotice( false ) }
					className="wp-peeps-notice"
				>
					{ __(
						'You changed the directory slug or public status. Please visit the Permalinks page and click "Save Changes" to update your URLs.',
						'wp-peeps'
					) }
					<p>
						<a
							href="options-permalink.php"
							className="button button-secondary"
						>
							{ __( 'Visit Permalinks Page', 'wp-peeps' ) }
						</a>
					</p>
				</Notice>
			) }
			<div className="wrap wp-peeps-admin">
				<div className="wp-peeps-header">
					<h1>{ __( 'WP Peeps Settings', 'wp-peeps' ) }</h1>
				</div>

				<Card className="wp-peeps-card">
					<CardHeader>
						<h2 className="wp-peeps-card__title">
							{ __( 'Directory Settings', 'wp-peeps' ) }
						</h2>
					</CardHeader>
					<CardBody>
						<div className="wp-peeps-settings">
							<div className="wp-peeps-setting-row">
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __(
										'Make People Directory Public',
										'wp-peeps'
									) }
									help={ __(
										'When enabled, the people directory will be visible to the public.',
										'wp-peeps'
									) }
									checked={
										localSettings.wp_peeps_public_cpt ??
										isPublic
									}
									onChange={ ( value ) =>
										updateLocalSetting(
											value,
											'wp_peeps_public_cpt'
										)
									}
									disabled={ isSaving }
								/>
							</div>

							<div className="wp-peeps-setting-row">
								<TextControl
									__nextHasNoMarginBottom
									label={ __( 'Directory Slug', 'wp-peeps' ) }
									help={ __(
										'The URL slug for the people directory (e.g., "staff" would make URLs like /staff/john-doe). Defaults to "people".',
										'wp-peeps'
									) }
									value={
										localSettings.wp_peeps_cpt_slug ??
										cptSlug
									}
									onChange={ ( value ) =>
										updateLocalSetting(
											value,
											'wp_peeps_cpt_slug'
										)
									}
									disabled={ isSaving }
								/>
							</div>

							<div className="wp-peeps-setting-row">
								<TextControl
									__nextHasNoMarginBottom
									label={ __(
										'Phone Number Format',
										'wp-peeps'
									) }
									help={
										<>
											{ __( 'Use # for digits. Example: ', 'wp-peeps' ) }
											<button
												type="button"
												className="button-link"
												onClick={ () => updateLocalSetting( '(###) ###-####', 'wp_peeps_phone_format' ) }
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
										const digitCount = (value.match(/#/g) || []).length;
										if (digitCount >= 10) {
											updateLocalSetting(value, 'wp_peeps_phone_format');
										}
									}}
									disabled={ isSaving }
								/>
							</div>

							{ hasChanges && (
								<div className="wp-peeps-settings__footer">
									<Button
										variant="primary"
										onClick={ saveSettings }
										disabled={ isSaving }
									>
										{ isSaving
											? __( 'Saving…', 'wp-peeps' )
											: __( 'Save Changes', 'wp-peeps' ) }
									</Button>
								</div>
							) }
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

export default SettingsPage;
