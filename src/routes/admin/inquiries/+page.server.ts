import type { PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountMessageThreadData } from '$lib/server/account-message-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'admin/inquiries';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: messageSlot } = renderAuxeroPageSlot('message.html', renderOptions, {
		marker: 'data-bohemcars-message-container',
		templateError: 'Admin inquiries template could not be rendered',
		slotError: 'Admin inquiries slot could not be located'
	});

	return {
		afterMessageHtml: messageSlot.afterHtml,
		auxeroFullPage: true,
		beforeMessageHtml: messageSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('message.html', renderOptions, {
			subtitle: 'Triage leads, assignments, and buyer requests.',
			title: 'Inquiries'
		}),
		messageHtml: messageSlot.sectionHtml,
		pageDocument,
		thread: getAccountMessageThreadData('message.html', renderOptions)
	};
};
