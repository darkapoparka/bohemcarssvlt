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
	await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();
	await expect(page.getByRole('link', { name: 'Add Listing' })).toHaveCount(0);
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
	const cardImageRatio = await boxRatio(refreshedFirstCard.locator('.card--img'));

	expect(cardImageRatio).toBeGreaterThan(1.25);
	expect(cardImageRatio).toBeLessThan(1.61);

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
	await expect(
		page.locator('[data-bohemcars-compare-table]').filter({ visible: true }).first()
	).toBeVisible();
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
	await expect(page.locator('[data-bohemcars-favorites-grid]')).toBeVisible();
	await expect(page.locator('body')).toContainText('BMW X5 40i M Sport Shadow Line');

	await page.goto('/account/compare?role=customer');
	await expect(page.locator('body')).toContainText('Compare Bohemcars Vehicles Side-by-Side');
	await expect(
		page.locator('[data-bohemcars-compare-table]').filter({ visible: true }).first()
	).toBeVisible();

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
