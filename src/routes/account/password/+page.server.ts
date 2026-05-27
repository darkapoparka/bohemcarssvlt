import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuxeroAccountPasswordFormData } from '$lib/server/auxero-account-data';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';
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
	const html = renderAuxeroTemplate('change-password.html', renderOptions);

	if (!html) {
		error(500, 'Account password template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const passwordSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-password-form',
		'form'
	);

	if (!passwordSlot) {
		error(500, 'Account password form slot could not be located');
	}

	return {
		afterPasswordHtml: passwordSlot.afterHtml,
		auxeroFullPage: true,
		beforePasswordHtml: passwordSlot.beforeHtml,
		pageDocument,
		password: getAuxeroAccountPasswordFormData('change-password.html', renderOptions)
	};
};
