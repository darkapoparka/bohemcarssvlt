import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuxeroMessageThreadData } from '$lib/server/auxero-account-data';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
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
	const { pageDocument, slot: messageSlot } = renderAuxeroPageSlot('message.html', renderOptions, {
		marker: 'data-bohemcars-message-container',
		templateError: 'Admin messages template could not be rendered',
		slotError: 'Admin messages slot could not be located'
	});

	return {
		afterMessageHtml: messageSlot.afterHtml,
		auxeroFullPage: true,
		beforeMessageHtml: messageSlot.beforeHtml,
		pageDocument,
		thread: getAuxeroMessageThreadData('message.html', renderOptions)
	};
};
