import type { PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import {
	accountUserManagementNotesData,
	getAccountUserManagementData
} from '$lib/server/account-users-state';
import { renderAuxeroPageSlot, splitAuxeroDivBlockByMarker } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

const allowedUserRoles = new Set(['all', 'admin', 'agent', 'customer', 'lead']);

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'admin/users';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);
	const searchQuery = (url.searchParams.get('q') ?? '').trim();
	const requestedUserRole = (url.searchParams.get('userRole') ?? 'all').toLowerCase();
	const selectedUserRole = allowedUserRoles.has(requestedUserRole) ? requestedUserRole : 'all';

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
	const usersNotesSlot = splitAuxeroDivBlockByMarker(usersSlot.afterHtml, 'bohemcars-users-box');
	const afterUsersHtml = usersNotesSlot
		? `${usersNotesSlot.beforeHtml}${usersNotesSlot.afterHtml}`
		: usersSlot.afterHtml;
	const usersData = getAccountUserManagementData('dashboard.html', renderOptions);
	const searchNeedle = searchQuery.toLowerCase();
	const users = {
		...usersData,
		rows: usersData.rows.filter((row) => {
			const rowRole = row.role.toLowerCase();
			const matchesRole = selectedUserRole === 'all' || rowRole === selectedUserRole;
			const matchesSearch =
				!searchNeedle ||
				[row.name, row.description, row.role, ...row.columns]
					.join(' ')
					.toLowerCase()
					.includes(searchNeedle);

			return matchesRole && matchesSearch;
		})
	};

	return {
		afterUsersHtml,
		auxeroFullPage: true,
		beforeUsersHtml: usersSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('dashboard.html', renderOptions, {
			subtitle: 'Review customer, agent, and admin activity in one table.',
			title: 'Users'
		}),
		notes: accountUserManagementNotesData(),
		pageDocument,
		searchQuery,
		selectedUserRole,
		users
	};
};
