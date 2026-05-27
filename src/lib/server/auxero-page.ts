import { error } from '@sveltejs/kit';
import type { AuxeroPageDocument } from '$lib/auxero/page-document';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import { renderAuxeroTemplate } from './auxero-template';

export type AuxeroBodySlot = {
	afterHtml: string;
	beforeHtml: string;
	sectionHtml: string;
};

type AuxeroPageSlotOptions = {
	marker: string;
	slotError: string;
	tagName?: string;
	templateError: string;
};

const tagContents = (html: string, tagName: 'body' | 'head') => {
	const match = html.match(new RegExp(`<${tagName}([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, 'i'));

	if (!match) {
		throw new Error(`Expected Auxero document to include <${tagName}>`);
	}

	return {
		attributes: match[1] ?? '',
		content: match[2] ?? ''
	};
};

const attributeValue = (attributes: string, name: string) => {
	const match = attributes.match(new RegExp(`${name}=(["'])(.*?)\\1`, 'i'));

	return match?.[2] ?? '';
};

const injectedBodyClass = (bodyHtml: string) => {
	const match = bodyHtml.match(/document\.body\.classList\.add\((["'])(.*?)\1\)/);

	return match?.[2] ?? '';
};

export function splitAuxeroDocument(html: string): AuxeroPageDocument {
	const head = tagContents(html, 'head');
	const body = tagContents(html, 'body');

	return {
		bodyClass: attributeValue(body.attributes, 'class') || injectedBodyClass(body.content),
		bodyHtml: body.content,
		headHtml: head.content
	};
}

export function renderAuxeroPageDocument(
	templateFile: string,
	options: AuxeroRenderOptions,
	templateError: string
) {
	const html = renderAuxeroTemplate(templateFile, options);

	if (!html) {
		error(500, templateError);
	}

	return splitAuxeroDocument(html);
}

export function splitAuxeroBodySection(bodyHtml: string, startComment: string, endComment: string) {
	const start = bodyHtml.indexOf(startComment);
	const end = bodyHtml.indexOf(endComment, start + startComment.length);

	if (start < 0 || end < 0) {
		return undefined;
	}

	const afterStart = end + endComment.length;

	return {
		afterHtml: bodyHtml.slice(afterStart),
		beforeHtml: bodyHtml.slice(0, start),
		sectionHtml: bodyHtml.slice(start, afterStart)
	};
}

const findClosingTagIndex = (html: string, openTagIndex: number, tagName: string) => {
	const pattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi');
	pattern.lastIndex = openTagIndex;
	let depth = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(html))) {
		if (match[0].startsWith(`</${tagName}`)) {
			depth -= 1;
		} else {
			depth += 1;
		}

		if (depth === 0) return match.index + match[0].length;
	}

	return -1;
};

export function splitAuxeroElementBlockByMarker(bodyHtml: string, marker: string, tagName: string) {
	const markerIndex = bodyHtml.indexOf(marker);

	if (markerIndex < 0) {
		return undefined;
	}

	const start = bodyHtml.lastIndexOf(`<${tagName}`, markerIndex);

	if (start < 0) {
		return undefined;
	}

	const end = findClosingTagIndex(bodyHtml, start, tagName);

	if (end < 0) {
		return undefined;
	}

	return {
		afterHtml: bodyHtml.slice(end),
		beforeHtml: bodyHtml.slice(0, start),
		sectionHtml: bodyHtml.slice(start, end)
	};
}

export function splitAuxeroDivBlockByMarker(bodyHtml: string, marker: string) {
	return splitAuxeroElementBlockByMarker(bodyHtml, marker, 'div');
}

export function renderAuxeroPageSlot(
	templateFile: string,
	options: AuxeroRenderOptions,
	{ marker, slotError, tagName = 'div', templateError }: AuxeroPageSlotOptions
) {
	const pageDocument = renderAuxeroPageDocument(templateFile, options, templateError);
	const slot = splitAuxeroElementBlockByMarker(pageDocument.bodyHtml, marker, tagName);

	if (!slot) {
		error(500, slotError);
	}

	return { pageDocument, slot };
}
