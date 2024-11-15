import { __ } from '@wordpress/i18n';
import { setCategories, getCategories } from '@wordpress/blocks';

// Import our blocks
import './full-name';
import './phone';
import './social-links';

// Add our category if it doesn't exist
const currentCategories = getCategories().map(({ slug }) => slug);
if (!currentCategories.includes('wp-peeps')) {
	setCategories([
		{
			slug: 'wp-peeps',
			title: __('People Directory', 'wp-peeps'),
			icon: 'groups',
		},
		...getCategories(),
	]);
}
