import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuxeroMessageThreadData } from '$lib/server/auxero-account-data';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';
import { canAccessBohemcarsRoute, resolveBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'admin/messages';
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
	const html = renderAuxeroTemplate('message.html', renderOptions);

	if (!html) {
		error(500, 'Admin messages template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const messageSlot = splitAuxeroDivBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-message-container'
	);

	if (!messageSlot) {
		error(500, 'Admin messages slot could not be located');
	}

	return {
		afterMessageHtml: messageSlot.afterHtml,
		auxeroFullPage: true,
		beforeMessageHtml: messageSlot.beforeHtml,
		pageDocument,
		thread: getAuxeroMessageThreadData('message.html', renderOptions)
	};
};
