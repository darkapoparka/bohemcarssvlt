import type { PageServerLoad } from './$types';
import { compareVehiclesFromVehicles } from '$lib/auxero/compare';
import { vehicles } from '$lib/data/vehicles';
import { resolveLocale } from '$lib/i18n/messages';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getCompareVehicles } from '$lib/server/compare-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const routePath = 'account/compare';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: compareSlot } = renderAuxeroPageSlot(
		'dashboard.html',
		renderOptions,
		{
			marker: 'dashboard-content--inner',
			templateError: 'Account compare dashboard template could not be rendered',
			slotError: 'Account compare dashboard slot could not be located'
		}
	);

	return {
		afterCompareHtml: compareSlot.afterHtml,
		allVehicles: compareVehiclesFromVehicles(vehicles, locale),
		auxeroFullPage: true,
		beforeCompareHtml: compareSlot.beforeHtml,
		dashboardShell: true,
		dashboard: getAccountDashboardPageData('dashboard.html', renderOptions, {
			subtitle: 'Compare saved vehicles side by side before contacting Bohemcars.',
			title: 'My Compare'
		}),
		locale,
		pageDocument,
		vehicles: compareVehiclesFromVehicles(getCompareVehicles(renderOptions), locale)
	};
};
