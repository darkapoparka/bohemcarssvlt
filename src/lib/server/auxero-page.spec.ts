import { describe, expect, it } from 'vitest';
import { renderAuxeroTemplate } from './auxero-template';
import {
	splitAuxeroBodySection,
	splitAuxeroDivBlockByMarker,
	splitAuxeroDocument,
	splitAuxeroElementBlockByMarker
} from './auxero-page';

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

	it('can split the Home 05 header before the hero handoff', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroBodySection(document.bodyHtml, '<!-- Header -->', '<!-- Header -->');

		expect(split?.beforeHtml).toContain('<div id="wrapper">');
		expect(split?.sectionHtml).toContain('header-wrapper-style-4');
		expect(split?.sectionHtml).toContain('header-style-4');
		expect(split?.sectionHtml).toContain('main-nav-wrapper');
		expect(split?.afterHtml).toContain('<!-- page-title -->');
		expect(split?.afterHtml).not.toContain('header-style-4');
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

	it('can split the reviews section after the budget slot', () => {
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
		const reviewsSplit = splitAuxeroBodySection(
			budgetSplit!.afterHtml,
			'<!-- /Client Reviews -->',
			'<!-- /Client Reviews -->'
		);

		expect(reviewsSplit?.sectionHtml).toContain('Client Reviews');
		expect(reviewsSplit?.sectionHtml).toContain('testimonior-box');
		expect(reviewsSplit?.sectionHtml).toContain('swiper-testimonior');
		expect(reviewsSplit?.afterHtml).toContain('<!-- News & Reviews -->');
	});

	it('can split the news section after the reviews slot', () => {
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
		const reviewsSplit = splitAuxeroBodySection(
			budgetSplit!.afterHtml,
			'<!-- /Client Reviews -->',
			'<!-- /Client Reviews -->'
		);
		const newsSplit = splitAuxeroBodySection(
			reviewsSplit!.afterHtml,
			'<!-- News & Reviews -->',
			'<!-- /News & Reviews -->'
		);

		expect(newsSplit?.sectionHtml).toContain('Bohemcars notes');
		expect(newsSplit?.sectionHtml).toContain('post-style-2');
		expect(newsSplit?.sectionHtml).toContain('post-style-3');
		expect(newsSplit?.afterHtml).toContain('footer');
	});

	it('can split the footer after the news slot', () => {
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
		const reviewsSplit = splitAuxeroBodySection(
			budgetSplit!.afterHtml,
			'<!-- /Client Reviews -->',
			'<!-- /Client Reviews -->'
		);
		const newsSplit = splitAuxeroBodySection(
			reviewsSplit!.afterHtml,
			'<!-- News & Reviews -->',
			'<!-- /News & Reviews -->'
		);
		const footerSplit = splitAuxeroBodySection(
			newsSplit!.afterHtml,
			'<!-- Footer -->',
			'<!-- Footer -->'
		);

		expect(footerSplit?.sectionHtml).toContain('footer-top');
		expect(footerSplit?.sectionHtml).toContain('form-footer');
		expect(footerSplit?.sectionHtml).toContain('footer-bottom-links');
		expect(footerSplit?.afterHtml).toContain('LoginModal');
	});

	it('can split the Home 05 modal stack before the script tail', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const newsSplit = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- News & Reviews -->',
			'<!-- /News & Reviews -->'
		);
		const footerSplit = splitAuxeroBodySection(
			newsSplit!.afterHtml,
			'<!-- Footer -->',
			'<!-- Footer -->'
		);
		const modalSplit = splitAuxeroBodySection(
			footerSplit!.afterHtml,
			'<!-- Modal -->',
			'<!-- /CompareModal -->'
		);

		expect(modalSplit?.sectionHtml).toContain('CardModal');
		expect(modalSplit?.sectionHtml).toContain('LoginModal');
		expect(modalSplit?.sectionHtml).toContain('SearchModal');
		expect(modalSplit?.sectionHtml).toContain('SignUpModal');
		expect(modalSplit?.sectionHtml).toContain('CompareModal');
		expect(modalSplit?.beforeHtml).toContain('</div>');
		expect(modalSplit?.beforeHtml).not.toContain('<div id="LoginModal"');
		expect(modalSplit?.afterHtml).toContain('progress-wrap');
		expect(modalSplit?.afterHtml).toContain('/assets/js/jquery.min.js');
		expect(modalSplit?.afterHtml).not.toContain('<div id="LoginModal"');
	});

	it('can split a generated inventory content div without dropping toolbar or filter markup', () => {
		const html = renderAuxeroTemplate('listing-grid3-columns.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'bohemcars-inventory-content');

		expect(split?.beforeHtml).toContain('bohemcars-inventory-toolbar-row');
		expect(split?.sectionHtml).toContain('content-tab bohemcars-inventory-content');
		expect(split?.sectionHtml).toContain('card-box-style-1');
		expect(split?.afterHtml).toContain('filter-sidebar');
		expect(split?.afterHtml).not.toContain('content-tab bohemcars-inventory-content');
	});

	it('can split the generated Listing Details 3 vehicle block without dropping related vehicles', () => {
		const html = renderAuxeroTemplate('listing-details-3.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-bohemcars-detail="true"');

		expect(split?.beforeHtml).toContain('swiper-listing-details-navigation');
		expect(split?.sectionHtml).toContain('listing-details--content');
		expect(split?.sectionHtml).toContain('listing-details--sidebar');
		expect(split?.afterHtml).toContain('You might also like');
		expect(split?.afterHtml).not.toContain('data-bohemcars-detail="true"');
	});

	it('can split the generated compare table without dropping Auxero page chrome', () => {
		const html = renderAuxeroTemplate('compare.html', { routePath: 'compare' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-bohemcars-compare-table',
			'table'
		);

		expect(split?.beforeHtml).toContain('Compare Bohemcars Vehicles Side-by-Side');
		expect(split?.beforeHtml).not.toContain('data-bohemcars-compare-table');
		expect(split?.sectionHtml).toContain('card-details--table');
		expect(split?.sectionHtml).toContain('data-bohemcars-compare-table');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('CompareModal');
	});

	it('can split the account compare table from saved garage state', () => {
		const html = renderAuxeroTemplate('compare.html', { routePath: 'account/compare' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-bohemcars-compare-table',
			'table'
		);

		expect(split?.beforeHtml).toContain('Compare Bohemcars Vehicles Side-by-Side');
		expect(split?.sectionHtml).toContain('data-bohemcars-compare-table');
		expect(split?.sectionHtml).toContain('data-bohemcars-compare-column');
		expect(split?.afterHtml).toContain('CompareModal');
	});

	it('can split the generated account favorites grid without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('my-favorites.html', { routePath: 'account/favorites' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-bohemcars-favorites-grid');

		expect(split?.beforeHtml).toContain('My Favorites');
		expect(split?.beforeHtml).toContain('dashboard-menu-item active');
		expect(split?.sectionHtml).toContain('data-bohemcars-favorites-grid');
		expect(split?.sectionHtml).toContain('card-box-style-1');
		expect(split?.afterHtml).toContain('pagination justify-center');
		expect(split?.afterHtml).toContain('CardModal');
		expect(split?.afterHtml).toContain('renderAccountFavorites');
	});

	it('can split the public agents grid without dropping page chrome', () => {
		const html = renderAuxeroTemplate('sale-agents.html', { routePath: 'agents' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(
			document.bodyHtml,
			'data-bohemcars-agent-management="false"'
		);

		expect(split?.beforeHtml).toContain('Bohemcars Consultants');
		expect(split?.sectionHtml).toContain('bohemcars-agent-grid');
		expect(split?.sectionHtml).toContain('sale-agent-box');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the agent detail main content without dropping sidebar or footer chrome', () => {
		const html = renderAuxeroTemplate('sale-agents-details.html', {
			routePath: 'agents/bohemcars-import'
		});
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(
			document.bodyHtml,
			'class="innerpage__content md-mb-30"'
		);

		expect(split?.beforeHtml).toContain('Bohemcars Consultants');
		expect(split?.sectionHtml).toContain('Bohemcars Import');
		expect(split?.sectionHtml).toContain('Verified Bohemcars Consultant');
		expect(split?.sectionHtml).toContain('bohemcars-agent-inventory');
		expect(split?.afterHtml).toContain('send-inquiry');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the contact form card without dropping map, info, or footer chrome', () => {
		const html = renderAuxeroTemplate('contact-us.html', { routePath: 'contact' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'contact-page-form');

		expect(split?.beforeHtml).toContain('widget-gg-map');
		expect(split?.beforeHtml).toContain('contact-page-info');
		expect(split?.sectionHtml).toContain('bohemcars-contact-form');
		expect(split?.sectionHtml).toContain('Send Message');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the services form card without dropping service sections or footer chrome', () => {
		const html = renderAuxeroTemplate('services-center.html', { routePath: 'services' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'services-center-form');

		expect(split?.beforeHtml).toContain('Bohemcars Services Center');
		expect(split?.beforeHtml).toContain('Featured Services');
		expect(split?.beforeHtml).toContain('services-center-info');
		expect(split?.sectionHtml).toContain('bohemcars-service-form');
		expect(split?.sectionHtml).toContain('Schedule Service');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the sell-your-car intake form without dropping tabs or follow-up sections', () => {
		const html = renderAuxeroTemplate('sell-your-car.html', { routePath: 'sell-your-car' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(document.bodyHtml, 'bohemcars-sell-form', 'form');

		expect(split?.beforeHtml).toContain('Sell Your Car With Bohemcars');
		expect(split?.beforeHtml).toContain('menu-tab-style7');
		expect(split?.sectionHtml).toContain('calculate-form bohemcars-sell-form');
		expect(split?.sectionHtml).toContain('Request Review');
		expect(split?.afterHtml).toContain('How It Works');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the reviews grid without dropping pagination or footer chrome', () => {
		const html = renderAuxeroTemplate('clients-reviews.html', { routePath: 'reviews' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-bohemcars-reviews-grid',
			'div'
		);

		expect(split?.beforeHtml).toContain('Client Reviews');
		expect(split?.sectionHtml).toContain('testimonior-box');
		expect(split?.sectionHtml).toContain('Aleksandar Vytev');
		expect(split?.afterHtml).toContain('pagination__link active');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the calculator estimator without dropping budget or FAQ sections', () => {
		const html = renderAuxeroTemplate('calculator.html', { routePath: 'calculator' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-bohemcars-calculator',
			'div'
		);

		expect(split?.beforeHtml).toContain('Import Cost Calculator');
		expect(split?.sectionHtml).toContain('Calculate Estimated Landed Cost');
		expect(split?.sectionHtml).toContain('data-bohemcars-calc-output="total"');
		expect(split?.afterHtml).toContain('Browse By Budget');
		expect(split?.afterHtml).toContain('Calculator FAQ');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the terms content without dropping the page shell', () => {
		const html = renderAuxeroTemplate('terms.html', { routePath: 'terms' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(document.bodyHtml, 'data-bohemcars-terms', 'div');

		expect(split?.beforeHtml).toContain('Bohemcars Terms Of Use');
		expect(split?.sectionHtml).toContain('term-page--nav');
		expect(split?.sectionHtml).toContain('1. Vehicle Information');
		expect(split?.sectionHtml).toContain('6. Contact And Data');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the blog listing grid without dropping pagination or footer chrome', () => {
		const html = renderAuxeroTemplate('blog-grid-style-1.html', { routePath: 'blog' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-bohemcars-blog-grid',
			'div'
		);

		expect(split?.beforeHtml).toContain('Bohemcars Blog');
		expect(split?.sectionHtml).toContain('post-style-6');
		expect(split?.sectionHtml).toContain(
			'What Bohemcars Checks Before Importing A Vehicle From Canada'
		);
		expect(split?.afterHtml).toContain('pagination__link active');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});
});
