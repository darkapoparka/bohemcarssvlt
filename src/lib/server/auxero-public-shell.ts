import type { AuxeroPageDocument } from '$lib/auxero/page-document';
import {
	homeFiveFooterDataForLocale,
	homeFiveHeaderDataForLocale,
	homeFiveModalsDataFromVehicles
} from '$lib/auxero/home-five';
import { vehicles } from '$lib/data/vehicles';
import { getMessages, type Locale } from '$lib/i18n/messages';
import { extractAuxeroBodyScriptsHtml, extractAuxeroRuntimeHtml } from './auxero-page';

export const auxeroPublicShellData = (
	pageDocument: AuxeroPageDocument,
	locale: Locale,
	activePath: string
) => ({
	shellCopy: getMessages(locale).home,
	shellFooter: homeFiveFooterDataForLocale(locale),
	shellHeader: homeFiveHeaderDataForLocale(locale, activePath),
	shellModals: homeFiveModalsDataFromVehicles(vehicles, locale),
	shellRuntimeHtml: [
		extractAuxeroBodyScriptsHtml(pageDocument.bodyHtml),
		extractAuxeroRuntimeHtml(pageDocument.bodyHtml)
	]
		.filter(Boolean)
		.join('\n')
});
