import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import {
	TextControl,
	Button,
	Flex,
	FlexItem,
	Icon,
} from '@wordpress/components';
import { useEffect, useRef, useState, useCallback, useMemo } from '@wordpress/element';
import { dispatch, useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import { store as editPostStore } from '@wordpress/edit-post';
import { dragHandle } from '@wordpress/icons';
import {
	isValidEmail,
	isValidUrl,
	formatPhoneNumber,
	detectPlatform,
	createSlug,
} from './utils';

// Import and register blocks
import '../blocks';

// Import styles
import './style.scss';

const REQUIRED_FIELD_ERROR = __('This field is required', 'peeps-people-directory');
const EMAIL_VALIDATION_ERROR = __('Please enter a valid email address', 'peeps-people-directory');
const URL_VALIDATION_ERROR = __('Please enter a valid URL', 'peeps-people-directory');
const NAME_FIELDS = {
	FIRST_NAME: 'ph_peeps_first_name',
	MIDDLE_NAME: 'ph_peeps_middle_name',
	LAST_NAME: 'ph_peeps_last_name',
	JOB_TITLE: 'ph_peeps_job_title',
	PHONE: 'ph_peeps_phone',
	PHONE_EXT: 'ph_peeps_phone_ext',
	EMAIL: 'ph_peeps_email',
};

function PersonDetailsPanel() {
	// Check if we're on the people post type
	const postType = useSelect(
		(select) => select('core/editor').getCurrentPostType(),
		[],
	);

	// Get dispatch function for edit-post store
	const { openGeneralSidebar, toggleEditorPanelOpened } =
		useDispatch(editPostStore);

	// Check if post is new
	const isNewPost = useSelect(
		(select) => select('core/editor').isEditedPostNew(),
		[],
	);

	// Open Person Name panel by default on new posts
	useEffect(() => {
		if (postType === 'ph_peeps_people' && isNewPost) {
			// Ensure the document sidebar is open
			openGeneralSidebar('edit-post/document');

			// Open the panel on new posts (with a small delay to ensure state is ready)
			const timer = setTimeout(() => {
				toggleEditorPanelOpened('ph-peeps-name-panel');
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [postType, isNewPost, toggleEditorPanelOpened, openGeneralSidebar]);

	const [meta, setMeta] = useEntityProp(
		'postType',
		'ph_peeps_people',
		'meta',
	);
	const [, setTitle] = useEntityProp('postType', 'ph_peeps_people', 'title');
	const [, setSlug] = useEntityProp('postType', 'ph_peeps_people', 'slug');
	const [errors, setErrors] = useState({});

	const { lockPostSaving, unlockPostSaving, editPost } =
		dispatch('core/editor');

	// Get phone format from settings
	const phoneFormat = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('root', 'site')
				?.ph_peeps_phone_format || '(###) ###-####',
		[],
	);

	// Move this outside of the component if possible, or memoize if it needs component scope
	const handleMetaChange = useCallback(
		(field, value) => {
			setMeta({
				...meta,
				[field]: value,
			});

			// Clear error for this field
			setErrors((prevErrors) =>
				prevErrors[field]
					? {
							...prevErrors,
							[field]: null,
						}
					: prevErrors,
			);
		},
		[meta, setMeta],
	);

	const validateFields = useCallback(() => {
		const newErrors = {};

		// Required fields
		if (!meta?.[NAME_FIELDS.FIRST_NAME]?.trim()) {
			newErrors[NAME_FIELDS.FIRST_NAME] = REQUIRED_FIELD_ERROR;
		}
		if (!meta?.[NAME_FIELDS.LAST_NAME]?.trim()) {
			newErrors[NAME_FIELDS.LAST_NAME] = REQUIRED_FIELD_ERROR;
		}

		// Email validation
		if (
			meta?.[NAME_FIELDS.EMAIL] &&
			!isValidEmail(meta[NAME_FIELDS.EMAIL])
		) {
			newErrors[NAME_FIELDS.EMAIL] = EMAIL_VALIDATION_ERROR;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [meta]);

	const validateAndLock = useCallback(() => {
		const isValid = validateFields();
		if (!isValid) {
			lockPostSaving('requiredNameFields');
		} else {
			unlockPostSaving('requiredNameFields');
		}
	}, [validateFields, lockPostSaving, unlockPostSaving]);

	useEffect(() => {
		if (!meta) {
			return;
		}
		validateAndLock();
	}, [meta, validateAndLock]);

	useEffect(() => {
		if (!meta) {
			return;
		}

		const firstName = meta[NAME_FIELDS.FIRST_NAME]?.trim() || '';
		const middleName = meta[NAME_FIELDS.MIDDLE_NAME]?.trim() || '';
		const lastName = meta[NAME_FIELDS.LAST_NAME]?.trim() || '';

		// Create the full name
		const fullName = [firstName, middleName, lastName]
			.filter(Boolean)
			.join(' ');

		// Update title and slug
		setTitle(fullName);
		editPost({ title: fullName });
		setSlug(createSlug(fullName));
	}, [meta, setTitle, setSlug, editPost]);

	if (postType !== 'ph_peeps_people') {
		return null;
	}

	return (
		<>
			<PluginDocumentSettingPanel
				name="ph-peeps-name-panel"
				title={__('Person Name', 'peeps-people-directory')}
				className="ph-peeps-name-panel"
			>
				<TextControl
					__next40pxDefaultSize
					label={__('First Name', 'peeps-people-directory') + ' *'}
					value={meta?.[NAME_FIELDS.FIRST_NAME] || ''}
					onChange={(value) =>
						handleMetaChange(NAME_FIELDS.FIRST_NAME, value)
					}
					help={errors[NAME_FIELDS.FIRST_NAME] || ''}
					className={
						errors[NAME_FIELDS.FIRST_NAME] ? 'has-error' : ''
					}
				/>
				<TextControl
					__next40pxDefaultSize
					label={__('Middle Name', 'peeps-people-directory')}
					value={meta?.[NAME_FIELDS.MIDDLE_NAME] || ''}
					onChange={(value) =>
						handleMetaChange(NAME_FIELDS.MIDDLE_NAME, value)
					}
				/>
				<TextControl
					__next40pxDefaultSize
					label={__('Last Name', 'peeps-people-directory') + ' *'}
					value={meta?.[NAME_FIELDS.LAST_NAME] || ''}
					onChange={(value) =>
						handleMetaChange(NAME_FIELDS.LAST_NAME, value)
					}
					help={errors[NAME_FIELDS.LAST_NAME] || ''}
					className={errors[NAME_FIELDS.LAST_NAME] ? 'has-error' : ''}
				/>
			</PluginDocumentSettingPanel>

			<PluginDocumentSettingPanel
				name="ph-peeps-contact-panel"
				title={__('Contact Information', 'peeps-people-directory')}
				className="ph-peeps-contact-panel"
			>
				<TextControl
					__next40pxDefaultSize
					label={__('Phone', 'peeps-people-directory')}
					value={
						meta?.[NAME_FIELDS.PHONE]
							? formatPhoneNumber(
									meta[NAME_FIELDS.PHONE],
									phoneFormat,
								)
							: ''
					}
					onChange={(value) =>
						handleMetaChange(NAME_FIELDS.PHONE, value)
					}
					help={__(
						'Enter between 10–15 digit phone number',
						'peeps-people-directory',
					)}
					type="tel"
				/>
				<TextControl
					__next40pxDefaultSize
					label={__('Extension', 'peeps-people-directory')}
					value={meta?.[NAME_FIELDS.PHONE_EXT] || ''}
					onChange={(value) =>
						handleMetaChange(NAME_FIELDS.PHONE_EXT, value)
					}
					placeholder={__('e.g. 100', 'peeps-people-directory')}
				/>
				<TextControl
					__next40pxDefaultSize
					type="email"
					label={__('Email', 'peeps-people-directory')}
					value={meta?.[NAME_FIELDS.EMAIL] || ''}
					onChange={(value) =>
						handleMetaChange(NAME_FIELDS.EMAIL, value)
					}
					help={errors[NAME_FIELDS.EMAIL] || ''}
					className={errors[NAME_FIELDS.EMAIL] ? 'has-error' : ''}
				/>
			</PluginDocumentSettingPanel>
		</>
	);
}

function SocialLinksPanel() {
	const { postType, postId } = useSelect(
		(select) => ({
			postType: select('core/editor').getCurrentPostType(),
			postId: select('core/editor').getCurrentPostId(),
		}),
		[],
	);

	const [meta, setMeta] = useEntityProp(
		'postType',
		'ph_peeps_people',
		'meta',
	);
	const { saveEntityRecord } = useDispatch('core');
	const [newUrl, setNewUrl] = useState('');
	const [urlError, setUrlError] = useState('');
	const [draggedIndex, setDraggedIndex] = useState(null);

	const socialLinks = useMemo(
		() => meta?.ph_peeps_social_links || [],
		[meta],
	);

	// Ref so handleDragEnd always reads the latest order, not a stale closure.
	const socialLinksRef = useRef(socialLinks);
	useEffect(() => {
		socialLinksRef.current = socialLinks;
	}, [socialLinks]);

	const handleDragStart = useCallback((index) => {
		setDraggedIndex(index);
	}, []);

	const handleDragEnd = useCallback(() => {
		setDraggedIndex(null);
		saveEntityRecord('postType', 'ph_peeps_people', {
			id: postId,
			meta: { ph_peeps_social_links: socialLinksRef.current },
		});
	}, [saveEntityRecord, postId]);

	const updateSocialLinks = useCallback(
		(links) => {
			setMeta({
				...meta,
				ph_peeps_social_links: links,
			});
			saveEntityRecord('postType', 'ph_peeps_people', {
				id: postId,
				meta: { ph_peeps_social_links: links },
			});
		},
		[meta, setMeta, saveEntityRecord, postId],
	);

	const handleDragOver = useCallback(
		(e, index) => {
			e.preventDefault();
			if (draggedIndex === null || draggedIndex === index) {
				return;
			}

			const updatedLinks = [...socialLinks];
			const [draggedItem] = updatedLinks.splice(draggedIndex, 1);
			updatedLinks.splice(index, 0, draggedItem);

			updateSocialLinks(updatedLinks);
			setDraggedIndex(index);
		},
		[draggedIndex, socialLinks, updateSocialLinks],
	);

	const handleAddLink = useCallback(() => {
		if (!newUrl) {
			setUrlError(__('Please enter a URL', 'peeps-people-directory'));
			return;
		}

		// Validate URL
		if (!isValidUrl(newUrl)) {
			setUrlError(URL_VALIDATION_ERROR);
			return;
		}

		const platform = detectPlatform(newUrl);

		// Add the new link
		const updatedLinks = [...socialLinks, { platform, url: newUrl }];
		updateSocialLinks(updatedLinks);

		// Reset form
		setNewUrl('');
		setUrlError('');
	}, [newUrl, socialLinks, updateSocialLinks]);

	const handleRemoveLink = useCallback(
		(index) => {
			const updatedLinks = socialLinks.filter((_, i) => i !== index);
			updateSocialLinks(updatedLinks);
		},
		[socialLinks, updateSocialLinks],
	);

	const renderSocialLinkItem = useCallback(
		(link, index) => (
			<Flex
				key={index}
				align="center"
				gap={4}
				className={`social-link-item ${draggedIndex === index ? 'is-dragging' : ''}`}
				style={{ cursor: 'grab' }}
				draggable
				onDragStart={() => handleDragStart(index)}
				onDragOver={(e) => handleDragOver(e, index)}
				onDragEnd={handleDragEnd}
			>
				<FlexItem>
					<Icon icon={dragHandle} />
				</FlexItem>
				<FlexItem style={{ flex: 1 }}>
					<TextControl
						__next40pxDefaultSize
						value={link.url}
						onChange={(url) => {
							const platform = detectPlatform(url);
							const updatedLinks = [...socialLinks];
							updatedLinks[index] = { platform, url };
							updateSocialLinks(updatedLinks);
						}}
					/>
				</FlexItem>
				<FlexItem>
					<Button
						isDestructive
						onClick={() => handleRemoveLink(index)}
						icon="no-alt"
						label={__('Remove social link', 'peeps-people-directory')}
					/>
				</FlexItem>
			</Flex>
		),
		[
			draggedIndex,
			handleDragStart,
			handleDragOver,
			handleDragEnd,
			socialLinks,
			updateSocialLinks,
			handleRemoveLink,
		],
	);

	if (postType !== 'ph_peeps_people') {
		return null;
	}

	return (
		<PluginDocumentSettingPanel
			name="ph-peeps-social-links"
			title={__('Social Links', 'peeps-people-directory')}
			className="ph-peeps-social-links"
		>
			{socialLinks.map(renderSocialLinkItem)}

			<Flex align="flex-end" gap={4} className="add-social-link">
				<FlexItem style={{ flex: 1 }}>
					<TextControl
						__next40pxDefaultSize
						label={__('Add Social Link', 'peeps-people-directory')}
						value={newUrl}
						onChange={(value) => {
							setNewUrl(value);
							setUrlError('');
						}}
						help={urlError}
						className={urlError ? 'has-error' : ''}
					/>
				</FlexItem>
				<FlexItem style={{ marginBottom: 8 }}>
					<Button
						variant="secondary"
						onClick={handleAddLink}
						disabled={!newUrl}
					>
						{__('Add', 'peeps-people-directory')}
					</Button>
				</FlexItem>
			</Flex>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin('ph-peeps-person-details', {
	render: PersonDetailsPanel,
});

registerPlugin('ph-peeps-social-links-panel', {
	render: SocialLinksPanel,
});
