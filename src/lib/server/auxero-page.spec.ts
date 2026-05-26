import { describe, expect, it } from 'vitest';
import { renderAuxeroTemplate } from './auxero-template';
import { splitAuxeroDocument } from './auxero-page';

describe('splitAuxeroDocument', () => {
	it('extracts the Home 05 head, body class, and body markup for Svelte pages', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);

		expect(document.headHtml).toContain('/assets/app.css');
		expect(document.bodyClass).toContain('auxero-template-home-05-html');
		expect(document.bodyHtml).toContain('Browse, Compare, Drive');
		expect(document.bodyHtml).toContain('search-cars__search');
		expect(document.bodyHtml).not.toContain('<body');
	});
});
