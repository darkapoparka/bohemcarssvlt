import type { PageServerLoad } from './$types';
import { auxeroFaqGroups, featuredFaqs } from '$lib/auxero/faqs';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const pageDocument = renderAuxeroPageDocument(
		'faqs.html',
		{
			request,
			routePath: 'faqs',
			searchParams: url.searchParams
		},
		'FAQ template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		featured: featuredFaqs,
		groups: auxeroFaqGroups,
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/faqs')
	};
};
