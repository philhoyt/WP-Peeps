import { __ } from '@wordpress/i18n';
import { registerBlockStyle, registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import metadata from './block.json';

registerBlockStyle('wp-peeps/social-links', {
	name: 'logos-only',
	label: __('Logos Only'),
});

registerBlockType(metadata.name, {
	edit: Edit,
});
