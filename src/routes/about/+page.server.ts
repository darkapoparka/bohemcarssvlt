import type { PageServerLoad } from './$types';
import { auxeroAboutContent } from '$lib/auxero/about';
import { removeAuxeroBreadcrumb, renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: aboutSlot } = renderAuxeroPageSlot(
		'about-us.html',
		{
			request,
			routePath: 'about',
			searchParams: url.searchParams
		},
		{
			marker: 'data-bohemcars-about',
			templateError: 'About template could not be rendered',
			slotError: 'About content slot could not be located'
		}
	);

	return {
		about: auxeroAboutContent,
		afterAboutHtml: aboutSlot.afterHtml,
		auxeroFullPage: true,
		beforeAboutHtml: removeAuxeroBreadcrumb(aboutSlot.beforeHtml),
		pageDocument
	};
};
