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
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
	Placeholder,
	Spinner,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { layout, share } from '@wordpress/icons';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

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
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set block attributes.
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		iconColorValue,
		iconBackgroundColorValue,
		size = 'has-normal-icon-size',
		openInNewTab,
		showLabels,
	} = attributes;

	const blockProps = useBlockProps();

	// Track save state to force ServerSideRender update after save
	const [renderKey, setRenderKey] = useState(0);
	const wasSavingRef = useRef(false);

	// Get meta and save status
	const { isSaving, isDirty } = useSelect((select) => {
		const coreEditor = select('core/editor');
		return {
			isSaving: select('core').isSavingEntityRecord(
				'postType',
				'ph_peeps_people',
			),
			isDirty: coreEditor ? coreEditor.isEditedPostDirty() : false,
		};
	}, []);

	// Force ServerSideRender to update after save completes
	useEffect(() => {
		// If we just finished saving (was saving, now not saving and not dirty)
		if (wasSavingRef.current && !isSaving && !isDirty) {
			// Force re-render by changing the key (doesn't mark block as dirty)
			setRenderKey((prev) => prev + 1);
		}
		wasSavingRef.current = isSaving;
	}, [isSaving, isDirty]);

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
					value={attributes.layout?.justifyContent}
					onChange={(value) =>
						setAttributes({
							layout: {
								...attributes.layout,
								justifyContent: value,
							},
						})
					}
					allowedControls={[
						'left',
						'center',
						'right',
						'space-between',
					]}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					<ToggleControl
						label={__('Show labels')}
						checked={showLabels}
						onChange={() =>
							setAttributes({ showLabels: !showLabels })
						}
					/>
					<ToggleControl
						label={__('Open links in new tab')}
						checked={openInNewTab}
						onChange={() =>
							setAttributes({ openInNewTab: !openInNewTab })
						}
					/>
				</PanelBody>
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
					title={__('Color settings')}
					colorSettings={[
						{
							value: iconColorValue,
							onChange: (color) => {
								setAttributes({
									iconColorValue: color,
								});
							},
							label: __('Icon color'),
						},
						{
							value: iconBackgroundColorValue,
							onChange: (color) => {
								setAttributes({
									iconBackgroundColorValue: color,
								});
							},
							label: __('Icon background'),
						},
					]}
				/>
			</InspectorControls>
			<div {...blockProps}>
				<ServerSideRender
					key={renderKey}
					block="ph-peeps/social-links"
					attributes={attributes}
					EmptyResponsePlaceholder={() => (
						<Placeholder
							icon={share}
							label={__('Social Links')}
							instructions={__(
								'Add social links in the Person settings to display them here.',
							)}
						/>
					)}
					LoadingResponsePlaceholder={() => (
						<Placeholder icon={share} label={__('Social Links')}>
							<Spinner />
						</Placeholder>
					)}
				/>
			</div>
		</>
	);
}
