import { render } from '@wordpress/element';
import SettingsPage from './settings';

console.log('WP Peeps Admin JS loaded');

render(
    <SettingsPage />,
    document.getElementById('wp-peeps-settings-root')
); 