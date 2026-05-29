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

test('homepage preserves Home 05 and routes hero search to inventory', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('.page-title-style-4')).toBeVisible();
	await expect(page.locator('h1.search-cars__title').first()).toContainText(
		'Разгледай, сравни и избери'
	);
	await expect(page.locator('h1.search-cars__title').first()).toContainText('Bohemcars');
	await expect(page.locator('body')).toContainText('Автомобили от Канада с проверена история');
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
	await expect(homeHeader.locator('.header-right.main-nav-wrapper')).toHaveCSS('display', 'grid');
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
		/\/assets\/bohemcars\/megamenu\/inventory-bmw-x5-cutout\.png$/
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
	await expect(homeHero.locator('.swiper-btn.navigation-prev')).toHaveCount(1);
	await expect(homeHero.locator('.swiper-btn.navigation-next')).toHaveCount(1);
	await expect(homeHero.locator('.page-title--slider.sw-single')).toBeVisible();
	await expect(homeHero.locator('.sw-single-thumb .search-cars__title')).toHaveCount(4);
	await expect(homeHero.locator('.menu-tab-style1 li')).toHaveCount(3);
	await expect(
		homeHero.locator('.search-cars__filters > .search-cars__select-wrapper')
	).toHaveCount(4);
	await expect(homeHero.locator('.search-cars__advanced .search-cars__select-wrapper')).toHaveCount(
		3
	);
	await expect(homeHero.locator('.search-cars__features-grid .form-group')).toHaveCount(8);
	const homeFeaturedSection = page.locator('[data-bohemcars-home-vehicles]');
	await expect(homeFeaturedSection.locator('h2')).toHaveText('Налични автомобили');
	await expect(homeFeaturedSection).not.toContainText('Актуална наличност');
	await expect(homeFeaturedSection).not.toContainText('Подбрани автомобили с проверен произход');
	const featuredCta = homeFeaturedSection.locator('.bohemcars-stock-banner__cta');
	await expect(featuredCta).toContainText('Виж всички');
	await expect(featuredCta).toHaveClass(/btn-line-white/);
	await expect(featuredCta).toHaveAttribute('href', /\/inventory\?view=4$/);
	await expect(featuredCta).toHaveCSS('border-radius', '12px');
	await featuredCta.hover();
	await expect(featuredCta).toHaveCSS('transform', 'none');
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pill')).toHaveCount(12);
	await expect(
		homeFeaturedSection.locator('.bohemcars-quick-pill.bohemcars-type-pill')
	).toHaveCount(4);
	await expect(
		homeFeaturedSection.locator('.bohemcars-quick-pill.bohemcars-spec-pill')
	).toHaveCount(5);
	await expect(
		homeFeaturedSection.locator('.bohemcars-quick-pill.bohemcars-brand-pill')
	).toHaveCount(3);
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pill.active')).toContainText('SUV');
	await expect(homeFeaturedSection.locator('.bohemcars-vehicle-pill.active')).toHaveCSS(
		'background-color',
		'rgb(217, 242, 117)'
	);
	await expect(homeFeaturedSection).toContainText('Автоматик');
	await expect(homeFeaturedSection).toContainText('4x4');
	await expect(homeFeaturedSection).toContainText('Бензин');
	await expect(homeFeaturedSection).toContainText('2021+');
	await expect(homeFeaturedSection).toContainText('до 120k');
	await expect(homeFeaturedSection).toContainText('BMW');
	await expect(homeFeaturedSection).toContainText('Audi');
	await expect(homeFeaturedSection).toContainText('Mercedes');
	await expect(homeFeaturedSection.locator('.bohemcars-type-icon')).toHaveCount(4);
	await expect(homeFeaturedSection.locator('.bohemcars-type-icon--suv')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-type-icon--sedan')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-type-icon--coupe')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-type-icon--luxury')).toHaveCount(1);
	await expect(homeFeaturedSection.locator('.bohemcars-pill-image--spec')).toHaveCount(5);
	await expect(homeFeaturedSection.locator('.bohemcars-pill-image--brand')).toHaveCount(3);
	const featuredPillRows = await homeFeaturedSection
		.locator('.bohemcars-vehicle-pill')
		.evaluateAll(
			(pills) => new Set(pills.map((pill) => Math.round(pill.getBoundingClientRect().top))).size
		);
	expect(featuredPillRows).toBe(1);
	const featuredGrid = homeFeaturedSection.locator('.bohemcars-home-vehicle-grid');
	await expect(featuredGrid).toBeVisible();
	await expect(featuredGrid).toHaveClass(/grid-cols-4/);
	await expect(featuredGrid.locator('.card-box-style-1')).toHaveCount(8);
	await expect(homeFeaturedSection.locator('ul.tag.style2')).toHaveCount(0);
	await expect(homeFeaturedSection.locator('.pagination-swiper-card-5')).toHaveCount(0);
	const featuredCard = homeFeaturedSection.locator('.card-box-style-1').first();
	await featuredCard.hover();
	await expect(featuredCard.locator('.card--img')).toHaveCSS('transform', 'none');
	await expect(featuredCard.locator('.top .highlight')).toHaveText(/km$/);
	const featuredSpecs = featuredCard.locator('.bohemcars-card-specs');
	await expect(featuredSpecs.locator('li')).toHaveCount(3);
	const featuredMileageText = await featuredCard.locator('.top .highlight').innerText();
	await expect(featuredSpecs).not.toContainText(featuredMileageText);
	const featuredSpecRows = await featuredSpecs
		.locator('li')
		.evaluateAll(
			(items) => new Set(items.map((item) => Math.round(item.getBoundingClientRect().top))).size
		);
	expect(featuredSpecRows).toBe(1);
	await expect(featuredCard.locator('.bohemcars-card-price__amount')).toHaveCSS(
		'font-size',
		'22px'
	);
	await expect(featuredCard.locator('.bohemcars-card-price__amount')).toHaveCSS(
		'font-weight',
		'600'
	);
	await expect(featuredCard.locator('.bohemcars-card-price__finance')).toBeVisible();
	const featuredMonthlyBox = await featuredCard
		.locator('.bohemcars-card-price__monthly')
		.boundingBox();
	const featuredFinanceBox = await featuredCard
		.locator('.bohemcars-card-price__finance-link')
		.boundingBox();
	expect(featuredFinanceBox?.y ?? 0).toBeGreaterThan(featuredMonthlyBox?.y ?? 0);
	await expect(featuredCard.locator('.compare-details')).toHaveCSS(
		'background-color',
		'rgb(28, 28, 28)'
	);
	await expect(featuredCard.locator('.compare-details')).toHaveCSS('color', 'rgb(255, 255, 255)');
	const featuredColumnCount = await featuredGrid.evaluate(
		(grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length
	);
	expect(featuredColumnCount).toBe(4);
	const featuredActionOffsets = await featuredGrid
		.locator('[data-bohemcars-slug]')
		.evaluateAll((cards) =>
			cards.slice(0, 4).map((card) => {
				const cardBox = card.getBoundingClientRect();
				const action = card.querySelector('.bohemcars-card-actions')?.getBoundingClientRect();

				return Math.round((action?.top ?? 0) - cardBox.top);
			})
		);
	expect(
		Math.max(...featuredActionOffsets) - Math.min(...featuredActionOffsets)
	).toBeLessThanOrEqual(1);
	const homeBrowseSection = page.locator('.bohemcars-browse-section');
	await expect(homeBrowseSection).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	const browseSurface = homeBrowseSection.locator('.bohemcars-browse-section__surface');
	await expect(browseSurface).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
	await expect(browseSurface).toHaveCSS('border-top-width', '0px');
	await expect(browseSurface).toHaveCSS('box-shadow', 'none');
	await expect(browseSurface).toHaveCSS('border-top-left-radius', '0px');
	const homeBrandSection = homeBrowseSection.locator('.bohemcars-brand-strip');
	const brandCta = homeBrandSection.locator('.title-section a');
	await expect(brandCta).toContainText('Виж всички марки');
	await expect(brandCta).toHaveClass(/btn-primary-3/);
	await expect(brandCta).toHaveClass(/bohemcars-section-cta/);
	await expect(brandCta).toHaveCSS('background-color', 'rgb(152, 188, 42)');
	await expect(brandCta).toHaveCSS('color', 'rgb(255, 255, 255)');
	await expect(brandCta.locator('svg path')).toHaveCSS('fill', 'rgb(255, 255, 255)');
	await expect(brandCta).toHaveCSS('border-radius', '12px');
	await brandCta.hover();
	await expect(brandCta).toHaveCSS('background-color', 'rgb(28, 28, 28)');
	await expect(brandCta).toHaveCSS('color', 'rgb(255, 255, 255)');
	await expect(brandCta).toHaveCSS('transform', 'none');
	await expect(homeBrandSection.locator('.out-brand-2')).toHaveCount(12);
	await expect(page.locator('.out-brand-2')).toHaveCount(12);
	const firstBrandTile = homeBrandSection.locator('.out-brand-2').first();
	await expect(firstBrandTile).toHaveCSS('background-color', 'rgb(248, 249, 246)');
	await expect(firstBrandTile).toHaveCSS('border-top-color', 'rgb(231, 231, 231)');
	await expect(firstBrandTile).toHaveCSS('border-top-left-radius', '8px');
	await expect(firstBrandTile).toHaveCSS('box-shadow', 'none');
	await homeBrandSection.locator('.out-brand-2').first().hover();
	await expect(firstBrandTile).toHaveCSS('box-shadow', 'none');
	const typeGallery = homeBrowseSection.locator('.bohemcars-type-gallery');
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
		'rgb(255, 255, 255)'
	);
	await expect(typeGallery.locator('.bohemcars-type-gallery__cta svg path')).toHaveCSS(
		'fill',
		'rgb(255, 255, 255)'
	);
	await expect(typeGallery.locator('.bohemcars-type-card').first()).toHaveCSS(
		'background-color',
		'rgba(0, 0, 0, 0)'
	);
	const typeGalleryBox = await typeGallery.locator('.bohemcars-type-gallery__grid').boundingBox();
	const browseSurfaceBox = await browseSurface.boundingBox();
	expect(typeGalleryBox?.x).toBeGreaterThanOrEqual((browseSurfaceBox?.x ?? 0) - 1);
	expect((typeGalleryBox?.x ?? 0) + (typeGalleryBox?.width ?? 0)).toBeLessThanOrEqual(
		(browseSurfaceBox?.x ?? 0) + (browseSurfaceBox?.width ?? 0) + 1
	);
	await expect(page.locator('.bohemcars-type-card')).toHaveCount(8);
	await expect(
		homeBrowseSection.locator('img[src*="/assets/images/card/card-27.png"]')
	).toBeVisible();
	const homeCompareSection = page.locator('section', {
		hasText: 'Сравни избрани автомобили'
	});
	await expect(homeCompareSection).toHaveCSS('background-color', 'rgb(246, 247, 243)');
	await expect(homeCompareSection.locator('.bohemcars-compare-card')).toHaveCount(2);
	await expect(homeCompareSection.locator('.bohemcars-compare-card__media img')).toHaveCount(4);
	await expect(homeCompareSection.locator('.bohemcars-compare-card__vs')).toHaveCount(2);
	await expect(homeCompareSection.locator('.btn.btn-small.btn-primary-3.text-sm')).toHaveCount(2);
	await expect(homeCompareSection.locator('.bohemcars-compare-card__action svg').first()).toHaveCSS(
		'stroke',
		'rgb(255, 255, 255)'
	);
	const homeBudgetSection = page.locator('section', { hasText: 'Автомобили по бюджет' });
	await expect(homeBudgetSection).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	await expect(homeBudgetSection.locator('.bohemcars-home-section-surface')).toHaveCSS(
		'background-color',
		'rgba(0, 0, 0, 0)'
	);
	await expect(homeBudgetSection.locator('.bohemcars-home-section-surface')).toHaveCSS(
		'border-top-left-radius',
		'0px'
	);
	await expect(homeBudgetSection.locator('.menu-tab-style2 .car-box')).toHaveCount(5);
	await expect(homeBudgetSection.locator('.content-inner.active > .grid')).toHaveClass(
		/grid-cols-4/
	);
	await expect(homeBudgetSection.locator('.card-box-style-1')).toHaveCount(8);
	await expect(homeBudgetSection.locator('ul.tag.style2')).toHaveCount(8);
	const budgetCard = homeBudgetSection.locator('.card-box-style-1').first();
	await expect(budgetCard.locator('.top .highlight')).toHaveText(/km$/);
	const budgetSpecs = budgetCard.locator('.bohemcars-card-specs');
	await expect(budgetSpecs.locator('li')).toHaveCount(3);
	const budgetMileageText = await budgetCard.locator('.top .highlight').innerText();
	await expect(budgetSpecs).not.toContainText(budgetMileageText);
	const budgetActionOffsets = await homeBudgetSection
		.locator('.content-inner.active > .grid > [data-bohemcars-slug]')
		.evaluateAll((cards) =>
			cards.slice(0, 4).map((card) => {
				const cardBox = card.getBoundingClientRect();
				const action = card.querySelector('.bohemcars-card-actions')?.getBoundingClientRect();

				return Math.round((action?.top ?? 0) - cardBox.top);
			})
		);
	expect(Math.max(...budgetActionOffsets) - Math.min(...budgetActionOffsets)).toBeLessThanOrEqual(
		1
	);
	const homeReviewsSection = page.locator('section', { hasText: 'Отзиви от клиенти' });
	await expect(homeReviewsSection).toHaveCSS('background-color', 'rgb(255, 255, 255)');
	const reviewsPanel = homeReviewsSection.locator('.bohemcars-reviews-panel');
	await expect(reviewsPanel).toHaveCSS('background-color', 'rgb(246, 247, 243)');
	await expect(reviewsPanel).toHaveCSS('border-top-left-radius', '8px');
	await expect(homeReviewsSection.locator('.swiper-testimonior')).toBeVisible();
	await expect(homeReviewsSection.locator('.swiper-slide .testimonior-box')).toHaveCount(6);
	await expect(homeReviewsSection.locator('.swiper-slide .testimonior-box').first()).toHaveCSS(
		'background-color',
		'rgb(255, 255, 255)'
	);
	await expect(homeReviewsSection.locator('.swiper-slide .testimonior-box').first()).toHaveCSS(
		'border-top-left-radius',
		'8px'
	);
	await expect(homeReviewsSection.locator('img[src="/assets/icons/star.svg"]')).toHaveCount(30);
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
	const homeNewsSection = page.locator('section', { hasText: 'Съвети от Bohemcars' });
	await expect(homeNewsSection.locator('.post-style-2')).toHaveCount(1);
	await expect(homeNewsSection.locator('.post-style-3')).toHaveCount(2);
	await expect(homeNewsSection.locator('img.post--img, .post--img img')).toHaveCount(3);
	await expect(homeNewsSection.locator('span', { hasText: 'от Bohemcars' })).toHaveCount(3);
	await expect(homeNewsSection.locator('.title-section a')).toHaveAttribute('href', /^\.?\/blog$/);
	const homeFooter = page.locator('footer.footer');
	await expect(homeFooter).toHaveCount(1);
	await expect(homeFooter.locator('.footer-top')).toBeVisible();
	await expect(homeFooter.locator('.form-footer #footer-email')).toBeVisible();
	await expect(homeFooter.locator('.footer-links .collapse')).toHaveCount(2);
	await expect(homeFooter.locator('.footer-links .widget-links li')).toHaveCount(14);
	await expect(homeFooter.locator('.footer-contact')).toContainText('+359 893 588 680');
	await expect(homeFooter.locator('.footer-contact')).toContainText('Plovdiv');
	await expect(homeFooter.locator('.widget-socical li')).toHaveCount(6);
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
		.not.toContain('<\\/script>');
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

test('header, garage, and inquiry flows keep Auxero behavior', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('link', { name: /inventory/i }).first()).toBeVisible();
	await expect(
		page
			.getByRole('button', { name: /sign in/i })
			.or(page.getByRole('link', { name: /sign in/i }))
			.first()
	).toBeVisible();
	await expect(page.getByRole('link', { name: /add listing/i })).toHaveCount(0);

	await page.goto('/inventory');
	await page.evaluate(() => {
		localStorage.removeItem('bohemcars:favorites');
		localStorage.removeItem('bohemcars:compare');
	});
	await page.reload();

	const firstCard = page.locator('[data-bohemcars-slug]').first();
	const firstSlug = await firstCard.getAttribute('data-bohemcars-slug');
	expect(firstSlug).toBeTruthy();

	await firstCard.locator('.bohemcars-favorite, .heart').click();
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
	await inquiryForm.getByRole('button', { name: 'Send Message' }).click();
	await expect(inquiryForm.locator('.auxero-form-status')).toHaveText(
		'Message queued for Bohemcars locally'
	);
});

test('inventory supports branded cards, saved favorites, compare, and view toggles', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/inventory');

	await expect(page.locator('body')).toContainText('Showing 1 - 42 of 42 Bohemcars Listings');
	await expect(page.locator('section.background-light.mb-32')).toHaveCount(0);
	await expect(page.locator('.breadcrumb')).toHaveCount(0);
	await expect(page.locator('.bohemcars-inventory-banner')).toBeVisible();
	await expect(page.locator('.bohemcars-inventory-banner')).toContainText('Browse inventory');
	await expect(page.locator('section.pb-100 > .container > h2')).toHaveCount(0);
	await expect(page.locator('.bohemcars-inventory-searchbar')).toHaveCount(1);
	await expect(page.locator('.bohemcars-inventory-searchbar input[name="q"]')).toHaveAttribute(
		'placeholder',
		'Search brand, model, stock #'
	);
	await expect(page.locator('.bohemcars-inventory-brand-pills .bohemcars-brand-pill')).toHaveCount(
		6
	);
	await expect(page.locator('.bohemcars-inventory-brand-pills img')).toHaveCount(5);
	await expect(page.locator('.bohemcars-inventory-searchbar #filterSidebarToggle')).toBeVisible();
	await expect(page.locator('section.pb-100')).toHaveCSS('background-color', 'rgb(246, 247, 243)');
	await expect(page.locator('.bohemcars-inventory-content > .content-inner.active')).toHaveCSS(
		'transition-duration',
		'0s'
	);
	await expect(page.locator('.bohemcars-inventory-content > .content-inner.active')).toHaveCSS(
		'transform',
		'none'
	);
	await expect(
		page.locator('.bohemcars-inventory-brand-pills .bohemcars-quick-pill').first()
	).toHaveCSS('transition-duration', '0s');
	await expect(
		page.locator('.bohemcars-inventory-brand-pills .bohemcars-quick-pill a').first()
	).toHaveCSS('transition-duration', '0s');
	await expect(page.locator('.bohemcars-inventory-searchbar__primary')).toHaveCSS(
		'transition-duration',
		'0s'
	);
	await expect(page.locator('[data-bohemcars-slug]').first()).toBeVisible();
	await expectBohemcarsShell(page);

	await page.goto('/inventory?q=Audi');
	await expect(page.locator('body')).toContainText(
		'Showing 1 - 9 of 9 matching Bohemcars Listings'
	);
	await expect(page.locator('[data-bohemcars-slug]').first()).toContainText('Audi');

	const firstCard = page.locator('[data-bohemcars-slug]').first();
	const firstSlug = await firstCard.getAttribute('data-bohemcars-slug');
	expect(firstSlug).toBeTruthy();

	await page.goto('/inventory?brand=Audi');
	await expect(page.locator('[data-bohemcars-slug]').first()).toContainText('Audi');

	await page.goto('/inventory');
	const refreshedFirstCard = page.locator('[data-bohemcars-slug]').first();
	const refreshedFirstSlug = await refreshedFirstCard.getAttribute('data-bohemcars-slug');
	const inventoryContainerBox = await page
		.locator('section.pb-100 > .container')
		.first()
		.boundingBox();
	expect(inventoryContainerBox?.width ?? 0).toBeGreaterThan(1400);
	const refreshedFirstCardBox = await refreshedFirstCard.boundingBox();
	expect(refreshedFirstCardBox?.width ?? 0).toBeGreaterThan(300);
	expect(refreshedFirstCardBox?.width ?? 0).toBeLessThan(360);
	const cardImageRatio = await boxRatio(refreshedFirstCard.locator('.card--img'));

	expect(cardImageRatio).toBeGreaterThan(1.31);
	expect(cardImageRatio).toBeLessThan(1.35);
	await expect(page.locator('.bohemcars-inventory-toolbar-row')).toBeVisible();
	await expect(page.locator('.bohemcars-inventory-content')).toHaveCSS(
		'background-color',
		'rgb(255, 255, 255)'
	);
	await expect(page.locator('.bohemcars-inventory-content')).toHaveCSS('border-radius', '8px');
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
	const compactSpecs = refreshedFirstCard.locator('.bohemcars-card-specs');
	await expect(compactSpecs.locator('li')).toHaveCount(3);
	await expect(compactSpecs).toContainText('2019');
	await expect(compactSpecs).toContainText('Petrol');
	await expect(compactSpecs).toContainText('Automatic');
	await expect(compactSpecs).not.toContainText('140 000 km');
	await expect(compactSpecs.locator('li span').first()).toHaveCSS('font-size', '14px');
	const compactSpecRows = await compactSpecs
		.locator('li')
		.evaluateAll(
			(items) => new Set(items.map((item) => Math.round(item.getBoundingClientRect().top))).size
		);
	expect(compactSpecRows).toBe(1);
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
	await expect(refreshedFirstCard.locator('.compare-details')).toContainText('Compare');
	await expect(refreshedFirstCard.locator('.compare-details')).toHaveCSS('border-radius', '12px');
	await refreshedFirstCard.locator('.compare-details').hover();
	await expect(refreshedFirstCard.locator('.compare-details')).toHaveCSS(
		'background-color',
		'rgb(28, 28, 28)'
	);
	await expect(refreshedFirstCard.locator('.card--img')).toHaveCSS('transform', 'none');
	await expect(refreshedFirstCard.locator('.view-details')).toHaveAttribute(
		'href',
		new RegExp(`/inventory/${refreshedFirstSlug}$`)
	);

	await page.goto('/inventory?view=3');
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Comfortable 3 grid'
	);
	await expect(
		page.locator('.bohemcars-inventory-content > .content-inner.active > div.grid')
	).toHaveClass(/grid-cols-3/);

	await page.goto('/inventory?view=4');
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

	await page.goto('/inventory?view=map');
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Half map'
	);
	await expect(
		page.locator('.bohemcars-inventory-content .card-box-style-9').first()
	).toBeVisible();
	await expect(page.locator('.bohemcars-map-fallback')).toContainText(
		'Exact vehicle viewing location'
	);

	await page.goto('/inventory');
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

	await page.goto(`/inventory/${firstSlug}`);
	const detailTitle = page.locator('.listing-details--content h2').first();

	await expect(page.locator('.listing-details[data-bohemcars-detail="true"]')).toBeVisible();
	await expect(page.locator('.listing-details--content')).toBeVisible();
	await expect(page.locator('.listing-details--sidebar')).toBeVisible();
	await expect(page.locator('.title-section .btn-line[data-bohemcars-compare]')).toContainText(
		'Compare'
	);
	await expect(page.locator('.title-section .bohemcars-favorite')).toBeVisible();
	await expect(page.locator('.swiper-listing-details-main .listing-details-item')).toHaveCount(7);
	await expect(page.locator('.swiper-listing-details-thumbs .listing-details-thumb')).toHaveCount(
		7
	);
	await expect(page.locator('.listing-details--content .menu-tab-style4 li')).toHaveCount(6);
	await expect(page.locator('.listing-details--sidebar .menu-tab-style5 li')).toHaveCount(2);
	await expect(page.locator('.car-overview-list-style2 > li')).toHaveCount(10);
	await expect(page.locator('form.send-inquiry')).toBeVisible();
	await expect(page.locator('.listing-details')).toContainText(firstTitle);
	expect(await cssValue(detailTitle, 'color')).toBe('rgb(28, 28, 28)');
	expect(await cssValue(detailTitle, 'font-size')).toBe('40px');
	await expect(page.locator('.listing-details--sidebar-box .h4').first()).toHaveCSS(
		'color',
		'rgb(28, 28, 28)'
	);
	await expect(page.locator('.car-overview-list-style2 .text-secondary').first()).toHaveCSS(
		'color',
		'rgb(75, 75, 75)'
	);
	await expect(page.locator('body')).toContainText('Bohemcars Consultant');
	await expect(page.locator('body')).toContainText('Source ID');
	await expect(page.locator('body')).toContainText('Equipment');
	await expectBohemcarsShell(page);

	const inquiry = page.locator('form.send-inquiry');
	await inquiry.locator('#SendInquiryname').fill('QA Visitor');
	await inquiry.locator('#SendInquiryemail').fill('qa@example.com');
	await inquiry.locator('#SendInquiryphone').fill('893588680');
	await inquiry.locator('#message').fill('Please confirm the next viewing appointment.');
	await inquiry.locator('button', { hasText: 'Send Inquiry' }).click();
	await expect(inquiry.locator('.auxero-form-status')).toHaveText(
		'Inquiry sent to Bohemcars locally'
	);
});

test('compare and consultants render branded buyer flows without login', async ({ page }) => {
	await page.goto('/compare');
	await expect(page.locator('body')).toContainText('Compare Bohemcars Vehicles Side-by-Side');
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
	for (const rowLabel of ['Mileage:', 'Years:', 'Fuel:', 'Source ID:', 'Stock Number:', 'Price:']) {
		await expect(compareTable.locator('tr', { hasText: rowLabel })).toBeVisible();
	}
	await expect(page.locator('body')).toContainText('Source ID');
	await expectBohemcarsShell(page);

	await page.goto('/agents');
	await expect(page.locator('body')).toContainText('Bohemcars Consultants');
	await expect(page.locator('body')).toContainText('Bohemcars Sales');
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
	await expect(page.locator('body')).toContainText('Bohemcars Import');
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
		['/sell-your-car', 'Продай автомобила си With Bohemcars'],
		['/about', 'Проверка преди избор'],
		['/reviews', 'Aleksandar Vytev'],
		['/calculator', 'Калкулатор за внос'],
		['/faqs', 'Why import a vehicle from Canada?'],
		['/terms', 'Bohemcars Terms Of Use'],
		['/blog', 'What Bohemcars Checks Before Importing A Vehicle From Canada'],
		['/blog/vnos-ot-kanada-proverka', 'Before recommending a vehicle, Bohemcars reviews origin']
	];

	for (const [route, expectedText] of routes) {
		await page.goto(route);
		await expect(page.locator('body')).toContainText(expectedText);
		await expectBohemcarsShell(page);
	}

	await page.goto('/about');
	const aboutContent = page.locator('[data-bohemcars-about]');
	await expect(aboutContent).toBeVisible();
	await expect(aboutContent.locator('.bohemcars-about-profile')).toBeVisible();
	await expect(aboutContent.locator('.bohemcars-about-profile__stat')).toHaveCount(4);
	await expect(aboutContent.locator('.bohemcars-about-step')).toHaveCount(4);
	await expect(aboutContent.locator('.swiper-testimonior .testimonior-box')).toHaveCount(4);
	await expect(aboutContent.locator('.why-choose-us.style2.style3')).toBeVisible();
	await expect(aboutContent.locator('.sale-agent-box')).toHaveCount(3);
	await expect(aboutContent.locator('.sale-agent-box.active')).toHaveCount(1);
	await expect(aboutContent.locator('.sale-agent-social')).toHaveCount(3);
	await expect(aboutContent.locator('.wow.fadeInUp .sale-agent-box')).toHaveCount(3);
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
	await expect(faqsContent).toContainText('Import And Buying');
	await expect(faqsContent).toContainText('Selling And Appointments');

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
		'Sell-your-car request prepared locally for Bohemcars'
	);

	await page.goto('/contact');
	await expect(page.locator('body')).toContainText('Reach Out to Bohemcars');
	await expect(page.locator('.widget-gg-map iframe')).toBeVisible();
	await expect(page.locator('.contact-page-info')).toContainText('Bohemcars Office');
	const contactFormCard = page.locator('.contact-page-form').first();
	await expect(contactFormCard).toBeVisible();
	await expect(contactFormCard).toHaveClass(/radius-20/);
	await expect(contactFormCard.locator('.h3')).toContainText('get in touch');
	const contact = page.locator('form.bohemcars-contact-form');
	await expect(contact).toBeVisible();
	await expect(contact.locator('input.input-large')).toHaveCount(4);
	await expect(contact.locator('textarea#message')).toBeVisible();
	await contact.locator('#Firstname').fill('QA');
	await contact.locator('#Lastname').fill('Contact');
	await contact.locator('#SendInquiryemail').fill('qa@example.com');
	await contact.locator('#SendInquiryphone').fill('893588680');
	await contact.locator('#message').fill('Please send available appointment times.');
	await contact.locator('button').click();
	await expect(contact.locator('.auxero-form-status')).toHaveText(
		'Message queued for Bohemcars locally'
	);
});

test('account and admin routes are role-aware and branded', async ({ page }) => {
	await page.goto('/account?role=customer');
	await expect(page.locator('body')).toContainText('Account Dashboard');
	await expect(page.locator('body')).toContainText('My Favorites');
	await expect(
		page.locator('.dashboard-menu-item[href="/sell-your-car"]', { hasText: 'Submit Vehicle' })
	).toBeVisible();
	await expect(page.locator('body')).not.toContainText('/admin/inventory/new?role=customer');
	const accountHeaderCta = page
		.locator('.header .mobile-hidden-header-button a.btn')
		.filter({ hasText: 'Submit Vehicle' });
	await expect(accountHeaderCta).toHaveCount(1);
	await expect(accountHeaderCta).toHaveAttribute('href', '/sell-your-car');
	await expect(
		page.locator('.header .mobile-hidden-header-button a.btn').filter({ hasText: 'Add Listing' })
	).toHaveCount(0);
	await expectBohemcarsShell(page);
	const accountRecent = page.locator('[data-bohemcars-dashboard-recent]');
	await expect(accountRecent).toBeVisible();
	await expect(accountRecent).toContainText('Recent Messages');
	await expect.poll(async () => accountRecent.locator('.comment-box').count()).toBeGreaterThan(0);
	await expect(accountRecent).toContainText('Bohemcars Sales');
	await expect(page.locator('body')).not.toContainText('Great Experience!');

	await page.goto('/account/favorites?role=customer');
	const favoritesGrid = page.locator('[data-bohemcars-favorites-grid]');
	await expect(favoritesGrid).toBeVisible();
	await expect(favoritesGrid).toHaveAttribute('data-bohemcars-favorites-count', '3');
	await expect(favoritesGrid).toHaveClass(/grid-cols-3/);
	await expect(
		page.locator('.dashboard-menu-item.active[data-bohemcars-menu-item="favorites"]')
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
	await expect(page.locator('body')).toContainText('Compare Bohemcars Vehicles Side-by-Side');
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
	await expect(accountCompareTable.locator('tr', { hasText: 'Mileage:' })).toBeVisible();

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
	await expect(page.locator('body')).toContainText('My profile');
	const accountProfile = page.locator('[data-bohemcars-profile-form]');
	await expect(accountProfile).toBeVisible();
	await expect(
		page.locator('.dashboard-menu-item.active[data-bohemcars-menu-item="profile"]')
	).toBeVisible();
	await expect(accountProfile.locator('#avatarPreview')).toBeVisible();
	await expect(accountProfile.locator('#posterPreview')).toBeVisible();
	await expect(accountProfile.locator('#first_name')).toHaveValue('Bohemcars');
	await expect(accountProfile.locator('#last_name')).toHaveValue('Customer');
	await expect(accountProfile.locator('#EmailAddress')).toHaveValue('customer@bohemcars.local');
	await expect(accountProfile.locator('#Phone')).toHaveValue('+359 893 588 680');
	await expect(accountProfile.locator('#SalesPhone')).toHaveValue('0888899911');
	await expect(accountProfile.locator('#Company')).toHaveValue('Bohemcars');
	await expect(accountProfile.locator('#message')).toHaveValue(/Canada-sourced vehicles/);
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
		page.locator('.dashboard-menu-item.active[data-bohemcars-menu-item="password"]')
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
	await expect(page.locator('body')).toContainText('My Listings');
	const accountListings = page.locator('[data-bohemcars-account-listings]');
	const accountSubmissionRows = accountListings.locator('.cart-item[data-bohemcars-submission-id]');
	await expect(accountListings).toBeVisible();
	await expect(accountListings).toHaveAttribute('data-bohemcars-submissions-table', 'true');
	await expect.poll(async () => accountSubmissionRows.count()).toBeGreaterThan(1);
	const accountSubmissionCount = await accountSubmissionRows.count();
	await expect(accountListings).toContainText('Client BMW evaluation');
	await expect(accountListings).toContainText('Trade-in review request');
	await expect(accountListings.locator('a[href$="/sell-your-car"]')).toHaveCount(
		accountSubmissionCount
	);
	await expect(accountListings.locator('a[href$="/account/messages"]')).toHaveCount(
		accountSubmissionCount
	);

	await page.goto('/admin?role=admin');
	await expect(page.locator('body')).toContainText('Admin Dashboard');
	await expect(page.locator('body')).toContainText('Bohemcars Inventory');
	const adminHeaderCta = page
		.locator('.header .mobile-hidden-header-button a.btn')
		.filter({ hasText: 'Add Listing' });
	await expect(adminHeaderCta).toHaveCount(1);
	await expect(adminHeaderCta).toHaveAttribute('href', '/admin/inventory/new');
	const adminRecent = page.locator('[data-bohemcars-dashboard-recent]');
	await expect(adminRecent).toBeVisible();
	await expect(adminRecent).toContainText('Recent Inquiries');
	await expect(adminRecent.locator('.comment-box')).toHaveCount(3);
	await expect(adminRecent).toContainText('Canada import lead');
	await expect(page.locator('body')).not.toContainText('Great Experience!');

	await page.goto('/admin/inventory?role=admin');
	await expect(page.locator('body')).toContainText('Inventory Management');
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
	await expect(page.locator('body')).toContainText('Edit Bohemcars Listing');
	const adminEditForm = page.locator('[data-bohemcars-add-listing-form]');
	await expect(adminEditForm).toBeVisible();
	await expect(adminEditForm).toHaveAttribute('data-bohemcars-admin-listing-mode', 'clone-static');
	await expect(adminEditForm.locator('input[name="sourceId"]')).toHaveCount(1);
	await expect(adminEditForm.locator('#carPreviewImage')).toBeVisible();
	await expect(adminEditForm.locator('.car-gallery-upload__item')).toHaveCount(7);
	await expect(adminEditForm.locator('#title')).toHaveValue(/BMW X5|Audi|Mercedes|Volkswagen/);
	await expect(adminEditForm.locator('#EnterVIN')).not.toHaveValue('');
	await expect(adminEditForm.locator('#PriceListing2')).not.toHaveValue('');
	await expect(adminEditForm.locator('#Doorstextarea')).toHaveAttribute(
		'placeholder',
		'Vehicle description and inspection notes'
	);
	await expect(adminEditForm).toContainText('Features');
	await expect(adminEditForm.locator('.form-group')).toHaveCount(25);
	await expect(page.locator('body')).not.toContainText('Lorem ipsum');

	await page.goto('/admin/inventory/new?role=admin');
	await expect(page.locator('body')).toContainText('Add Bohemcars Listing');
	const adminNewForm = page.locator('[data-bohemcars-add-listing-form]');
	await expect(adminNewForm).toBeVisible();
	await expect(adminNewForm).toHaveAttribute('data-bohemcars-admin-listing-mode', 'create');
	await expect(adminNewForm.locator('input[name="actorRole"]')).toHaveValue('admin');
	await expect(adminNewForm.locator('#carPreviewImage')).toBeVisible();
	await expect(adminNewForm.locator('.car-gallery-upload__item')).toHaveCount(7);
	await expect(adminNewForm.locator('.dashboard-box')).toHaveCount(7);
	await expect(adminNewForm.locator('#title')).toHaveValue(/BMW X5|Audi|Mercedes|Volkswagen/);
	await expect(adminNewForm.locator('#EnterVIN')).not.toHaveValue('');
	await expect(adminNewForm.locator('#PriceListing2')).not.toHaveValue('');
	await expect(adminNewForm.locator('.widget-gg-map iframe')).toBeVisible();
	await expect(page.locator('.bohemcars-local-form-action')).toHaveCount(2);
	await page.locator('[data-bohemcars-listing-status="draft"]').click();
	await expect(adminNewForm.locator('.auxero-form-status')).toHaveText(
		'Listing draft saved locally for Bohemcars review'
	);

	await page.goto('/admin/inquiries?role=agent');
	await expect(page.locator('body')).toContainText('Inquiries & Messages');
	const agentHeaderCta = page
		.locator('.header .mobile-hidden-header-button a.btn')
		.filter({ hasText: 'Inquiries' });
	await expect(agentHeaderCta).toHaveCount(1);
	await expect(agentHeaderCta).toHaveAttribute('href', '/admin/inquiries?role=agent');
	const agentInquiries = page.locator('[data-bohemcars-message-container]');
	await expect(agentInquiries).toBeVisible();
	await expect
		.poll(async () => agentInquiries.locator('.message-contact').count())
		.toBeGreaterThan(0);
	await expect(agentInquiries).toContainText('Canada import lead');
	await expect(page.locator('[data-contact="john"]')).toHaveCount(0);

	await page.goto('/admin/messages?role=admin');
	await expect(page.locator('body')).toContainText('Inquiries & Messages');
	const adminMessages = page.locator('[data-bohemcars-message-container]');
	await expect(adminMessages).toBeVisible();
	await expect
		.poll(async () => adminMessages.locator('.message-contact').count())
		.toBeGreaterThan(0);
	await expect(adminMessages.locator('.message-chat__header')).toHaveCount(1);
	await expect(adminMessages.locator('.message-chat__body')).toHaveCount(1);
	await expect.poll(async () => adminMessages.locator('.message-item').count()).toBeGreaterThan(1);
	await expect(adminMessages).toContainText('Canada import lead');
	await expect(adminMessages).toContainText('Customer asked for source history');
	await expect(page.locator('[data-contact="john"]')).toHaveCount(0);
	await expect(page.locator('body')).not.toContainText('Bohemcars follow-up is ready');

	await page.goto('/admin/agents?role=admin');
	await expect(page.locator('body')).toContainText('Bohemcars Agent Management');
	const adminAgents = page.locator('[data-bohemcars-agent-management="true"]');
	await expect(adminAgents).toBeVisible();
	await expect(adminAgents.locator('.sale-agent-box')).toHaveCount(3);
	await expect(adminAgents.locator('[data-bohemcars-agent-status="active"]')).toHaveCount(3);
	await expect(adminAgents.locator('a[href*="/admin/inquiries?role=admin"]')).toHaveCount(3);
	await expect(adminAgents.locator('a[href*="/admin/messages?role=admin"]')).toHaveCount(3);
	await expect(adminAgents).toContainText('open leads');

	const forbiddenAgents = await page.goto('/admin/agents?role=customer');
	expect(forbiddenAgents?.status()).toBe(403);
	await expect(page.locator('body')).toContainText(
		'Bohemcars account role cannot access this route'
	);

	await page.goto('/admin/users?role=admin');
	await expect(page.locator('body')).toContainText('User Management');
	const adminUsers = page.locator('[data-bohemcars-users-table]');
	await expect(adminUsers).toBeVisible();
	await expect(adminUsers.locator('.cart-header > div')).toHaveCount(6);
	await expect
		.poll(async () => adminUsers.locator('.cart-item[data-bohemcars-user-id]').count())
		.toBeGreaterThan(2);
	const adminUserCount = await adminUsers.locator('.cart-item[data-bohemcars-user-id]').count();
	await expect(adminUsers.locator('[data-bohemcars-user-role="admin"]')).toBeVisible();
	await expect(adminUsers).toContainText('customer@bohemcars.local');
	await expect(adminUsers).toContainText('Canada import lead');
	await expect(adminUsers.locator('.cart-item__price .price.clamp-1.clamp')).toHaveCount(
		adminUserCount
	);
	await expect(adminUsers.locator('.cart-item__total .clamp-1.clamp')).toHaveCount(adminUserCount);
	await expect(adminUsers.locator('a[href*="/admin/messages"]')).toHaveCount(adminUserCount);
	await expect(adminUsers.locator('a[href*="/admin/inquiries"]')).toHaveCount(adminUserCount);
	await expect(page.locator('.bohemcars-users-box')).toContainText('Role Access Notes');

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
