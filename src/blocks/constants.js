import { __ } from '@wordpress/i18n';
import { paragraph, grid, tag } from '@wordpress/icons';

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
