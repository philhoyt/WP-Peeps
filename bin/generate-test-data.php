<?php
/**
 * Generate test data for WP Peeps plugin
 *
 * Usage: wp eval-file generate-test-data.php [number_of_people]
 */

if ( ! defined( 'WP_CLI' ) ) {
	exit;
}

// Check if the post type exists
if ( ! post_type_exists( 'ph_peeps_people' ) ) {
	WP_CLI::error( 'Post type ph_peeps_people does not exist. Make sure the WP Peeps plugin is activated.' );
	exit;
}

// Check upload directory permissions
$upload_dir = wp_upload_dir();
if ( $upload_dir['error'] ) {
	WP_CLI::error( sprintf( 'Upload directory error: %s', $upload_dir['error'] ) );
	exit;
}

// Check if upload directory is writable
if ( ! is_writable( $upload_dir['path'] ) ) {
	WP_CLI::error( sprintf( 'Upload directory is not writable: %s', $upload_dir['path'] ) );
	exit;
}

// Get number of people to create from argument, default to 10
$number_of_people = $args[0] ?? 10;

// Sample data with gender
$first_names = [
	'boy' => [
		'John', 'Michael', 'David', 'Robert', 'William', 
		'James', 'Joseph', 'Charles', 'Thomas', 'Daniel',
		'Christopher', 'Matthew', 'Anthony', 'Mark', 'Andrew',
		'Brian', 'Joshua', 'Kevin', 'Jonathan', 'Edward',
		'Jason', 'Ryan', 'Nicholas', 'Eric', 'Jacob',
		'Justin', 'Paul', 'Brandon', 'Ethan', 'Nathan',
		'Alexander', 'Aaron', 'Zachary', 'Benjamin', 'Lucas',
		'Jack', 'Logan', 'Tyler', 'Dylan', 'Samuel'
	],
	'girl' => [
		'Jane', 'Sarah', 'Emily', 'Lisa', 'Emma', 
		'Sophia', 'Olivia', 'Isabella', 'Mia', 'Charlotte',
		'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Ella',
		'Ava', 'Chloe', 'Madison', 'Lily', 'Hannah',
		'Grace', 'Scarlett', 'Victoria', 'Aria', 'Layla',
		'Zoe', 'Riley', 'Nora', 'Aubrey', 'Sofia',
		'Audrey', 'Elizabeth', 'Mila', 'Ellie', 'Lucy',
		'Brooklyn', 'Violet', 'Lillian', 'Bella', 'Aurora'
	]
];

$middle_names = [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
	'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
	'U', 'V', 'W', 'X', 'Y', 'Z', 
	'Marie', 'Lee', 'Ann', 'Grace', 'James', 
	'Rose', 'Lynn', 'Rae', 'Jean', 'Scott',
	'Claire', 'Faith', 'Jade', 'May', 'Paul',
	'Noel', 'Ray', 'Hope', 'Taylor', 'Jay',
	'Drew', 'Reese', 'Kai', 'Beau', 'Dean'
];

$last_names = [
	'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 
	'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 
	'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
	'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
	'Lee', 'Perez', 'Thompson', 'White', 'Harris',
	'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
	'Walker', 'Young', 'Allen', 'King', 'Wright',
	'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
	'Green', 'Adams', 'Nelson', 'Baker', 'Hall',
	'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];
$domains = ['example.com', 'test.com', 'email.com', 'domain.com', 'mail.com'];

// Job titles for test data
$job_titles = ['Manager', 'Developer', 'Designer', 'Director', 'Analyst', 'Coordinator', 'Specialist', 'Engineer', 'Consultant', 'Administrator'];

$social_platforms = [
	'facebook' => 'https://facebook.com/%s',
	'twitter' => 'https://twitter.com/%s',
	'linkedin' => 'https://linkedin.com/in/%s',
	'instagram' => 'https://instagram.com/%s',
	'github' => 'https://github.com/%s',
	'youtube' => 'https://youtube.com/@%s'
];

// Lorem ipsum paragraphs
$lorem_paragraphs = [
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
	"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
	"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
];

WP_CLI::log( "Generating $number_of_people test people..." );
WP_CLI::log( sprintf( "Using upload directory: %s", $upload_dir['path'] ) );

try {
	for ( $i = 0; $i < $number_of_people; $i++ ) {
		// Randomly choose gender and get appropriate first name
		$gender = array_rand($first_names);
		$first_name = $first_names[$gender][array_rand($first_names[$gender])];
		$middle_name = $middle_names[array_rand($middle_names)];
		$last_name = $last_names[array_rand($last_names)];
		$email = strtolower($first_name . '.' . $last_name . '@' . $domains[array_rand($domains)]);
		$phone = sprintf('(%d%d%d) %d%d%d-%d%d%d%d',
			rand(2,9), rand(0,9), rand(0,9),
			rand(2,9), rand(0,9), rand(0,9),
			rand(0,9), rand(0,9), rand(0,9), rand(0,9)
		);

		// Check if job-title taxonomy exists
		if (taxonomy_exists('job-title')) {
			// Get a random job title
			$job_title = $job_titles[array_rand($job_titles)];
			
			// Check if the term already exists
			$existing_term = get_term_by('name', $job_title, 'job-title');
			if (!$existing_term) {
				// Create the term if it doesn't exist
				$new_term = wp_insert_term($job_title, 'job-title');
				if (!is_wp_error($new_term)) {
					$job_term_id = $new_term['term_id'];
				}
			} else {
				$job_term_id = $existing_term->term_id;
			}
		}

		// Generate random content
		$num_paragraphs = rand(2, 5);
		$paragraphs = array_rand(array_flip($lorem_paragraphs), $num_paragraphs);
		$content = implode("\n\n", (array)$paragraphs);

		// Create the post
		$post_id = wp_insert_post([
			'post_type' => 'ph_peeps_people',
			'post_status' => 'publish',
			'post_title' => sprintf('%s %s %s', $first_name, $middle_name, $last_name),
			'post_content' => $content,
		], true);

		if ( is_wp_error( $post_id ) ) {
			WP_CLI::warning( sprintf(
				"Failed to create person %d: %s",
				$i + 1,
				$post_id->get_error_message()
			));
			continue;
		}

		// Set meta data
		update_post_meta( $post_id, 'ph_peeps_first_name', $first_name );
		update_post_meta( $post_id, 'ph_peeps_middle_name', $middle_name );
		update_post_meta( $post_id, 'ph_peeps_last_name', $last_name );
		update_post_meta( $post_id, 'ph_peeps_email', $email );
		update_post_meta( $post_id, 'ph_peeps_phone', preg_replace('/[^0-9]/', '', $phone) );
		if (isset($job_term_id)) {
			wp_set_post_terms($post_id, [$job_term_id], 'job-title');
			update_post_meta($post_id, 'ph_peeps_job_title', $job_title);
		}

		// Generate random social links
		$num_social = rand(2, 4); // Random number of social platforms per person
		$chosen_platforms = array_rand($social_platforms, $num_social);
		if (!is_array($chosen_platforms)) {
			$chosen_platforms = [$chosen_platforms];
		}
		
		$social_links = [];
		$username = strtolower(str_replace(' ', '', $first_name . $last_name));
		
		foreach ($chosen_platforms as $platform) {
			$social_links[] = [
				'platform' => $platform,
				'url' => sprintf($social_platforms[$platform], $username)
			];
		}
		
		update_post_meta($post_id, 'ph_peeps_social_links', $social_links);

		// Add featured image
		$image_url = "https://avatar.iran.liara.run/public/{$gender}";
		
		WP_CLI::log( sprintf( "Downloading %s avatar from: %s", $gender, $image_url ) );
		
		// Set up context options for file_get_contents
		$context = stream_context_create([
			'http' => [
				'method' => 'GET',
				'header' => [
					'User-Agent: PHP/WP-CLI'
				]
			],
			'ssl' => [
				'verify_peer' => false,
				'verify_peer_name' => false,
			],
		]);
		
		$image_data = @file_get_contents($image_url, false, $context);
		if ($image_data === false) {
			$error = error_get_last();
			WP_CLI::warning( sprintf( 
				"Failed to download avatar for person %d. Error: %s", 
				$i + 1, 
				$error ? $error['message'] : 'Unknown error'
			));
			continue;
		}

		$filename = "person-{$post_id}-" . time() . ".png";
		$file = $upload_dir['path'] . '/' . $filename;
		
		if (!@file_put_contents($file, $image_data)) {
			WP_CLI::warning( sprintf( 
				"Failed to save avatar for person %d. Check permissions for: %s", 
				$i + 1, 
				$upload_dir['path']
			));
			continue;
		}

		// Make sure the image library is loaded
		require_once(ABSPATH . 'wp-admin/includes/image.php');
		require_once(ABSPATH . 'wp-admin/includes/file.php');
		require_once(ABSPATH . 'wp-admin/includes/media.php');

		// Prepare file information
		$wp_filetype = wp_check_filetype($filename, null);
		$attachment = array(
			'guid'           => $upload_dir['url'] . '/' . basename($file),
			'post_mime_type' => $wp_filetype['type'],
			'post_title'     => sanitize_file_name($filename),
			'post_content'   => '',
			'post_status'    => 'inherit'
		);

		// Insert attachment into database
		$attach_id = wp_insert_attachment($attachment, $file, $post_id);
		if (is_wp_error($attach_id)) {
			WP_CLI::warning( sprintf( 
				"Failed to create attachment for person %d: %s", 
				$i + 1,
				$attach_id->get_error_message()
			));
			continue;
		}

		// Generate metadata and update attachment
		$attach_data = wp_generate_attachment_metadata($attach_id, $file);
		wp_update_attachment_metadata($attach_id, $attach_data);

		// Set as featured image
		$result = set_post_thumbnail($post_id, $attach_id);
		if (!$result) {
			WP_CLI::warning( sprintf( 
				"Failed to set featured image for person %d", 
				$i + 1
			));
		}

		WP_CLI::success( sprintf(
			"Created person %d: %s %s %s (%s) with %s avatar",
			$i + 1,
			$first_name,
			$middle_name,
			$last_name,
			$email,
			$gender
		));
	}

	WP_CLI::success( "Generated $number_of_people test people!" );
} catch ( Exception $e ) {
	WP_CLI::error( sprintf(
		"Error generating test data: %s",
		$e->getMessage()
	));
}