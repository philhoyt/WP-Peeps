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
	TabPanel,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import {
	DEFAULT_PHONE_FORMAT,
	DEFAULT_CPT_SLUG,
	DEFAULT_MENU_POSITION,
} from '../blocks/constants';
import './style.scss';

const META_KEYS = [
	{
		key: 'ph_peeps_first_name',
		label: __( 'First Name', 'peeps-people-directory' ),
		type: 'string',
		notes: '',
	},
	{
		key: 'ph_peeps_middle_name',
		label: __( 'Middle Name', 'peeps-people-directory' ),
		type: 'string',
		notes: '',
	},
	{
		key: 'ph_peeps_last_name',
		label: __( 'Last Name', 'peeps-people-directory' ),
		type: 'string',
		notes: '',
	},
	{
		key: 'ph_peeps_phone',
		label: __( 'Phone Number', 'peeps-people-directory' ),
		type: 'string',
		notes: __( 'Stored as digits only (10–15)', 'peeps-people-directory' ),
	},
	{
		key: 'ph_peeps_phone_ext',
		label: __( 'Phone Extension', 'peeps-people-directory' ),
		type: 'string',
		notes: '',
	},
	{
		key: 'ph_peeps_email',
		label: __( 'Email Address', 'peeps-people-directory' ),
		type: 'string',
		notes: '',
	},
	{
		key: 'ph_peeps_social_links',
		label: __( 'Social Links', 'peeps-people-directory' ),
		type: 'array',
		notes: '[{ platform, url }]',
	},
];

const BLOCKS = [
	{
		name: 'ph-peeps/full-name',
		title: __( 'Full Name', 'peeps-people-directory' ),
		description: __(
			"Displays a person's full name with configurable parts (first, middle, last). Supports heading tags and optional link wrapping.",
			'peeps-people-directory'
		),
	},
	{
		name: 'ph-peeps/phone',
		title: __( 'Phone Number', 'peeps-people-directory' ),
		description: __(
			"Displays a person's phone number, formatted via the plugin's phone format setting. Supports tel: link.",
			'peeps-people-directory'
		),
	},
	{
		name: 'ph-peeps/email',
		title: __( 'Email Address', 'peeps-people-directory' ),
		description: __(
			"Displays a person's email address. Supports mailto: link.",
			'peeps-people-directory'
		),
	},
	{
		name: 'ph-peeps/social-links',
		title: __( 'Social Links', 'peeps-people-directory' ),
		description: __(
			"Renders a person's social media links as icons. Supports labels, icon sizing, and flex layout.",
			'peeps-people-directory'
		),
	},
];

const SETTINGS_KEYS = [
	{
		key: 'ph_peeps_public_cpt',
		type: 'boolean',
		default: 'true',
		description: __(
			'Whether the People directory is publicly accessible.',
			'peeps-people-directory'
		),
	},
	{
		key: 'ph_peeps_has_archive',
		type: 'boolean',
		default: 'true',
		description: __(
			'Whether the archive page listing all people is enabled.',
			'peeps-people-directory'
		),
	},
	{
		key: 'ph_peeps_cpt_slug',
		type: 'string',
		default: 'people',
		description: __(
			'URL slug for the people directory (e.g. "staff" → /staff/john-doe).',
			'peeps-people-directory'
		),
	},
	{
		key: 'ph_peeps_phone_format',
		type: 'string',
		default: '(###) ###-####',
		description: __(
			'Phone number display format. Use # for each digit (10–15 # symbols required).',
			'peeps-people-directory'
		),
	},
	{
		key: 'ph_peeps_menu_position',
		type: 'integer',
		default: '25',
		description: __(
			'Admin sidebar menu position for the People post type (0–999).',
			'peeps-people-directory'
		),
	},
];

function DocsTab() {
	return (
		<div className="ph-peeps-docs">
			<Card className="ph-peeps-card">
				<CardHeader>
					<h2 className="ph-peeps-card__title">
						{ __( 'Post Type', 'peeps-people-directory' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<table className="ph-peeps-docs__table">
						<tbody>
							<tr>
								<th>
									{ __(
										'Post Type Key',
										'peeps-people-directory'
									) }
								</th>
								<td>
									<code>ph_peeps_people</code>
								</td>
							</tr>
							<tr>
								<th>
									{ __(
										'REST API Base',
										'peeps-people-directory'
									) }
								</th>
								<td>
									<code>
										/wp-json/wp/v2/ph_peeps_people
									</code>
								</td>
							</tr>
							<tr>
								<th>
									{ __(
										'PHP Namespace',
										'peeps-people-directory'
									) }
								</th>
								<td>
									<code>PH_Peeps\Inc</code>
								</td>
							</tr>
							<tr>
								<th>
									{ __(
										'Text Domain',
										'peeps-people-directory'
									) }
								</th>
								<td>
									<code>peeps-people-directory</code>
								</td>
							</tr>
							<tr>
								<th>
									{ __(
										'Plugin Prefix',
										'peeps-people-directory'
									) }
								</th>
								<td>
									<code>ph_peeps_</code>
								</td>
							</tr>
						</tbody>
					</table>
				</CardBody>
			</Card>

			<Card className="ph-peeps-card">
				<CardHeader>
					<h2 className="ph-peeps-card__title">
						{ __( 'Meta Keys', 'peeps-people-directory' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<p className="ph-peeps-docs__intro">
						{ __(
							'Post meta fields registered for ph_peeps_people. All fields are exposed via the REST API and available in the block editor.',
							'peeps-people-directory'
						) }
					</p>
					<table className="ph-peeps-docs__table ph-peeps-docs__table--full">
						<thead>
							<tr>
								<th>
									{ __(
										'Meta Key',
										'peeps-people-directory'
									) }
								</th>
								<th>
									{ __( 'Label', 'peeps-people-directory' ) }
								</th>
								<th>
									{ __( 'Type', 'peeps-people-directory' ) }
								</th>
								<th>
									{ __( 'Notes', 'peeps-people-directory' ) }
								</th>
							</tr>
						</thead>
						<tbody>
							{ META_KEYS.map(
								( { key, label, type, notes } ) => (
									<tr key={ key }>
										<td>
											<code>{ key }</code>
										</td>
										<td>{ label }</td>
										<td>
											<code>{ type }</code>
										</td>
										<td>{ notes || '—' }</td>
									</tr>
								)
							) }
						</tbody>
					</table>
				</CardBody>
			</Card>

			<Card className="ph-peeps-card">
				<CardHeader>
					<h2 className="ph-peeps-card__title">
						{ __( 'Available Blocks', 'peeps-people-directory' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<p className="ph-peeps-docs__intro">
						{ __(
							'Custom blocks provided by WP Peeps. These are designed for use inside the person post template and pull data from post meta.',
							'peeps-people-directory'
						) }
					</p>
					<table className="ph-peeps-docs__table ph-peeps-docs__table--full">
						<thead>
							<tr>
								<th>
									{ __(
										'Block Name',
										'peeps-people-directory'
									) }
								</th>
								<th>
									{ __( 'Title', 'peeps-people-directory' ) }
								</th>
								<th>
									{ __(
										'Description',
										'peeps-people-directory'
									) }
								</th>
							</tr>
						</thead>
						<tbody>
							{ BLOCKS.map( ( { name, title, description } ) => (
								<tr key={ name }>
									<td>
										<code>{ name }</code>
									</td>
									<td>{ title }</td>
									<td>{ description }</td>
								</tr>
							) ) }
						</tbody>
					</table>
				</CardBody>
			</Card>

			<Card className="ph-peeps-card">
				<CardHeader>
					<h2 className="ph-peeps-card__title">
						{ __(
							'Settings / Options',
							'peeps-people-directory'
						) }
					</h2>
				</CardHeader>
				<CardBody>
					<p className="ph-peeps-docs__intro">
						{ __(
							'Plugin options stored via the WordPress Settings API and exposed through the REST API at',
							'peeps-people-directory'
						) }{ ' ' }
						<code>/wp-json/wp/v2/settings</code>.
					</p>
					<table className="ph-peeps-docs__table ph-peeps-docs__table--full">
						<thead>
							<tr>
								<th>
									{ __(
										'Option Key',
										'peeps-people-directory'
									) }
								</th>
								<th>
									{ __( 'Type', 'peeps-people-directory' ) }
								</th>
								<th>
									{ __(
										'Default',
										'peeps-people-directory'
									) }
								</th>
								<th>
									{ __(
										'Description',
										'peeps-people-directory'
									) }
								</th>
							</tr>
						</thead>
						<tbody>
							{ SETTINGS_KEYS.map(
								( {
									key,
									type,
									default: defaultVal,
									description,
								} ) => (
									<tr key={ key }>
										<td>
											<code>{ key }</code>
										</td>
										<td>
											<code>{ type }</code>
										</td>
										<td>
											<code>{ defaultVal }</code>
										</td>
										<td>{ description }</td>
									</tr>
								)
							) }
						</tbody>
					</table>
				</CardBody>
			</Card>

		</div>
	);
}

function SettingsPage() {
	const { saveEntityRecord } = useDispatch( coreStore );

	// Local state for tracking changes
	const [ localSettings, setLocalSettings ] = useState( {} );
	const [ hasChanges, setHasChanges ] = useState( false );
	const [ showRewriteNotice, setShowRewriteNotice ] = useState( false );
	const [ error, setError ] = useState( null );
	const [ phoneFormatError, setPhoneFormatError ] = useState( '' );

	const {
		isPublic,
		hasArchive,
		phoneFormat,
		cptSlug,
		menuPosition,
		isSaving,
	} = useSelect( ( select ) => {
		const record = select( coreStore ).getEditedEntityRecord(
			'root',
			'site',
			undefined
		);
		return {
			isPublic: record.ph_peeps_public_cpt,
			hasArchive: record.ph_peeps_has_archive,
			phoneFormat: record.ph_peeps_phone_format,
			cptSlug: record.ph_peeps_cpt_slug,
			menuPosition: record.ph_peeps_menu_position,
			isSaving: select( coreStore ).isSavingEntityRecord( 'root', 'site' ),
		};
	} );

	// Menu position options
	const menuPositions = [
		{
			value: '5',
			label: __( 'Below Posts (5)', 'peeps-people-directory' ),
		},
		{
			value: '10',
			label: __( 'Below Media (10)', 'peeps-people-directory' ),
		},
		{
			value: '15',
			label: __( 'Below Links (15)', 'peeps-people-directory' ),
		},
		{
			value: '20',
			label: __( 'Below Pages (20)', 'peeps-people-directory' ),
		},
		{
			value: '25',
			label: __( 'Below Comments (25)', 'peeps-people-directory' ),
		},
		{
			value: '60',
			label: __( 'Below First Separator (60)', 'peeps-people-directory' ),
		},
		{
			value: '65',
			label: __( 'Below Plugins (65)', 'peeps-people-directory' ),
		},
		{
			value: '70',
			label: __( 'Below Users (70)', 'peeps-people-directory' ),
		},
		{
			value: '75',
			label: __( 'Below Tools (75)', 'peeps-people-directory' ),
		},
		{
			value: '80',
			label: __( 'Below Settings (80)', 'peeps-people-directory' ),
		},
		{
			value: '100',
			label: __(
				'Below Second Separator (100)',
				'peeps-people-directory'
			),
		},
	];

	const updateLocalSetting = ( value, setting ) => {
		setLocalSettings( ( prev ) => ( {
			...prev,
			[ setting ]: value,
		} ) );
		setHasChanges( true );
	};

	const saveSettings = async () => {
		// Prevent saving if there's a phone format error
		if ( phoneFormatError ) {
			setError( phoneFormatError );
			return;
		}

		// Only validate phone format if it's being changed
		if ( localSettings.ph_peeps_phone_format !== undefined ) {
			const formatPlaceholders = (
				localSettings.ph_peeps_phone_format.match( /#/g ) || []
			).length;
			if ( formatPlaceholders < 10 || formatPlaceholders > 15 ) {
				setPhoneFormatError(
					__(
						'Format must contain between 10 and 15 # symbols.',
						'peeps-people-directory'
					)
				);
				setError(
					__(
						'Phone format must contain between 10 and 15 # symbols.',
						'peeps-people-directory'
					)
				);
				return;
			}
		}

		try {
			await saveEntityRecord( 'root', 'site', localSettings );
			setHasChanges( false );
			setError( null ); // Clear any existing errors
			// Show notice if slug or public status was changed
			if (
				localSettings.ph_peeps_cpt_slug ||
				localSettings.ph_peeps_public_cpt !== undefined ||
				localSettings.ph_peeps_has_archive !== undefined
			) {
				setShowRewriteNotice( true );
			}
		} catch ( err ) {
			setError(
				err?.message || 'Failed to save settings. Please try again.'
			);
		}
	};

	return (
		<div>
			{ error && (
				<Notice
					status="error"
					isDismissible={ true }
					onDismiss={ () => setError( null ) }
				>
					{ error }
				</Notice>
			) }
			{ showRewriteNotice && (
				<Notice
					status="warning"
					isDismissible={ true }
					onDismiss={ () => setShowRewriteNotice( false ) }
					className="ph-peeps-notice"
				>
					{ __(
						'You changed the directory slug or public status. Please visit the Permalinks page and click "Save Changes" to update your URLs.',
						'peeps-people-directory'
					) }
					<p>
						<a
							href="options-permalink.php"
							className="button button-secondary"
						>
							{ __(
								'Visit Permalinks Page',
								'peeps-people-directory'
							) }
						</a>
					</p>
				</Notice>
			) }
			<div className="wrap ph-peeps-admin">
				<div className="ph-peeps-header">
					<h1>
						{ __( 'WP Peeps Settings', 'peeps-people-directory' ) }
					</h1>
				</div>

				<TabPanel
					className="ph-peeps-tabs"
					tabs={ [
						{
							name: 'settings',
							title: __(
								'Settings',
								'peeps-people-directory'
							),
						},
						{
							name: 'docs',
							title: __(
								'Developer Docs',
								'peeps-people-directory'
							),
						},
					] }
				>
					{ ( tab ) => {
						if ( tab.name === 'docs' ) {
							return <DocsTab />;
						}

						return (
							<Card className="ph-peeps-card">
								<CardHeader>
									<h2 className="ph-peeps-card__title">
										{ __(
											'Directory Settings',
											'peeps-people-directory'
										) }
									</h2>
								</CardHeader>
								<CardBody>
									<div className="ph-peeps-settings">
										<div className="ph-peeps-setting-row">
											<ToggleControl
												__nextHasNoMarginBottom
												label={ __(
													'Make People Directory Public',
													'peeps-people-directory'
												) }
												help={ __(
													'When enabled, the people directory will be visible to the public.',
													'peeps-people-directory'
												) }
												checked={
													localSettings.ph_peeps_public_cpt ??
													isPublic
												}
												onChange={ ( value ) =>
													updateLocalSetting(
														value,
														'ph_peeps_public_cpt'
													)
												}
												disabled={ isSaving }
											/>
										</div>

										<div className="ph-peeps-setting-row">
											<ToggleControl
												__nextHasNoMarginBottom
												label={ __(
													'Enable People Archive Page',
													'peeps-people-directory'
												) }
												help={ __(
													'When enabled, a page listing all people will be available.',
													'peeps-people-directory'
												) }
												checked={
													( localSettings.ph_peeps_public_cpt ??
														isPublic )
														? ( localSettings.ph_peeps_has_archive ??
																hasArchive )
														: false
												}
												onChange={ ( value ) =>
													updateLocalSetting(
														value,
														'ph_peeps_has_archive'
													)
												}
												disabled={
													isSaving ||
													! ( localSettings.ph_peeps_public_cpt ??
														isPublic )
												}
											/>
										</div>

										<div className="ph-peeps-setting-row">
											<SelectControl
												__nextHasNoMarginBottom
												label={ __(
													'Menu Position',
													'peeps-people-directory'
												) }
												help={ __(
													'Choose where the People menu appears in the admin sidebar.',
													'peeps-people-directory'
												) }
												value={ String(
													localSettings.ph_peeps_menu_position ??
														menuPosition ??
														DEFAULT_MENU_POSITION
												) }
												options={ menuPositions }
												onChange={ ( value ) =>
													updateLocalSetting(
														parseInt( value, 10 ),
														'ph_peeps_menu_position'
													)
												}
												disabled={ isSaving }
											/>
										</div>

										<div className="ph-peeps-setting-row">
											<TextControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ __(
													'Directory Slug',
													'peeps-people-directory'
												) }
												help={
													<>
														{ __(
															'The URL slug for the people directory (e.g., "staff" would make URLs like /staff/john-doe). Defaults to "',
															'peeps-people-directory'
														) }
														<button
															type="button"
															className="button-link"
															onClick={ () =>
																updateLocalSetting(
																	DEFAULT_CPT_SLUG,
																	'ph_peeps_cpt_slug'
																)
															}
														>
															people
														</button>
														{ __(
															'"',
															'peeps-people-directory'
														) }{ ' ' }
														.
													</>
												}
												value={
													localSettings.ph_peeps_cpt_slug ??
													cptSlug
												}
												onChange={ ( value ) =>
													updateLocalSetting(
														value,
														'ph_peeps_cpt_slug'
													)
												}
												disabled={ isSaving }
											/>
										</div>

										<div className="ph-peeps-setting-row">
											<TextControl
												__next40pxDefaultSize
												__nextHasNoMarginBottom
												label={ __(
													'Phone Number Format',
													'peeps-people-directory'
												) }
												help={
													<>
														{ __(
															'Use # for digits (10–15 digits). Example:',
															'peeps-people-directory'
														) }
														<button
															type="button"
															className="button-link"
															onClick={ () =>
																updateLocalSetting(
																	DEFAULT_PHONE_FORMAT,
																	'ph_peeps_phone_format'
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
												onChange={ ( value ) => {
													const placeholderCount = (
														value.match( /#/g ) || []
													).length;
													if (
														placeholderCount < 10 ||
														placeholderCount > 15
													) {
														setPhoneFormatError(
															__(
																'Format must contain between 10 and 15 # symbols.',
																'peeps-people-directory'
															)
														);
													} else {
														setPhoneFormatError(
															''
														);
													}
													updateLocalSetting(
														value,
														'ph_peeps_phone_format'
													);
												} }
												disabled={ isSaving }
											/>
											{ phoneFormatError && (
												<Notice
													status="error"
													isDismissible={ false }
													className="ph-peeps-field-error"
												>
													{ phoneFormatError }
												</Notice>
											) }
										</div>
									</div>

									<div className="ph-peeps-settings__footer">
										<Button
											variant="primary"
											onClick={ saveSettings }
											disabled={
												! hasChanges || isSaving
											}
											isBusy={ isSaving }
										>
											{ isSaving
												? __(
														'Saving…',
														'peeps-people-directory'
												  )
												: __(
														'Save Changes',
														'peeps-people-directory'
												  ) }
										</Button>
									</div>
								</CardBody>
							</Card>
						);
					} }
				</TabPanel>
			</div>
		</div>
	);
}

export default SettingsPage;
