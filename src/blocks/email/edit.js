import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl, ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { paragraph, grid, tag } from '@wordpress/icons';

const HTML_TAGS = [
    { 
        title: __('Paragraph', 'wp-peeps'), 
        value: 'p',
        icon: paragraph,
    },
    { 
        title: __('Div', 'wp-peeps'), 
        value: 'div',
        icon: grid,
    },
    { 
        title: __('Span', 'wp-peeps'), 
        value: 'span',
        icon: tag,
    },
];

/**
 * Email block edit component.
 *
 * @param {Object} props               Block props.
 * @param {Object} props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set block attributes.
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
    const { tagName, makeLink, prefix, textAlign } = attributes;
    const blockProps = useBlockProps({
        className: textAlign ? `has-text-align-${textAlign}` : undefined,
    });

    // Get email from meta
    const [meta] = useEntityProp('postType', 'wp_peeps_people', 'meta');
    const email = meta?.wp_peeps_email || 'name@domain.com';

    const TagName = tagName;

    // Create content elements
    const emailLink = email && email !== 'name@domain.com' ? (
        <a href={`mailto:${email}`}>{email}</a>
    ) : email;

    const content = (
        <>
            {prefix && <span>{prefix} </span>}
            {makeLink ? emailLink : email}
        </>
    );

    // Get current tag info
    const currentTag = HTML_TAGS.find(tag => tag.value === tagName);

    return (
        <>
            <BlockControls>
                <AlignmentToolbar
                    value={textAlign}
                    onChange={(nextAlign) => {
                        setAttributes({ textAlign: nextAlign });
                    }}
                />
                <ToolbarGroup>
                    <ToolbarDropdownMenu
                        icon={currentTag?.icon}
                        label={__('HTML element', 'wp-peeps')}
                        controls={HTML_TAGS.map(({ title, value, icon }) => ({
                            title,
                            icon,
                            isActive: tagName === value,
                            onClick: () => setAttributes({ tagName: value }),
                        }))}
                    />
                </ToolbarGroup>
            </BlockControls>
            <InspectorControls>
                <PanelBody title={__('Settings', 'wp-peeps')}>
                    <ToggleControl
                        label={__('Make email clickable', 'wp-peeps')}
                        checked={makeLink}
                        onChange={() => setAttributes({ makeLink: !makeLink })}
                    />
                    <TextControl
                        label={__('Prefix text', 'wp-peeps')}
                        value={prefix}
                        onChange={(value) => setAttributes({ prefix: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <TagName {...blockProps}>
                {content}
            </TagName>
        </>
    );
}
