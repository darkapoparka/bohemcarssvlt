import { expect, test, type Locator, type Page } from '@playwright/test';

async function cssValue(locator: Locator, property: string) {
	return locator.evaluate((node, prop) => getComputedStyle(node).getPropertyValue(prop), property);
}

async function boxRatio(locator: Locator) {
	const box = await locator.boundingBox();
	if (!box) throw new Error('Expected element to have a box');

	return Number((box.width / box.height).toFixed(2));
}

const expectBohemcarsShell = async (page: Page) => {
	await expect(page.locator('body')).toContainText('Bohemcars');
	await expect(page.locator('body')).not.toContainText('Aurexo');
	await expect(page.locator('body')).not.toContainText('ThemeForest');
	await expect(page.locator('body')).not.toContainText('Search Cars Near You');
};

const visibleAuxeroModalIds = async (page: Page) => {
	try {
		return await page.evaluate(() => {
			const modalIds = [
				'CardModal',
				'LoginModal',
				'ForgotPasswordModal',
				'SignUpModal',
				'CompareModal',
				'SearchModal'
			];

			return modalIds.filter((id) => {
				const element = document.getElementById(id);
				if (!element) return false;

				const style = getComputedStyle(element);
				const rect = element.getBoundingClientRect();

				return (
					style.display !== 'none' &&
					style.visibility !== 'hidden' &&
					Number(style.opacity || '1') > 0.01 &&
					rect.width > 0 &&
					rect.height > 0
				);
			});
		});
	} catch (error) {
		if (String(error).includes('Execution context was destroyed')) {
			return [];
		}

		throw error;
	}
};

const visiblePreloadSamplesDuring = async (page: Page, action: () => Promise<void>) => {
	await page.evaluate(() => {
		type Sample = { className: string; height: number; width: number };
		const state = window as Window & { __bohemcarsVisiblePreloads?: Sample[] };
		const visible = (element: Element) => {
			const style = getComputedStyle(element);
			const rect = element.getBoundingClientRect();

			return (
				style.display !== 'none' &&
				style.visibility !== 'hidden' &&
				Number(style.opacity || '1') > 0.01 &&
				rect.width > 0 &&
				rect.height > 0
			);
		};

		state.__bohemcarsVisiblePreloads = [];
		let framesRemaining = 24;
		const sample = () => {
			for (const element of document.querySelectorAll('.preload')) {
				if (!visible(element)) continue;

				const rect = element.getBoundingClientRect();
				state.__bohemcarsVisiblePreloads?.push({
					className: String(element.className),
					height: Math.round(rect.height),
					width: Math.round(rect.width)
				});
			}

			framesRemaining -= 1;
			if (framesRemaining > 0) requestAnimationFrame(sample);
		};

		requestAnimationFrame(sample);
	});

	await action();
	await page.waitForTimeout(400);

	return page.evaluate(
		() =>
			(window as Window & { __bohemcarsVisiblePreloads?: unknown[] }).__bohemcarsVisiblePreloads ??
			[]
	);
};

const expectDesktopInventorySurface = async (page: Page) => {
	await expect(page.locator('.bohemcars-inventory-banner')).toBeVisible();
	await expect(
		page.locator('.bohemcars-inventory-banner .bohemcars-inventory-searchbar')
	).toBeVisible();
	await expect(page.locator('.page-title h1, .page-title-style-4 h1')).toHaveCount(0);

	const metrics = await page.evaluate(() => {
		const rect = (selector: string) => {
			const element = document.querySelector(selector);
			const box = element?.getBoundingClientRect();

			return box
				? {
						bottom: Math.round(box.bottom),
						height: Math.round(box.height),
						top: Math.round(box.top),
						width: Math.round(box.width)
					}
				: undefined;
		};
		const style = (selector: string, property: string) => {
			const element = document.querySelector(selector);

			return element ? getComputedStyle(element).getPropertyValue(property) : undefined;
		};

		return {
			banner: rect('.bohemcars-inventory-banner'),
			heroControls: document.querySelectorAll(
				'.bohemcars-inventory-banner .bohemcars-view-toggle, .bohemcars-inventory-banner .bohemcars-inventory-filter-grid, .bohemcars-inventory-banner .bohemcars-inventory-toolbar-row'
			).length,
			hiddenTitle: rect('.bohemcars-inventory-banner h1.bohemcars-sr-only'),
			searchPrimary: rect('.bohemcars-inventory-searchbar__primary'),
			searchPrimaryDisplay: style('.bohemcars-inventory-searchbar__primary', 'display'),
			searchSubmit: rect('.bohemcars-inventory-searchbar__submit'),
			searchSubmitBackground: style('.bohemcars-inventory-searchbar__submit', 'background-color'),
			searchbar: rect('.bohemcars-inventory-banner .bohemcars-inventory-searchbar')
		};
	});

	expect(metrics.banner?.height ?? 0).toBeGreaterThanOrEqual(250);
	expect(metrics.banner?.height ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(460);
	expect(metrics.hiddenTitle?.height ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(2);
	expect(metrics.hiddenTitle?.width ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(2);
	expect(metrics.searchbar?.height ?? 0).toBeGreaterThanOrEqual(40);
	expect(metrics.searchPrimaryDisplay).toBe('grid');
	expect(metrics.searchSubmitBackground).toBe('rgb(28, 28, 28)');
	expect(metrics.searchSubmit?.top ?? -1).toBeGreaterThanOrEqual(metrics.searchPrimary?.top ?? 0);
	expect(metrics.searchSubmit?.bottom ?? 0).toBeLessThanOrEqual(
		(metrics.searchPrimary?.bottom ?? 0) + 1
	);
	expect(metrics.searchbar?.top ?? -1).toBeGreaterThanOrEqual(metrics.banner?.top ?? 0);
	expect(metrics.searchbar?.bottom ?? 0).toBeLessThanOrEqual((metrics.banner?.bottom ?? 0) + 1);
	expect(metrics.heroControls).toBeGreaterThanOrEqual(2);
};

const desktopHeaderRhythm = async (page: Page, path: string) => {
	await page.goto(path);
	await expect(page.locator('.header-wrapper-style-4 #main-nav')).toBeVisible();

	return page.evaluate(() => {
		const rect = (selector: string) => {
			const element = document.querySelector(selector);
			if (!element) throw new Error(`Missing selector: ${selector}`);

			const box = element.getBoundingClientRect();
			return {
				height: Math.round(box.height),
				left: Math.round(box.left),
				right: Math.round(box.right),
				width: Math.round(box.width)
			};
		};
		const logo = rect('.header-wrapper-style-4 .logo img');
		const nav = rect('.header-wrapper-style-4 #main-nav');
		const login = rect('.header-wrapper-style-4 .header-button');

		return {
			logo,
			nav,
			navToLoginGap: login.left - nav.right,
			navToLogoGap: nav.left - logo.right
		};
	});
};

test('homepage preserves Home 05 and routes hero search to inventory', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('.page-title-style-4')).toBeVisible();
	await expect(page.locator('h1.bohemcars-hero-accessible-title')).toContainText(
		'Разгледай, сравни и избери с Bohemcars!'
	);
	await expect(page.locator('.sw-single-thumb .search-cars__title').first()).toContainText(
		'Купи автомобил'
	);
	await expect(page.locator('body')).toContainText('Проверени автомобили с ясна история');
	await expect(page.locator('.search-cars__search')).toContainText('Покажи 42 автомобила');
	await expectBohemcarsShell(page);
	const homeHeader = page.locator('.header-wrapper-style-4 .header-style-4');
	await expect(homeHeader).toHaveCount(1);
	await expect(homeHeader).toHaveClass(/bg-white/);
	await expect(homeHeader).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	await expect(homeHeader.locator('.header-top-bar')).toBeVisible();
	await expect(homeHeader.locator('#menu-primary-menu')).not.toHaveClass(/style-2/);
	await expect(homeHeader.locator('#menu-primary-menu > .menu-item')).toHaveCount(5);
	await expect(homeHeader.locator('#menu-primary-menu > .menu-item > a')).toHaveText([
		'Начало',
		'Автомобили',
		'Услуги',
		'За нас',
		'Контакти'
	]);
	await expect(homeHeader.locator('#menu-primary-menu > .current-menu-item')).toContainText(
		'Начало'
	);
	await expect(homeHeader.locator('#menu-primary-menu > .menu-item > a').first()).toHaveCSS(
		'color',
		'rgb(28, 28, 28)'
	);
	await expect(homeHeader.locator('.header-right.main-nav-wrapper')).toHaveCSS('display', 'flex');
	await expect(homeHeader.locator('.logo img')).toHaveAttribute('alt', 'Bohemcars');
	await expect(homeHeader.locator('.logo img')).toHaveAttribute(
		'src',
		/bohemcars-logo-concept-light-template-clean/
	);
	const homeHeaderLogoBox = await homeHeader.locator('.logo img').boundingBox();
	expect(homeHeaderLogoBox?.height ?? 0).toBeGreaterThan(30);
	expect(homeHeaderLogoBox?.height ?? 0).toBeLessThanOrEqual(58);
	const inventoryNavItem = homeHeader.locator('#menu-primary-menu > .menu-item').nth(1);
	await expect(inventoryNavItem.locator('a').first()).toContainText('Автомобили');
	await expect(inventoryNavItem).toHaveClass(/menu-item-has-children/);
	await expect(inventoryNavItem).toHaveClass(/menu-item--static/);
	await inventoryNavItem.hover();
	const inventoryMegaMenu = inventoryNavItem.locator('.sub-menu--listing');
	await expect(inventoryMegaMenu).toBeVisible();
	await expect(inventoryMegaMenu.locator('.sub-menu-item-listing')).toHaveCount(4);
	await expect(inventoryMegaMenu.locator('.bohemcars-mega-car')).toHaveCount(4);
	await expect(inventoryMegaMenu).toContainText('Виж всички автомобили');
	await expect(inventoryMegaMenu).toContainText('Бензин');
	await expect(inventoryMegaMenu).toContainText('Внос и покупка');
	await expect(inventoryMegaMenu.locator('.bohemcars-mega__footer .btn')).toHaveAttribute(
		'href',
		/^\.?\/inventory$/
	);
	const inventoryMegaMenuBox = await inventoryMegaMenu.boundingBox();
	expect(inventoryMegaMenuBox).not.toBeNull();
	await expect(inventoryMegaMenu.locator('.bohemcars-mega-car img').first()).toHaveAttribute(
		'src',
		/\/assets\/bohemcars\/megamenu\/inventory-bmw-x5-cutout\.webp$/
	);
	const servicesNavItem = homeHeader.locator('#menu-primary-menu > .menu-item').nth(2);
	await expect(servicesNavItem).toHaveClass(/menu-item-has-children/);
	await expect(servicesNavItem).not.toHaveClass(/menu-item--static/);
	await servicesNavItem.hover();
	const servicesMegaMenu = servicesNavItem.locator('.sub-menu--container');
	await expect(servicesMegaMenu).toBeVisible();
	await expect(servicesMegaMenu).toContainText('Услуги');
	await expect(servicesMegaMenu).toContainText('Продай автомобила си');
	await expect(servicesMegaMenu).toContainText('Сравни автомобили');
	await expect(
		servicesMegaMenu.getByRole('link', { name: 'Продай автомобила си' })
	).toHaveAttribute('href', /^\.?\/sell-your-car$/);
	const servicesMegaMenuBox = await servicesMegaMenu.boundingBox();
	expect(servicesMegaMenuBox).not.toBeNull();
	expect(
		Math.abs((inventoryMegaMenuBox?.y ?? 0) - (servicesMegaMenuBox?.y ?? 0))
	).toBeLessThanOrEqual(10);
	const aboutNavItem = homeHeader.locator('#menu-primary-menu > .menu-item').nth(3);
	await expect(aboutNavItem).toHaveClass(/menu-item-has-children/);
	await aboutNavItem.hover();
	const aboutMegaMenu = aboutNavItem.locator('.sub-menu--container');
	await expect(aboutMegaMenu).toBeVisible();
	await expect(aboutMegaMenu).toContainText('Нашите консултанти');
	await expect(aboutMegaMenu).toContainText('Отзиви от клиенти');
	await expect(aboutMegaMenu.getByRole('link', { name: 'За нас' })).toHaveAttribute(
		'href',
		/^\.?\/about$/
	);
	await expect(homeHeader.locator('#searchToggle')).toBeVisible();
	await expect(homeHeader.locator('.header-action-icon[aria-label="Сравни"]')).toHaveAttribute(
		'href',
		/^\.?\/compare$/
	);
	await expect(homeHeader.locator('.header-action-icon[aria-label="Любими"]')).toHaveAttribute(
		'href',
		/^\.?\/account\/favorites$/
	);
	const homeSignIn = homeHeader
		.locator('.mobile-hidden-header-button .bg-sign-in.open-modal')
		.first();
	await expect(homeSignIn).toBeVisible();
	await expect(homeSignIn).toHaveClass(/btn-primary-3/);
	await expect(homeSignIn).toHaveCSS('background-color', 'rgb(152, 188, 42)');
	await expect(homeSignIn).toHaveCSS('border-color', 'rgb(152, 188, 42)');
	await expect(homeSignIn).toHaveCSS('color', 'rgb(255, 255, 255)');
	await expect(homeSignIn.locator('svg path').first()).toHaveCSS('stroke', 'rgb(255, 255, 255)');
	await expect(homeHeader.locator('#searchToggle svg path').first()).toHaveCSS(
		'stroke',
		'rgb(28, 28, 28)'
	);
	await expect(page.getByRole('link', { name: 'Add Listing' })).toHaveCount(0);
	const homeHero = page.locator('.page-title-style-4');
	await expect(homeHero.locator('.swiper-btn.navigation-prev')).toHaveCount(0);
	await expect(homeHero.locator('.swiper-btn.navigation-next')).toHaveCount(0);
	await expect(homeHero.locator('.page-title--slider.sw-single')).toBeVisible();
	await expect(homeHero.locator('.sw-single-thumb .search-cars__title')).toHaveCount(3);
	await expect(homeHero.locator('.menu-tab-style1 li')).toHaveCount(3);
	await expect(homeHero.locator('.search-cars__filters > .hfp')).toHaveCount(4);
	await expect(homeHero.locator('#filterToggle')).toHaveCount(0);
	await expect(page.locator('#bohemcars-desktop-search-panel')).toHaveCount(0);
	await expect(homeHero.locator('.search-cars__advanced .search-cars__select-wrapper')).toHaveCount(
		3
	);
	await expect(homeHero.locator('.search-cars__features-grid .form-group')).toHaveCount(8);
	const homeActionBand = page.locator('.bohemcars-action-band');
	const homeFeaturedSection = page.locator('[data-bohemcars-home-vehicles]');
	await expect(homeActionBand.locator('.bohemcars-action-card')).toHaveCount(2);
	await expect(homeActionBand.locator('.bohemcars-action-card__img')).toHaveCount(2);
	await expect(homeActionBand.locator('a.bohemcars-action-card--import')).toHaveAttribute(
		'href',
		/^\.?\/services$/
	);
	const consultationActionCard = homeActionBand.locator('a.bohemcars-action-card--consultation');
	await expect(consultationActionCard).toHaveAttribute('href', /^\.?\/contact$/);
	await expect(consultationActionCard).toContainText('Запази консултация');
	const heroBox = await homeHero.boundingBox();
	const actionBandBox = await homeActionBand.boundingBox();
	const featuredSectionBox = await homeFeaturedSection.boundingBox();
	expect(actionBandBox?.y ?? 0).toBeGreaterThan(heroBox?.y ?? 0);
	expect(featuredSectionBox?.y ?? 0).toBeGreaterThan(actionBandBox?.y ?? 0);
	await expect(homeFeaturedSection.locator('h2 .bohemcars-title-desktop')).toHaveText(
		'Най-нови автомобили'
	);
	await expect(homeFeaturedSection).not.toContainText('Актуална наличност');
	await expect(homeFeaturedSection).not.toContainText('Подбрани автомобили с проверен произход');
	await expect(homeFeaturedSection.locator('.bohemcars-newest-shell')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-newest-shell')).toHaveCSS(
		'border-top-width',
		'0px'
	);
	await expect(homeFeaturedSection.locator('.bohemcars-newest-shell')).toHaveCSS(
		'background-color',
		'rgba(0, 0, 0, 0)'
	);
	await expect(homeFeaturedSection.locator('.bohemcars-newest-banner')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-newest-banner__media')).toHaveCount(0);
	await expect(homeFeaturedSection.locator('.bohemcars-newest-band')).toHaveCount(0);
	await expect(homeFeaturedSection.locator('.bohemcars-newest-banner__car')).toHaveCount(0);
	await expect(
		homeFeaturedSection.locator('.bohemcars-newest-banner .bohemcars-quick-filter-shell')
	).toHaveCount(1);
	await expect(
		homeFeaturedSection.locator('.bohemcars-newest-controls .bohemcars-quick-filter-shell')
	).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-newest-controls')).toHaveCSS(
		'background-color',
		'rgba(255, 255, 255, 0.08)'
	);
	const newestControlsBox = await homeFeaturedSection
		.locator('.bohemcars-newest-controls')
		.boundingBox();
	const newestQuickFilterBox = await homeFeaturedSection
		.locator('.bohemcars-quick-filter-shell')
		.boundingBox();
	expect(newestQuickFilterBox?.width ?? 0).toBeGreaterThanOrEqual(
		(newestControlsBox?.width ?? 0) - 26
	);
	const featuredCta = homeFeaturedSection.locator(
		'.bohemcars-newest-heading .bohemcars-section-cta'
	);
	await expect(featuredCta).toContainText('Виж всички');
	await expect(featuredCta).toHaveClass(/btn-primary-3/);
	await expect(featuredCta).toHaveAttribute('href', /^\.?\/inventory$/);
	await expect(featuredCta.locator('.bohemcars-section-cta__arrow')).toContainText('→');
	await featuredCta.hover();
	await expect(featuredCta).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	await expect(featuredCta).toHaveCSS('color', 'rgb(20, 33, 15)');
	await expect(featuredCta).toHaveCSS('transform', 'none');
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pill')).toHaveCount(8);
	await expect(homeFeaturedSection.locator('.bohemcars-price-pill')).toHaveCount(3);
	await expect(
		homeFeaturedSection.locator('.bohemcars-quick-pill.bohemcars-type-pill')
	).toHaveCount(4);
	await expect(
		homeFeaturedSection.locator('.bohemcars-quick-pill.bohemcars-spec-pill')
	).toHaveCount(1);
	await expect(
		homeFeaturedSection.locator('.bohemcars-quick-pill.bohemcars-brand-pill')
	).toHaveCount(3);
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pill.active')).toContainText('SUV');
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pill.active')).toHaveCSS(
		'background-color',
		'rgb(217, 242, 117)'
	);
	const sedanQuickPill = homeFeaturedSection.locator('.bohemcars-vehicle-pill', {
		hasText: 'Седан'
	});
	await sedanQuickPill.hover();
	await expect(sedanQuickPill).toHaveCSS('background-color', 'rgb(217, 242, 117)');
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pills')).toContainText('4x4');
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pills')).not.toContainText(
		'Автомат'
	);
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pills')).not.toContainText('Бензин');
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pills')).not.toContainText('2021+');
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pills')).not.toContainText(
		'до 120k'
	);
	await expect(homeFeaturedSection.locator('.bohemcars-budget-pills')).toContainText('≤10 000');
	await expect(homeFeaturedSection.locator('.bohemcars-budget-pills')).toContainText('≤20 000');
	await expect(homeFeaturedSection.locator('.bohemcars-budget-pills')).toContainText('≤30 000');
	await expect(homeFeaturedSection.locator('.bohemcars-price-pill a').first()).toHaveAttribute(
		'href',
		/^\.?\/inventory\?maxPrice=10000$/
	);
	const clippedFeaturedPills = await homeFeaturedSection
		.locator('.bohemcars-filter-pill a')
		.evaluateAll((links) =>
			links
				.map((link) => ({
					text: link.textContent?.replace(/\s+/g, ' ').trim() ?? '',
					clientWidth: link.clientWidth,
					scrollWidth: link.scrollWidth
				}))
				.filter((link) => link.scrollWidth > link.clientWidth + 1)
		);
	expect(clippedFeaturedPills).toEqual([]);
	await expect(homeFeaturedSection).toContainText('BMW');
	await expect(homeFeaturedSection).toContainText('Audi');
	await expect(homeFeaturedSection).toContainText('Mercedes');
	await expect(homeFeaturedSection.locator('.bohemcars-type-icon')).toHaveCount(4);
	await expect(homeFeaturedSection.locator('.bohemcars-type-icon--suv')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-type-icon--sedan')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-type-icon--coupe')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-type-icon--luxury')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-pill-image--spec')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-pill-image--brand')).toHaveCount(3);
	const featuredPillRows = await homeFeaturedSection
		.locator('.bohemcars-vehicle-pill')
		.evaluateAll(
			(pills) => new Set(pills.map((pill) => Math.round(pill.getBoundingClientRect().top))).size
		);
	expect(featuredPillRows).toBeGreaterThanOrEqual(1);
	expect(featuredPillRows).toBeLessThanOrEqual(2);
	const featuredGrid = homeFeaturedSection.locator('.bohemcars-home-vehicle-grid');
	await expect(featuredGrid).toBeVisible();
	await expect(
		homeFeaturedSection.locator('.bohemcars-newest-shell .bohemcars-home-vehicle-grid')
	).toBeVisible();
	await expect(featuredGrid).toHaveClass(/grid-cols-4/);
	await expect(featuredGrid.locator('.card-box-style-1')).toHaveCount(8);
	await expect(homeFeaturedSection.locator('ul.tag.style2')).toHaveCount(0);
	await expect(homeFeaturedSection.locator('.pagination-swiper-card-5')).toHaveCount(0);
	const featuredCard = homeFeaturedSection.locator('.card-box-style-1').first();
	await featuredCard.hover();
	await expect(featuredCard).toHaveCSS('background-color', 'rgb(228, 234, 223)');
	await expect(featuredCard.locator('.content')).toHaveCSS(
		'background-color',
		'rgb(228, 234, 223)'
	);
	await expect(featuredCard.locator('.card--img')).toHaveCSS('transform', 'none');
	await expect(featuredCard.locator('.top .highlight')).toHaveText(/km$/);
	await expect(featuredCard.locator('.bottom .category a')).toHaveCSS(
		'text-decoration-line',
		'none'
	);
	const featuredSpecs = featuredCard.locator('.bohemcars-card-specs');
	await expect(featuredSpecs.locator('li')).toHaveCount(3);
	const featuredMileageText = await featuredCard.locator('.top .highlight').innerText();
	await expect(featuredSpecs).not.toContainText(featuredMileageText);
	const featuredSpecRows = await featuredSpecs
		.locator('li')
		.evaluateAll(
			(items) => new Set(items.map((item) => Math.round(item.getBoundingClientRect().top))).size
		);
	expect(featuredSpecRows).toBeGreaterThanOrEqual(1);
	expect(featuredSpecRows).toBeLessThanOrEqual(2);
	await expect(featuredCard.locator('.bohemcars-card-price__amount')).toHaveCSS(
		'font-size',
		'22px'
	);
	await expect(featuredCard.locator('.bohemcars-card-price__amount')).toHaveCSS(
		'font-weight',
		'600'
	);
	await expect(featuredCard.locator('.bohemcars-card-price__amount')).toHaveCSS(
		'background-color',
		'rgba(0, 0, 0, 0)'
	);
	await expect(featuredCard.locator('.card-box__price')).toHaveCSS('color', 'rgb(23, 26, 21)');
	await expect(featuredCard.locator('.bohemcars-card-price__finance')).toBeVisible();
	const featuredMonthlyBox = await featuredCard
		.locator('.bohemcars-card-price__monthly')
		.boundingBox();
	const featuredFinanceBox = await featuredCard
		.locator('.bohemcars-card-price__finance-link')
		.boundingBox();
	expect(featuredFinanceBox?.y ?? 0).toBeGreaterThan(featuredMonthlyBox?.y ?? 0);
	await page.mouse.move(0, 0);
	await expect(featuredGrid.locator('.compare-details')).toHaveCount(0);
	await expect(featuredGrid.locator('.view-details')).toHaveCount(0);
	await expect(featuredGrid.locator('.bohemcars-card-actions')).toHaveCount(0);
	const hybridFeaturedCard = featuredGrid
		.locator('[data-bohemcars-slug]')
		.filter({ hasText: 'BMW X3 30e xDrive' })
		.first();
	await expect(hybridFeaturedCard.locator('.bohemcars-card-specs')).toContainText('Хибрид');
	await expect(hybridFeaturedCard.locator('.bohemcars-card-specs')).not.toContainText('Plug-in');
	const featuredColumnCount = await featuredGrid.evaluate(
		(grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length
	);
	expect(featuredColumnCount).toBe(4);
	const homeBrowseSection = page.locator('.bohemcars-browse-section');
	await expect(homeBrowseSection).toHaveCSS('background-color', 'rgb(251, 252, 250)');
	const browseSurface = homeBrowseSection.locator('.bohemcars-browse-section__surface');
	await expect(browseSurface).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
	await expect(browseSurface).toHaveCSS('border-top-width', '0px');
	await expect(browseSurface).toHaveCSS('box-shadow', 'none');
	await expect(browseSurface).toHaveCSS('border-top-left-radius', '0px');
	const homeBrandSection = homeBrowseSection.locator('.bohemcars-brand-strip');
	const brandBanner = homeBrandSection.locator('.bohemcars-section-banner--brand');
	await expect(brandBanner).toHaveCount(1);
	await expect(brandBanner).toHaveCSS('background-image', /linear-gradient/);
	await expect(brandBanner).toHaveCSS('border-top-left-radius', '8px');
	await expect(brandBanner.locator('h2')).toHaveCSS('color', 'rgb(255, 255, 255)');
	const brandCta = homeBrandSection.locator('.title-section a');
	await expect(brandCta).toContainText('Виж всички марки');
	await expect(brandCta).toHaveClass(/btn-primary-3/);
	await expect(brandCta).toHaveClass(/bohemcars-section-cta/);
	await expect(brandCta).toHaveCSS('background-color', 'rgb(152, 188, 42)');
	await expect(brandCta).toHaveCSS('color', 'rgb(20, 33, 15)');
	await expect(brandCta.locator('.bohemcars-section-cta__arrow')).toContainText('→');
	await expect(brandCta).toHaveCSS('border-radius', '12px');
	await brandCta.hover();
	await expect(brandCta).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	await expect(brandCta).toHaveCSS('color', 'rgb(20, 33, 15)');
	await expect(brandCta).toHaveCSS('transform', 'none');
	await expect(homeBrandSection.locator('.out-brand-2')).toHaveCount(12);
	await expect(page.locator('.out-brand-2')).toHaveCount(12);
	const firstBrandTile = homeBrandSection.locator('.out-brand-2').first();
	await expect(firstBrandTile).toHaveCSS('background-color', 'rgb(238, 241, 237)');
	await expect(firstBrandTile).toHaveCSS('border-top-width', '0px');
	await expect(firstBrandTile).toHaveCSS('border-top-left-radius', '8px');
	await expect(firstBrandTile).toHaveCSS('box-shadow', 'none');
	await homeBrandSection.locator('.out-brand-2').first().hover();
	await expect(firstBrandTile).toHaveCSS('background-color', 'rgb(231, 244, 198)');
	await expect(firstBrandTile).toHaveCSS('box-shadow', 'none');
	const typeGallery = homeBrowseSection.locator('.bohemcars-type-gallery');
	const typeBanner = typeGallery.locator('.bohemcars-section-banner--type');
	await expect(typeBanner).toHaveCount(1);
	await expect(typeBanner).toHaveCSS('background-image', /linear-gradient/);
	await expect(typeBanner).toHaveCSS('border-top-left-radius', '8px');
	await expect(typeBanner.locator('h2')).toHaveCSS('color', 'rgb(255, 255, 255)');
	await expect(typeGallery.locator('.brand-item-style-2')).toHaveCount(0);
	await expect(typeGallery).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
	await expect(typeGallery).toHaveCSS('border-top-width', '0px');
	await expect(typeGallery.locator('.bohemcars-type-card')).toHaveCount(8);
	await expect(typeGallery.locator('.bohemcars-type-card img')).toHaveCount(8);
	await expect(typeGallery.locator('.bohemcars-type-gallery__cta')).toHaveCSS(
		'background-color',
		'rgb(152, 188, 42)'
	);
	await expect(typeGallery.locator('.bohemcars-type-gallery__cta')).toHaveCSS(
		'color',
		'rgb(20, 33, 15)'
	);
	await expect(typeGallery.locator('.bohemcars-type-gallery__cta-arrow')).toContainText('→');
	await expect(typeGallery.locator('.bohemcars-type-gallery__cta svg')).toHaveCSS(
		'display',
		'none'
	);
	await expect(typeGallery.locator('.bohemcars-type-card').first()).toHaveCSS(
		'background-color',
		'rgb(238, 241, 237)'
	);
	const typeGalleryBox = await typeGallery.locator('.bohemcars-type-gallery__grid').boundingBox();
	const browseSurfaceBox = await browseSurface.boundingBox();
	expect(typeGalleryBox?.x).toBeGreaterThanOrEqual((browseSurfaceBox?.x ?? 0) - 1);
	expect((typeGalleryBox?.x ?? 0) + (typeGalleryBox?.width ?? 0)).toBeLessThanOrEqual(
		(browseSurfaceBox?.x ?? 0) + (browseSurfaceBox?.width ?? 0) + 1
	);
	await expect(page.locator('.bohemcars-type-card')).toHaveCount(8);
	await expect(
		homeBrowseSection.locator('img[src*="/assets/images/card/card-27.webp"]')
	).toBeVisible();
	await expect(homeActionBand).toHaveCSS('background-color', 'rgb(251, 252, 250)');
	await expect(homeActionBand.locator('.bohemcars-action-card')).toHaveCount(2);
	await expect(homeActionBand.locator('a.bohemcars-action-card--import')).toHaveAttribute(
		'href',
		/^\.?\/services$/
	);
	await expect(consultationActionCard).toHaveAttribute('href', /^\.?\/contact$/);
	const homeBudgetSection = page.locator('.bohemcars-budget-section');
	await expect(homeBudgetSection).toHaveCount(0);
	await expect(page.locator('body')).not.toContainText('Автомобили по бюджет');
	const homeReviewsSection = page.locator('section', { hasText: 'Отзиви от клиенти' });
	await expect(homeReviewsSection).toHaveCSS('background-color', 'rgb(251, 252, 250)');
	const reviewsPanel = homeReviewsSection.locator('.bohemcars-reviews-panel');
	await expect(reviewsPanel).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
	await expect(reviewsPanel).toHaveCSS('border-top-left-radius', '0px');
	const reviewsBanner = homeReviewsSection.locator('.bohemcars-reviews-banner');
	await expect(reviewsBanner).toHaveCount(1);
	await expect(reviewsBanner).toHaveCSS('background-image', /linear-gradient/);
	await expect(reviewsBanner).toHaveCSS('border-top-left-radius', '8px');
	await expect(reviewsBanner.locator('h2')).toHaveCSS('color', 'rgb(255, 255, 255)');
	await expect(homeReviewsSection.locator('.swiper-testimonior')).toBeVisible();
	await expect(homeReviewsSection.locator('.swiper-slide .testimonior-box')).toHaveCount(6);
	await expect(homeReviewsSection.locator('.swiper-slide .testimonior-box').first()).toHaveCSS(
		'background-color',
		'rgb(238, 241, 237)'
	);
	await expect(homeReviewsSection.locator('.swiper-slide .testimonior-box').first()).toHaveCSS(
		'border-top-left-radius',
		'8px'
	);
	await expect(homeReviewsSection.locator('.bohemcars-review-stars')).toHaveCount(6);
	await expect(homeReviewsSection.locator('.bohemcars-review-stars').first()).toHaveAttribute(
		'aria-label',
		'5 от 5 звезди'
	);
	await expect(homeReviewsSection.locator('.testimonior--img')).toHaveCount(6);
	await expect(homeReviewsSection.locator('.pagination-swiper-testimonior')).toHaveCount(1);
	await homeReviewsSection.locator('.testimonior-box').first().hover();
	await expect(homeReviewsSection.locator('.testimonior-box').first()).toHaveCSS(
		'transform',
		'none'
	);
	await expect(homeReviewsSection.getByRole('link', { name: 'Виж всички' })).toHaveAttribute(
		'href',
		/^\.?\/reviews$/
	);
	const homeNewsSection = page.locator('.bohemcars-news-section');
	await expect(homeNewsSection).toHaveCSS('background-color', 'rgb(251, 252, 250)');
	const newsBanner = homeNewsSection.locator('.bohemcars-news-banner');
	await expect(newsBanner).toHaveCount(1);
	await expect(newsBanner).toHaveCSS('background-image', /linear-gradient/);
	await expect(newsBanner).toHaveCSS('border-top-left-radius', '8px');
	await expect(newsBanner.locator('h2')).toHaveCSS('color', 'rgb(255, 255, 255)');
	await expect(newsBanner.locator('h2')).toContainText('Съвети от');
	await expect(newsBanner.locator('h2 span')).toHaveCSS('color', 'rgb(255, 255, 255)');
	await expect(newsBanner.locator('.bohemcars-news-banner__brand img')).toHaveAttribute(
		'alt',
		'Bohemcars'
	);
	await expect(newsBanner.locator('.bohemcars-news-banner__brand img')).toHaveAttribute(
		'src',
		/bohemcars-logo-concept-dark-template-clean/
	);
	await expect(homeNewsSection.locator('.bohemcars-news-card')).toHaveCount(3);
	await expect(homeNewsSection.locator('.bohemcars-news-card__img')).toHaveCount(3);
	await expect(
		homeNewsSection.locator('.bohemcars-news-card__meta', { hasText: 'от Bohemcars' })
	).toHaveCount(3);
	await expect(homeNewsSection.locator('.title-section a')).toHaveAttribute('href', /^\.?\/blog$/);
	const homeFooter = page.locator('footer.footer');
	await expect(homeFooter).toHaveCount(1);
	await expect(homeFooter.locator('.footer-top')).toBeVisible();
	await expect(homeFooter.locator('.form-footer #footer-email')).toBeVisible();
	await expect(homeFooter.locator('.footer-links .collapse')).toHaveCount(2);
	await expect(homeFooter.locator('.footer-links .widget-links li')).toHaveCount(14);
	await expect(homeFooter.locator('.footer-contact')).toContainText('+359 893 588 680');
	await expect(homeFooter.locator('.footer-contact')).toContainText('Пловдив');
	await expect(homeFooter.locator('.widget-socical li')).toHaveCount(3);
	await expect(homeFooter.locator('.footer-bottom-links li')).toHaveCount(3);
	await expect(homeFooter).not.toContainText('Aurexo');
	await expect(page.locator('#CardModal')).toHaveCount(1);
	await expect(page.locator('#LoginModal form')).toHaveCount(1);
	await expect(page.locator('#ForgotPasswordModal form')).toHaveCount(1);
	await expect(page.locator('#SignUpModal form')).toHaveCount(1);
	await expect(page.locator('#SearchModal .search-modal__form')).toHaveAttribute(
		'action',
		'/inventory'
	);
	await expect(page.locator('#SearchModal .search-modal__input')).toHaveAttribute('name', 'q');
	await expect(page.locator('#CompareModal')).toHaveCount(1);
	await expect(page.locator('#CompareModal .compare-item')).toHaveCount(3);
	await expect(page.locator('#LoginModal')).not.toContainText('Username:');
	await expect(page.locator('#LoginModal')).not.toContainText('Password: demo');
	await expect(page.locator('#LoginModal')).toContainText('Use your Bohemcars account credentials');
	await expect
		.poll(() =>
			page.evaluate(() => typeof (window as Window & { jQuery?: unknown; $?: unknown }).jQuery)
		)
		.toBe('function');
	await expect
		.poll(() => page.evaluate(() => document.scripts[0]?.textContent ?? ''))
		.not.toContain('</script>');
	await expect(page.locator('.search-cars, .search-form-widget').first()).toBeVisible();

	const homeLinks = await page
		.locator('a[href]')
		.evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
	expect(homeLinks).not.toContain('/shop.html');
	expect(homeLinks).not.toContain('/check-out.html');
	expect(homeLinks).not.toContain('/home-10.html');
	expect(homeLinks).not.toContain('/listing-details-6.html');

	await page.locator('.search-cars__search').click();
	await expect(page).toHaveURL(/\/inventory/);
	await expect(page.locator('.bohemcars-inventory-searchbar')).toBeVisible();
});

test('inventory header keeps the home desktop nav rhythm', async ({ page }) => {
	await page.setViewportSize({ width: 1919, height: 944 });

	const home = await desktopHeaderRhythm(page, '/');
	const inventory = await desktopHeaderRhythm(page, '/inventory?layout=classic&filters=modal');

	expect(inventory.logo.width).toBe(home.logo.width);
	expect(inventory.logo.height).toBe(home.logo.height);
	expect(inventory.navToLogoGap).toBeGreaterThan(320);
	expect(Math.abs(inventory.navToLogoGap - home.navToLogoGap)).toBeLessThanOrEqual(30);
	expect(Math.abs(inventory.navToLoginGap - home.navToLoginGap)).toBeLessThanOrEqual(30);
});

test('inventory classic controls stay compact in the desktop rail', async ({ page }) => {
	await page.setViewportSize({ width: 1273, height: 638 });
	await page.goto('/inventory?layout=classic&filters=modal');

	await expect(page.locator('.bohemcars-inventory-layout-toggle.active')).toContainText('Grid');
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Compact 5 grid'
	);

	const metrics = await page.evaluate(() => {
		const rect = (selector: string) => {
			const element = document.querySelector(selector);
			if (!element) throw new Error(`Missing selector: ${selector}`);

			const box = element.getBoundingClientRect();
			const style = getComputedStyle(element);

			return {
				backgroundColor: style.backgroundColor,
				height: Math.round(box.height),
				width: Math.round(box.width)
			};
		};
		const viewControlRows = new Set(
			Array.from(document.querySelectorAll('.bohemcars-inventory-view-controls__group')).map(
				(element) => Math.round(element.getBoundingClientRect().top)
			)
		);
		const grid = document.querySelector(
			'.bohemcars-inventory-content > .content-inner.active > div.grid'
		);
		if (!grid) throw new Error('Missing inventory grid');

		return {
			buybox: rect('.bohemcars-inventory-banner__buybox'),
			demoStrip: rect('.bohemcars-inventory-demo-strip'),
			gridColumns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
			sortButton: rect('.bohemcars-inventory-sort .core-dropdown__button'),
			viewControlRows: viewControlRows.size
		};
	});

	expect(metrics.demoStrip.height).toBeLessThanOrEqual(90);
	expect(metrics.viewControlRows).toBe(1);
	expect(metrics.sortButton.height).toBeLessThanOrEqual(44);
	expect(metrics.buybox.backgroundColor).toBe('rgb(255, 255, 255)');
	expect(metrics.gridColumns).toBe(5);
});

test('homepage hero intent routes keep desktop tab, title, and form in sync', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });

	for (const [route, tabLabel, title, formMode, buttonLabel] of [
		['/?intent=import', 'Внос', 'Внос от Канада', 'import', 'Провери линка'],
		['/?intent=sell', 'Продай', 'Продай автомобила си', 'sell', 'Заяви оценка']
	] as const) {
		await page.goto(route);

		await expect(page.locator('.bohemcars-desktop-hero')).toHaveAttribute(
			'data-bohemcars-search-form',
			formMode
		);
		await expect(page.locator('.page-title-style-4 .menu-tab-style1 li.active')).toContainText(
			tabLabel
		);
		await expect(
			page.locator('.page-title-style-4 .swiper-slide-active .search-cars__title')
		).toContainText(title);
		await expect(page.locator('.bohemcars-desktop-hero .search-cars__search')).toContainText(
			buttonLabel
		);
	}
});

test('mobile bottom navigation returns home without leaving the Auxero preloader visible', async ({
	page
}) => {
	const hydrationWarnings: string[] = [];
	page.on('console', (message) => {
		const text = message.text();

		if (
			(message.type() === 'warning' || message.type() === 'error') &&
			text.includes('Failed to hydrate')
		) {
			hydrationWarnings.push(text);
		}
	});

	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	const bottomNav = page.locator('.mobile-bottom-nav');
	await expect(bottomNav).toBeVisible();
	await expect(page.locator('body')).toHaveClass(/auxero-template-home-05-html/);
	await expect(bottomNav.getByRole('link', { name: 'Начало' })).toHaveAttribute(
		'data-sveltekit-reload',
		''
	);

	await bottomNav.getByRole('link', { name: 'Коли' }).click();
	await expect(page).toHaveURL(/\/inventory$/);
	const mobileInventoryCard = page.locator('.bohemcars-inventory-mobile-card').first();
	await expect(mobileInventoryCard).toBeVisible();
	await expect(page.locator('.bohemcars-inventory-mobile__search-field')).toHaveCSS(
		'background-color',
		'rgb(255, 255, 255)'
	);
	await expect(page.locator('.bohemcars-inventory-mobile__search-field')).toHaveCSS(
		'border-top-width',
		'0px'
	);
	await expect(page.locator('.bohemcars-inventory-mobile__search-field')).toHaveCSS(
		'border-radius',
		'999px'
	);
	await expect(page.locator('.bohemcars-inventory-mobile__tool-choice').first()).toHaveCSS(
		'background-color',
		'rgb(255, 255, 255)'
	);
	await expect(page.locator('.bohemcars-inventory-mobile__tool-choice').first()).toHaveCSS(
		'border-radius',
		'10px'
	);
	await expect(page.locator('.bohemcars-inventory-mobile')).toHaveCSS(
		'background-color',
		'rgb(238, 241, 237)'
	);
	await expect(mobileInventoryCard).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	await expect(mobileInventoryCard).toHaveCSS('border-top-width', '0px');
	expect(hydrationWarnings).toEqual([]);

	await bottomNav.getByRole('link', { name: 'Начало' }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.locator('body')).toHaveClass(/auxero-template-home-05-html/);
	await expect(page.locator('.header-wrapper-style-4 .logo img')).toBeVisible();
	await expect(page.locator('.header-wrapper-style-4 .logo-mobile')).toBeHidden();
	await expect(page.locator('.bohemcars-mobile-hero__copy h1')).toBeVisible();
	await expect(page.locator('.preload')).toBeHidden();
	expect(hydrationWarnings).toEqual([]);
});

test('mobile homepage intent tabs keep form, quick links, and drawer in sync', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	const mobileHero = page.locator('.bohemcars-mobile-home');
	const importTab = mobileHero.getByRole('tab', { name: 'Внос' });
	const mobileTopColors = await page.evaluate(() => {
		const backgroundColor = (selector: string) => {
			const element = document.querySelector(selector);

			return element ? window.getComputedStyle(element).backgroundColor : null;
		};

		return {
			body: window.getComputedStyle(document.body).backgroundColor,
			header: backgroundColor('.header-wrapper-style-4 .header.header-style-4'),
			headerShell: backgroundColor('.header-wrapper-style-4'),
			hero: backgroundColor('.bohemcars-mobile-home'),
			themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
			viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content')
		};
	});

	expect(mobileTopColors).toEqual({
		body: 'rgb(143, 202, 26)',
		header: 'rgb(143, 202, 26)',
		headerShell: 'rgb(143, 202, 26)',
		hero: 'rgb(143, 202, 26)',
		themeColor: '#8fca1a',
		viewport: 'width=device-width, initial-scale=1, viewport-fit=cover'
	});

	const mobileHeaderAction = await page
		.locator('.header-wrapper-style-4 .bohemcars-mobile-map')
		.evaluate((action) => {
			const header = document.querySelector('.header-wrapper-style-4 .header.header-style-4');

			if (!(header instanceof HTMLElement) || !(action instanceof HTMLElement)) {
				throw new Error('Expected mobile home sticky header action to render');
			}

			const headerRect = header.getBoundingClientRect();
			const actionRect = action.getBoundingClientRect();
			const actionStyles = window.getComputedStyle(action);
			const ringStyles = window.getComputedStyle(action, '::before');

			return {
				actionBorderTop: actionStyles.borderTopWidth,
				actionHeight: Math.round(actionRect.height),
				headerHeight: Math.round(headerRect.height),
				ringBackground: ringStyles.backgroundColor,
				ringBorderTop: ringStyles.borderTopWidth,
				ringInsetBottom: ringStyles.bottom,
				ringInsetTop: ringStyles.top,
				visibleRingBottomGap: Math.round(
					headerRect.bottom - actionRect.bottom + Number.parseFloat(ringStyles.bottom)
				)
			};
		});

	expect(mobileHeaderAction).toMatchObject({
		actionBorderTop: '0px',
		actionHeight: 44,
		headerHeight: 56,
		ringBorderTop: '0px',
		ringInsetBottom: '2px',
		ringInsetTop: '2px'
	});
	expect(mobileHeaderAction.visibleRingBottomGap).toBeGreaterThanOrEqual(6);
	expect(mobileHeaderAction.ringBackground).toBe('rgb(255, 255, 255)');

	const mobileHeroTabMetrics = await mobileHero
		.locator('.bohemcars-mobile-hero__tabs')
		.evaluate((tabs) => {
			const tabsStyles = window.getComputedStyle(tabs);
			const tab = tabs.querySelector('.bohemcars-mobile-hero__tab.active');
			const tabStyles = tab ? window.getComputedStyle(tab) : null;
			const indicatorStyles = tab ? window.getComputedStyle(tab, '::after') : null;
			const tabsRect = tabs.getBoundingClientRect();
			const tabRect = tab?.getBoundingClientRect();

			return {
				activeBackground: tabStyles?.backgroundColor,
				activeBorderRadius: tabStyles?.borderRadius,
				activeFontWeight: tabStyles?.fontWeight,
				activeMinHeight: tabStyles?.minHeight,
				activeWidth: Math.round(tabRect?.width ?? 0),
				indicatorBackground: indicatorStyles?.backgroundColor,
				indicatorHeight: indicatorStyles?.height,
				railBackground: tabsStyles.backgroundColor,
				railBorderRadius: tabsStyles.borderRadius,
				railMinHeight: tabsStyles.minHeight,
				railWidth: Math.round(tabsRect.width)
			};
		});

	expect(mobileHeroTabMetrics).toMatchObject({
		activeBackground: 'rgba(0, 0, 0, 0)',
		activeBorderRadius: '0px',
		activeFontWeight: '700',
		activeMinHeight: '48px',
		indicatorBackground: 'rgb(20, 33, 15)',
		indicatorHeight: '3px',
		railBackground: 'rgba(0, 0, 0, 0)',
		railBorderRadius: '0px',
		railMinHeight: '48px'
	});
	expect(mobileHeroTabMetrics.activeWidth).toBeCloseTo(
		Math.round(mobileHeroTabMetrics.railWidth / 3),
		1
	);

	await expect(mobileHero).toHaveAttribute('data-bohemcars-search-form', 'buy');
	await expect(importTab).toHaveAttribute('aria-selected', 'false');

	await importTab.click();

	await expect(importTab).toHaveAttribute('aria-selected', 'true');
	await expect(mobileHero).toHaveAttribute('data-bohemcars-search-form', 'import');
	await expect(mobileHero).toHaveAttribute('action', /\/import$/);
	await expect(mobileHero.locator('.bohemcars-mobile-hero__search-label')).toContainText(
		'Линк към обява или VIN...'
	);
	await expect(mobileHero.locator('.bohemcars-mobile-hero__all')).toHaveAttribute(
		'href',
		/\/import$/
	);
	await expect(mobileHero.locator('.bohemcars-mobile-hero__all')).toContainText(
		'Пълна заявка за внос'
	);
	await expect(page.locator('.bohemcars-mobile-home-quick')).toContainText('Калкулатор');
	await expect(page.locator('.bohemcars-mobile-home-quick')).not.toContainText('До 10 000');

	await mobileHero.locator('.bohemcars-mobile-hero__search-label').click();

	const panel = mobileHero.locator('.bohemcars-mobile-search-sheet__panel');
	await expect(mobileHero.locator('.bohemcars-mobile-search-sheet')).toHaveClass(/is-open/);
	await expect(panel).toBeVisible();
	await expect(panel.locator('.bc-drawer')).toHaveCount(1);
	await expect(panel.locator('.bc-drawer--import')).toBeVisible();
	await expect(panel.locator('h2')).toContainText('Изпрати линк за проверка');
	await expect(panel.locator('input[name="vehicle"]')).toHaveCount(1);
	await expect(panel.locator('.bohemcars-mobile-search-sheet__field')).toHaveCSS(
		'border-radius',
		'999px'
	);
	await expect(panel.getByRole('button', { name: 'Провери линка' })).toBeVisible();

	await expect
		.poll(async () => {
			return panel.evaluate((element) => {
				const rect = element.getBoundingClientRect();
				const styles = window.getComputedStyle(element);

				return {
					top: rect.top,
					transform: styles.transform,
					viewportHeight: window.innerHeight
				};
			});
		})
		.toMatchObject({ top: expect.any(Number), transform: 'matrix(1, 0, 0, 1, 0, 0)' });

	await expect
		.poll(async () =>
			panel.evaluate((element) => {
				const rect = element.getBoundingClientRect();

				return rect.top < window.innerHeight;
			})
		)
		.toBe(true);
});

test('mobile primary routes do not expose desktop shells or fallback chrome', async ({ page }) => {
	const visibleChromeLeaks = async () =>
		page.evaluate(() => {
			const visible = (element: Element) => {
				const styles = window.getComputedStyle(element);
				const rect = element.getBoundingClientRect();

				return (
					styles.display !== 'none' &&
					styles.visibility !== 'hidden' &&
					Number(styles.opacity) > 0 &&
					rect.width > 0 &&
					rect.height > 0
				);
			};
			const visibleMatches = (selector: string) =>
				Array.from(document.querySelectorAll(selector))
					.filter(visible)
					.map((element) => element.id || element.className);

			return {
				desktopShells: visibleMatches(
					'.bohemcars-inventory-desktop-route, .bohemcars-sell-desktop-route, .bohemcars-favorites-desktop-route'
				),
				homeFallbackLogoVisible:
					window.location.pathname === '/' &&
					visibleMatches('.header-wrapper-style-4 .logo-mobile').length > 0,
				mobileDrawer: visibleMatches('#main-nav-mobile'),
				modals: visibleMatches('.modal, [id$="Modal"]'),
				preloaders: visibleMatches('.preload')
			};
		});
	const expectNoChromeLeaks = async () => {
		expect(await visibleChromeLeaks()).toEqual({
			desktopShells: [],
			homeFallbackLogoVisible: false,
			mobileDrawer: [],
			modals: [],
			preloaders: []
		});
	};

	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/inventory');

	const bottomNav = page.locator('.mobile-bottom-nav');
	await expect(bottomNav).toBeVisible();
	await expectNoChromeLeaks();

	await bottomNav.getByRole('link', { name: 'Начало' }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.locator('.bohemcars-mobile-hero__copy h1')).toBeVisible();
	await expectNoChromeLeaks();

	await bottomNav.getByRole('link', { name: 'Коли' }).click();
	await expect(page).toHaveURL(/\/inventory$/);
	await expect(page.locator('.bohemcars-inventory-mobile-card').first()).toBeVisible();
	await expectNoChromeLeaks();

	await bottomNav.getByRole('link', { name: 'Продай' }).click();
	await expect(page).toHaveURL(/\/sell-your-car$/);
	await expect(page.locator('.bohemcars-sell-mobile__inline-drawer')).toBeVisible();
	await expectNoChromeLeaks();

	await bottomNav.getByRole('link', { name: 'Любими' }).click();
	await expect(page).toHaveURL(/\/account\/favorites$/);
	await expect(page.locator('.bohemcars-favorites-mobile')).toBeVisible();
	await expect(bottomNav).toBeVisible();
	await expectNoChromeLeaks();

	await page.goto('/');
	await expect(page).toHaveURL(/\/$/);
	await expect(page.locator('.header-wrapper-style-4 .logo-mobile')).toBeHidden();
	await expectNoChromeLeaks();
});

test('desktop inventory navigation returns home without flashing Auxero modals', async ({
	page
}) => {
	await page.setViewportSize({ width: 1917, height: 940 });
	await page.goto('/inventory');

	await expect(page.locator('.bohemcars-inventory-searchbar')).toBeVisible();
	await expect(page.locator('body')).toHaveClass(/auxero-template-listing-grid/);
	await expect(
		page.locator('.header-wrapper-style-4 #menu-primary-menu > li > a', { hasText: 'Начало' })
	).toHaveCount(1);

	await page.evaluate(() => {
		const homeLink = [
			...document.querySelectorAll<HTMLAnchorElement>(
				'.header-wrapper-style-4 #menu-primary-menu > li > a'
			)
		].find(
			(link) => link.textContent?.includes('Начало') && link.getBoundingClientRect().width > 0
		);

		if (!homeLink) throw new Error('Expected visible desktop home link');

		homeLink.click();
	});

	const visibleModalSamples: Array<{ ms: number; ids: string[] }> = [];
	let previousMark = 0;

	for (const mark of [0, 25, 50, 75, 100, 125, 150, 200, 300, 500]) {
		await page.waitForTimeout(mark - previousMark);
		previousMark = mark;

		const ids = await visibleAuxeroModalIds(page);
		if (ids.length > 0) {
			visibleModalSamples.push({ ms: mark, ids });
		}
	}

	await expect(page).toHaveURL(/\/$/);
	await expect(page.locator('body')).toHaveClass(/auxero-template-home-05-html/);
	await expect(page.locator('html')).not.toHaveClass(/bohemcars-route-nav-click/);
	const activeHeroTitle = page.locator(
		'.page-title-style-4 .swiper-slide-active .search-cars__title'
	);
	await expect(activeHeroTitle).toBeVisible();
	await expect(activeHeroTitle).toHaveCSS('color', 'rgb(255, 255, 255)');
	const heroBox = await page.locator('.page-title-style-4').boundingBox();
	expect(heroBox?.height ?? 0).toBeLessThan(390);
	const filtersBox = await page.locator('.page-title-style-4 .search-cars__filters').boundingBox();
	expect(filtersBox?.y ?? 0).toBeLessThan(410);
	expect(visibleModalSamples).toEqual([]);
});

test('desktop client navigation resets Auxero shell state across route families', async ({
	page
}) => {
	const pageErrors: string[] = [];
	const consoleErrors: string[] = [];
	page.on('pageerror', (error) => pageErrors.push(error.message));
	page.on('console', (message) => {
		if (message.type() === 'error') consoleErrors.push(message.text());
	});

	const routeSequence = [
		['/inventory', 'bohemcars-inventory-template', 'Bohemcars Inventory'],
		['/inventory?layout=dashboard', 'bohemcars-inventory-template', 'Bohemcars Inventory'],
		['/compare', 'auxero-template-compare-html', 'Сравни автомобили от Bohemcars'],
		['/agents', 'auxero-template-sale-agents-html', 'Консултанти на Bohemcars'],
		['/services', 'auxero-template-services-center-html', 'Внос от Канада'],
		['/sell-your-car', 'auxero-template-sell-your-car-html', 'Продай автомобила си'],
		['/contact', 'auxero-template-contact-us-html', 'Свържете се с Bohemcars'],
		['/about', 'auxero-template-about-us-html', 'Bohemcars: автомобили от Канада'],
		['/reviews', 'auxero-template-clients-reviews-html', 'Отзиви от клиенти'],
		['/calculator', 'auxero-template-calculator-html', 'Калкулатор за внос'],
		['/faqs', 'auxero-template-faqs-html', 'Често задавани въпроси'],
		['/terms', 'auxero-template-terms-html', 'Условия за използване на Bohemcars'],
		['/blog', 'auxero-template-blog-grid-style-1-html', 'Съвети от Bohemcars'],
		[
			'/blog/vnos-ot-kanada-proverka',
			'auxero-template-blog-details-1-html',
			'Какво проверява Bohemcars'
		],
		['/', 'auxero-template-home-05-html', 'Разгледай, сравни и избери']
	] as const;

	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.evaluate(() => {
		(window as Window & { __bcClientNavSequence?: string }).__bcClientNavSequence = 'alive';
	});

	for (const [route, expectedBodyClass, expectedHeading] of routeSequence) {
		await page.evaluate((href) => {
			const anchor = document.createElement('a');
			anchor.href = href;
			anchor.textContent = 'route probe';
			anchor.style.position = 'fixed';
			anchor.style.left = '-9999px';
			document.body.append(anchor);
			anchor.click();
		}, route);
		await page.waitForURL(route, { waitUntil: 'load' });
		await page.waitForTimeout(300);

		const state = await page.evaluate(() => {
			const visible = (selector: string) =>
				Array.from(document.querySelectorAll(selector)).filter((element) => {
					const rect = element.getBoundingClientRect();
					const style = getComputedStyle(element);

					return (
						rect.width > 0 &&
						rect.height > 0 &&
						style.visibility !== 'hidden' &&
						style.display !== 'none' &&
						rect.bottom > 0 &&
						rect.top < innerHeight &&
						Number(style.opacity || '1') > 0.05
					);
				}).length;
			const firstHeading = Array.from(
				document.querySelectorAll('h1, .page-title .h1, .title-section .h2, .title-section .h3')
			).find((element) => {
				const rect = element.getBoundingClientRect();
				const style = getComputedStyle(element);

				return (
					rect.width > 0 &&
					rect.height > 0 &&
					style.visibility !== 'hidden' &&
					style.display !== 'none' &&
					Number(style.opacity || '1') > 0.05
				);
			});

			return {
				activeHtmlSuppression: document.documentElement.classList.contains(
					'bohemcars-route-nav-click'
				),
				activeModals: document.querySelectorAll('.modal.active, .search-modal.active').length,
				bodyClass: document.body.className,
				brokenImages: Array.from(document.images).filter(
					(image) => image.complete && image.naturalWidth === 0
				).length,
				firstHeading: firstHeading?.textContent?.trim().replace(/\s+/g, ' ') ?? '',
				homeReviewCardWidth: Math.round(
					document
						.querySelector('.bohemcars-home-reviews .testimonior-box')
						?.getBoundingClientRect().width ?? 0
				),
				homeReviewSwiperInitialized: Boolean(
					(
						document.querySelector('.bohemcars-home-reviews .swiper-testimonior') as HTMLElement & {
							swiper?: unknown;
						}
					)?.swiper
				),
				horizontalOverflow:
					document.documentElement.scrollWidth - document.documentElement.clientWidth,
				marker: (window as Window & { __bcClientNavSequence?: string }).__bcClientNavSequence,
				visibleModals: visible('.modal, #SearchModal, .search-modal, #coreDropdownMenu'),
				visiblePreloaders: visible('.preload')
			};
		});

		expect(state.marker).toBe('alive');
		expect(state.bodyClass, route).toContain(expectedBodyClass);
		expect(state.firstHeading, route).toContain(expectedHeading);
		expect(state.visiblePreloaders, route).toBe(0);
		expect(state.visibleModals, route).toBe(0);
		expect(state.activeModals, route).toBe(0);
		expect(state.activeHtmlSuppression, route).toBe(false);
		expect(state.brokenImages, route).toBe(0);
		expect(state.horizontalOverflow, route).toBe(0);

		if (route === '/') {
			expect(state.homeReviewSwiperInitialized).toBe(true);
			expect(state.homeReviewCardWidth).toBeGreaterThan(300);
			expect(state.homeReviewCardWidth).toBeLessThan(500);
		}
	}

	expect(pageErrors).toEqual([]);
	expect(consoleErrors).toEqual([]);
});

test('header, garage, and inquiry flows keep Auxero behavior', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('link', { name: /автомобили/i }).first()).toBeVisible();
	await expect(
		page
			.getByRole('button', { name: /sign in/i })
			.or(page.getByRole('button', { name: /вход/i }))
			.or(page.getByRole('link', { name: /sign in|вход/i }))
			.first()
	).toBeVisible();
	await expect(page.getByRole('link', { name: /add listing/i })).toHaveCount(0);

	await page.goto('/inventory');
	await page.evaluate(() => {
		localStorage.removeItem('bohemcars:favorites');
		localStorage.removeItem('bohemcars:compare');
	});
	await page.reload({ waitUntil: 'networkidle' });

	const firstCard = page.locator('.bohemcars-inventory-content [data-bohemcars-slug]').first();
	await expect(firstCard).toBeVisible();
	const firstSlug = await firstCard.getAttribute('data-bohemcars-slug');
	expect(firstSlug).toBeTruthy();

	const favoriteButton = firstCard.locator('.bohemcars-favorite, .heart');
	await favoriteButton.click();
	await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
	await expect
		.poll(async () =>
			page.evaluate(
				(slug) => JSON.parse(localStorage.getItem('bohemcars:favorites') ?? '[]').includes(slug),
				firstSlug
			)
		)
		.toBe(true);

	await firstCard.locator('.compare-details').click();
	await expect
		.poll(async () =>
			page.evaluate(
				(slug) => JSON.parse(localStorage.getItem('bohemcars:compare') ?? '[]').includes(slug),
				firstSlug
			)
		)
		.toBe(true);

	await page.route('**/api/inquiries', async (route) => {
		await route.fulfill({
			body: JSON.stringify({ data: { id: 'playwright-inquiry' }, ok: true }),
			contentType: 'application/json',
			status: 200
		});
	});
	await page.goto('/contact');
	const inquiryForm = page.locator('.bohemcars-contact-form');
	await expect(inquiryForm).toBeVisible();
	await inquiryForm.locator('input[name="Firstname"]').fill('Nikolay');
	await inquiryForm.locator('input[name="Lastname"]').fill('Petrov');
	await inquiryForm.locator('input[name="SendInquiryemail"]').fill('nikolay@example.com');
	await inquiryForm.locator('input[name="SendInquiryphone"]').fill('359888123456');
	await inquiryForm.locator('textarea[name="message"]').fill('I want to schedule a viewing.');
	await inquiryForm.getByRole('button', { name: 'Изпрати съобщение' }).click();
	await expect(inquiryForm.locator('.auxero-form-status')).toHaveText(
		'Съобщението е подготвено локално за Bohemcars'
	);
});

test('inventory supports branded cards, saved favorites, compare, and view toggles', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/inventory');

	await expect(page.locator('body')).toContainText('Показани 1 – 42 от 42 обяви');
	await expect(page.locator('section.background-light.mb-32')).toHaveCount(0);
	await expect(page.locator('.breadcrumb')).toHaveCount(0);
	const inventoryHeader = page.locator(
		'.bohemcars-inventory-desktop-route .header-wrapper-style-4 .header-style-4'
	);
	await expect(inventoryHeader).toHaveCount(1);
	await expect(inventoryHeader.locator('.header-top-bar')).toBeVisible();
	await expect(
		page.locator('.bohemcars-inventory-desktop-route .header-wrapper .header-style-1')
	).toHaveCount(0);
	await expect(inventoryHeader.locator('#menu-primary-menu > .current-menu-item')).toContainText(
		'Автомобили'
	);
	await expect(inventoryHeader.locator('#menu-primary-menu > .current-menu-item')).toHaveClass(
		/menu-item-has-children/
	);
	const desktopLogoBox = await inventoryHeader.locator('.logo img').boundingBox();
	expect(desktopLogoBox?.width ?? 0).toBeGreaterThan(280);
	expect(desktopLogoBox?.width ?? 0).toBeLessThan(370);
	expect(desktopLogoBox?.height ?? 0).toBeGreaterThan(50);
	expect(desktopLogoBox?.height ?? 0).toBeLessThanOrEqual(58);
	await expect(page.locator('.bohemcars-inventory-banner')).toBeVisible();
	await expect(page.locator('.bohemcars-inventory-banner')).toHaveAttribute(
		'aria-label',
		'Bohemcars inventory showcase'
	);
	await expectDesktopInventorySurface(page);
	await expect(page.locator('section.pb-100 > .container > h2')).toHaveCount(0);
	await expect(page.locator('.bohemcars-inventory-searchbar')).toHaveCount(1);
	await expect(
		page.locator('.bohemcars-inventory-banner .bohemcars-inventory-searchbar')
	).toHaveCount(1);
	await expect(page.locator('section.pb-100 .bohemcars-inventory-searchbar')).toHaveCount(0);
	await expect(page.locator('.bohemcars-inventory-searchbar')).toHaveAttribute('role', 'search');
	await expect(page.locator('.bohemcars-inventory-banner h1')).toHaveClass(/bohemcars-sr-only/);
	await expect(page.locator('.bohemcars-inventory-searchbar input[name="q"]')).toHaveAttribute(
		'placeholder',
		'Търси по марка, модел, година, гориво, екстри...'
	);
	await expect(page.locator('.bohemcars-inventory-dashboard')).toBeVisible();
	await expect(page.locator('.bohemcars-inventory-dashboard-sidebar')).toBeVisible();
	await expect(
		page.locator('.bohemcars-inventory-dashboard-sidebar .bohemcars-inventory-sidebar-heading')
	).toHaveCSS('border-bottom-width', '0px');
	await expect(
		page.locator('.bohemcars-inventory-dashboard-sidebar .bohemcars-inventory-sidebar-actions')
	).toHaveCount(0);
	await expect(page.locator('.bohemcars-inventory-layout-toggle.active')).toContainText('Sidebar');
	await expect(page.locator('.bohemcars-inventory-hero-switches__label')).toHaveCount(0);
	await expect(
		page.locator('.bohemcars-inventory-banner .bohemcars-inventory-filter-grid')
	).toHaveCount(0);
	await expect(
		page.locator('.bohemcars-inventory-banner [data-inventory-filter-field]')
	).toHaveCount(0);
	await expect(
		page.locator('.bohemcars-inventory-dashboard-results .bohemcars-inventory-filter-grid')
	).toHaveCount(0);
	await expect(
		page.locator('.bohemcars-inventory-banner .bohemcars-inventory-toolbar-row')
	).toHaveCount(1);
	await expect(
		page.locator('.bohemcars-inventory-dashboard-results .bohemcars-inventory-toolbar-row')
	).toHaveCount(0);
	await expect(
		page.locator('.bohemcars-inventory-dashboard-sidebar [data-inventory-filter-field]')
	).toHaveCount(8);
	await expect(
		page.locator('.bohemcars-inventory-dashboard-sidebar [data-filter-name]')
	).toHaveCount(0);

	await page.goto('/inventory?layout=classic');
	await page.waitForLoadState('networkidle');
	await expect(page.locator('.bohemcars-inventory-layout-toggle.active')).toContainText('Grid');
	await expect(page.locator('.bohemcars-inventory-filter-mode-toggle__item')).toHaveCount(2);
	await expect(page.locator('.bohemcars-inventory-filter-mode-toggle__item.active')).toContainText(
		'Popover'
	);
	const dashboardBrandFilter = page.locator(
		'.bohemcars-inventory-filter-panel [data-name="brand"] .ifp__field'
	);
	await dashboardBrandFilter.click();
	await expect(page.locator('.bohemcars-inventory-filter-panel [data-name="brand"]')).toHaveClass(
		/ifp--open/
	);
	await expect(
		page.locator('.bohemcars-inventory-filter-panel [data-name="brand"] .ifp__panel')
	).not.toHaveAttribute('aria-modal', 'true');
	const popoverLayer = await page.evaluate(() => {
		const panel = document.querySelector(
			'.bohemcars-inventory-filter-panel [data-name="brand"] .ifp__panel'
		);
		const main = document.querySelector('.bohemcars-inventory-main');
		if (!panel || !main) return null;

		const panelRect = panel.getBoundingClientRect();
		const mainRect = main.getBoundingClientRect();
		const sampleX = panelRect.left + panelRect.width / 2;
		const sampleY = Math.min(panelRect.bottom - 8, window.innerHeight - 8);
		const topElement = document.elementFromPoint(sampleX, sampleY);

		return {
			mainTop: Math.round(mainRect.top),
			panelBottom: Math.round(panelRect.bottom),
			topInsidePanel: Boolean(topElement && panel.contains(topElement))
		};
	});
	expect(popoverLayer).not.toBeNull();
	expect(popoverLayer?.panelBottom).toBeGreaterThan(popoverLayer?.mainTop ?? 0);
	expect(popoverLayer?.topInsidePanel).toBe(true);
	await page.keyboard.press('Escape');

	await page.goto('/inventory?layout=classic&filters=modal');
	await page.waitForLoadState('networkidle');
	await expect(page.locator('.bohemcars-inventory-filter-mode-toggle__item')).toHaveCount(2);
	await expect(page.locator('.bohemcars-inventory-filter-mode-toggle__item.active')).toContainText(
		'Modal'
	);
	const modalBrandFilter = page.locator(
		'.bohemcars-inventory-filter-panel [data-name="brand"] .ifp__field'
	);
	const modalLayoutBefore = await page.evaluate(() => {
		const rect = (selector: string) => {
			const element = document.querySelector(selector);
			if (!element) return null;

			const box = element.getBoundingClientRect();
			return {
				height: Math.round(box.height),
				top: Math.round(box.top)
			};
		};

		return {
			demoStrip: rect('.bohemcars-inventory-demo-strip'),
			filterPanel: rect('.bohemcars-inventory-filter-panel'),
			firstCard: rect('.bohemcars-inventory-content .card-box'),
			main: rect('.bohemcars-inventory-main')
		};
	});
	await modalBrandFilter.click();
	await expect(
		page.locator('.bohemcars-inventory-filter-panel [data-name="brand"] .ifp__panel')
	).toHaveAttribute('aria-modal', 'true');
	await expect(page.locator('.bohemcars-inventory-filter-panel .ifp__backdrop')).toHaveCount(1);
	const modalLayer = await page.evaluate(() => {
		const panel = document.querySelector(
			'.bohemcars-inventory-filter-panel [data-name="brand"] .ifp__panel'
		);
		if (!panel) return null;

		const panelRect = panel.getBoundingClientRect();
		const demoStrip = document.querySelector('.bohemcars-inventory-demo-strip');
		const demoStripRect = demoStrip?.getBoundingClientRect();
		const topElement = document.elementFromPoint(
			panelRect.left + panelRect.width / 2,
			panelRect.top + panelRect.height / 2
		);

		return {
			bottomGap: Math.round(window.innerHeight - panelRect.bottom),
			gapFromRail: demoStripRect ? Math.round(panelRect.top - demoStripRect.bottom) : null,
			topInsidePanel: Boolean(topElement && panel.contains(topElement))
		};
	});
	expect(modalLayer).not.toBeNull();
	expect(modalLayer?.gapFromRail).toBeGreaterThanOrEqual(10);
	expect(modalLayer?.bottomGap).toBeGreaterThanOrEqual(24);
	expect(modalLayer?.topInsidePanel).toBe(true);
	const modalLayoutAfter = await page.evaluate(() => {
		const rect = (selector: string) => {
			const element = document.querySelector(selector);
			if (!element) return null;

			const box = element.getBoundingClientRect();
			return {
				height: Math.round(box.height),
				top: Math.round(box.top)
			};
		};

		return {
			demoStrip: rect('.bohemcars-inventory-demo-strip'),
			filterPanel: rect('.bohemcars-inventory-filter-panel'),
			firstCard: rect('.bohemcars-inventory-content .card-box'),
			main: rect('.bohemcars-inventory-main')
		};
	});
	expect(modalLayoutAfter.demoStrip?.height).toBe(modalLayoutBefore.demoStrip?.height);
	expect(modalLayoutAfter.filterPanel?.top).toBe(modalLayoutBefore.filterPanel?.top);
	expect(modalLayoutAfter.main?.top).toBe(modalLayoutBefore.main?.top);
	expect(modalLayoutAfter.firstCard?.top).toBe(modalLayoutBefore.firstCard?.top);
	await page.keyboard.press('Escape');

	await page.goto('/inventory?layout=classic');
	await expect(page.locator('body')).toContainText('Показани 1 – 42 от 42 обяви');
	await expect(
		page.locator('.bohemcars-inventory-filter-grid [data-inventory-filter-field]')
	).toHaveCount(8);
	await expect
		.poll(async () =>
			page
				.locator('.bohemcars-inventory-filter-grid')
				.evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length)
		)
		.toBe(4);
	await expect(page.locator('.bohemcars-inventory-filter-grid [data-name="brand"]')).toBeVisible();
	await expect(page.locator('.bohemcars-inventory-filter-grid [data-name="model"]')).toBeVisible();
	await expect(
		page.locator('.bohemcars-inventory-filter-grid [data-name="mileageTo"]')
	).toBeVisible();
	await expect(
		page.locator('.bohemcars-inventory-banner .bohemcars-inventory-quick-pills')
	).toHaveCount(0);
	await expect(
		page.locator('.bohemcars-inventory-banner .bohemcars-inventory-active-filters')
	).toHaveCount(0);
	await expect(page.locator('.bohemcars-inventory-quick-pills')).toHaveCount(0);
	await expect(page.locator('.bohemcars-inventory-quick-pills--results')).toHaveCount(0);
	await expect(page.locator('#filterSidebarToggle')).toHaveCount(1);
	await expect(
		page.locator('.bohemcars-inventory-banner .bohemcars-inventory-toolbar-row')
	).toHaveCount(1);
	await expect(page.locator('section.pb-100 .bohemcars-inventory-toolbar-row')).toHaveCount(0);
	await expect(page.locator('section.pb-100')).toHaveCSS('background-color', 'rgb(238, 241, 237)');
	await expect(page.locator('.bohemcars-inventory-content > .content-inner.active')).toHaveCSS(
		'transition-duration',
		'0s'
	);
	await expect(page.locator('.bohemcars-inventory-content > .content-inner.active')).toHaveCSS(
		'transform',
		'none'
	);
	await expect(page.locator('.bohemcars-inventory-searchbar__primary')).toHaveCSS(
		'transition-duration',
		'0s'
	);
	await expect(page.locator('[data-bohemcars-slug]').first()).toBeVisible();
	await expectBohemcarsShell(page);

	await page.goto('/inventory?q=Audi');
	await expect(page.locator('body')).toContainText('Показани 1 – 9 от 9 съвпадащи обяви');
	await expect(
		page.locator('.bohemcars-inventory-banner .bohemcars-inventory-active-filters')
	).toHaveCount(0);
	await expect(
		page.locator('section.pb-100 .bohemcars-inventory-active-filters--results')
	).toHaveCount(1);
	await expect(page.locator('[data-bohemcars-slug]').first()).toContainText('Audi');

	const firstCard = page.locator('[data-bohemcars-slug]').first();
	const firstSlug = await firstCard.getAttribute('data-bohemcars-slug');
	expect(firstSlug).toBeTruthy();

	await page.goto('/inventory?brand=Audi');
	await expect(page.locator('[data-bohemcars-slug]').first()).toContainText('Audi');
	await expect(
		page.locator('.bohemcars-inventory-dashboard-sidebar .bohemcars-inventory-sidebar-actions')
	).toHaveCount(1);
	await expect(
		page.locator('.bohemcars-inventory-dashboard-sidebar .bohemcars-inventory-sidebar-clear')
	).toHaveText('Изчисти');
	await expect(
		page.locator('.bohemcars-inventory-dashboard-sidebar .bohemcars-inventory-sidebar-apply')
	).toContainText('Покажи');

	await page.goto('/inventory');
	const inventoryContent = page.locator('.bohemcars-inventory-content');
	await expect(page.locator('.bohemcars-inventory-dashboard-sidebar')).toBeVisible();
	await expect(inventoryContent).toBeVisible();
	await expect(inventoryContent.locator(':scope > .content-inner.active')).toBeVisible();
	const refreshedFirstCard = inventoryContent.locator('[data-bohemcars-slug]').first();
	await expect(refreshedFirstCard).toBeVisible();
	const refreshedFirstSlug = await refreshedFirstCard.getAttribute('data-bohemcars-slug');
	const inventoryContentBox = await inventoryContent.boundingBox();
	expect(inventoryContentBox?.width ?? 0).toBeGreaterThan(950);
	expect(inventoryContentBox?.width ?? 0).toBeLessThan(1100);
	const refreshedFirstCardBox = await refreshedFirstCard.boundingBox();
	expect(refreshedFirstCardBox?.width ?? 0).toBeGreaterThan(210);
	expect(refreshedFirstCardBox?.width ?? 0).toBeLessThan(250);
	const cardImageRatio = await boxRatio(refreshedFirstCard.locator('.card--img'));

	expect(cardImageRatio).toBeGreaterThan(1.31);
	expect(cardImageRatio).toBeLessThan(1.35);
	await expect(page.locator('.bohemcars-inventory-toolbar-row')).toBeVisible();
	await expect(
		page.locator('.bohemcars-inventory-banner .bohemcars-inventory-toolbar-row')
	).toHaveCount(1);
	await expect(
		page.locator('.bohemcars-inventory-dashboard-results .bohemcars-inventory-toolbar-row')
	).toHaveCount(0);
	await expect(page.locator('.bohemcars-inventory-toolbar-row')).toHaveCSS(
		'background-color',
		'rgba(0, 0, 0, 0)'
	);
	await expect(page.locator('.bohemcars-inventory-toolbar-row')).toHaveCSS(
		'border-top-width',
		'0px'
	);
	await expect(page.locator('.bohemcars-inventory-toolbar-row')).toHaveCSS('border-radius', '0px');
	await expect(page.locator('.bohemcars-inventory-toolbar-row .core-dropdown__button')).toHaveCSS(
		'background-color',
		'rgb(248, 250, 243)'
	);
	await expect(page.locator('.bohemcars-inventory-toolbar-row .core-dropdown__button')).toHaveCSS(
		'border-top-color',
		'rgb(221, 229, 216)'
	);
	await expect(page.locator('.bohemcars-inventory-content')).toHaveCSS(
		'background-color',
		'rgba(0, 0, 0, 0)'
	);
	await expect(page.locator('.bohemcars-inventory-content')).toHaveCSS('border-top-width', '0px');
	await expect(page.locator('.bohemcars-inventory-content')).toHaveCSS('border-radius', '0px');
	await expect(page.locator('.bohemcars-view-toggle .item-menu')).toHaveCount(3);
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Dense 4 grid'
	);
	await expect(
		page.locator('.bohemcars-inventory-content > .content-inner.active > div.grid')
	).toHaveClass(/grid-cols-4/);
	await expect(refreshedFirstCard).toHaveClass(/card-box-style-1/);
	await expect(refreshedFirstCard.locator('.card-box__title')).toHaveClass(/h6/);
	await expect(refreshedFirstCard.locator('.card-box__title')).toHaveCSS('font-size', '18px');
	await expect(refreshedFirstCard.locator('.card-box__title')).toHaveCSS('line-height', '25.92px');
	const refreshedFirstTitleBox = await refreshedFirstCard.locator('.card-box__title').boundingBox();
	expect(refreshedFirstTitleBox?.height ?? 0).toBeGreaterThanOrEqual(50);
	await expect(refreshedFirstCard.locator('.top .highlight')).toHaveText('140 000 km');
	await expect(refreshedFirstCard.locator('.card--img')).toHaveAttribute(
		'src',
		/\/assets\/images\/card\/card-48\.jpg/
	);
	await expect(refreshedFirstCard.locator('.card--img')).not.toHaveAttribute('src', /hero/);
	await expect(refreshedFirstCard.locator('.top .highlight')).toHaveCSS(
		'background-color',
		'rgb(255, 255, 255)'
	);
	await expect(refreshedFirstCard.locator('.top .highlight')).toHaveCSS('color', 'rgb(28, 28, 28)');
	const compactSpecs = refreshedFirstCard.locator('.bohemcars-card-specs');
	await expect(compactSpecs.locator('li')).toHaveCount(3);
	await expect(compactSpecs).toContainText('2019');
	await expect(compactSpecs).toContainText('Бензин');
	await expect(compactSpecs).toContainText('Автомат');
	await expect(compactSpecs).not.toContainText('140 000 km');
	await expect(compactSpecs.locator('li span').first()).toHaveCSS('font-size', '14px');
	const compactSpecRows = await compactSpecs
		.locator('li')
		.evaluateAll(
			(items) => new Set(items.map((item) => Math.round(item.getBoundingClientRect().top))).size
		);
	expect(compactSpecRows).toBeGreaterThanOrEqual(1);
	expect(compactSpecRows).toBeLessThanOrEqual(2);
	await expect(refreshedFirstCard.locator('.card-box__price')).toHaveClass(/h6/);
	await expect(refreshedFirstCard.locator('.bohemcars-card-price__amount')).toHaveCSS(
		'font-size',
		'22px'
	);
	await expect(refreshedFirstCard.locator('.bohemcars-card-price__amount')).toHaveCSS(
		'font-weight',
		'600'
	);
	await expect(refreshedFirstCard.locator('.content')).toHaveCSS(
		'background-color',
		'rgb(255, 255, 255)'
	);
	await expect(refreshedFirstCard).toHaveCSS('border-top-width', '0px');
	await expect(refreshedFirstCard).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	await refreshedFirstCard.hover();
	await expect(refreshedFirstCard).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	await expect(refreshedFirstCard.locator('.content')).toHaveCSS(
		'background-color',
		'rgb(251, 252, 248)'
	);
	await expect(refreshedFirstCard.locator('.bohemcars-card-price__finance')).toBeVisible();
	const inventoryMonthlyBox = await refreshedFirstCard
		.locator('.bohemcars-card-price__monthly')
		.boundingBox();
	const inventoryFinanceBox = await refreshedFirstCard
		.locator('.bohemcars-card-price__finance-link')
		.boundingBox();
	expect(inventoryFinanceBox?.y ?? 0).toBeGreaterThan(inventoryMonthlyBox?.y ?? 0);
	await expect(refreshedFirstCard.locator('.tag.style2.mb-10')).toHaveCSS('font-size', '16px');
	const firstRowCards = page.locator(
		'.bohemcars-inventory-content > .content-inner.active > div.grid > [data-bohemcars-slug]'
	);
	const firstRowActionOffsets = await firstRowCards.evaluateAll((cards) =>
		cards.slice(0, 4).map((card) => {
			const cardBox = card.getBoundingClientRect();
			const action = card.querySelector('.bohemcars-card-actions')?.getBoundingClientRect();

			return Math.round((action?.top ?? 0) - cardBox.top);
		})
	);
	expect(
		Math.max(...firstRowActionOffsets) - Math.min(...firstRowActionOffsets)
	).toBeLessThanOrEqual(1);
	await expect(refreshedFirstCard.locator('.compare-details')).toContainText('Сравни');
	await expect(refreshedFirstCard.locator('.compare-details')).toHaveCSS('border-radius', '12px');
	await refreshedFirstCard.locator('.compare-details').hover();
	await expect(refreshedFirstCard.locator('.compare-details')).toHaveCSS(
		'background-color',
		'rgb(120, 159, 27)'
	);
	await expect(refreshedFirstCard.locator('.card--img')).toHaveCSS('transform', 'none');
	await expect(refreshedFirstCard.locator('.view-details')).toHaveAttribute(
		'href',
		new RegExp(`/inventory/${refreshedFirstSlug}$`)
	);

	await page.goto('/inventory?layout=classic');
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Compact 5 grid'
	);

	expect(
		await visiblePreloadSamplesDuring(page, () =>
			page.locator('.bohemcars-view-toggle .item-menu[aria-label="Comfortable 3 grid"]').click()
		)
	).toEqual([]);
	await expect(page).toHaveURL(/\/inventory\?layout=classic&view=3$/);
	await expect(page.locator('.preload')).toBeHidden();
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Comfortable 3 grid'
	);
	await expect(
		page.locator('.bohemcars-inventory-content > .content-inner.active > div.grid')
	).toHaveClass(/grid-cols-3/);
	await expectDesktopInventorySurface(page);

	expect(
		await visiblePreloadSamplesDuring(page, () =>
			page.locator('.bohemcars-view-toggle .item-menu[aria-label="Dense 4 grid"]').click()
		)
	).toEqual([]);
	await expect(page).toHaveURL(/\/inventory\?layout=classic&view=4$/);
	await expect(page.locator('.preload')).toBeHidden();
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Dense 4 grid'
	);
	await expect(
		page.locator('.bohemcars-inventory-content > .content-inner.active > div.grid')
	).toHaveClass(/grid-cols-4/);
	await expect(
		page.locator('.bohemcars-inventory-content .card-box-style-1').first()
	).toBeVisible();
	await expectDesktopInventorySurface(page);

	expect(
		await visiblePreloadSamplesDuring(page, () =>
			page.locator('.bohemcars-view-toggle .item-menu[aria-label="Compact 5 grid"]').click()
		)
	).toEqual([]);
	await expect(page).toHaveURL(/\/inventory\?layout=classic$/);
	await expect(page.locator('.preload')).toBeHidden();
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Compact 5 grid'
	);
	await expect(
		page.locator('.bohemcars-inventory-content > .content-inner.active > div.grid')
	).toHaveClass(/grid-cols-5/);
	await expectDesktopInventorySurface(page);

	expect(
		await visiblePreloadSamplesDuring(page, () =>
			page.locator('.bohemcars-view-toggle .item-menu[aria-label="Dense 4 grid"]').click()
		)
	).toEqual([]);
	await expect(page).toHaveURL(/\/inventory\?layout=classic&view=4$/);
	await expect(page.locator('.preload')).toBeHidden();
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Dense 4 grid'
	);
	await expect(
		page.locator('.bohemcars-inventory-content > .content-inner.active > div.grid')
	).toHaveClass(/grid-cols-4/);
	await expect(page.locator('.bohemcars-inventory-layout-toggle.active')).toContainText('Grid');

	expect(
		await visiblePreloadSamplesDuring(page, () =>
			page.locator('.bohemcars-inventory-layout-toggle:not(.active)').click()
		)
	).toEqual([]);
	await expect(page).toHaveURL(/\/inventory$/);
	await expect(page.locator('.preload')).toBeHidden();
	await expect(page.locator('.bohemcars-inventory-dashboard')).toBeVisible();
	await expect(page.locator('.bohemcars-inventory-dashboard')).toHaveCSS(
		'background-color',
		'rgb(238, 241, 237)'
	);
	await expect(page.locator('.bohemcars-inventory-dashboard')).toHaveCSS('border-top-width', '0px');
	await expect(page.locator('.bohemcars-inventory-dashboard-results')).toHaveCSS(
		'background-color',
		'rgb(238, 241, 237)'
	);
	const sidebarRail = page.locator('.bohemcars-inventory-dashboard-sidebar');
	await expect(sidebarRail).toBeVisible();
	await expect(sidebarRail).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	await expect(sidebarRail).toHaveCSS('border-radius', '16px');
	await expect(sidebarRail.locator('.bohemcars-inventory-sidebar-heading')).toHaveCSS(
		'border-bottom-width',
		'0px'
	);
	await expect(sidebarRail.locator('.bohemcars-inventory-sidebar-actions')).toHaveCount(0);
	await expect(
		page.locator('.bohemcars-inventory-dashboard-results #filterSidebarToggle')
	).toHaveCount(0);
	await expect(page.locator('.bohemcars-inventory-dashboard')).toHaveCSS(
		'grid-template-columns',
		/336px/
	);
	await expect(
		page.locator('.bohemcars-inventory-dashboard-sidebar [data-inventory-filter-field]')
	).toHaveCount(8);
	await expect(sidebarRail.locator('[data-filter-name]')).toHaveCount(0);
	for (const name of ['brand', 'fuel', 'bodyType', 'transmission']) {
		const sidebarField = sidebarRail.locator(`[data-name="${name}"]`);
		await expect(sidebarField.locator('.ifp__field')).toHaveCount(1);
		await expect(sidebarField.locator('.ifp__panel')).toHaveCSS('display', 'none');
	}
	const sidebarBrandField = sidebarRail.locator('[data-name="brand"]');
	await expect(sidebarBrandField.locator('.ifp__label')).toHaveText('Марка');
	await expect(sidebarBrandField.locator('.ifp__value')).toHaveText('Всички марки');
	await expect(sidebarBrandField.locator('.ifp__field')).toHaveCSS('border-radius', '12px');
	const sidebarModelField = sidebarRail.locator('[data-name="model"]');
	await expect(sidebarModelField.locator('.ifp__label')).toHaveText('Модел');
	await expect(sidebarModelField.locator('.ifp__value')).toHaveText('Всички модели');
	await expect(sidebarModelField.locator('.ifp__field')).toHaveCSS('min-height', '64px');
	await expect(sidebarModelField.locator('.ifp__panel')).toHaveCSS('display', 'none');
	await sidebarModelField.locator('.ifp__field').click();
	await expect(sidebarModelField).toHaveClass(/ifp--open/);
	await expect(sidebarModelField.locator('.ifp__panel')).toBeVisible();
	await expect(sidebarModelField.locator('.ifp__panel')).toHaveCSS('position', 'absolute');
	const sidebarModelOverflow = await sidebarRail.evaluate((rail) => ({
		clientWidth: rail.clientWidth,
		scrollWidth: rail.scrollWidth
	}));
	expect(sidebarModelOverflow.scrollWidth).toBeLessThanOrEqual(
		sidebarModelOverflow.clientWidth + 1
	);
	const sidebarModelPanelBounds = await sidebarModelField
		.locator('.ifp__panel')
		.evaluate((panel) => {
			const rail = panel.closest('.bohemcars-inventory-dashboard-sidebar');
			const railRect = rail?.getBoundingClientRect();
			const panelRect = panel.getBoundingClientRect();

			return {
				panelLeft: Math.round(panelRect.left),
				panelRight: Math.round(panelRect.right),
				railLeft: Math.round(railRect?.left ?? 0),
				railRight: Math.round(railRect?.right ?? 0)
			};
		});
	expect(sidebarModelPanelBounds.panelLeft).toBeGreaterThanOrEqual(
		sidebarModelPanelBounds.railLeft
	);
	expect(sidebarModelPanelBounds.panelRight).toBeLessThanOrEqual(sidebarModelPanelBounds.railRight);
	await expect(sidebarModelField.locator('.ifp__search')).toBeVisible();
	await expect(sidebarModelField.locator('.ifp__row').first()).toBeVisible();
	await expect(sidebarModelField.locator('.ifp__row').first()).toContainText('Всички модели');
	await expect(sidebarModelField.locator('.ifp__chip')).toHaveCount(0);
	await expect(
		page.locator('.bohemcars-inventory-dashboard-results .bohemcars-inventory-content')
	).toBeVisible();
	await expect(page.locator('.compare-details.btn.btn-small.open-modal')).toHaveCount(42);
	await expect(page.locator('.view-details')).toHaveCount(42);
	await expect(page.locator('.bohemcars-inventory-layout-toggle.active')).toContainText('Sidebar');

	expect(
		await visiblePreloadSamplesDuring(page, () =>
			page.locator('.bohemcars-inventory-layout-toggle:not(.active)').click()
		)
	).toEqual([]);
	await expect(page).toHaveURL(/\/inventory\?layout=classic$/);
	await expect(page.locator('.preload')).toBeHidden();
	await expect(page.locator('.bohemcars-inventory-dashboard-sidebar')).toHaveCount(0);
	await expect(page.locator('.bohemcars-inventory-layout-toggle.active')).toContainText('Grid');

	expect(
		await visiblePreloadSamplesDuring(page, () =>
			page.locator('.bohemcars-view-toggle .item-menu[aria-label="Half map"]').click()
		)
	).toEqual([]);
	await expect(page).toHaveURL(/\/inventory\?layout=classic&view=map$/);
	await expect(page.locator('.preload')).toBeHidden();
	await expect(page.locator('body')).toHaveClass(/auxero-template-listing-gridstyle-halfmap-html/);
	await expect(page.locator('body')).toHaveClass(/(^|\s)halfmap(\s|$)/);
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Half map'
	);
	await expect(
		page.locator('.bohemcars-inventory-content .card-box-style-9').first()
	).toBeVisible();
	await expect(page.locator('.bohemcars-map-fallback')).toContainText('Точната локация за оглед');
	await expectDesktopInventorySurface(page);

	await page.goto('/inventory');
	await page.waitForLoadState('networkidle');
	await refreshedFirstCard.locator('.bohemcars-favorite, .heart').click();
	await expect
		.poll(async () =>
			page.evaluate(() => JSON.parse(localStorage.getItem('bohemcars:favorites') ?? '[]').length)
		)
		.toBeGreaterThan(0);

	await refreshedFirstCard.locator('.compare-details').click();
	await expect
		.poll(async () =>
			page.evaluate(() => JSON.parse(localStorage.getItem('bohemcars:compare') ?? '[]').length)
		)
		.toBeGreaterThan(0);
});

test('vehicle detail uses Listing Details 3 data and local inquiry flow', async ({ page }) => {
	await page.goto('/inventory');
	const firstCard = page.locator('[data-bohemcars-slug]').first();
	const firstSlug = await firstCard.getAttribute('data-bohemcars-slug');
	const firstTitle = (await firstCard.locator('.card-box__title').innerText()).trim();
	expect(firstSlug).toBeTruthy();

	await firstCard.locator('a.view-details, .card-box__title a').first().click();
	await expect(page).toHaveURL(new RegExp(`/inventory/${firstSlug}$`));
	const detailTitle = page.locator('.listing-details--content h1').first();

	await expect(page.locator('.listing-details[data-bohemcars-detail="true"]')).toBeVisible();
	await expect(page.locator('.listing-details--content')).toBeVisible();
	await expect(page.locator('.listing-details--sidebar')).toBeVisible();
	await expect(
		page.locator('.title-section .bohemcars-pdp-compare[data-bohemcars-compare]')
	).toBeVisible();
	await expect(page.locator('.title-section .bohemcars-favorite')).toBeVisible();
	await expect(page.locator('.swiper-listing-details-main .listing-details-item')).toHaveCount(7);
	await expect(page.locator('.swiper-listing-details-thumbs .listing-details-thumb')).toHaveCount(
		7
	);
	await expect(page.locator('.listing-details--content .menu-tab-style4 li')).toHaveCount(7);
	await expect(page.locator('.listing-details--content .menu-tab-style4 li').first()).toContainText(
		'Описание'
	);
	await expect(page.locator('.bohemcars-pdp-info-panel')).toBeVisible();
	await page
		.locator('.listing-details--content .menu-tab-style4 li', { hasText: 'Техника' })
		.click();
	await expect(page.locator('.listing-details--content .menu-tab-style4 li.active')).toContainText(
		'Техника'
	);
	await expect(page.locator('.bohemcars-pdp-info-panel .content-inner.active')).toContainText(
		'технически преглед'
	);
	await expect(page.locator('.listing-details--sidebar .menu-tab-style5 li')).toHaveCount(2);
	await expect(page.locator('.car-overview-list-style2 > li')).toHaveCount(10);
	await expect(page.locator('form.send-inquiry')).toBeVisible();
	await expect(page.locator('.listing-details')).toContainText(firstTitle);
	expect(await cssValue(detailTitle, 'color')).toBe('rgb(20, 33, 15)');
	expect(await cssValue(detailTitle, 'font-size')).toBe('40px');
	await expect(page.locator('.listing-details--sidebar-box .h4').first()).toHaveCSS(
		'color',
		'rgb(28, 28, 28)'
	);
	await expect(page.locator('.car-overview-list-style2 .text-secondary').first()).toHaveCSS(
		'color',
		'rgb(75, 75, 75)'
	);
	await expect(page.locator('body')).toContainText('Продажби и огледи');
	await expect(page.locator('body')).toContainText('ID от източника');
	await expect(page.locator('body')).toContainText('Оборудване');
	await expectBohemcarsShell(page);

	const inquiry = page.locator('form.send-inquiry');
	await inquiry.locator('#SendInquiryname').fill('QA Visitor');
	await inquiry.locator('#SendInquiryemail').fill('qa@example.com');
	await inquiry.locator('#SendInquiryphone').fill('893588680');
	await inquiry.locator('#message').fill('Please confirm the next viewing appointment.');
	await expect
		.poll(() =>
			page.evaluate(() =>
				Boolean((window as Window & { __BOHEMCARS_RUNTIME__?: unknown }).__BOHEMCARS_RUNTIME__)
			)
		)
		.toBe(true);
	await inquiry.locator('button', { hasText: 'Изпрати запитване' }).click();
	await expect(inquiry.locator('.auxero-form-status')).toHaveText(
		'Inquiry sent to Bohemcars locally'
	);
});

test('mobile vehicle detail keeps actions above scrollable information', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/inventory');
	const firstSlug = await page
		.locator('[data-bohemcars-slug]')
		.first()
		.getAttribute('data-bohemcars-slug');
	expect(firstSlug).toBeTruthy();

	await page.goto(`/inventory/${firstSlug}`);
	const drawer = page.locator('.bohemcars-mobile-pdp__drawer');
	const actions = page.locator('.bohemcars-mobile-pdp__drawer > .bohemcars-mobile-pdp__actions');
	const panel = page.locator('.bohemcars-mobile-pdp__panel');

	await expect(page.locator('[data-mobile-pdp-root]')).toBeVisible();
	await expect(drawer).toBeVisible();
	await expect(actions).toBeVisible();
	await expect(actions.getByRole('button', { name: /Запитване/ })).toBeVisible();
	await expect(actions.getByRole('link', { name: /Обади се/ })).toBeVisible();
	await expect(
		page.locator('.bohemcars-mobile-pdp__drawer > .bohemcars-mobile-pdp__facts')
	).toHaveCount(0);
	await expect(panel.locator('.bohemcars-mobile-pdp__facts > div')).toHaveCount(4);

	const mobileDrawerLayout = await drawer.evaluate((drawerElement) => {
		const classOf = (selector: string) => drawerElement.querySelector(selector);
		const rectOf = (element: Element | null) => {
			if (!element) return null;
			const rect = element.getBoundingClientRect();

			return {
				bottom: Math.round(rect.bottom),
				height: Math.round(rect.height),
				top: Math.round(rect.top),
				width: Math.round(rect.width)
			};
		};
		const styleOf = (element: Element | null) => {
			if (!element) return null;
			const style = getComputedStyle(element);

			return {
				borderTopWidth: style.borderTopWidth,
				gridTemplateColumns: style.gridTemplateColumns,
				minHeight: style.minHeight,
				overflowY: style.overflowY
			};
		};

		const heading = classOf('.bohemcars-mobile-pdp__drawer-heading');
		const actionsElement = classOf(':scope > .bohemcars-mobile-pdp__actions');
		const tabs = classOf('.bohemcars-mobile-pdp__tabs');
		const activeTab = classOf('.bohemcars-mobile-pdp__tab.active');
		const panelElement = classOf('.bohemcars-mobile-pdp__panel');
		const facts = classOf('.bohemcars-mobile-pdp__panel .bohemcars-mobile-pdp__facts');
		const primaryCta = classOf('.bohemcars-mobile-pdp__cta--primary');
		const activeTabIndicator = activeTab ? getComputedStyle(activeTab, '::after') : null;

		return {
			actions: rectOf(actionsElement),
			actionsStyle: styleOf(actionsElement),
			activeTab: rectOf(activeTab),
			activeTabIndicator: activeTabIndicator
				? {
						backgroundColor: activeTabIndicator.backgroundColor,
						height: activeTabIndicator.height,
						left: activeTabIndicator.left,
						right: activeTabIndicator.right
					}
				: null,
			factsStyle: styleOf(facts),
			heading: rectOf(heading),
			panel: {
				...rectOf(panelElement),
				clientHeight: panelElement?.clientHeight,
				scrollHeight: panelElement?.scrollHeight,
				style: styleOf(panelElement)
			},
			primaryCtaStyle: styleOf(primaryCta),
			tabs: rectOf(tabs)
		};
	});

	expect(mobileDrawerLayout.actions?.top).toBeGreaterThanOrEqual(
		mobileDrawerLayout.heading?.bottom ?? 0
	);
	expect(mobileDrawerLayout.actions?.bottom).toBeLessThanOrEqual(
		mobileDrawerLayout.tabs?.top ?? Number.POSITIVE_INFINITY
	);
	expect(mobileDrawerLayout.actionsStyle).toMatchObject({
		borderTopWidth: '0px'
	});
	expect(mobileDrawerLayout.primaryCtaStyle).toMatchObject({
		minHeight: '44px'
	});
	expect(mobileDrawerLayout.factsStyle?.gridTemplateColumns.split(' ')).toHaveLength(2);
	expect(mobileDrawerLayout.activeTab?.width).toBeCloseTo(
		Math.round((mobileDrawerLayout.tabs?.width ?? 0) / 3),
		1
	);
	expect(mobileDrawerLayout.activeTabIndicator).toMatchObject({
		backgroundColor: 'rgb(152, 188, 42)',
		height: '3px',
		left: '0px',
		right: '0px'
	});
	expect(mobileDrawerLayout.panel.style?.overflowY).toBe('auto');
	expect(mobileDrawerLayout.panel.scrollHeight ?? 0).toBeGreaterThan(
		mobileDrawerLayout.panel.clientHeight ?? 0
	);
});

test('compare and consultants render branded buyer flows without login', async ({ page }) => {
	await page.goto('/compare');
	await expect(page.locator('body')).toContainText('Сравни автомобили от Bohemcars');
	const compareTable = page
		.locator('[data-bohemcars-compare-table]')
		.filter({ visible: true })
		.first();
	await expect(compareTable).toBeVisible();
	await expect(compareTable).toHaveClass(/card-details--table/);
	await expect(compareTable).toHaveClass(/bohemcars-compare-table/);
	await expect(compareTable.locator('[data-bohemcars-compare-column]')).toHaveCount(4);
	await expect(compareTable.locator('tr')).toHaveCount(12);
	await expect(compareTable.locator('tr').first().locator('.h4.text-center').first()).toBeVisible();
	await expect(
		compareTable.locator('tr').first().locator('img.mb-10.radius-16.image').first()
	).toBeVisible();
	await expect(compareTable.locator('[data-bohemcars-compare-remove]')).toHaveCount(4);
	for (const rowLabel of [
		'Пробег:',
		'Година:',
		'Гориво:',
		'ID от източника:',
		'Номер в наличност:',
		'Цена:'
	]) {
		await expect(compareTable.locator('tr', { hasText: rowLabel })).toBeVisible();
	}
	await expect(page.locator('body')).toContainText('ID от източника');
	await expectBohemcarsShell(page);

	await page.goto('/agents');
	await expect(page.locator('body')).toContainText('Консултанти на Bohemcars');
	await expect(page.locator('body')).toContainText('Продажби и огледи');
	await expect(page.locator('body')).not.toContainText('Robert Fox');
	const agentsGrid = page.locator('[data-bohemcars-agent-management="false"]').first();
	await expect(agentsGrid).toBeVisible();
	await expect(agentsGrid).toHaveClass(/grid-cols-4/);
	await expect(agentsGrid.locator('.sale-agent-box')).toHaveCount(3);
	await expect(agentsGrid.locator('.sale-agent-box.active')).toHaveCount(1);
	await expect(agentsGrid.locator('.sale-agent-title')).toHaveCount(3);
	const firstAgentCard = agentsGrid.locator('.sale-agent-box').first();
	await firstAgentCard.hover();
	await expect(firstAgentCard.locator('.sale-agent-title')).toHaveCSS(
		'text-decoration-line',
		'none'
	);
	const agentImageTransform = await cssValue(
		firstAgentCard.locator('.card-top > a > img'),
		'transform'
	);
	expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(agentImageTransform);
	const firstAgentSocial = firstAgentCard.locator('.sale-agent-social li a').first();
	await expect(firstAgentSocial).toHaveCSS('opacity', '1');
	await expect(firstAgentSocial).toHaveCSS('bottom', '0px');
	await firstAgentSocial.hover();
	await expect(firstAgentSocial).toHaveCSS('background-color', 'rgb(238, 240, 236)');
	await expect(firstAgentSocial).toHaveCSS('border-color', 'rgb(214, 219, 209)');
	await expect(agentsGrid.locator('.sale-agent-social')).toHaveCount(3);
	await expect(agentsGrid.locator('.contact li')).toHaveCount(6);
	await expect(agentsGrid.locator('.sale-agent-title').first()).toHaveAttribute(
		'href',
		/\/agents\/bohemcars-sales$/
	);

	await page.goto('/agents/bohemcars-import');
	await expect(page.locator('body')).toContainText('Внос от Канада');
	await expect(page.locator('body')).toContainText('Verified Bohemcars Consultant');
	await expect(page.locator('body')).not.toContainText('Mike Hanley');
	const agentDetailContent = page.locator('.innerpage__content').first();
	await expect(agentDetailContent).toBeVisible();
	await expect(agentDetailContent.locator('img.w-full.mb-35.radius-16')).toBeVisible();
	await expect(agentDetailContent.locator('.verify.mb-16')).toContainText(
		'Verified Bohemcars Consultant'
	);
	await expect(agentDetailContent.locator('.bohemcars-agent-inventory')).toBeVisible();
	await expect(
		agentDetailContent.locator('.bohemcars-agent-inventory .card-box.card-box-style-9')
	).toHaveCount(3);
	await expect(
		agentDetailContent.locator(
			'.bohemcars-agent-inventory .compare-details[data-bohemcars-compare]'
		)
	).toHaveCount(3);
	await expect(agentDetailContent.locator('.bohemcars-agent-inventory .view-details')).toHaveCount(
		3
	);
	await expect(page.locator('form.send-inquiry').first()).toBeVisible();
	const missingAgentResponse = await page.goto('/agents/missing-consultant');
	expect(missingAgentResponse?.status()).toBe(404);
	await expect(page.locator('body')).toContainText('Agent not found');
});

test('planned public support routes render Bohemcars content and local forms', async ({ page }) => {
	const routes = [
		['/services', 'Внос от Канада'],
		['/sell-your-car', 'Продай автомобила си с Bohemcars'],
		['/about', 'Bohemcars: автомобили от Канада'],
		['/reviews', 'Aleksandar Vytev'],
		['/calculator', 'Калкулатор за внос'],
		['/faqs', 'Защо да внеса автомобил от Канада?'],
		['/terms', 'Условия за използване на Bohemcars'],
		['/blog', 'Какво проверява Bohemcars преди внос на автомобил от Канада'],
		['/blog/vnos-ot-kanada-proverka', 'Преди да препоръча автомобил, Bohemcars проверява произход']
	];

	for (const [route, expectedText] of routes) {
		await page.goto(route);
		await expect(page.locator('body')).toContainText(expectedText);
		await expectBohemcarsShell(page);
	}

	await page.goto('/about');
	const aboutContent = page.locator('[data-bohemcars-about]');
	await expect(aboutContent).toBeVisible();
	await expect(aboutContent.locator('.bohemcars-about-story')).toBeVisible();
	await expect(aboutContent).toContainText('Внос от Канада');
	await expect(aboutContent.locator('.bohemcars-about-service')).toHaveCount(3);
	await expect(aboutContent.locator('.sale-agent-box')).toHaveCount(3);
	await expect(aboutContent.locator('.sale-agent-box.active')).toHaveCount(1);
	await expect(aboutContent.locator('.sale-agent-social')).toHaveCount(3);
	await expect(aboutContent.locator('.wow.fadeInUp .sale-agent-box')).toHaveCount(3);
	await expect(aboutContent.locator('.bohemcars-about-brand-card')).toHaveCount(8);
	await expect(aboutContent.locator('.bohemcars-about-location-card')).toHaveCount(3);
	await expect(aboutContent.locator('.bohemcars-about-location__map iframe')).toBeVisible();
	await expect(aboutContent.locator('.sale-agent-title').first()).toHaveAttribute(
		'href',
		/^\.?\/agents\/bohemcars-sales$/
	);

	await page.goto('/reviews');
	const reviewsGrid = page.locator('[data-bohemcars-reviews-grid]');
	await expect(reviewsGrid).toBeVisible();
	await expect(reviewsGrid).toHaveClass(/grid-cols-3/);
	await expect(reviewsGrid.locator('.testimonior-box')).toHaveCount(6);
	await expect(reviewsGrid.locator('.testimonior--img')).toHaveCount(6);
	await expect(reviewsGrid.locator('.h5.title').first()).toHaveText('Aleksandar Vytev');

	await page.goto('/calculator');
	await page.waitForLoadState('networkidle');
	const calculator = page.locator('[data-bohemcars-calculator]');
	await expect(calculator).toBeVisible();
	await expect(calculator).toHaveClass(/grid-cols-2/);
	await expect(calculator.locator('[data-bohemcars-calc-input]')).toHaveCount(5);
	await expect(calculator.locator('[data-bohemcars-calc-output="total"]')).toHaveText('38 640 EUR');
	await calculator.locator('[data-bohemcars-calc-input="price"]').fill('30000');
	await expect(calculator.locator('[data-bohemcars-calc-output="price"]')).toHaveText('30 000 EUR');
	await expect(calculator.locator('[data-bohemcars-calc-output="total"]')).toHaveText('45 240 EUR');

	await page.goto('/terms');
	const termsContent = page.locator('[data-bohemcars-terms]');
	await expect(termsContent).toBeVisible();
	await expect(termsContent.locator('.term-page--nav a')).toHaveCount(6);
	await expect(termsContent.locator('.content .section')).toHaveCount(6);
	await expect(termsContent.locator('#section1 .h4')).toHaveText('1. Vehicle Information');
	await expect(termsContent.locator('#section6')).toContainText(
		'Do not submit sensitive payment details'
	);

	await page.goto('/faqs');
	const faqsContent = page.locator('[data-bohemcars-faqs]');
	await expect(faqsContent).toBeVisible();
	await expect(faqsContent.locator('.flat-accordion')).toHaveCount(4);
	await expect(faqsContent.locator('.flat-toggle')).toHaveCount(12);
	await expect(faqsContent.locator('.flat-toggle.active')).toHaveCount(4);
	await expect(faqsContent.locator('.toggle-title.active')).toHaveCount(4);
	await expect(faqsContent).toContainText('Внос и покупка');
	await expect(faqsContent).toContainText('Продажба и огледи');

	await page.goto('/blog');
	const blogGrid = page.locator('[data-bohemcars-blog-grid]');
	await expect(blogGrid).toBeVisible();
	await expect(blogGrid).toHaveClass(/grid-cols-3/);
	await expect(blogGrid.locator('.post-style-6')).toHaveCount(3);
	await expect(blogGrid.locator('.post--img')).toHaveCount(3);
	await expect(blogGrid.locator('.post-style-6').first()).toHaveAttribute(
		'href',
		/^\.?\/blog\/vnos-ot-kanada-proverka$/
	);

	await page.goto('/blog/vnos-ot-kanada-proverka');
	const blogDetail = page.locator('.innerpage__content.md-mb-30');
	await expect(blogDetail).toBeVisible();
	await expect(blogDetail.locator('.post--img.radius-20')).toBeVisible();
	await expect(blogDetail.locator('.quote')).toBeVisible();
	await expect(blogDetail.locator('.blog-detail-recentpost a')).toHaveCount(2);
	const blogCommentForm = blogDetail.locator('form.bohemcars-blog-comment-form');
	await expect(blogCommentForm).toBeVisible();
	await expect(blogCommentForm.locator('input.input-large')).toHaveCount(2);
	await expect(blogCommentForm.locator('textarea.message')).toBeVisible();
	await blogCommentForm.locator('input[name="name-review"]').fill('Proposal Reviewer');
	await blogCommentForm.locator('input[name="email-comment"]').fill('reviewer@example.com');
	await blogCommentForm.locator('textarea[name="comment"]').fill('Looks ready for review.');
	await blogCommentForm.locator('button').click();
	await expect(blogCommentForm.locator('.auxero-form-status')).toHaveText(
		'Comment saved locally for Bohemcars review'
	);
	const missingBlogResponse = await page.goto('/blog/missing-post');
	expect(missingBlogResponse?.status()).toBe(404);
	await expect(page.locator('body')).toContainText('Blog post not found');

	await page.goto('/services');
	await expect(page.locator('.service-box')).toHaveCount(6);
	await expect(page.locator('.services-center-info')).toContainText('Контакт за услуга');
	const serviceFormCard = page.locator('.services-center-form').first();
	await expect(serviceFormCard).toBeVisible();
	await expect(serviceFormCard).toHaveClass(/radius-20/);
	const serviceForm = serviceFormCard.locator('form.bohemcars-service-form');
	await expect(serviceForm).toBeVisible();
	await expect(serviceForm.locator('input.input-large')).toHaveCount(5);
	await expect(serviceForm.locator('select.select-style-2')).toBeVisible();
	await expect(serviceForm.locator('button')).toContainText('Изпрати заявка');

	await page.goto('/sell-your-car');
	await expect(page.locator('.sell-your-car-box')).toHaveCount(4);
	await expect(page.locator('.sell-your-car-box.active-step')).toHaveCount(1);
	const sellForm = page.locator('form.bohemcars-sell-form');
	await expect(sellForm).toBeVisible();
	await expect(sellForm).toHaveClass(/calculate-form/);
	await expect(sellForm.locator('input.input-large')).toHaveCount(4);
	await sellForm.locator('#sellVIN').fill('2T2ZZMCA1KC123456');
	await sellForm.locator('#sellMileage').fill('89000');
	await sellForm.locator('#sellPrice').fill('32000');
	await sellForm.locator('#sellPhone').fill('893588680');
	await sellForm.locator('button').click();
	await expect(sellForm.locator('.auxero-form-status')).toHaveText(
		'Заявката е подготвена. Bohemcars ще се свърже с вас.'
	);

	await page.goto('/contact');
	await expect(page.locator('body')).toContainText('Свържете се с Bohemcars');
	await expect(page.locator('.widget-gg-map iframe')).toBeHidden();
	await expect(
		page.locator('body.auxero-template-contact-us-html section.bg-white.pb-84')
	).toHaveCSS('background-color', 'rgb(17, 17, 17)');
	await expect(page.locator('.contact-page-info')).toContainText('Офис Bohemcars');
	const contactFormCard = page.locator('.contact-page-form').first();
	await expect(contactFormCard).toBeVisible();
	await expect(contactFormCard).toHaveClass(/radius-20/);
	await expect(contactFormCard.locator('.h3')).toContainText('Пишете ни за автомобил');
	const contact = page.locator('form.bohemcars-contact-form');
	await expect(contact).toBeVisible();
	await expect(contact.locator('input.input-large')).toHaveCount(4);
	await expect(contact.locator('input.input-large').nth(1)).toHaveCSS(
		'background-color',
		'rgb(255, 255, 255)'
	);
	await expect(contact.locator('input.input-large').nth(1)).toHaveCSS(
		'box-shadow',
		/0px 0px 0px 1px/
	);
	await expect(contact.locator('textarea#message')).toBeVisible();
	await expect(contact.locator('textarea#message')).toHaveCSS('box-shadow', /0px 0px 0px 1px/);
	await contact.locator('#Firstname').fill('QA');
	await contact.locator('#Lastname').fill('Contact');
	await contact.locator('#SendInquiryemail').fill('qa@example.com');
	await contact.locator('#SendInquiryphone').fill('893588680');
	await contact.locator('#message').fill('Please send available appointment times.');
	await contact.locator('button').click();
	await expect(contact.locator('.auxero-form-status')).toHaveText(
		'Съобщението е подготвено локално за Bohemcars'
	);
});

test('account and admin routes are role-aware and branded', async ({ page }) => {
	await page.goto('/account?role=customer');
	await expect(page.locator('body')).toContainText('Табло на акаунта');
	await expect(page.locator('body')).toContainText('Любими');
	await expect(
		page.locator('[data-bohemcars-menu-item="add"]', { hasText: 'Подай автомобил' }).first()
	).toBeVisible();
	await expect(page.locator('body')).not.toContainText('/admin/inventory/new?role=customer');
	const accountHeaderCta = page.locator('[data-dashboard-primary-action]');
	await expect(accountHeaderCta).toHaveCount(1);
	await expect(accountHeaderCta).toContainText('Подай автомобил');
	await expect(accountHeaderCta).toHaveAttribute('href', /^\.?\/account\/listings\/new$/);
	await expect(
		page.locator('[data-dashboard-primary-action]', { hasText: 'Add Listing' })
	).toHaveCount(0);
	await expectBohemcarsShell(page);
	const accountRecent = page.locator('[data-bohemcars-dashboard-recent]');
	await expect(accountRecent).toBeVisible();
	await expect(accountRecent).toContainText('Скорошни съобщения');
	await expect.poll(async () => accountRecent.locator('.comment-box').count()).toBeGreaterThan(0);
	await expect(accountRecent).toContainText('Bohemcars Sales');
	await expect(page.locator('body')).not.toContainText('Great Experience!');
	await expect(page.locator('body')).not.toContainText('Клиентски портал');

	await page.goto('/account?role=admin');
	await expect(page).toHaveURL(/\/admin$/);
	await expect(page.locator('body')).toContainText('Admin Dashboard');

	await page.goto('/account/favorites?role=customer');
	const favoritesGrid = page.locator('[data-bohemcars-favorites-grid]');
	await expect(favoritesGrid).toBeVisible();
	await expect(favoritesGrid).toHaveAttribute('data-bohemcars-favorites-count', '3');
	await expect(favoritesGrid).toHaveClass(/grid-cols-3/);
	await expect(
		page.locator('[aria-current="page"][data-bohemcars-menu-item="favorites"]')
	).toBeVisible();
	await expect(
		favoritesGrid.locator('.card-box.card-box-style-1[data-bohemcars-slug]')
	).toHaveCount(3);
	await expect(favoritesGrid.locator('.bohemcars-favorite.is-active')).toHaveCount(3);
	await expect(favoritesGrid.locator('.tag.mb-10')).toHaveCount(3);
	await expect(favoritesGrid.locator('.compare-details[data-bohemcars-compare]')).toHaveCount(3);
	await expect(favoritesGrid.locator('.card-box__title').first()).toHaveClass(/h6/);
	await expect(favoritesGrid.locator('.card-box__price').first()).toHaveClass(/h6/);
	const firstFavoriteSlug = await favoritesGrid
		.locator('[data-bohemcars-slug]')
		.first()
		.getAttribute('data-bohemcars-slug');
	expect(firstFavoriteSlug).toBeTruthy();
	await expect(favoritesGrid.locator('.view-details').first()).toHaveAttribute(
		'href',
		new RegExp(`/inventory/${firstFavoriteSlug}$`)
	);
	await expect(page.locator('body')).toContainText('BMW X5 40i M Sport Shadow Line');

	await page.goto('/account/compare?role=customer');
	await expect(page.locator('body')).toContainText('Сравнения');
	const accountCompareTable = page
		.locator('[data-bohemcars-compare-table]')
		.filter({ visible: true })
		.first();
	await expect(accountCompareTable).toBeVisible();
	await expect(accountCompareTable).toHaveClass(/card-details--table/);
	await expect(accountCompareTable).toHaveClass(/bohemcars-compare-table/);
	await expect(accountCompareTable.locator('[data-bohemcars-compare-column]')).toHaveCount(2);
	await expect(accountCompareTable.locator('tr')).toHaveCount(12);
	await expect(accountCompareTable.locator('[data-bohemcars-compare-remove]')).toHaveCount(2);
	await expect(accountCompareTable.locator('tr', { hasText: 'Пробег:' })).toBeVisible();

	await page.goto('/account/messages?role=customer');
	await expect(page.locator('body')).toContainText('Messages');
	const accountMessages = page.locator('[data-bohemcars-message-container]');
	await expect(accountMessages).toBeVisible();
	await expect(accountMessages.locator('.message-sidebar')).toBeVisible();
	await expect(accountMessages.locator('.message-chat')).toBeVisible();
	await expect
		.poll(async () => accountMessages.locator('.message-contact').count())
		.toBeGreaterThan(0);
	await expect(accountMessages.locator('.message-chat__header')).toHaveCount(1);
	await expect(accountMessages.locator('.message-chat__body')).toHaveCount(1);
	await expect
		.poll(async () => accountMessages.locator('.message-item').count())
		.toBeGreaterThan(1);
	await expect(accountMessages.locator('.message__action')).toBeVisible();
	await expect(accountMessages).toContainText('Bohemcars Sales');
	await expect(accountMessages).toContainText('Please send appointment options');
	await expect(page.locator('[data-contact="john"]')).toHaveCount(0);
	await expect(page.locator('body')).not.toContainText('Bohemcars follow-up is ready');

	await page.goto('/account/profile?role=customer');
	await expect(page.locator('body')).toContainText('Профил');
	const accountProfile = page.locator('[data-bohemcars-profile-form]');
	await expect(accountProfile).toBeVisible();
	await expect(
		page.locator('[aria-current="page"][data-bohemcars-menu-item="profile"]')
	).toBeVisible();
	await expect(accountProfile.locator('#avatarPreview')).toBeVisible();
	await expect(accountProfile.locator('#posterPreview')).toBeVisible();
	await expect(accountProfile.locator('#first_name')).toHaveValue('Bohemcars');
	await expect(accountProfile.locator('#last_name')).toHaveValue('Customer');
	await expect(accountProfile.locator('#EmailAddress')).toHaveValue('customer@bohemcars.local');
	await expect(accountProfile.locator('#Phone')).toHaveValue('+359 893 588 680');
	await expect(accountProfile.locator('#SalesPhone')).toHaveValue('+359 893 588 680');
	await expect(accountProfile.locator('#Company')).toHaveValue('Bohemcars');
	await expect(accountProfile.locator('#message')).toHaveValue(/Внос от Канада/);
	await expect(accountProfile.locator('.widget-gg-map iframe')).toBeVisible();
	await expect(page.locator('body')).not.toContainText('Lorem ipsum');
	await expect(page.locator('body')).not.toContainText('themesflat@gmail.com');
	await accountProfile.locator('button[type="submit"]').click();
	await expect(accountProfile.locator('.auxero-form-status')).toHaveText(
		'Profile saved locally for Bohemcars Customer'
	);

	await page.goto('/account/password?role=customer');
	await expect(page.locator('body')).toContainText('Change Password');
	const accountPassword = page.locator('[data-bohemcars-password-form]');
	await expect(accountPassword).toBeVisible();
	await expect(
		page.locator('[aria-current="page"][data-bohemcars-menu-item="password"]')
	).toBeVisible();
	await expect(accountPassword.locator('#Email')).toHaveValue('customer@bohemcars.local');
	await expect(accountPassword.locator('#OldPassword')).toHaveValue('');
	await expect(accountPassword.locator('#NewPassword')).toHaveValue('');
	await expect(accountPassword.locator('#RetypeNewPassword')).toHaveValue('');
	await accountPassword.locator('#OldPassword').fill('Bohemcars2026!');
	await accountPassword.locator('#NewPassword').fill('Bohemcars2026!');
	await accountPassword.locator('#RetypeNewPassword').fill('Bohemcars2026!');
	await accountPassword.locator('button[type="submit"]').click();
	await expect(accountPassword.locator('.auxero-form-status')).toHaveText(
		'Password change recorded locally'
	);

	await page.goto('/account/listings?role=customer');
	await expect(page.locator('body')).toContainText('Моите автомобили');
	const accountListings = page.locator('[data-bohemcars-account-listings]');
	const accountSubmissionRows = accountListings.locator('.cart-item[data-bohemcars-submission-id]');
	await expect(accountListings).toBeVisible();
	await expect(accountListings).toHaveAttribute('data-bohemcars-submissions-table', 'true');
	await expect.poll(async () => accountSubmissionRows.count()).toBeGreaterThan(1);
	const accountSubmissionCount = await accountSubmissionRows.count();
	await expect(accountListings).toContainText('Client BMW evaluation');
	await expect(accountListings).toContainText('Trade-in review request');
	await expect(accountListings.locator('a[href$="/sell-your-car"]')).toHaveCount(0);
	await expect(accountListings.locator('a[href*="/account/listings/edit/"]')).toHaveCount(
		accountSubmissionCount
	);
	await expect(accountListings.locator('a[href$="/account/messages"]')).toHaveCount(
		accountSubmissionCount
	);

	await page.goto('/admin?role=admin');
	await expect(page.locator('body')).toContainText('Admin Dashboard');
	await expect(page.locator('body')).toContainText('Inventory');
	const adminHeaderCta = page.locator('[data-dashboard-primary-action]');
	await expect(adminHeaderCta).toHaveCount(1);
	await expect(adminHeaderCta).toContainText('Add Listing');
	await expect(adminHeaderCta).toHaveAttribute('href', /^\.?\/admin\/inventory\/new$/);
	const adminRecent = page.locator('[data-bohemcars-dashboard-recent]');
	await expect(adminRecent).toBeVisible();
	await expect(adminRecent).toContainText('Admin Focus');
	await expect(page.locator('[data-bohemcars-dashboard-action="review-leads"]')).toContainText(
		'Review leads'
	);
	await expect(adminRecent.locator('.comment-box')).toHaveCount(3);
	await expect(adminRecent).toContainText(/Canada import lead|QA Contact|QA Visitor/);
	await expect(page.locator('body')).not.toContainText('Great Experience!');

	await page.goto('/admin/inventory?role=admin');
	await expect(page.locator('body')).toContainText('Inventory');
	const adminInventory = page.locator('[data-bohemcars-account-listings]');
	await expect(adminInventory).toBeVisible();
	await expect
		.poll(async () => adminInventory.locator('.cart-item[data-bohemcars-slug]').count())
		.toBeGreaterThan(0);
	await expect(adminInventory).toContainText('BMW X5 40i M Sport Shadow Line');
	const adminEditHref = await adminInventory
		.locator('a.cart-item__edit[aria-label^="Edit "]')
		.first()
		.getAttribute('href');
	const adminEditPath = new URL(adminEditHref ?? '', page.url()).pathname;
	expect(adminEditPath).toMatch(/^\/admin\/inventory\/edit\/[^/]+$/);
	expect(adminEditHref).not.toContain('%2F');
	await expect(adminInventory.locator('.cart-item__remove.action').first()).toBeVisible();

	await page.goto(`${adminEditPath}?role=admin`);
	await expect(page.locator('body')).toContainText('Edit Listing');
	const adminEditForm = page.locator('[data-bohemcars-admin-listing-editor]');
	await expect(adminEditForm).toBeVisible();
	await expect(adminEditForm).toHaveAttribute('data-bohemcars-admin-listing-mode', 'edit');
	await expect(adminEditForm.locator('input[name="source"]')).toHaveValue(
		/static-vehicle|admin-listing/
	);
	await expect(adminEditForm).toContainText('Listing workspace');
	await expect(adminEditForm).toContainText('Record summary');
	await expect(adminEditForm.locator('#title')).toHaveValue(/BMW X5|Audi|Mercedes|Volkswagen/);
	await expect(adminEditForm.locator('#vin')).not.toHaveValue('');
	await expect(adminEditForm.locator('#priceLabel')).not.toHaveValue('');
	await expect(adminEditForm.locator('#routePath')).toHaveValue(/\/inventory\//);
	await expect(adminEditForm.locator('button[type="submit"]')).toContainText(/Save/);
	await expect(page.locator('body')).not.toContainText('Lorem ipsum');

	await page.goto('/admin/inventory/new?role=admin');
	await expect(page.locator('body')).toContainText(/Add listing|Create inventory draft/);
	const adminNewForm = page.locator('[data-bohemcars-admin-listing-editor]');
	await expect(adminNewForm).toBeVisible();
	await expect(adminNewForm).toHaveAttribute('data-bohemcars-admin-listing-mode', 'create');
	await expect(adminNewForm.locator('input[name="source"]')).toHaveValue('admin-listing');
	await expect(adminNewForm.locator('#title')).toHaveValue('');
	await expect(adminNewForm.locator('#vin')).toHaveValue('');
	await expect(adminNewForm.locator('#priceLabel')).toHaveValue('');
	await expect(adminNewForm.locator('#routePath')).toHaveValue('');
	await expect(adminNewForm.locator('button[type="submit"]')).toContainText('Create listing');

	await page.goto('/admin/inquiries?role=agent');
	await expect(page.locator('body')).toContainText('Inquiries');
	await expect(
		page.locator('[aria-current="page"][data-bohemcars-menu-item="inquiries"]')
	).toBeVisible();
	const agentInquiries = page.locator('[data-bohemcars-admin-inquiries]');
	await expect(agentInquiries).toBeVisible();
	await expect
		.poll(async () => agentInquiries.locator('[data-bohemcars-admin-inquiry]').count())
		.toBeGreaterThan(0);
	await expect(agentInquiries).toContainText('Canada import lead');
	await expect(page.locator('[data-contact="john"]')).toHaveCount(0);

	await page.goto('/admin/messages?role=admin');
	await expect(page.locator('body')).toContainText('Messages');
	const adminMessages = page.locator('[data-bohemcars-admin-messages]');
	await expect(adminMessages).toBeVisible();
	await expect
		.poll(async () => adminMessages.locator('[data-bohemcars-admin-thread]').count())
		.toBeGreaterThan(0);
	await expect
		.poll(async () => adminMessages.locator('[data-bohemcars-admin-message]').count())
		.toBeGreaterThan(0);
	await expect(adminMessages).toContainText('Bohemcars Customer');
	await expect(adminMessages).toContainText('Please send appointment options');
	await expect(page.locator('[data-contact="john"]')).toHaveCount(0);
	await expect(page.locator('body')).not.toContainText('Bohemcars follow-up is ready');

	await page.goto('/admin/agents?role=admin');
	await expect(page.locator('body')).toContainText('Agents');
	const adminAgents = page.locator('[data-bohemcars-agent-management="true"]');
	await expect(adminAgents).toBeVisible();
	await expect(adminAgents.locator('[data-bohemcars-agent-card]')).toHaveCount(3);
	await expect(adminAgents.locator('[data-bohemcars-agent-status="active"]')).toHaveCount(3);
	await expect(adminAgents.locator('a[href*="/admin/agents/"]')).toHaveCount(3);
	await expect(adminAgents).toContainText(/Open leads/i);

	const forbiddenAgents = await page.goto('/admin/agents?role=customer');
	expect(forbiddenAgents?.status()).toBe(403);
	await expect(page.locator('body')).toContainText(
		'Bohemcars account role cannot access this route'
	);

	await page.goto('/admin/users?role=admin');
	await expect(page.locator('body')).toContainText('Users');
	const adminUsers = page.locator('[data-bohemcars-users-table]');
	await expect(adminUsers).toBeVisible();
	await expect(adminUsers.locator('thead th')).toHaveCount(5);
	await expect
		.poll(async () => adminUsers.locator('[data-bohemcars-user-id]').count())
		.toBeGreaterThan(2);
	await expect(adminUsers.locator('[data-bohemcars-user-role="admin"]')).toBeVisible();
	await expect(adminUsers).toContainText('customer@bohemcars.local');
	await expect(adminUsers).toContainText('Canada import lead');
	await expect(adminUsers.locator('form input[name="id"]')).toHaveCount(3);
	await expect.poll(async () => adminUsers.getByText('Open lead').count()).toBeGreaterThan(0);
	await expect(adminUsers).toContainText('Account edits stay in the table row');

	const forbidden = await page.goto('/admin?role=customer');
	expect(forbidden?.status()).toBe(403);
	await expect(page.locator('body')).toContainText(
		'Bohemcars account role cannot access this route'
	);
});

test('blocked ecommerce and coming-soon routes are not exposed', async ({ page }) => {
	const blockedRoutes = [
		'/shop',
		'/shop.html',
		'/shopping-cart.html',
		'/check-out.html',
		'/product-details.html',
		'/coming-soon.html'
	];

	for (const route of blockedRoutes) {
		const response = await page.goto(route);
		expect(response?.status(), `${route} should be blocked`).toBe(404);
		await expect(page.locator('body')).toContainText('Auxero template route not found');
	}
});

test('sitemap exposes public proposal routes without dashboard surfaces', async ({ page }) => {
	const response = await page.goto('/sitemap.xml');
	if (!response) throw new Error('Expected sitemap response');

	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toContain('application/xml');

	const xml = await response.text();
	expect(xml).toContain('<loc>https://bohemcars.net/</loc>');
	expect(xml).toContain('<loc>https://bohemcars.net/inventory</loc>');
	expect(xml).toContain('<loc>https://bohemcars.net/inventory?view=3</loc>');
	expect(xml).toContain('<loc>https://bohemcars.net/inventory?view=map</loc>');
	expect(xml).toContain('<loc>https://bohemcars.net/agents</loc>');
	expect(xml).toContain('<loc>https://bohemcars.net/sell-your-car</loc>');
	expect(xml).toContain('<loc>https://bohemcars.net/contact</loc>');
	expect(xml).not.toContain('https://bohemcars.net/account');
	expect(xml).not.toContain('https://bohemcars.net/admin');
	expect(xml).not.toContain('/shop');
	expect(xml).not.toContain('/check-out');
});
