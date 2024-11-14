/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    PanelColorSettings,
    useBlockProps,
    BlockControls,
    JustifyContentControl,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    ToolbarGroup,
    ToolbarButton,
    Placeholder,
    Spinner,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { layout, share } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';

const SIZES = [
    {
        name: __('Small'),
        value: 'has-small-icon-size',
    },
    {
        name: __('Normal'),
        value: 'has-normal-icon-size',
    },
    {
        name: __('Large'),
        value: 'has-large-icon-size',
    },
    {
        name: __('Huge'),
        value: 'has-huge-icon-size',
    },
];

/**
 * Edit component for the social links block.
 *
 * @param {Object} props               Block props.
 * @param {Object} props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set block attributes.
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        iconColor,
        iconBackgroundColor,
        size = 'has-normal-icon-size',
    } = attributes;

    const blockProps = useBlockProps();

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon={layout}
                        label={__('Change layout')}
                        onClick={() => {
                            const orientation =
                                attributes.layout?.orientation === 'horizontal'
                                    ? 'vertical'
                                    : 'horizontal';
                            setAttributes({
                                layout: {
                                    ...attributes.layout,
                                    orientation,
                                },
                            });
                        }}
                    />
                </ToolbarGroup>
                <JustifyContentControl
                    value={ attributes.layout?.justifyContent }
                    onChange={ value =>
                        setAttributes( {
                            layout: {
                                ...attributes.layout,
                                justifyContent: value,
                            },
                        } )
                    }
                    allowedControls={ [ 'left', 'center', 'right', 'space-between' ] }
                />
            </BlockControls>
            <InspectorControls>
                <PanelBody title={__('Styles')}>
                    <SelectControl
                        label={__('Size')}
                        value={size}
                        options={SIZES.map(({ name, value }) => ({
                            label: name,
                            value,
                        }))}
                        onChange={(newSize) => setAttributes({ size: newSize })}
                    />
                </PanelBody>
                <PanelColorSettings
                    __experimentalHasMultipleOrigins
                    __experimentalIsRenderedInSidebar
                    title={__('Color settings')}
                    colorSettings={[
                        {
                            value: iconColor,
                            onChange: (color) => {
                                setAttributes({ iconColor: color });
                            },
                            label: __('Icon color'),
                        },
                        {
                            value: iconBackgroundColor,
                            onChange: (color) => {
                                setAttributes({ iconBackgroundColor: color });
                            },
                            label: __('Icon background'),
                        },
                    ]}
                />
            </InspectorControls>
            <div {...blockProps}>
                <ServerSideRender
                    block="wp-peeps/social-links"
                    attributes={attributes}
                    EmptyResponsePlaceholder={() => (
                        <Placeholder
                            icon={share}
                            label={__('Social Links')}
                            instructions={__('Add social links in the Person settings to display them here.')}
                        />
                    )}
                    LoadingResponsePlaceholder={() => (
                        <Placeholder
                            icon={share}
                            label={__('Social Links')}
                        >
                            <Spinner />
                        </Placeholder>
                    )}
                />
            </div>
        </>
    );
}
