import {
	isValidEmail,
	isValidUrl,
	formatPhoneNumber,
	detectPlatform,
	createSlug,
} from '../utils';

describe('isValidEmail', () => {
	it('accepts a standard email address', () => {
		expect(isValidEmail('user@example.com')).toBe(true);
	});

	it('accepts email with subdomain', () => {
		expect(isValidEmail('user@mail.example.com')).toBe(true);
	});

	it('rejects email without @', () => {
		expect(isValidEmail('userexample.com')).toBe(false);
	});

	it('rejects email without domain', () => {
		expect(isValidEmail('user@')).toBe(false);
	});

	it('rejects email without TLD', () => {
		expect(isValidEmail('user@example')).toBe(false);
	});

	it('rejects empty string', () => {
		expect(isValidEmail('')).toBe(false);
	});

	it('rejects email with spaces', () => {
		expect(isValidEmail('user @example.com')).toBe(false);
	});
});

describe('isValidUrl', () => {
	it('accepts a standard https URL', () => {
		expect(isValidUrl('https://example.com')).toBe(true);
	});

	it('accepts a standard http URL', () => {
		expect(isValidUrl('http://example.com')).toBe(true);
	});

	it('accepts URL with path', () => {
		expect(isValidUrl('https://example.com/path/to/page')).toBe(true);
	});

	it('rejects a URL without protocol', () => {
		expect(isValidUrl('example.com')).toBe(false);
	});

	it('rejects empty string', () => {
		expect(isValidUrl('')).toBe(false);
	});

	it('rejects ftp protocol', () => {
		expect(isValidUrl('ftp://example.com')).toBe(false);
	});

	it('rejects plain text', () => {
		expect(isValidUrl('not a url')).toBe(false);
	});
});

describe('formatPhoneNumber', () => {
	const defaultFormat = '(###) ###-####';

	it('formats a 10-digit number with default format', () => {
		expect(formatPhoneNumber('5551234567', defaultFormat)).toBe(
			'(555) 123-4567'
		);
	});

	it('strips non-digit characters before formatting', () => {
		expect(formatPhoneNumber('(555) 123-4567', defaultFormat)).toBe(
			'(555) 123-4567'
		);
	});

	it('returns empty string for empty input', () => {
		expect(formatPhoneNumber('', defaultFormat)).toBe('');
	});

	it('appends extra digits beyond format length', () => {
		expect(formatPhoneNumber('555123456789', defaultFormat)).toBe(
			'(555) 123-456789'
		);
	});

	it('strips # placeholders but retains format separators for partial numbers', () => {
		// With only 3 digits, the remaining ### are stripped but the dash separator stays
		expect(formatPhoneNumber('555', defaultFormat)).toBe('(555) -');
	});

	it('supports a custom format', () => {
		expect(formatPhoneNumber('5551234567', '###-###-####')).toBe(
			'555-123-4567'
		);
	});
});

describe('detectPlatform', () => {
	it('detects twitter.com', () => {
		expect(detectPlatform('https://twitter.com/user')).toBe('twitter');
	});

	it('detects x.com', () => {
		expect(detectPlatform('https://x.com/user')).toBe('x');
	});

	it('detects github.com', () => {
		expect(detectPlatform('https://github.com/user')).toBe('github');
	});

	it('detects linkedin.com', () => {
		expect(detectPlatform('https://linkedin.com/in/user')).toBe('linkedin');
	});

	it('detects instagram.com', () => {
		expect(detectPlatform('https://instagram.com/user')).toBe('instagram');
	});

	it('detects youtube.com', () => {
		expect(detectPlatform('https://youtube.com/channel/123')).toBe('youtube');
	});

	it('detects youtu.be shortlink', () => {
		expect(detectPlatform('https://youtu.be/abc123')).toBe('youtube');
	});

	it('detects facebook.com', () => {
		expect(detectPlatform('https://facebook.com/user')).toBe('facebook');
	});

	it('detects bluesky bsky.app', () => {
		expect(detectPlatform('https://bsky.app/profile/user')).toBe('bluesky');
	});

	it('detects discord.gg invite link', () => {
		expect(detectPlatform('https://discord.gg/invite123')).toBe('discord');
	});

	it('detects discord.com server link', () => {
		expect(detectPlatform('https://discord.com/channels/123')).toBe(
			'discord',
		);
	});

	it('detects 500px.com as fivehundredpx', () => {
		expect(detectPlatform('https://500px.com/p/user')).toBe('fivehundredpx');
	});

	it('detects RSS feed URL', () => {
		expect(detectPlatform('https://example.com/feed')).toBe('feed');
	});

	it('detects .rss feed URL', () => {
		expect(detectPlatform('https://example.com/posts.rss')).toBe('feed');
	});

	it('detects gravatar.com', () => {
		expect(detectPlatform('https://gravatar.com/user')).toBe('gravatar');
	});

	it('detects mailto: link as mail', () => {
		expect(detectPlatform('mailto:user@example.com')).toBe('mail');
	});

	it('detects patreon.com', () => {
		expect(detectPlatform('https://patreon.com/user')).toBe('patreon');
	});

	it('detects threads.net', () => {
		expect(detectPlatform('https://threads.net/@user')).toBe('threads');
	});

	it('detects tiktok.com', () => {
		expect(detectPlatform('https://tiktok.com/@user')).toBe('tiktok');
	});

	it('detects vk.com', () => {
		expect(detectPlatform('https://vk.com/user')).toBe('vk');
	});

	it('returns chain for unknown URL', () => {
		expect(detectPlatform('https://mywebsite.example.com')).toBe('chain');
	});

	it('returns chain for invalid URL', () => {
		expect(detectPlatform('not-a-url')).toBe('chain');
	});
});

describe('createSlug', () => {
	it('lowercases the string', () => {
		expect(createSlug('Hello World')).toBe('hello-world');
	});

	it('replaces spaces with hyphens', () => {
		expect(createSlug('John Doe')).toBe('john-doe');
	});

	it('handles middle names', () => {
		expect(createSlug('John Michael Doe')).toBe('john-michael-doe');
	});

	it('strips leading and trailing hyphens', () => {
		expect(createSlug('  Jane  ')).toBe('jane');
	});

	it('collapses multiple spaces into one hyphen', () => {
		expect(createSlug('John  Doe')).toBe('john-doe');
	});

	it('removes special characters', () => {
		expect(createSlug("O'Brien")).toBe('o-brien');
	});

	it('handles an empty string', () => {
		expect(createSlug('')).toBe('');
	});
});
