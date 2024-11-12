import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { tagName, makeLink, openInNewTab, linkRel } = attributes;
	const blockProps = useBlockProps.save();
	const TagName = tagName;

	const linkAttributes = {
		href: '#', // Placeholder, will be replaced by PHP render callback
		target: openInNewTab ? '_blank' : undefined,
		rel: linkRel || undefined,
	};

	return (
		<TagName {...blockProps}>
			{makeLink ? (
				<a {...linkAttributes}></a>
			) : (
				null
			)}
		</TagName>
	);
}
