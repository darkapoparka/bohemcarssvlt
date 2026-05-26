import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuxeroUserManagementData } from '$lib/server/auxero-account-data';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';
import { canAccessBohemcarsRoute, resolveBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'admin/users';
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
	const html = renderAuxeroTemplate('dashboard.html', renderOptions);

	if (!html) {
		error(500, 'Admin users template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const usersSlot = splitAuxeroDivBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-users-table'
	);

	if (!usersSlot) {
		error(500, 'Admin users table slot could not be located');
	}

	return {
		afterUsersHtml: usersSlot.afterHtml,
		auxeroFullPage: true,
		beforeUsersHtml: usersSlot.beforeHtml,
		pageDocument,
		users: getAuxeroUserManagementData('dashboard.html', renderOptions)
	};
};
