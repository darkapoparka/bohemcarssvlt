import type { PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountPasswordFormData } from '$lib/server/account-profile-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/password';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: passwordSlot } = renderAuxeroPageSlot(
		'change-password.html',
		renderOptions,
		{
			marker: 'data-bohemcars-password-form',
			tagName: 'form',
			templateError: 'Account password template could not be rendered',
			slotError: 'Account password form slot could not be located'
		}
	);

	return {
		afterPasswordHtml: passwordSlot.afterHtml,
		auxeroFullPage: true,
		beforePasswordHtml: passwordSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('change-password.html', renderOptions, {
			subtitle: 'Update account credentials for this Bohemcars workspace.',
			title: 'Profile Security'
		}),
		pageDocument,
		password: getAccountPasswordFormData('change-password.html', renderOptions),
		passwordHtml: passwordSlot.sectionHtml
	};
};
