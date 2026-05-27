import type { PageServerLoad } from './$types';
import { getAccountMessageThreadData } from '$lib/server/account-message-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/messages';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: messageSlot } = renderAuxeroPageSlot('message.html', renderOptions, {
		marker: 'data-bohemcars-message-container',
		templateError: 'Account messages template could not be rendered',
		slotError: 'Account messages slot could not be located'
	});

	return {
		afterMessageHtml: messageSlot.afterHtml,
		auxeroFullPage: true,
		beforeMessageHtml: messageSlot.beforeHtml,
		pageDocument,
		thread: getAccountMessageThreadData('message.html', renderOptions)
	};
};
