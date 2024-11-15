import { registerBlockType } from '@wordpress/blocks';
import { atSymbol as icon } from '@wordpress/icons';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

registerBlockType(metadata.name, {
    icon,
    edit: Edit,
    save: Save,
});
