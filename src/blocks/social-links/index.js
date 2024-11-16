import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import metadata from './block.json';

registerBlockStyle('wp-peeps/social-links', {
	name: 'logos-only',
	label: __('Logos Only'),
});

registerBlockType( metadata.name, {
	edit: Edit,
} );
