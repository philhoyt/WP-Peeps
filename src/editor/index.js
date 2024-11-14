import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { TextControl, Button, Flex, FlexItem, SelectControl, Icon } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { useSelect } from '@wordpress/data';
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import { dragHandle } from '@wordpress/icons';

// Import and register blocks
import '../blocks';

function NameFieldsPanel() {
	const [ meta, setMeta ] = useEntityProp( 'postType', 'wp_peeps_people', 'meta' );
	const [ , setTitle ] = useEntityProp( 'postType', 'wp_peeps_people', 'title' );
	const [ , setSlug ] = useEntityProp( 'postType', 'wp_peeps_people', 'slug' );
	const { lockPostSaving, unlockPostSaving, editPost } =
		dispatch( 'core/editor' );

	// Get phone format from settings
	const phoneFormat = useSelect(
		( select ) =>
			select( coreStore ).getEntityRecord( 'root', 'site' )
				?.wp_peeps_phone_format || '(###) ###-####'
	);

	const formatPhoneNumber = ( value ) => {
		// Strip all non-digits
		const digits = value.replace( /\D/g, '' );

		if ( ! digits ) return '';

		// Get the format template
		let format = phoneFormat;

		// Replace each # with a digit
		let formatted = format;
		for ( let i = 0; i < digits.length && i < 10; i++ ) {
			formatted = formatted.replace( '#', digits[ i ] );
		}

		// Remove any remaining # placeholders
		formatted = formatted.replace( /#/g, '' );

		return formatted;
	};

	const handlePhoneChange = ( value ) => {
		// Strip all non-digits and limit to 10
		const digits = value.replace( /\D/g, '' ).slice( 0, 10 );
		setMeta( {
			...meta,
			wp_peeps_phone: digits,
		} );
	};

	useEffect( () => {
		if ( ! meta ) return;

		const firstName = meta?.wp_peeps_first_name?.trim() || '';
		const middleName = meta?.wp_peeps_middle_name?.trim() || '';
		const lastName = meta?.wp_peeps_last_name?.trim() || '';

		if ( ! firstName || ! lastName ) {
			lockPostSaving( 'requiredNameFields' );
			return;
		}

		unlockPostSaving( 'requiredNameFields' );

		// Create the full name with middle name if present
		const fullName = middleName
			? `${ firstName } ${ middleName } ${ lastName }`
			: `${ firstName } ${ lastName }`;

		// Update both title and slug
		setTitle( fullName );
		editPost( { title: fullName } );

		// Update slug
		const newSlug = fullName
			.toLowerCase()
			.replace( /[^a-z0-9]+/g, '-' )
			.replace( /^-+|-+$/g, '' );
		setSlug( newSlug );
	}, [ meta?.wp_peeps_first_name, meta?.wp_peeps_middle_name, meta?.wp_peeps_last_name ] );

	return (
		<PluginDocumentSettingPanel
			name="wp-peeps-name-fields"
			title={ __( 'Name Details', 'wp-peeps' ) }
			className="wp-peeps-name-fields"
			initialOpen={ true }
		>
			<TextControl
				label={ __( 'First Name', 'wp-peeps' ) + ' *' }
				value={ meta?.wp_peeps_first_name || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						wp_peeps_first_name: newValue,
					} )
				}
				help={
					! meta?.wp_peeps_first_name?.trim()
						? __( 'First name is required', 'wp-peeps' )
						: ''
				}
			/>
			<TextControl
				label={ __( 'Middle Name', 'wp-peeps' ) }
				value={ meta?.wp_peeps_middle_name || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						wp_peeps_middle_name: newValue,
					} )
				}
			/>
			<TextControl
				label={ __( 'Last Name', 'wp-peeps' ) + ' *' }
				value={ meta?.wp_peeps_last_name || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						wp_peeps_last_name: newValue,
					} )
				}
				help={
					! meta?.wp_peeps_last_name?.trim()
						? __( 'Last name is required', 'wp-peeps' )
						: ''
				}
			/>
			<TextControl
				label={ __( 'Job Title', 'wp-peeps' ) }
				value={ meta?.wp_peeps_job_title || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						wp_peeps_job_title: newValue,
					} )
				}
			/>
			<TextControl
				label={ __( 'Phone', 'wp-peeps' ) }
				value={ meta?.wp_peeps_phone ? formatPhoneNumber(meta.wp_peeps_phone) : '' }
				onChange={ handlePhoneChange }
				help={ __( 'Enter 10 digit phone number', 'wp-peeps' ) }
				type="tel"
			/>
			<TextControl
				type="email"
				label={ __( 'Email', 'wp-peeps' ) }
				value={ meta?.wp_peeps_email || '' }
				onChange={ ( newValue ) =>
					setMeta( {
						...meta,
						wp_peeps_email: newValue,
					} )
				}
				help={ __( 'Enter valid email address', 'wp-peeps' ) }
			/>
		</PluginDocumentSettingPanel>
	);
}

const PLATFORM_PATTERNS = {
    '500px': /500px\.com/i,
    amazon: /amazon\./i,
    bandcamp: /bandcamp\.com/i,
    behance: /behance\.net/i,
    bluesky: /(?:bsky\.app|bsky\.social)/i,
    codepen: /codepen\.io/i,
    deviantart: /deviantart\.com/i,
    dribbble: /dribbble\.com/i,
    dropbox: /dropbox\.com/i,
    etsy: /etsy\.com/i,
    facebook: /(?:facebook\.com|fb\.com|fb\.me)/i,
    flickr: /flickr\.com/i,
    foursquare: /foursquare\.com/i,
    github: /github\.com/i,
    goodreads: /goodreads\.com/i,
    google: /(?:google\.com|plus\.google\.com)/i,
    instagram: /(?:instagram\.com|instagr\.am)/i,
    lastfm: /last\.fm/i,
    linkedin: /linkedin\.com/i,
    mastodon: /@.*@.*\.[a-z]+/i,
    medium: /medium\.com/i,
    meetup: /meetup\.com/i,
    pinterest: /pinterest\./i,
    pocket: /getpocket\.com/i,
    reddit: /reddit\.com/i,
    skype: /skype\.com/i,
    snapchat: /snapchat\.com/i,
    soundcloud: /soundcloud\.com/i,
    spotify: /spotify\.com/i,
    telegram: /t\.me/i,
    tumblr: /tumblr\.com/i,
    twitch: /twitch\.tv/i,
    twitter: /(?:twitter\.com|x\.com)/i,
    vimeo: /vimeo\.com/i,
    whatsapp: /(?:whatsapp\.com|wa\.me)/i,
    wordpress: /(?:wordpress\.org|wordpress\.com)/i,
    yelp: /yelp\./i,
    youtube: /(?:youtube\.com|youtu\.be)/i
};

const detectPlatform = (url) => {
    try {
        const urlObj = new URL(url);
        
        // Check against known patterns
        for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
            if (pattern.test(urlObj.hostname) || pattern.test(url)) {
                return platform;
            }
        }

        // Return chain as fallback
        return 'chain';
    } catch (e) {
        // If URL is invalid, return chain
        return 'chain';
    }
};

const isValidUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (e) {
        return false;
    }
};

function SocialLinksPanel() {
    // Check if we're in the post editor
    const { isPostEditor } = useSelect(select => ({
        isPostEditor: !!select('core/editor'),
    }), []);

    // Only render in post editor
    if (!isPostEditor) {
        return null;
    }

    const [meta, setMeta] = useEntityProp('postType', 'wp_peeps_people', 'meta');
    const [newUrl, setNewUrl] = useState('');

    const socialLinks = meta?.wp_peeps_social_links || [];

    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const updatedLinks = [...socialLinks];
        const [draggedItem] = updatedLinks.splice(draggedIndex, 1);
        updatedLinks.splice(index, 0, draggedItem);
        
        setMeta({
            ...meta,
            wp_peeps_social_links: updatedLinks,
        });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleAddLink = () => {
        if (!newUrl) return;

        // Validate URL first
        if (!isValidUrl(newUrl)) {
            // Could add a notice here if you want to show an error message
            return;
        }

        const platform = detectPlatform(newUrl);
        if (!platform) return; // Don't add if we can't determine the platform

        const updatedLinks = [...socialLinks, { platform, url: newUrl }];
        setMeta({
            ...meta,
            wp_peeps_social_links: updatedLinks,
        });
        setNewUrl('');
    };

    const handleRemoveLink = (index) => {
        const updatedLinks = socialLinks.filter((_, i) => i !== index);
        setMeta({
            ...meta,
            wp_peeps_social_links: updatedLinks,
        });
    };

    return (
        <PluginDocumentSettingPanel
            name="wp-peeps-social-links-panel"
            title={__('Social Links')}
            className="wp-peeps-social-links-panel"
        >
            <div className="wp-peeps-social-links-list">
                {socialLinks.map((link, index) => (
                    <Flex
                        key={index}
                        className="wp-peeps-social-link-item"
                        align="center"
                        style={{ marginBottom: '8px' }}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        <Icon icon={dragHandle} />
                        <FlexItem>
                            {link.platform} - {link.url}
                        </FlexItem>
                        <Button
                            isDestructive
                            onClick={() => handleRemoveLink(index)}
                            icon="no-alt"
                            label={__('Remove link')}
                        />
                    </Flex>
                ))}
            </div>

            <Flex align="flex-start" style={{ marginTop: '16px' }}>
                <FlexItem>
                    <TextControl
                        label={__('Add social link')}
                        value={newUrl}
                        onChange={setNewUrl}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleAddLink();
                            }
                        }}
                    />
                </FlexItem>
                <FlexItem>
                    <Button
                        variant="secondary"
                        onClick={handleAddLink}
                        style={{ marginTop: '24px' }}
                    >
                        {__('Add')}
                    </Button>
                </FlexItem>
            </Flex>
        </PluginDocumentSettingPanel>
    );
}

registerPlugin('wp-peeps-name-fields-panel', { render: NameFieldsPanel });
registerPlugin('wp-peeps-social-links-panel', { render: SocialLinksPanel });
