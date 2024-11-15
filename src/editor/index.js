// Constants and configurations
const REQUIRED_FIELD_ERROR = __('This field is required', 'wp-peeps');
const EMAIL_VALIDATION_ERROR = __('Please enter a valid email address', 'wp-peeps');
const URL_VALIDATION_ERROR = __('Please enter a valid URL', 'wp-peeps');

const NAME_FIELDS = {
	FIRST_NAME: 'wp_peeps_first_name',
	MIDDLE_NAME: 'wp_peeps_middle_name',
	LAST_NAME: 'wp_peeps_last_name',
	JOB_TITLE: 'wp_peeps_job_title',
	PHONE: 'wp_peeps_phone',
	EMAIL: 'wp_peeps_email'
};

const PLATFORM_PATTERNS = {
	amazon: /amazon\./i,
	bandcamp: /bandcamp\.com/i,
	behance: /behance\.net/i,
	bluesky: /(?:bsky\.app|bsky\.social)/i,
	codepen: /codepen\.io/i,
	deviantart: /deviantart\.com/i,
	dribbble: /dribbble\.com/i,
	dropbox: /dropbox\.com/i,
	etsy: /etsy\.com/i,
	facebook: /(?:facebook\.com|fb\.com|fb\.me)/i,
	flickr: /flickr\.com/i,
	foursquare: /foursquare\.com/i,
	github: /github\.com/i,
	goodreads: /goodreads\.com/i,
	google: /(?:google\.com|plus\.google\.com)/i,
	instagram: /(?:instagram\.com|instagr\.am)/i,
	lastfm: /last\.fm/i,
	linkedin: /linkedin\.com/i,
	mastodon: /@.*@.*\.[a-z]+/i,
	medium: /medium\.com/i,
	meetup: /meetup\.com/i,
	pinterest: /pinterest\./i,
	pocket: /getpocket\.com/i,
	reddit: /reddit\.com/i,
	skype: /skype\.com/i,
	snapchat: /snapchat\.com/i,
	soundcloud: /soundcloud\.com/i,
	spotify: /spotify\.com/i,
	telegram: /t\.me/i,
	tumblr: /tumblr\.com/i,
	twitch: /twitch\.tv/i,
	twitter: /(?:twitter\.com|x\.com)/i,
	vimeo: /vimeo\.com/i,
	whatsapp: /(?:whatsapp\.com|wa\.me)/i,
	wordpress: /(?:wordpress\.org|wordpress\.com)/i,
	yelp: /yelp\./i,
	youtube: /(?:youtube\.com|youtu\.be)/i
};

/**
 * Validates an email address.
 *
 * @param {string} email The email address to validate.
 * @return {boolean} Whether the email is valid.
 */
const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Validates a URL.
 *
 * @param {string} url The URL to validate.
 * @return {boolean} Whether the URL is valid.
 */
const isValidUrl = (url) => {
	try {
		const urlObj = new URL(url);
		return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
	} catch (e) {
		return false;
	}
};

/**
 * Formats a phone number according to the site's format.
 *
 * @param {string} value The phone number to format.
 * @param {string} format The format template.
 * @return {string} The formatted phone number.
 */
const formatPhoneNumber = (value, format) => {
	if (!value) return '';

	// Strip all non-digits
	const digits = value.replace(/\D/g, '');
	
	// Get the format template
	let formatted = format;
	
	// Replace each # with a digit
	for (let i = 0; i < digits.length && i < 10; i++) {
		formatted = formatted.replace('#', digits[i]);
	}

	// Remove any remaining # placeholders
	return formatted.replace(/#/g, '');
};

/**
 * Detects the social media platform from a URL.
 *
 * @param {string} url The URL to analyze.
 * @return {string} The detected platform or 'chain' as fallback.
 */
const detectPlatform = (url) => {
	try {
		const urlObj = new URL(url);
		
		for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
			if (pattern.test(urlObj.hostname) || pattern.test(url)) {
				return platform;
			}
		}

		return 'chain';
	} catch (e) {
		return 'chain';
	}
};

/**
 * Creates a URL-friendly slug from a string.
 *
 * @param {string} str The string to slugify.
 * @return {string} The slugified string.
 */
const createSlug = (str) => {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
};

import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { TextControl, Button, Flex, FlexItem, SelectControl, Icon } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { useSelect } from '@wordpress/data';
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import { dragHandle } from '@wordpress/icons';

// Import and register blocks
import '../blocks';

function NameFieldsPanel() {
	const [meta, setMeta] = useEntityProp('postType', 'wp_peeps_people', 'meta');
	const [, setTitle] = useEntityProp('postType', 'wp_peeps_people', 'title');
	const [, setSlug] = useEntityProp('postType', 'wp_peeps_people', 'slug');
	const [errors, setErrors] = useState({});
	
	const { lockPostSaving, unlockPostSaving, editPost } = dispatch('core/editor');

	// Get phone format from settings
	const phoneFormat = useSelect(
		(select) => select(coreStore).getEntityRecord('root', 'site')?.wp_peeps_phone_format || '(###) ###-####'
	);

	const handleMetaChange = (field, value) => {
		setMeta({
			...meta,
			[field]: value,
		});

		// Clear error for this field
		if (errors[field]) {
			setErrors({
				...errors,
				[field]: null,
			});
		}
	};

	const validateFields = () => {
		const newErrors = {};

		// Required fields
		if (!meta?.[NAME_FIELDS.FIRST_NAME]?.trim()) {
			newErrors[NAME_FIELDS.FIRST_NAME] = REQUIRED_FIELD_ERROR;
		}
		if (!meta?.[NAME_FIELDS.LAST_NAME]?.trim()) {
			newErrors[NAME_FIELDS.LAST_NAME] = REQUIRED_FIELD_ERROR;
		}

		// Email validation
		if (meta?.[NAME_FIELDS.EMAIL] && !isValidEmail(meta[NAME_FIELDS.EMAIL])) {
			newErrors[NAME_FIELDS.EMAIL] = EMAIL_VALIDATION_ERROR;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	useEffect(() => {
		if (!meta) return;

		const isValid = validateFields();
		
		if (!isValid) {
			lockPostSaving('requiredNameFields');
			return;
		}

		unlockPostSaving('requiredNameFields');

		const firstName = meta[NAME_FIELDS.FIRST_NAME]?.trim() || '';
		const middleName = meta[NAME_FIELDS.MIDDLE_NAME]?.trim() || '';
		const lastName = meta[NAME_FIELDS.LAST_NAME]?.trim() || '';

		// Create the full name
		const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

		// Update title and slug
		setTitle(fullName);
		editPost({ title: fullName });
		setSlug(createSlug(fullName));
	}, [
		meta?.[NAME_FIELDS.FIRST_NAME],
		meta?.[NAME_FIELDS.MIDDLE_NAME],
		meta?.[NAME_FIELDS.LAST_NAME]
	]);

	return (
		<PluginDocumentSettingPanel
			name="wp-peeps-name-fields"
			title={__('Name Details', 'wp-peeps')}
			className="wp-peeps-name-fields"
			initialOpen={true}
		>
			<TextControl
				label={__('First Name', 'wp-peeps') + ' *'}
				value={meta?.[NAME_FIELDS.FIRST_NAME] || ''}
				onChange={(value) => handleMetaChange(NAME_FIELDS.FIRST_NAME, value)}
				help={errors[NAME_FIELDS.FIRST_NAME] || ''}
				className={errors[NAME_FIELDS.FIRST_NAME] ? 'has-error' : ''}
			/>
			<TextControl
				label={__('Middle Name', 'wp-peeps')}
				value={meta?.[NAME_FIELDS.MIDDLE_NAME] || ''}
				onChange={(value) => handleMetaChange(NAME_FIELDS.MIDDLE_NAME, value)}
			/>
			<TextControl
				label={__('Last Name', 'wp-peeps') + ' *'}
				value={meta?.[NAME_FIELDS.LAST_NAME] || ''}
				onChange={(value) => handleMetaChange(NAME_FIELDS.LAST_NAME, value)}
				help={errors[NAME_FIELDS.LAST_NAME] || ''}
				className={errors[NAME_FIELDS.LAST_NAME] ? 'has-error' : ''}
			/>
			<TextControl
				label={__('Job Title', 'wp-peeps')}
				value={meta?.[NAME_FIELDS.JOB_TITLE] || ''}
				onChange={(value) => handleMetaChange(NAME_FIELDS.JOB_TITLE, value)}
			/>
			<TextControl
				label={__('Phone', 'wp-peeps')}
				value={meta?.[NAME_FIELDS.PHONE] ? formatPhoneNumber(meta[NAME_FIELDS.PHONE], phoneFormat) : ''}
				onChange={(value) => handleMetaChange(NAME_FIELDS.PHONE, value)}
				help={__('Enter 10 digit phone number', 'wp-peeps')}
				type="tel"
			/>
			<TextControl
				type="email"
				label={__('Email', 'wp-peeps')}
				value={meta?.[NAME_FIELDS.EMAIL] || ''}
				onChange={(value) => handleMetaChange(NAME_FIELDS.EMAIL, value)}
				help={errors[NAME_FIELDS.EMAIL] || ''}
				className={errors[NAME_FIELDS.EMAIL] ? 'has-error' : ''}
			/>
		</PluginDocumentSettingPanel>
	);
}

/**
 * Social Links Panel Component
 *
 * @return {JSX.Element|null} The rendered component or null if not in post editor.
 */
function SocialLinksPanel() {
	// Check if we're in the post editor
	const { isPostEditor } = useSelect(select => ({
		isPostEditor: !!select('core/editor'),
	}), []);

	// Only render in post editor
	if (!isPostEditor) {
		return null;
	}

	const [meta, setMeta] = useEntityProp('postType', 'wp_peeps_people', 'meta');
	const [newUrl, setNewUrl] = useState('');
	const [urlError, setUrlError] = useState('');
	const [draggedIndex, setDraggedIndex] = useState(null);

	const socialLinks = meta?.wp_peeps_social_links || [];

	/**
	 * Handles drag start event
	 *
	 * @param {number} index The index of the dragged item
	 */
	const handleDragStart = (index) => {
		setDraggedIndex(index);
	};

	/**
	 * Handles drag over event
	 *
	 * @param {Event} e The drag event
	 * @param {number} index The index of the target item
	 */
	const handleDragOver = (e, index) => {
		e.preventDefault();
		if (draggedIndex === null || draggedIndex === index) return;

		const updatedLinks = [...socialLinks];
		const [draggedItem] = updatedLinks.splice(draggedIndex, 1);
		updatedLinks.splice(index, 0, draggedItem);
		
		updateSocialLinks(updatedLinks);
		setDraggedIndex(index);
	};

	/**
	 * Updates social links in meta
	 *
	 * @param {Array} links The updated social links array
	 */
	const updateSocialLinks = (links) => {
		setMeta({
			...meta,
			wp_peeps_social_links: links,
		});
	};

	/**
	 * Handles adding a new social link
	 */
	const handleAddLink = () => {
		if (!newUrl) {
			setUrlError(__('Please enter a URL', 'wp-peeps'));
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
	};

	/**
	 * Handles removing a social link
	 *
	 * @param {number} index The index of the link to remove
	 */
	const handleRemoveLink = (index) => {
		const updatedLinks = socialLinks.filter((_, i) => i !== index);
		updateSocialLinks(updatedLinks);
	};

	/**
	 * Renders a single social link item
	 *
	 * @param {Object} link The social link object
	 * @param {number} index The index of the link
	 * @return {JSX.Element} The rendered social link item
	 */
	const renderSocialLinkItem = (link, index) => (
		<Flex
			key={index}
			align="center"
			justify="space-between"
			className={`social-link-item ${draggedIndex === index ? 'is-dragging' : ''}`}
			draggable
			onDragStart={() => handleDragStart(index)}
			onDragOver={(e) => handleDragOver(e, index)}
			onDragEnd={() => setDraggedIndex(null)}
		>
			<FlexItem className="social-link-drag">
				<Icon icon={dragHandle} />
			</FlexItem>
			<FlexItem style={{ flex: 1 }}>
				<TextControl
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
					label={__('Remove social link', 'wp-peeps')}
				/>
			</FlexItem>
		</Flex>
	);

	return (
		<PluginDocumentSettingPanel
			name="wp-peeps-social-links"
			title={__('Social Links', 'wp-peeps')}
			className="wp-peeps-social-links"
		>
			{socialLinks.map(renderSocialLinkItem)}
			
			<Flex align="flex-end" className="add-social-link">
				<FlexItem>
					<TextControl
						label={__('Add Social Link', 'wp-peeps')}
						value={newUrl}
						onChange={(value) => {
							setNewUrl(value);
							setUrlError('');
						}}
						help={urlError}
						className={urlError ? 'has-error' : ''}
					/>
				</FlexItem>
				<FlexItem>
					<Button
						variant="secondary"
						onClick={handleAddLink}
						disabled={!newUrl}
					>
						{__('Add', 'wp-peeps')}
					</Button>
				</FlexItem>
			</Flex>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin('wp-peeps-name-fields-panel', { render: NameFieldsPanel });
registerPlugin('wp-peeps-social-links-panel', { render: SocialLinksPanel });
