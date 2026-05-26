import type { AuxeroPageDocument } from '$lib/auxero/page-document';

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
