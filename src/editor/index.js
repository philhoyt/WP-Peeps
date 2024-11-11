import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { useEntityProp } from '@wordpress/core-data';
import { TextControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { dispatch } from '@wordpress/data';

function NameFieldsPanel() {
    const [ meta, setMeta ] = useEntityProp('postType', 'people', 'meta');
    const [ , setTitle ] = useEntityProp('postType', 'people', 'title');
    const [ , setSlug ] = useEntityProp('postType', 'people', 'slug');
    const { lockPostSaving, unlockPostSaving, editPost } = dispatch('core/editor');

    useEffect(() => {
        if (!meta) return;

        const firstName = meta?.first_name?.trim() || '';
        const lastName = meta?.last_name?.trim() || '';
        
        if (!firstName || !lastName) {
            lockPostSaving('requiredNameFields');
            return;
        }

        unlockPostSaving('requiredNameFields');

        // Create the full name
        const fullName = `${firstName} ${lastName}`;
        
        // Update both title and slug
        setTitle(fullName);
        editPost({ title: fullName }); // This ensures the title is updated in the editor state
        
        // Update slug
        const newSlug = fullName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setSlug(newSlug);

    }, [meta?.first_name, meta?.last_name]);

    return (
        <PluginDocumentSettingPanel
            name="wp-peeps-name-fields"
            title={ __('Name Details', 'wp-peeps') }
            className="wp-peeps-name-fields"
            initialOpen={ true }
        >
            <TextControl
                label={ __('First Name', 'wp-peeps') + ' *' }
                value={ meta?.first_name || '' }
                onChange={ ( newValue ) =>
                    setMeta( {
                        ...meta,
                        first_name: newValue,
                    } )
                }
                help={ !meta?.first_name?.trim() ? __('First name is required', 'wp-peeps') : '' }
            />
            <TextControl
                label={ __('Middle Name', 'wp-peeps') }
                value={ meta?.middle_name || '' }
                onChange={ ( newValue ) =>
                    setMeta( {
                        ...meta,
                        middle_name: newValue,
                    } )
                }
            />
            <TextControl
                label={ __('Last Name', 'wp-peeps') + ' *' }
                value={ meta?.last_name || '' }
                onChange={ ( newValue ) =>
                    setMeta( {
                        ...meta,
                        last_name: newValue,
                    } )
                }
                help={ !meta?.last_name?.trim() ? __('Last name is required', 'wp-peeps') : '' }
            />
        </PluginDocumentSettingPanel>
    );
}

registerPlugin('wp-peeps-name-fields-panel', { render: NameFieldsPanel });