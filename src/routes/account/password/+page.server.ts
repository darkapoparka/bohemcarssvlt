import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuxeroAccountPasswordFormData } from '$lib/server/auxero-account-data';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { canAccessBohemcarsRoute, resolveBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/password';
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
		pageDocument,
		password: getAuxeroAccountPasswordFormData('change-password.html', renderOptions)
	};
};
