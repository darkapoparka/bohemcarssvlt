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
		'Browse, Compare, Drive'
	);
	await expect(page.locator('h1.search-cars__title').first()).toContainText('With Bohemcars');
	await expect(page.locator('body')).toContainText('Canada-sourced vehicles with verified history');
	await expect(page.locator('.search-cars__search')).toContainText('Show 42 Matches');
	await expectBohemcarsShell(page);
	const homeHeader = page.locator('.header-wrapper-style-4 .header-style-4');
	await expect(homeHeader).toHaveCount(1);
	await expect(homeHeader.locator('.header-top-bar')).toBeVisible();
	await expect(homeHeader.locator('#menu-primary-menu > .menu-item')).toHaveCount(7);
	await expect(homeHeader.locator('#menu-primary-menu > .current-menu-item')).toContainText('Home');
	await expect(homeHeader.locator('.header-right.main-nav-wrapper')).toHaveCSS('display', 'grid');
	await expect(homeHeader.locator('.logo img')).toHaveAttribute('alt', 'Bohemcars');
	await expect(homeHeader.locator('.logo img')).toHaveAttribute('src', /bohemcars-logo/);
	const homeHeaderLogoBox = await homeHeader.locator('.logo img').boundingBox();
	expect(homeHeaderLogoBox?.height ?? 0).toBeGreaterThan(30);
	expect(homeHeaderLogoBox?.height ?? 0).toBeLessThanOrEqual(58);
	await expect(homeHeader.locator('#searchToggle')).toBeVisible();
	await expect(homeHeader.locator('.header-action-icon[aria-label="Compare"]')).toHaveAttribute(
		'href',
		/^\.?\/compare$/
	);
	await expect(homeHeader.locator('.header-action-icon[aria-label="Wishlist"]')).toHaveAttribute(
		'href',
		/^\.?\/account\/favorites$/
	);
	await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();
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
	const homeFeaturedSection = page.locator('section', { hasText: 'new Bohemcars vehicles' });
	await expect(homeFeaturedSection.locator('.swiper-card-5')).toBeVisible();
	await expect(homeFeaturedSection.locator('.swiper-slide .card-box-style-1')).toHaveCount(6);
	await expect(homeFeaturedSection.locator('ul.tag.style2')).toHaveCount(0);
	await expect(homeFeaturedSection.locator('.pagination-swiper-card-5')).toHaveCount(1);
	const featuredCarouselDensity = await homeFeaturedSection
		.locator('.swiper-card-5')
		.evaluate((carousel) => {
			const carouselBox = carousel.getBoundingClientRect();
			const firstSlide = carousel.querySelector('.swiper-slide');
			const firstSlideBox = firstSlide?.getBoundingClientRect();

			return firstSlideBox ? carouselBox.width / firstSlideBox.width : 0;
		});
	expect(featuredCarouselDensity).toBeGreaterThan(2.5);
	await expect(
		page.locator('section', { hasText: 'Explore Our Brands' }).locator('.out-brand-2')
	).toHaveCount(12);
	await expect(page.locator('.out-brand-2')).toHaveCount(12);
	await expect(
		page.locator('section', { hasText: 'Browse By Type' }).locator('.brand-item-style-2')
	).toHaveCount(6);
	await expect(page.locator('.brand-item-style-2')).toHaveCount(6);
	await expect(
		page
			.locator('section', { hasText: 'Browse By Type' })
			.locator('img[src*="/assets/images/card/card-37.jpg"]')
	).toBeVisible();
	const homeCompareSection = page.locator('section', {
		hasText: 'Compare Top Rated Vehicles'
	});
	await expect(homeCompareSection.locator('.card-box-style-4')).toHaveCount(2);
	await expect(homeCompareSection.locator('.image img.w-full')).toHaveCount(4);
	await expect(homeCompareSection.locator('.btn.btn-small.btn-line-1.text-sm')).toHaveCount(2);
	const homeBudgetSection = page.locator('section', { hasText: 'Bohemcars by Budget' });
	await expect(homeBudgetSection.locator('.menu-tab-style2 .car-box')).toHaveCount(5);
	await expect(homeBudgetSection.locator('.card-box-style-1')).toHaveCount(9);
	await expect(homeBudgetSection.locator('ul.tag.style2')).toHaveCount(9);
	const homeReviewsSection = page.locator('section', { hasText: 'Client Reviews' });
	await expect(homeReviewsSection.locator('.swiper-testimonior')).toBeVisible();
	await expect(homeReviewsSection.locator('.swiper-slide .testimonior-box')).toHaveCount(6);
	await expect(homeReviewsSection.locator('img[src="/assets/icons/star.svg"]')).toHaveCount(30);
	await expect(homeReviewsSection.locator('.testimonior--img')).toHaveCount(6);
	await expect(homeReviewsSection.locator('.pagination-swiper-testimonior')).toHaveCount(1);
	await expect(homeReviewsSection.getByRole('link', { name: 'View All' })).toHaveAttribute(
		'href',
		/^\.?\/reviews$/
	);
	const homeNewsSection = page.locator('section', { hasText: 'Bohemcars notes' });
	await expect(homeNewsSection.locator('.post-style-2')).toHaveCount(1);
	await expect(homeNewsSection.locator('.post-style-3')).toHaveCount(2);
	await expect(homeNewsSection.locator('img.post--img, .post--img img')).toHaveCount(3);
	await expect(homeNewsSection.locator('span', { hasText: 'by Bohemcars' })).toHaveCount(3);
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
	await expect(page.getByRole('heading', { name: 'Bohemcars Inventory' })).toBeVisible();
});

test('inventory supports branded cards, saved favorites, compare, and view toggles', async ({
	page
}) => {
	await page.goto('/inventory');

	await expect(page.getByRole('heading', { name: 'Bohemcars Inventory' })).toBeVisible();
	await expect(page.locator('body')).toContainText('Showing 1 - 42 of 42 Bohemcars Listings');
	await expect(page.locator('.bohemcars-inventory-searchbar')).toHaveCount(0);
	await expect(page.locator('section.pb-100')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
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
	const cardImageRatio = await boxRatio(refreshedFirstCard.locator('.card--img'));

	expect(cardImageRatio).toBeGreaterThan(1.25);
	expect(cardImageRatio).toBeLessThan(1.61);
	await expect(page.locator('.bohemcars-inventory-toolbar-row')).toBeVisible();
	await expect(page.locator('.bohemcars-view-toggle .item-menu')).toHaveCount(3);
	await expect(page.locator('.bohemcars-view-toggle .item-menu.active')).toHaveAttribute(
		'aria-label',
		'Comfortable 3 grid'
	);
	await expect(
		page.locator('.bohemcars-inventory-content > .content-inner.active > div.grid')
	).toHaveClass(/grid-cols-3/);
	await expect(refreshedFirstCard).toHaveClass(/card-box-style-1/);
	await expect(refreshedFirstCard.locator('.card-box__title')).toHaveClass(/h6/);
	await expect(refreshedFirstCard.locator('.card-box__price')).toHaveClass(/h6/);
	await expect(refreshedFirstCard.locator('.compare-details')).toContainText('Compare');
	await expect(refreshedFirstCard.locator('.view-details')).toHaveAttribute(
		'href',
		new RegExp(`/inventory/${refreshedFirstSlug}$`)
	);

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

	await page.goto('/agents/bohemcars-import');
	await expect(page.locator('body')).toContainText('Bohemcars Import');
	await expect(page.locator('body')).toContainText('Verified Bohemcars Consultant');
	await expect(page.locator('body')).not.toContainText('Mike Hanley');
});

test('planned public support routes render Bohemcars content and local forms', async ({ page }) => {
	const routes = [
		['/services', 'Bohemcars Services Center'],
		['/sell-your-car', 'Sell Your Car With Bohemcars'],
		['/about', 'Canada-sourced vehicles, checked before the decision'],
		['/reviews', 'Aleksandar Vytev'],
		['/calculator', 'Import Cost Calculator'],
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

	await page.goto('/contact');
	await expect(page.locator('body')).toContainText('Reach Out to Bohemcars');
	const contact = page.locator('form.bohemcars-contact-form');
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
		page.locator('a[href="/sell-your-car"]', { hasText: 'Submit Vehicle' })
	).toBeVisible();
	await expect(page.locator('body')).not.toContainText('/admin/inventory/new?role=customer');
	await expectBohemcarsShell(page);

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
	await expect(page.locator('body')).toContainText('Bohemcars Sales');

	await page.goto('/account/listings?role=customer');
	await expect(page.locator('body')).toContainText('My Listings');
	await expect(page.locator('.bohemcars-account-listings')).toBeVisible();

	await page.goto('/admin?role=admin');
	await expect(page.locator('body')).toContainText('Admin Dashboard');
	await expect(page.locator('body')).toContainText('Bohemcars Inventory');

	await page.goto('/admin/inventory?role=admin');
	await expect(page.locator('body')).toContainText('Inventory Management');
	await expect(page.locator('.bohemcars-account-listings')).toBeVisible();

	await page.goto('/admin/inventory/new?role=admin');
	await expect(page.locator('body')).toContainText('Add Bohemcars Listing');
	await expect(page.locator('form.bohemcars-add-listing-form')).toBeVisible();

	await page.goto('/admin/inquiries?role=agent');
	await expect(page.locator('body')).toContainText('Inquiries & Messages');
	await expect(page.locator('body')).toContainText('Canada import lead');

	await page.goto('/admin/messages?role=admin');
	await expect(page.locator('body')).toContainText('Inquiries & Messages');
	await expect(page.locator('body')).toContainText('Bohemcars follow-up is ready');

	await page.goto('/admin/agents?role=admin');
	await expect(page.locator('body')).toContainText('Bohemcars Agent Management');
	await expect(page.locator('[data-bohemcars-agent-management="true"]')).toBeVisible();

	await page.goto('/admin/users?role=admin');
	await expect(page.locator('body')).toContainText('User Management');
	await expect(page.locator('.bohemcars-users-table')).toBeVisible();
	await expect(page.locator('body')).toContainText('customer@bohemcars.local');

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
