import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuxeroAccountProfileFormData } from '$lib/server/auxero-account-data';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';
import { canAccessBohemcarsRoute, resolveBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/profile';
	const session = resolveBohemcarsPageSession(request, routePath, url.searchParams);

	if (!session) {
		error(401, 'Bohemcars account session is required');
	}

	if (!canAccessBohemcarsRoute(session, routePath)) {
		error(403, 'Bohemcars account role cannot access this route');
	}

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const html = renderAuxeroTemplate('my-profile.html', renderOptions);

	if (!html) {
		error(500, 'Account profile template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const profileSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-profile-form',
		'form'
	);

	if (!profileSlot) {
		error(500, 'Account profile form slot could not be located');
	}

	return {
		afterProfileHtml: profileSlot.afterHtml,
		auxeroFullPage: true,
		beforeProfileHtml: profileSlot.beforeHtml,
		pageDocument,
		profile: getAuxeroAccountProfileFormData('my-profile.html', renderOptions)
	};
};
