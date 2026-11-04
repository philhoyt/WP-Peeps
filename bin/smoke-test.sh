#!/usr/bin/env bash
#
# Front-end smoke test against a running wp-env site.
#
# Creates one person with every meta field the blocks read, then requests the
# home page, the people archive and the single person page. Both plugin
# templates are rendered on those pages, so every block (full-name, phone,
# email, social-links) runs its render.php. The script fails when a page is not
# HTTP 200, when a PHP error is printed in the body (WP_DEBUG_DISPLAY is on in
# .wp-env.json), when the block output is missing, or when wp-content/debug.log
# is not empty after the requests (WP_DEBUG_LOG is on, so warnings and notices
# that do not reach the body still land there).
#
# Usage: npm run env:start && npm run test:smoke
# Set WP_ENV_SITE_URL when wp-env runs on a port other than 8888.

set -euo pipefail

SITE_URL="${WP_ENV_SITE_URL:-http://localhost:8888}"
CPT_SLUG="people"
PERSON_SLUG="ada-lovelace"
FAILURES=0

# wp-env prints its own progress lines on stderr, so stdout is the command's.
wpcli() {
	npx wp-env run cli -- wp "$@"
}

in_container() {
	npx wp-env run cli -- sh -c "$1"
}

fail() {
	echo "::error::$1"
	FAILURES=$(( FAILURES + 1 ))
}

echo "--- Fixture: one published person"
wpcli rewrite structure '/%postname%/' --hard

# The post may already exist on a re-run; reuse it.
POST_ID="$( wpcli post list --post_type=ph_peeps_people --name="${PERSON_SLUG}" --field=ID --format=csv | grep -E '^[0-9]+$' | tail -n 1 || true )"
if [ -z "${POST_ID}" ]; then
	POST_ID="$( wpcli post create \
		--post_type=ph_peeps_people \
		--post_status=publish \
		--post_title='Ada Lovelace' \
		--post_name="${PERSON_SLUG}" \
		--post_content='<!-- wp:paragraph --><p>Mathematician.</p><!-- /wp:paragraph -->' \
		--porcelain | grep -E '^[0-9]+$' | tail -n 1 )"
fi
if [ -z "${POST_ID}" ]; then
	echo "::error::Could not create the fixture person."
	exit 1
fi
echo "Person post ID: ${POST_ID}"

wpcli post meta update "${POST_ID}" ph_peeps_first_name 'Ada'
wpcli post meta update "${POST_ID}" ph_peeps_middle_name 'King'
wpcli post meta update "${POST_ID}" ph_peeps_last_name 'Lovelace'
wpcli post meta update "${POST_ID}" ph_peeps_job_title 'Analyst'
wpcli post meta update "${POST_ID}" ph_peeps_phone '5551234567'
wpcli post meta update "${POST_ID}" ph_peeps_phone_ext '12'
wpcli post meta update "${POST_ID}" ph_peeps_email 'ada@example.com'
wpcli post meta update "${POST_ID}" ph_peeps_social_links \
	'[{"platform":"github","url":"https://github.com/example"},{"platform":"linkedin","url":"https://www.linkedin.com/in/example"}]' \
	--format=json

# Start the front-end requests with a clean log so only they are judged.
in_container 'rm -f wp-content/debug.log'

check_url() {
	local url="$1"
	shift
	local response status body errors

	echo "--- GET ${url}"
	response="$( curl -sS -L -w $'\n%{http_code}' "${url}" )" || {
		fail "Request to ${url} failed."
		return
	}
	status="${response##*$'\n'}"
	body="${response%$'\n'*}"

	if [ "${status}" != "200" ]; then
		fail "${url} returned HTTP ${status}."
	fi

	# PHP prints "<b>Fatal error</b>:" with html_errors on and "Fatal error:" without.
	errors="$( printf '%s' "${body}" | grep -E '(Fatal error|Parse error|Warning|Notice|Deprecated)(</b>)?:' || true )"
	if [ -n "${errors}" ]; then
		fail "PHP error printed on ${url}:"
		printf '%s\n' "${errors}"
	fi

	for needle in "$@"; do
		if ! printf '%s' "${body}" | grep -qF -- "${needle}"; then
			fail "${url} is missing expected output: ${needle}"
			echo "Lines mentioning '${needle%% *}' on that page:"
			printf '%s' "${body}" | grep -F -- "${needle%% *}" | head -n 10 || true
		fi
	done
}

check_url "${SITE_URL}/"

check_url "${SITE_URL}/${CPT_SLUG}/" \
	'wp-block-ph-peeps-full-name' \
	'Ada King Lovelace' \
	'mailto:ada@example.com' \
	'tel:5551234567' \
	'ph-peeps-social-links' \
	'https://github.com/example'

check_url "${SITE_URL}/${CPT_SLUG}/${PERSON_SLUG}/" \
	'wp-block-ph-peeps-full-name' \
	'Ada King Lovelace' \
	'mailto:ada@example.com' \
	'tel:5551234567;ext=12' \
	'ph-peeps-social-links' \
	'https://github.com/example' \
	'https://www.linkedin.com/in/example'

echo "--- wp-content/debug.log after the requests"
DEBUG_LOG="$( in_container 'cat wp-content/debug.log 2>/dev/null || true' )"
if [ -n "${DEBUG_LOG}" ]; then
	fail "wp-content/debug.log is not empty:"
	printf '%s\n' "${DEBUG_LOG}"
else
	echo "(empty)"
fi

if [ "${FAILURES}" -gt 0 ]; then
	echo "Smoke test failed with ${FAILURES} problem(s)."
	exit 1
fi

echo "Smoke test passed."
