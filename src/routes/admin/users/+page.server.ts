import type { PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import {
	accountUserManagementNotesData,
	getAccountUserManagementData
} from '$lib/server/account-users-state';
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
		dashboard: getAccountDashboardPageData('dashboard.html', renderOptions, {
			subtitle: 'Review customer, agent, and admin activity in one table.',
			title: 'Users'
		}),
		notes: accountUserManagementNotesData(),
		pageDocument,
		users: getAccountUserManagementData('dashboard.html', renderOptions)
	};
};
