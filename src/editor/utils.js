/**
 * Social platform URL patterns.
 */
export const PLATFORM_PATTERNS = {
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
	twitter: /twitter\.com/i,
	x: /x\.com/i,
	vimeo: /vimeo\.com/i,
	whatsapp: /(?:whatsapp\.com|wa\.me)/i,
	wordpress: /(?:wordpress\.org|wordpress\.com)/i,
	yelp: /yelp\./i,
	youtube: /(?:youtube\.com|youtu\.be)/i,
};

/**
 * Validates an email address.
 *
 * @param {string} email The email address to validate.
 * @return {boolean} Whether the email is valid.
 */
export const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Validates a URL.
 *
 * @param {string} url The URL to validate.
 * @return {boolean} Whether the URL is valid.
 */
export const isValidUrl = (url) => {
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
 * @param {string} value  The phone number to format.
 * @param {string} format The format template.
 * @return {string} The formatted phone number.
 */
export const formatPhoneNumber = (value, format) => {
	if (!value) {
		return '';
	}

	const digits = value.replace(/\D/g, '');
	const placeholderCount = (format.match(/#/g) || []).length;

	let formatted = format;

	for (let i = 0; i < digits.length && i < placeholderCount; i++) {
		formatted = formatted.replace('#', digits[i]);
	}

	if (digits.length > placeholderCount) {
		formatted += digits.slice(placeholderCount);
	}

	return formatted.replace(/#/g, '');
};

/**
 * Detects the social media platform from a URL.
 *
 * @param {string} url The URL to analyze.
 * @return {string} The detected platform or 'chain' as fallback.
 */
export const detectPlatform = (url) => {
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
export const createSlug = (str) => {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
};
