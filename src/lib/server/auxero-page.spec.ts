import { describe, expect, it } from 'vitest';
import { renderAuxeroTemplate } from './auxero-template';
import { splitAuxeroBodySection, splitAuxeroDocument } from './auxero-page';

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

	it('splits a marked Home 05 section without dropping surrounding body markup', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- Explore Our Brands -->',
			'<!-- /Explore Our Brands -->'
		);

		expect(split?.beforeHtml).toContain('<!-- /New Vehicles -->');
		expect(split?.sectionHtml).toContain('Explore Our Brands');
		expect(split?.sectionHtml).toContain('out-brand-2');
		expect(split?.afterHtml).toContain('<!-- Browse By Type -->');
	});

	it('can split the Browse By Type gallery after the brand strip slot', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const brandSplit = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- Explore Our Brands -->',
			'<!-- /Explore Our Brands -->'
		);
		const typeSplit = splitAuxeroBodySection(
			brandSplit!.afterHtml,
			'<!-- Browse By Type -->',
			'<!-- /Browse By Type -->'
		);

		expect(typeSplit?.sectionHtml).toContain('Browse By Type');
		expect(typeSplit?.sectionHtml).toContain('card-37.jpg');
		expect(typeSplit?.afterHtml).toContain('<!-- Compare Top Rated Vehicles -->');
	});
});
