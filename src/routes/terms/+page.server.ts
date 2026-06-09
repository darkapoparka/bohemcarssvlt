import type { PageServerLoad } from './$types';
import { auxeroTermsPageTitle, auxeroTermsSections } from '$lib/auxero/terms';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const pageDocument = renderAuxeroPageDocument(
		'terms.html',
		{
			request,
			routePath: 'terms',
			searchParams: url.searchParams
		},
		'Terms template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		pageDocument,
		sections: auxeroTermsSections,
		title: auxeroTermsPageTitle,
		...auxeroPublicShellData(pageDocument, locale, '/terms')
	};
};
