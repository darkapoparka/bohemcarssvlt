import type { PageServerLoad } from './$types';
import { getAuxeroAccountProfileFormData } from '$lib/server/auxero-account-data';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/profile';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: profileSlot } = renderAuxeroPageSlot(
		'my-profile.html',
		renderOptions,
		{
			marker: 'data-bohemcars-profile-form',
			tagName: 'form',
			templateError: 'Account profile template could not be rendered',
			slotError: 'Account profile form slot could not be located'
		}
	);

	return {
		afterProfileHtml: profileSlot.afterHtml,
		auxeroFullPage: true,
		beforeProfileHtml: profileSlot.beforeHtml,
		pageDocument,
		profile: getAuxeroAccountProfileFormData('my-profile.html', renderOptions)
	};
};
