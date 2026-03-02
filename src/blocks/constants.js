import { __ } from '@wordpress/i18n';
import { paragraph, grid, tag } from '@wordpress/icons';

/**
 * Default setting values — keep in sync with inc/defaults.php.
 */
export const DEFAULT_PHONE_FORMAT = '(###) ###-####';
export const DEFAULT_CPT_SLUG = 'people';
export const DEFAULT_MENU_POSITION = 25;

/**
 * Allowed RichText formats for prefix fields.
 */
export const ALLOWED_FORMATS = [
	'core/bold',
	'core/image',
	'core/italic',
	'core/link',
	'core/strikethrough',
	'core/text-color',
];

/**
 * Inline HTML tag options shared by blocks that support p/div/span wrappers.
 */
export const HTML_TAGS = [
	{
		title: __('Paragraph', 'peeps-people-directory'),
		value: 'p',
		icon: paragraph,
	},
	{
		title: __('Div', 'peeps-people-directory'),
		value: 'div',
		icon: grid,
	},
	{
		title: __('Span', 'peeps-people-directory'),
		value: 'span',
		icon: tag,
	},
];
