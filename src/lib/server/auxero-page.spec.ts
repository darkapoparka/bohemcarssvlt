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

	it('can split the New Vehicles carousel before the brand strip slot', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- New Vehicles -->',
			'<!-- /New Vehicles -->'
		);

		expect(split?.beforeHtml).toContain('Browse, Compare, Drive');
		expect(split?.sectionHtml).toContain('new Bohemcars vehicles');
		expect(split?.sectionHtml).toContain('swiper-card-5');
		expect(split?.sectionHtml).toContain('pagination-swiper-card-5');
		expect(split?.afterHtml).toContain('<!-- Explore Our Brands -->');
	});

	it('can split the Home 05 hero/search block before New Vehicles', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- page-title -->',
			'<!-- page-title -->'
		);

		expect(split?.beforeHtml).toContain('header-style-4');
		expect(split?.sectionHtml).toContain('page-title-style-4');
		expect(split?.sectionHtml).toContain('page-title--slider');
		expect(split?.sectionHtml).toContain('search-cars__filters');
		expect(split?.afterHtml).toContain('<!-- New Vehicles -->');
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

	it('can split the compare section after the type gallery slot', () => {
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
		const compareSplit = splitAuxeroBodySection(
			typeSplit!.afterHtml,
			'<!-- Compare Top Rated Vehicles -->',
			'<!-- /Compare Top Rated Vehicles -->'
		);

		expect(compareSplit?.sectionHtml).toContain('Compare Top Rated Vehicles');
		expect(compareSplit?.sectionHtml).toContain('card-box-style-4');
		expect(compareSplit?.afterHtml).toContain('<!-- Used Cars by Budget -->');
	});

	it('can split the budget section after the compare slot', () => {
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
		const compareSplit = splitAuxeroBodySection(
			typeSplit!.afterHtml,
			'<!-- Compare Top Rated Vehicles -->',
			'<!-- /Compare Top Rated Vehicles -->'
		);
		const budgetSplit = splitAuxeroBodySection(
			compareSplit!.afterHtml,
			'<!-- Used Cars by Budget -->',
			'<!-- /Used Cars by Budget -->'
		);

		expect(budgetSplit?.sectionHtml).toContain('Bohemcars by Budget');
		expect(budgetSplit?.sectionHtml).toContain('grid grid-cols-3');
		expect(budgetSplit?.afterHtml).toContain('Client Reviews');
		expect(budgetSplit?.afterHtml).toContain('swiper-testimonior');
	});
});
