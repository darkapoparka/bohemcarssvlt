import { describe, expect, it } from 'vitest';
import { agents } from '$lib/data/agents';
import { posts } from '$lib/data/blog';
import { bohemcarsAssets, bohemcarsBrand, bohemcarsContact } from '$lib/data/bohemcars';
import { vehicles } from '$lib/data/vehicles';
import {
	authenticateBohemcarsUser,
	canAccessBohemcarsRoute,
	resolveBohemcarsSession,
	sessionCookieForBohemcarsSession
} from './auth';
import { createInventoryListing } from './inventory';
import { updateBohemcarsGarageState } from './garage';
import { listInquiriesForRole } from './inquiries';
import { listMessagesForRole } from './messages';
import {
	auxeroResponse,
	auxeroRouteResponse,
	renderAuxeroTemplate,
	resolveAuxeroTemplateFile
} from './auxero-template';

const requestForSession = (path: string, role: 'admin' | 'agent' | 'customer') => {
	const session = authenticateBohemcarsUser({
		email: `${role}@bohemcars.local`,
		password: 'bohemcars prototype',
		role
	});
	const cookie = session ? sessionCookieForBohemcarsSession(session) : undefined;

	return {
		request: new Request(`http://localhost/${path.replace(/^\/+/, '')}`, {
			headers: cookie ? { cookie } : undefined
		}),
		session
	};
};

describe('Auxero template Bohemcars adapter', () => {
	it('resolves planned Bohemcars aliases to preserved template files', () => {
		expect(resolveAuxeroTemplateFile('services')).toBe('services-center.html');
		expect(resolveAuxeroTemplateFile('account/favorites')).toBe('my-favorites.html');
		expect(resolveAuxeroTemplateFile('admin/inventory/new')).toBe('add-listings-2.html');
		expect(resolveAuxeroTemplateFile(`admin/inventory/edit/${vehicles[0].slug}`)).toBe(
			'add-listings-2.html'
		);
	});

	it('renders the planned Bohemcars route surfaces without opening a browser server', async () => {
		const routeCases = [
			['about', 'Услуги около внос, оглед и продажба'],
			['services', 'Услуги от Bohemcars'],
			['sell-your-car', 'Продай автомобила си с Bohemcars'],
			['compare', 'Сравни автомобили от Bohemcars'],
			['agents', 'Консултанти на Bohemcars'],
			['agents/bohemcars-import', 'Внос от Канада'],
			['reviews', 'Aleksandar Vytev'],
			['calculator', 'Калкулатор за внос'],
			['faqs', 'Защо да внеса автомобил от Канада?'],
			['terms', 'Условия за използване на Bohemcars'],
			['blog', 'Съвети от Bohemcars'],
			['blog/gotov-za-registracia', 'Какво означава „готов за регистрация“'],
			['contact', 'Свържете се с Bohemcars'],
			['account', 'Account Dashboard', 'customer'],
			['account/favorites', 'My Favorites', 'customer'],
			['account/compare', 'Сравни автомобили от Bohemcars', 'customer'],
			['account/messages', 'Messages', 'customer'],
			['account/listings', 'My Listings', 'customer'],
			['account/profile', 'My Profile', 'customer'],
			['account/password', 'Change Password', 'customer'],
			['admin', 'Admin Dashboard', 'admin'],
			['admin/inventory', 'Inventory Management', 'admin'],
			['admin/inventory/new', 'Add Bohemcars Listing', 'admin'],
			['admin/inquiries', 'Inquiries & Messages', 'agent'],
			['admin/messages', 'Inquiries & Messages', 'admin'],
			['admin/agents', 'Управление на консултанти', 'admin'],
			['admin/users', 'User Management', 'admin']
		] as const;

		const home = await auxeroResponse('home').text();
		const inventory = await auxeroResponse('inventory').text();
		const detail = await auxeroResponse('detail', { slug: vehicles[0].slug }).text();

		expect(home).toContain('Browse, Compare, Drive');
		expect(inventory).toContain('bohemcars-inventory-searchbar');
		expect(inventory).toContain('bohemcars-inventory-filter-grid');
		expect(detail).toContain(vehicles[0].title);
		expect(detail).toContain('Bohemcars Consultant');

		for (const [route, expected, role] of routeCases) {
			const response = auxeroRouteResponse(route, {
				searchParams: role ? new URLSearchParams(`role=${role}`) : undefined
			});
			const html = await response.text();

			expect(response.status, route).toBe(200);
			expect(html, route).toContain('Bohemcars');
			expect(html, route).toContain(expected);
		}
	});

	it('blocks ecommerce and coming-soon template routes', () => {
		expect(resolveAuxeroTemplateFile('shop')).toBeUndefined();
		expect(resolveAuxeroTemplateFile('shop.html')).toBeUndefined();
		expect(resolveAuxeroTemplateFile('coming-soon.html')).toBeUndefined();
	});

	it('removes blocked ecommerce and coming-soon menu anchors from rendered pages', () => {
		const publicTemplates = [
			'home-05.html',
			'listing-grid3-columns.html',
			'listing-details-3.html',
			'blog-grid-style-1.html',
			'dashboard.html',
			'sale-agents.html',
			'contact-us.html'
		];
		const blockedLabels = [
			'Products',
			'Product Details',
			'Shopping Cart',
			'Check Out',
			'Coming Soon'
		];

		for (const template of publicTemplates) {
			const html = renderAuxeroTemplate(template, {
				routePath: template === 'dashboard.html' ? 'account' : undefined
			});

			expect(html, template).toBeDefined();
			for (const label of blockedLabels) {
				expect(html, `${template} exposes ${label}`).not.toContain(`>${label}`);
			}
			expect(html, `${template} exposes blocked href`).not.toMatch(
				/href=(["'])(?:\/inventory|\/)?(?:check-out|coming-soon|product-details|shop|shopping-cart)(?:\.html)?\1/
			);
		}
	});

	it('redirects raw duplicate template filenames to branded canonical routes', () => {
		const duplicateHome = auxeroRouteResponse('home-02.html');
		const extensionlessDuplicateHome = auxeroRouteResponse('home-02');
		const primaryHome = auxeroRouteResponse('home-05.html');
		const extensionlessPrimaryHome = auxeroRouteResponse('home-05');
		const denseInventory = auxeroRouteResponse('listing-grid4-columns.html');
		const extensionlessDenseInventory = auxeroRouteResponse('listing-grid4-columns');
		const duplicateDetail = auxeroRouteResponse('listing-details-6.html');
		const extensionlessDuplicateDetail = auxeroRouteResponse('listing-details-6');
		const accountProfileAlias = auxeroRouteResponse('my-profile');
		const dashboardListingAlias = auxeroRouteResponse('dashboard/listings/new');

		expect(duplicateHome.status).toBe(308);
		expect(duplicateHome.headers.get('location')).toBe('/');
		expect(extensionlessDuplicateHome.status).toBe(308);
		expect(extensionlessDuplicateHome.headers.get('location')).toBe('/');
		expect(primaryHome.status).toBe(308);
		expect(primaryHome.headers.get('location')).toBe('/');
		expect(extensionlessPrimaryHome.status).toBe(308);
		expect(extensionlessPrimaryHome.headers.get('location')).toBe('/');
		expect(denseInventory.status).toBe(308);
		expect(denseInventory.headers.get('location')).toBe('/inventory');
		expect(extensionlessDenseInventory.status).toBe(308);
		expect(extensionlessDenseInventory.headers.get('location')).toBe('/inventory');
		expect(duplicateDetail.status).toBe(308);
		expect(duplicateDetail.headers.get('location')).toBe(`/inventory/${vehicles[0].slug}`);
		expect(extensionlessDuplicateDetail.status).toBe(308);
		expect(extensionlessDuplicateDetail.headers.get('location')).toBe(
			`/inventory/${vehicles[0].slug}`
		);
		expect(accountProfileAlias.status).toBe(308);
		expect(accountProfileAlias.headers.get('location')).toBe('/account/profile');
		expect(dashboardListingAlias.status).toBe(404);
	});

	it('brands the raw template without exposing demo credentials or duplicate nav labels', () => {
		const html = renderAuxeroTemplate('home-05.html');

		expect(html).toContain('Bohemcars');
		expect(html).toContain(
			'/assets/bohemcars/brand/bohemcars-logo-concept-light-template-clean.png'
		);
		expect(html).toContain('Browse, Compare, Drive');
		expect(html).toContain('With Bohemcars!');
		expect(html).toContain(bohemcarsBrand.tagline);
		expect(html).toMatch(/<header class="header header-style-4 header-blur"/);
		expect(html).toMatch(/id="menu-primary-menu" class="menu menu style-2"/);
		expect(html).toMatch(
			/class="btn btn-line-white btn-large font-weight-600\s+bg-sign-in open-modal"/
		);
		expect(html).toContain(`Show ${vehicles.length} Matches`);
		expect(html).toContain(vehicles[0].title);
		expect(html).toContain(vehicles[0].priceLabel);
		expect(html).toContain('Bohemcars Vehicles');
		expect(html).toContain('bohemcars-vehicle-pill car-box active');
		expect(html).toContain('Bohemcars by Budget');
		expect(html).toContain('Bohemcars notes');
		expect(html).toContain(bohemcarsContact.addressLabel);
		expect(html).toContain('/api/account/garage');
		expect(html).not.toContain('Username:');
		expect(html).not.toContain('Password:');
		expect(html).not.toContain('Show 1,029 Matches');
		expect(html).not.toContain('Discover the perfect car for you');
		expect(html).not.toContain('Homepage 02');
		expect(html).not.toContain('/shop.html');
	});

	it('globally replaces Auxero footer marketplace copy on routed template pages', () => {
		const html = renderAuxeroTemplate('blog-details-1.html', {
			routePath: 'blog/vnos-ot-kanada-proverka'
		});

		expect(html).toContain('Buying With Bohemcars');
		expect(html).toContain('Find a Consultant');
		expect(html).toContain('Verified Listings');
		expect(html).toContain('Bohemcars Online');
		expect(html).toContain('Weekend viewings by appointment');
		expect(html).not.toContain('Buying a car');
		expect(html).not.toContain('Find a Dealer');
		expect(html).not.toContain('Certified Pre-Owned');
		expect(html).not.toContain('Download App');
		expect(html).not.toContain('Saturday from 9 AM to 6 PM EST');
	});

	it('injects Bohemcars data into the preserved Home 09 homepage', () => {
		const html = renderAuxeroTemplate('home-09.html');
		const firstVehicle = vehicles[0];

		expect(html).toContain(bohemcarsBrand.tagline);
		expect(html).toContain(bohemcarsAssets.hero);
		expect(html).toContain(`Show ${vehicles.length} Matches`);
		expect(html).toContain(firstVehicle.title);
		expect(html).toContain(firstVehicle.priceLabel);
		expect(html).toContain('New Bohemcars Vehicles');
		expect(html).toContain('Why Choose Bohemcars?');
		expect(html).toContain('Featured Bohemcars Searches');
		expect(html).toContain('Import Cost Calculator');
		expect(html).toContain('Client Reviews');
		expect(html).toContain('/inventory?view=4');
		expect(html).toContain('/sell-your-car');
		expect(html).not.toContain('Search Cars Near You');
		expect(html).not.toContain('2024 Tesla Model Y');
		expect(html).not.toContain('Ford Mustang');
		expect(html).not.toContain('Mercedes-AMG C-Class');
		expect(html).not.toContain('Dealer Reviews');
		expect(html).not.toContain('Verified Dealers');
		expect(html).not.toContain('Certified Pre-Owned');
		expect(html).not.toContain('Download App');
		expect(html).not.toContain('Emily Johnson');
		expect(html).not.toContain('CEO Tesla');
	});

	it('injects real Bohemcars inventory cards into the default grid template', () => {
		const html = renderAuxeroTemplate('listing-grid3-columns.html');
		const firstVehicle = vehicles[0];

		expect(html).toContain(firstVehicle.title);
		expect(html).toContain(firstVehicle.priceLabel);
		expect(html).toContain(`/inventory/${firstVehicle.slug}`);
		expect(html).toContain('Showing 1 - 42 of 42 Bohemcars Listings');
		expect(html).not.toContain('$44.900,00');
		expect(html).not.toContain('Audi A6 Avant E-Tron');
	});

	it('renders dense and map inventory views from canonical query state', async () => {
		const denseResponse = auxeroResponse('inventory', {
			searchParams: new URLSearchParams('view=4')
		});
		const mapResponse = auxeroResponse('inventory', {
			searchParams: new URLSearchParams('view=map')
		});
		const dense = await denseResponse.text();
		const map = await mapResponse.text();

		expect(dense).toContain('grid-cols-4');
		expect(dense).toContain('Dense 4 grid');
		expect(map).toContain('card-box-style-9');
		expect(map).toContain('bohemcars-map-fallback');
		expect(map).toContain(`data-bohemcars-map-selected="${vehicles.length}"`);
		expect(map).toContain(`${vehicles.length} съвпадащи автомобила`);
		expect(map).toContain(`data-bohemcars-map-location="${vehicles[0].location}"`);
		expect(map).toContain('Точната локация за оглед се потвърждава по телефона');
		expect(map).not.toContain('maps.googleapis.com/maps/api/js');
		expect(map).not.toContain('/assets/js/maps.js');
		expect(map).not.toContain('/assets/js/infobox.min.js');
	});

	it('preserves filtered inventory state in the map location fallback', async () => {
		const filteredLocation = vehicles.find((vehicle) =>
			vehicle.location.includes('София')
		)!.location;
		const excludedLocation = vehicles.find(
			(vehicle) => vehicle.location !== filteredLocation
		)!.location;
		const selectedCount = vehicles.filter(
			(vehicle) => vehicle.location === filteredLocation
		).length;
		const mapResponse = auxeroResponse('inventory', {
			searchParams: new URLSearchParams({
				location: filteredLocation,
				view: 'map'
			})
		});
		const map = await mapResponse.text();

		expect(map).toContain(`data-bohemcars-map-selected="${selectedCount}"`);
		expect(map).toContain(
			`${selectedCount} ${selectedCount === 1 ? 'съвпадащ автомобил' : 'съвпадащи автомобила'}`
		);
		expect(map).toContain(`data-bohemcars-map-location="${filteredLocation}"`);
		expect(map).not.toContain(`data-bohemcars-map-location="${excludedLocation}"`);
		expect(map).toContain('Точната локация за оглед се потвърждава по телефона');
	});

	it('applies rich inventory query filters through the preserved template route', async () => {
		const vehicle = vehicles[0];
		const params = new URLSearchParams({
			Transmission: vehicle.transmission,
			location: vehicle.location,
			maxMileage: String(vehicle.mileage + 1),
			priceFrom: String(vehicle.price - 1),
			priceTo: String(vehicle.price + 1),
			sourceId: vehicle.stockNumber,
			status: 'new',
			yearFrom: String(vehicle.year),
			yearTo: String(vehicle.year)
		});
		const response = auxeroResponse('inventory', { searchParams: params });
		const html = await response.text();

		expect(html).toContain(vehicle.title);
		expect(html).toContain(vehicle.priceLabel);
		expect(html).toContain('Showing 1 - 1 of 1 matching Bohemcars Listings');
		const inventoryStart = html.indexOf('bohemcars-inventory-content');
		const inventoryEnd = html.indexOf('filter-sidebar', inventoryStart);
		const inventoryHtml = html.slice(inventoryStart, inventoryEnd);

		expect(inventoryHtml).toContain(`data-bohemcars-slug="${vehicle.slug}"`);
		expect(inventoryHtml).not.toContain(`data-bohemcars-slug="${vehicles[1].slug}"`);
	});

	it('keeps filtered inventory state in the reference-style toolbar and drawer', async () => {
		const vehicle = vehicles[0];
		const response = auxeroResponse('inventory', {
			searchParams: new URLSearchParams({
				brand: vehicle.brand,
				fuel: vehicle.fuel,
				minYear: String(vehicle.year),
				q: vehicle.model,
				transmission: vehicle.transmission
			})
		});
		const html = await response.text();

		expect(html).toContain('bohemcars-inventory-banner');
		expect(html).toContain('Bohemcars inventory showcase');
		expect(html).toContain('/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.png');
		expect(html).toContain('/assets/bohemcars/megamenu/inventory-audi-sq5-cutout.png');
		expect(html).not.toContain('/assets/bohemcars/megamenu/inventory-audi-a7-cutout.png');
		expect(html).not.toContain('Bohemcars current stock');
		expect(html).not.toContain('class="background-light mb-32"');
		expect(html).not.toContain('class="breadcrumb"');
		expect(html).toContain('bohemcars-inventory-banner__buybox');
		expect(html).toContain('class="bohemcars-inventory-searchbar"');
		expect(html).toContain('bohemcars-inventory-filter-grid');
		expect(html).not.toContain('bohemcars-inventory-quick-pills');
		expect(html).not.toContain('bohemcars-inventory-quick-pills--results');
		expect(html).toContain('bohemcars-inventory-active-filters--results');
		const bannerEnd = html.indexOf('</section>', html.indexOf('bohemcars-inventory-banner'));
		expect(
			html.indexOf(
				'<div class="bohemcars-inventory-active-filters bohemcars-inventory-active-filters--results"'
			)
		).toBeGreaterThan(bannerEnd);
		expect(html).toContain('Search make, model, year, fuel, extras...');
		expect(html).toContain('name="mileageTo"');
		expect(html).toContain('name="feature"');
		expect(html).toContain('role="search" aria-label="Search Bohemcars inventory"');
		expect(html).toContain('aria-controls="filterSidebar"');
		expect(html).toContain('id="bohemcars-inventory-title"');
		expect(html).toContain('class="bohemcars-sr-only"');
		expect(html).toContain(`value="${vehicle.model}"`);
		expect(html).toContain('bohemcars-inventory-toolbar-row');
		expect(html).toContain('matching Bohemcars Listings');
		expect(html).toContain(
			'body.auxero-template-listing-grid4-columns-html .bohemcars-inventory-content .content-inner.active'
		);
		expect(html).toContain(
			'body.auxero-template-listing-grid4-columns-html .bohemcars-inventory-filter-grid *'
		);
		expect(html).toContain('transition: none !important;');
		expect(html).toContain(`name="brand" value="${vehicle.brand}" checked`);
		expect(html).toContain(`name="FuelType" value="${vehicle.fuel}" checked`);
		expect(html).toContain(
			'<form class="search-form__form" action="/inventory" method="get" data-bohemcars-search-form="inventory">'
		);
		expect(html).toContain('name="q" placeholder="Search Bohemcars inventory"');
	});

	it('injects selected vehicle data into Listing Details 3', () => {
		const vehicle = vehicles[1];
		const html = renderAuxeroTemplate('listing-details-3.html', { slug: vehicle.slug });

		expect(html).toContain(vehicle.title);
		expect(html).toContain(vehicle.priceLabel);
		expect(html).toContain(vehicle.stockNumber);
		expect(html).toContain(vehicle.image);
		expect(html).toContain('Bohemcars Consultant');
		expect(html).toContain(`data-bohemcars-slug="${vehicle.slug}" data-bohemcars-detail="true"`);
		expect(html).toContain(`data-bohemcars-compare="${vehicle.slug}"`);
		expect(html).toContain(`aria-label="Compare ${vehicle.title}"`);
		expect(html).toContain(`aria-label="Запази ${vehicle.title}"`);
		expect(html).toContain('bohemcars-favorite');
		expect(html).not.toContain('Mike Hanley');
		expect(html).not.toContain('Tony Nguyen');
		expect(html).not.toContain('Honda HR-V');
	});

	it('injects real Bohemcars vehicles into the compare page', () => {
		const html = renderAuxeroTemplate('compare.html');
		const firstVehicle = vehicles[0];

		expect(html).toContain('bohemcars-compare-table');
		expect(html).toContain(firstVehicle.title);
		expect(html).toContain(firstVehicle.priceLabel);
		expect(html).toContain('Source ID');
		expect(html).not.toContain('Audi A6 Avant E-Tron');
		expect(html).not.toContain('Benzin + Plin');
	});

	it('replaces sale agent cards with Bohemcars consultants', () => {
		const html = renderAuxeroTemplate('sale-agents.html');

		for (const agent of agents) {
			expect(html).toContain(agent.name);
			expect(html).toContain(agent.image);
			expect(html).toContain(`/agents/${agent.slug}`);
		}

		expect(html).not.toContain('Robert Fox');
		expect(html).not.toContain('Bessie Cooper');
		expect(html).not.toContain('Brooklyn Simmons');
	});

	it('renders the requested Bohemcars consultant detail page', () => {
		const agent = agents[1];
		const html = renderAuxeroTemplate('sale-agents-details.html', {
			routePath: `agents/${agent.slug}`
		});

		expect(html).toContain(agent.name);
		expect(html).toContain(agent.bio);
		expect(html).toContain(agent.image);
		expect(html).toContain('Verified Bohemcars Consultant');
		expect(html).toContain(bohemcarsContact.addressLabel);
		expect(html).not.toContain('Mike Hanley');
		expect(html).not.toContain('Darrell Steward');
		expect(html).not.toContain('Tony Nguyen');
	});

	it('rebrands contact page data and local form behavior', () => {
		const html = renderAuxeroTemplate('contact-us.html');

		expect(html).toContain('Свържете се с Bohemcars');
		expect(html).toContain(bohemcarsContact.addressLabel);
		expect(html).toContain('bohemcars-contact-form');
		expect(html).toContain(bohemcarsContact.primaryPhoneLabel);
		expect(html).not.toContain('6205 Peachtree Dunwoody Rd');
		expect(html).not.toContain('1-555-678-8888');
		expect(html).not.toContain('1-866-288-6868');
		expect(html).not.toContain('value="Tony"');
	});

	it('renders role-aware admin dashboard data in the preserved dashboard template', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'admin' });

		expect(html).toContain('content="admin"');
		expect(html).toContain('Admin Dashboard');
		expect(html).toContain('Bohemcars Inventory');
		expect(html).toContain('Open Leads');
		expect(html).toContain('/assets/images/dashboard/Dashboard.svg');
		expect(html).not.toContain('/assets/images/dashboard/Admin Dashboard.svg');
		expect(html).toContain(vehicles[0].title);
		expect(html).toContain(vehicles[0].priceLabel);
		expect(html).not.toContain('Randynox');
		expect(html).not.toContain('Audi A6 Avant E-Tron');
		expect(html).not.toContain('Benzin + Plin');
	});

	it('renders admin user management from the preserved dashboard surface', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'admin/users' });

		expect(html).toContain('content="admin"');
		expect(html).toContain('User Management');
		expect(html).toContain('bohemcars-users-table');
		expect(html).toContain('data-bohemcars-user-role="admin"');
		expect(html).toContain('customer@bohemcars.local');
		expect(html).toContain('Canada import lead');
		expect(html).toContain('Role Access Notes');
		expect(html).not.toContain('Randynox');
	});

	it('renders admin agent management with Bohemcars consultant routing actions', () => {
		const html = renderAuxeroTemplate('sale-agents.html', { routePath: 'admin/agents' });

		expect(html).toContain('Управление на консултанти');
		expect(html).toContain('data-bohemcars-agent-management="true"');
		expect(html).toContain('/admin/inquiries?role=admin');
		expect(html).toContain('/admin/messages?role=admin');
		expect(html).not.toContain('Robert Fox');
	});

	it('renders customer dashboard and account compare from saved garage state', () => {
		const session = resolveBohemcarsSession('account');
		updateBohemcarsGarageState(session, {
			compare: vehicles.slice(4, 7).map((vehicle) => vehicle.slug),
			favorites: vehicles.slice(2, 4).map((vehicle) => vehicle.slug)
		});

		const dashboard = renderAuxeroTemplate('dashboard.html', { routePath: 'account' });
		const compare = renderAuxeroTemplate('compare.html', { routePath: 'account/compare' });

		expect(compare).toBeDefined();
		const compareHtml = compare ?? '';
		const tableStart = compareHtml.indexOf('bohemcars-compare-table');
		const compareTable = compareHtml.slice(tableStart, compareHtml.indexOf('</table>', tableStart));

		expect(dashboard).toContain(
			'data-bohemcars-dashboard-stat="favorites" data-bohemcars-stat-value="2"'
		);
		expect(dashboard).toContain(
			'data-bohemcars-dashboard-stat="compare" data-bohemcars-stat-value="3"'
		);
		expect(compareTable).toContain(`data-bohemcars-compare-column="${vehicles[4].slug}"`);
		expect(compareTable).toContain(`data-bohemcars-compare-column="${vehicles[5].slug}"`);
		expect(compareTable).toContain(`data-bohemcars-compare-column="${vehicles[6].slug}"`);
		expect(compareTable).not.toContain(`data-bohemcars-compare-column="${vehicles[0].slug}"`);

		updateBohemcarsGarageState(session, {
			compare: vehicles.slice(0, 2).map((vehicle) => vehicle.slug),
			favorites: vehicles.slice(0, 3).map((vehicle) => vehicle.slug)
		});
	});

	it('renders customer favorites with real Bohemcars vehicles and local-state hook', () => {
		updateBohemcarsGarageState(resolveBohemcarsSession('account'), {
			compare: vehicles.slice(0, 2).map((vehicle) => vehicle.slug),
			favorites: vehicles.slice(0, 3).map((vehicle) => vehicle.slug)
		});
		const html = renderAuxeroTemplate('my-favorites.html', { routePath: 'account/favorites' });

		expect(html).toContain('data-bohemcars-favorites-grid');
		expect(html).toContain('data-bohemcars-favorites-count="3"');
		expect(html).toContain(vehicles[0].title);
		expect(html).toContain(vehicles[0].priceLabel);
		expect(html).toContain('/account/messages');
		expect(html).not.toContain('2024 Hyundai Elantra');
		expect(html).not.toContain('$44.900,00');
	});

	it('keeps customer account vehicle submission out of admin-only routes', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'account' });
		const listings = renderAuxeroTemplate('my-listings.html', { routePath: 'account/listings' });

		expect(html).toContain('Submit Vehicle');
		expect(html).toContain('/sell-your-car');
		expect(html).toContain('data-bohemcars-submissions-table');
		expect(html).toContain('Client BMW evaluation');
		expect(listings).toContain('data-bohemcars-submissions-table');
		expect(listings).toContain('My Listings');
		expect(listings).toContain('Trade-in review request');
		expect(listings).not.toContain('My Listingss');
		expect(html).not.toContain('/admin/inventory/new?role=customer');
		expect(listings).not.toContain('/admin/inventory/new?role=customer');
	});

	it('uses a contextual dashboard header instead of the public mega-menu on account templates', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'admin/users' });

		expect(html).toContain('data-bohemcars-dashboard-context-header');
		expect(html).toContain('data-bohemcars-dashboard-context-nav');
		expect(html).toContain('Admin dashboard');
		expect(html).toContain('User Management');
		expect(html).toContain('href="/inventory"');
		expect(html).toContain('Bohemcars Автомобили');
		expect(html).toContain('href="/admin"');
		expect(html).not.toContain('sub-menu--main');
		expect(html).not.toContain('>Pages<');
		expect(html).not.toContain('>Listing<');
		expect(html).not.toContain('>News<');
	});

	it('renders Bohemcars account messages instead of template contacts', () => {
		const html = renderAuxeroTemplate('message.html', { routePath: 'admin/inquiries' });
		const customerHtml = renderAuxeroTemplate('message.html', { routePath: 'account/messages' });

		expect(html).toContain('Inquiries & Messages');
		expect(html).toContain('Canada import lead');
		expect(html).toContain('Customer asked for source history');
		expect(html).toContain('data-bohemcars-message-container');
		expect(html).toContain(bohemcarsContact.emailLabel);
		expect(customerHtml).toContain('data-bohemcars-message-container');
		expect(customerHtml).toContain('Bohemcars Sales');
		expect(customerHtml).toContain('Please send appointment options');
		expect(html).not.toContain('Marvin McKinney');
		expect(html).not.toContain('John Smith');
		expect(html).not.toContain('grew-sra@gmail.com');
		expect(html).not.toContain('data-contact="john"');
		expect(customerHtml).not.toContain('data-contact="john"');
	});

	it('keeps agent admin navigation scoped to allowed lead and message surfaces', () => {
		const html = renderAuxeroTemplate('message.html', {
			routePath: 'admin/inquiries',
			searchParams: new URLSearchParams('role=agent')
		});
		const agentInquiryCount = listInquiriesForRole('agent').length;
		const agentMessageCount = listMessagesForRole('agent').length;

		expect(html).toContain('content="agent"');
		expect(html).toContain('/admin/inquiries?role=agent');
		expect(html).toContain('/admin/messages?role=agent');
		expect(html).toContain('/account/profile?role=agent');
		expect(html).toContain('/account/password?role=agent');
		expect(html).toContain(`data-bohemcars-menu-badge="inquiries">${agentInquiryCount}</span>`);
		expect(html).toContain(`data-bohemcars-menu-badge="messages">${agentMessageCount}</span>`);
		expect(html).not.toContain('href="/admin/inventory"');
		expect(html).not.toContain('href="/admin/inventory/new"');
		expect(html).not.toContain('href="/admin/agents"');
		expect(html).not.toContain('href="/admin/users"');
	});

	it('wires preserved account logout controls to the Bohemcars session API', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'account' });

		expect(html).toContain('data-bohemcars-menu-item="logout"');
		expect(html).toContain('data-bohemcars-user-menu-item="logout"');
		expect(html).toContain('/api/auth/logout');
		expect(html).toContain('localStorage.removeItem(sessionKey)');
	});

	it('wires preserved auth modal fields to Bohemcars account APIs', () => {
		const html = renderAuxeroTemplate('home-09.html');

		expect(html).toContain('#LoginModal form, #SignUpModal form, #ForgotPasswordModal form');
		expect(html).toContain("payload['email-login']");
		expect(html).toContain("payload['Password-login']");
		expect(html).toContain("payload['SignUp-login']");
		expect(html).toContain("payload['Password-SignUp']");
		expect(html).toContain('name="ConfirmPassword-SignUp"');
		expect(html).toContain("payload['email-forgot-password']");
		expect(html).toContain("'/api/auth/register'");
		expect(html).toContain("'/api/auth/recovery'");
		expect(html).toContain('Customer account created locally for Bohemcars');
		expect(html).toContain('Password recovery request queued locally for Bohemcars');
		expect(html).not.toContain('value="bohemcars@gmail.com" type="email" id="email-login"');
		expect(html).not.toContain('value="bohemcars@gmail.com" type="email" id="SignUp-login"');
	});

	it('derives dashboard prototype garage role without enabling public pages', () => {
		const html = renderAuxeroTemplate('listing-grid3-columns.html');

		expect(html).toContain(
			"const roleFromUrl = new URLSearchParams(window.location.search).get('role')"
		);
		expect(html).toContain("window.location.pathname.startsWith('/account')");
		expect(html).toContain("window.location.pathname.startsWith('/admin')");
		expect(html).toContain('? runtimeData.account.session.role');
		expect(html).toContain("headers['x-bohemcars-prototype-role'] = prototypeRole");
		expect(html).toContain('...(prototypeRole ? { role: prototypeRole } : {})');
		expect(html).toContain("prototypeRole ? '?role=' + encodeURIComponent(prototypeRole) : ''");
	});

	it('wires preserved global search forms to Bohemcars inventory search', () => {
		const home = renderAuxeroTemplate('home-09.html');
		const listing = renderAuxeroTemplate('listing-grid3-columns.html');

		for (const html of [home, listing]) {
			expect(html).toContain(
				'<form class="search-form__form" action="/inventory" method="get" data-bohemcars-search-form="inventory">'
			);
			expect(html).toContain(
				'<form class="search-modal__form" action="/inventory" method="get" data-bohemcars-search-form="inventory">'
			);
			expect(html).toContain('class="search-form__input" name="q"');
			expect(html).toContain('class="search-modal__input" name="q"');
			expect(html).toContain('form.matches(\'[data-bohemcars-search-form="inventory"]\')');
			expect(html).toContain('const inventorySearchUrl = (form) =>');
			expect(html).toContain('const ensureInventoryUrlState = async () =>');
			expect(html).toContain("cache: 'no-store'");
			expect(html).toContain("'.bohemcars-inventory-content'");
			expect(html).toContain('go(inventorySearchUrl(form))');
		}
	});

	it('wires profile, password, and add-listing forms to Bohemcars local account behavior', () => {
		const profile = renderAuxeroTemplate('my-profile.html', { routePath: 'account/profile' });
		const password = renderAuxeroTemplate('change-password.html', {
			routePath: 'account/password'
		});
		const addListing = renderAuxeroTemplate('add-listings-2.html', {
			routePath: 'admin/inventory/new'
		});

		expect(profile).toContain('bohemcars-profile-form');
		expect(profile).toContain('data-bohemcars-profile-form');
		expect(profile).toContain('customer@bohemcars.local');
		expect(profile).toContain('Save Locally');
		expect(profile).toContain('+359 893 588 680');
		expect(profile).toContain('value="Bohemcars"');
		expect(password).toContain('bohemcars-password-form');
		expect(password).toContain('data-bohemcars-password-form');
		expect(password).not.toContain('themesflat@2026');
		expect(addListing).toContain('bohemcars-add-listing-form');
		expect(addListing).toContain('data-bohemcars-add-listing-form');
		expect(addListing).toContain('data-bohemcars-form-target=".bohemcars-add-listing-form"');
		expect(addListing).toContain('data-bohemcars-submit-form="true"');
		expect(addListing).toContain('data-bohemcars-listing-status="draft"');
		expect(addListing).toContain('data-bohemcars-listing-status="published"');
		expect(addListing).toContain('name="actorRole" value="admin"');
		expect(addListing).toContain("'/api/inventory/listings'");
		expect(addListing).toContain('Add Bohemcars Listing');
		expect(addListing).toContain(vehicles[0].title);
		expect(addListing).toContain('Vehicle description and inspection notes');
		expect(addListing).not.toContain('6205 Peachtree Dunwoody Rd');
		expect(addListing).not.toContain('Lorem ipsum');
	});

	it('renders admin inventory edit forms from the same preserved Auxero add-listing layout', () => {
		const listing = createInventoryListing({
			mileage: '12 300 km',
			priceLabel: '44 000 EUR',
			status: 'draft',
			title: 'Bohemcars Managed Edit Draft',
			vin: 'EDIT-DRAFT-001'
		});
		const html = renderAuxeroTemplate('add-listings-2.html', {
			routePath: `admin/inventory/edit/${listing.id}`
		});

		expect(html).toContain('Edit Bohemcars Listing');
		expect(html).toContain('data-bohemcars-admin-listing-mode="edit"');
		expect(html).toContain('data-bohemcars-add-listing-form');
		expect(html).toContain(`name="listingId" value="${listing.id}"`);
		expect(html).toContain('value="Bohemcars Managed Edit Draft"');
		expect(html).toContain('value="44 000 EUR"');
		expect(html).toContain('value="EDIT-DRAFT-001"');
		expect(html).toContain("listingId ? 'PATCH' : 'POST'");
	});

	it('renders sell-your-car and services pages with Bohemcars support forms', () => {
		const sell = renderAuxeroTemplate('sell-your-car.html');
		const services = renderAuxeroTemplate('services-center.html');

		expect(sell).toContain('Продай автомобила си с Bohemcars');
		expect(sell).toContain('bohemcars-sell-form');
		expect(sell).toContain(bohemcarsContact.primaryPhoneLabel);
		expect(sell).toContain('Sell-your-car request prepared locally for Bohemcars');
		expect(sell).not.toContain('Certified Dealers');
		expect(sell).not.toContain('Zip Code');
		expect(sell).not.toContain('1-555-678-8888');
		expect(services).toContain('Услуги от Bohemcars');
		expect(services).toContain('Внос от Канада');
		expect(services).toContain('bohemcars-service-form');
		expect(services).toContain('Service request queued locally for Bohemcars');
		expect(services).not.toContain('image-effect-scale');
		expect(services).not.toContain('Comprehensive Vehicle Care');
		expect(services).not.toContain('Tony Nguyen');
	});

	it('renders Bohemcars about and reviews content without demo executives', () => {
		const about = renderAuxeroTemplate('about-us.html');
		const reviews = renderAuxeroTemplate('clients-reviews.html');

		expect(about).toContain('Услуги около внос, оглед и продажба');
		expect(about).toContain('Екипът зад процеса');
		expect(about).toContain(agents[0].name);
		expect(reviews).toContain('Aleksandar Vytev');
		expect(reviews).toContain('Krasimir Georgiev');
		expect(reviews).not.toContain('Emily Johnson');
		expect(reviews).not.toContain('CEO Avitex');
		expect(about).not.toContain('Robert Fox');
		expect(about).not.toContain('President and Chief Executive Officer');
	});

	it('renders Bohemcars FAQ, terms, and calculator support surfaces', () => {
		const faqs = renderAuxeroTemplate('faqs.html');
		const terms = renderAuxeroTemplate('terms.html');
		const calculator = renderAuxeroTemplate('calculator.html');

		expect(faqs).toContain('Защо да внеса автомобил от Канада?');
		expect(faqs).toContain('Може ли Bohemcars да помогне при продажба на моя автомобил?');
		expect(faqs).not.toContain('Required documents for financing or leasing?');
		expect(terms).toContain('Условия за използване на Bohemcars');
		expect(terms).toContain('Vehicle Information');
		expect(terms).not.toContain('Lorem ipsum');
		expect(calculator).toContain('Калкулатор за внос');
		expect(calculator).toContain('data-bohemcars-calculator');
		expect(calculator).toContain('38 640 EUR');
		expect(calculator).not.toContain('$46.300');
		expect(calculator).not.toContain('What is an Auto Loan?');
	});

	it('renders Bohemcars blog list and detail pages from real posts', () => {
		const list = renderAuxeroTemplate('blog-grid-style-1.html');
		const detail = renderAuxeroTemplate('blog-details-1.html', {
			routePath: `blog/${posts[0].slug}`
		});

		for (const post of posts) {
			expect(list).toContain(post.title);
			expect(list).toContain(`/blog/${post.slug}`);
		}

		expect(detail).toContain(posts[0].title);
		expect(detail).toContain(posts[0].content[0]);
		expect(detail).toContain('bohemcars-blog-comment-form');
		expect(detail).toContain('bohemcars-newsletter-form');
		expect(detail).toContain('Comment saved locally for Bohemcars review');
		expect(list).not.toContain('Hybrid vs. Electric Cars');
		expect(detail).not.toContain('Compact SUV vs. Full-Size SUV');
		expect(detail).not.toContain('Mike Hanley');
		expect(detail).not.toContain('Tony Nguyen');
	});

	it('wires preserved Auxero newsletter forms into Bohemcars message capture', () => {
		const publicHtml = renderAuxeroTemplate('home-09.html');
		const accountHtml = renderAuxeroTemplate('dashboard.html', { routePath: 'account' });

		expect(publicHtml).toContain('class="form-footer relative"');
		expect(publicHtml).toContain('.bohemcars-newsletter-form, .form-footer, .newsletter-form');
		expect(publicHtml).toContain("'/api/messages'");
		expect(publicHtml).toContain('Newsletter signup saved locally for Bohemcars');
		expect(accountHtml).toContain('class="newsletter-form mb-16"');
		expect(accountHtml).toContain('.bohemcars-newsletter-form, .form-footer, .newsletter-form');
	});

	it('protects admin routes with the pragmatic role helper', () => {
		const customer = resolveBohemcarsSession('admin', new URLSearchParams('role=customer'));
		const agent = resolveBohemcarsSession('admin/inquiries', new URLSearchParams('role=agent'));
		const blocked = auxeroResponse('dashboard.html', { routePath: 'admin' });
		const guarded = auxeroRouteResponseWithCustomerRole();

		expect(canAccessBohemcarsRoute(customer, 'admin')).toBe(false);
		expect(canAccessBohemcarsRoute(agent, 'admin/inquiries')).toBe(true);
		expect(blocked.status).toBe(200);
		expect(guarded.status).toBe(403);
	});

	it('honors authenticated page session cookies for protected admin and account routes', async () => {
		const customer = requestForSession('admin/users', 'customer');
		const admin = requestForSession('admin/users', 'admin');
		const agent = requestForSession('admin/users', 'agent');
		const agentInquiries = requestForSession('admin/inquiries', 'agent');

		const anonymousAdmin = auxeroRouteResponse('admin/users', {
			request: new Request('http://localhost/admin/users')
		});
		const anonymousAccount = auxeroRouteResponse('account/messages', {
			request: new Request('http://localhost/account/messages')
		});
		const prototypeAdmin = auxeroRouteResponse('admin/users', {
			request: new Request('http://localhost/admin/users?role=admin'),
			searchParams: new URLSearchParams('role=admin')
		});
		const customerDenied = auxeroRouteResponse('admin/users', { request: customer.request });
		const adminAllowed = auxeroRouteResponse('admin/users', { request: admin.request });
		const agentDenied = auxeroRouteResponse('admin/users', { request: agent.request });
		const agentAllowed = auxeroRouteResponse('admin/inquiries', {
			request: agentInquiries.request
		});
		const anonymousAdminHtml = await anonymousAdmin.text();
		const anonymousAccountHtml = await anonymousAccount.text();
		const adminHtml = await adminAllowed.text();
		const agentHtml = await agentAllowed.text();

		expect(anonymousAdmin.status).toBe(200);
		expect(anonymousAdminHtml).toContain('User Management');
		expect(anonymousAdminHtml).toContain('content="admin"');
		expect(anonymousAccount.status).toBe(200);
		expect(anonymousAccountHtml).toContain('Messages');
		expect(anonymousAccountHtml).toContain('content="customer"');
		expect(prototypeAdmin.status).toBe(200);
		expect(customerDenied.status).toBe(403);
		expect(adminAllowed.status).toBe(200);
		expect(adminHtml).toContain('User Management');
		expect(adminHtml).toContain('content="admin"');
		expect(agentDenied.status).toBe(403);
		expect(agentAllowed.status).toBe(200);
		expect(agentHtml).toContain('content="agent"');
		expect(agentHtml).toContain('/admin/inquiries?role=agent');
		expect(agentHtml).not.toContain('href="/admin/users"');
	});

	it('uses authenticated account cookies for saved compare state on account pages', async () => {
		const customer = requestForSession('account/compare', 'customer');
		const savedVehicle = vehicles[1];

		updateBohemcarsGarageState(customer.session!, {
			compare: [savedVehicle.slug],
			favorites: []
		});

		const response = auxeroRouteResponse('account/compare', { request: customer.request });
		const html = await response.text();

		expect(response.status).toBe(200);
		expect(html).toContain(`data-bohemcars-compare-column="${savedVehicle.slug}"`);
		expect(html).toContain(savedVehicle.title);
	});
});

const auxeroRouteResponseWithCustomerRole = () =>
	auxeroRouteResponse('admin', { searchParams: new URLSearchParams('role=customer') });
