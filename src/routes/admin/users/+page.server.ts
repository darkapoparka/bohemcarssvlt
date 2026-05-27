import type { PageServerLoad } from './$types';
import { getAccountUserManagementData } from '$lib/server/account-users-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'admin/users';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: usersSlot } = renderAuxeroPageSlot('dashboard.html', renderOptions, {
		marker: 'data-bohemcars-users-table',
		templateError: 'Admin users template could not be rendered',
		slotError: 'Admin users table slot could not be located'
	});

	return {
		afterUsersHtml: usersSlot.afterHtml,
		auxeroFullPage: true,
		beforeUsersHtml: usersSlot.beforeHtml,
		pageDocument,
		users: getAccountUserManagementData('dashboard.html', renderOptions)
	};
};
