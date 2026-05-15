import { createRoot } from '@wordpress/element';
import SettingsPage from './settings';

const root = createRoot( document.getElementById( 'ph-peeps-settings-root' ) );
root.render( <SettingsPage /> );
