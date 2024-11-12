import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { tagName } = attributes;
	const TagName = tagName;
	const blockProps = useBlockProps.save();

	return <TagName {...blockProps}></TagName>;
}
