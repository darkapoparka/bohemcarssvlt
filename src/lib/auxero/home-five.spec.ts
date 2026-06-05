import { describe, expect, it } from 'vitest';
import {
	homeFiveBrandCardsForLocale,
	homeFiveHeaderData,
	homeFiveHeaderDataForLocale,
	homeFiveVehiclePills
} from './home-five';

describe('homeFiveVehiclePills', () => {
	it('keeps the Home 05 quick-search pills as shared typed route data', () => {
		expect(homeFiveVehiclePills).toEqual([
			{
				active: true,
				href: '/inventory?bodyType=SUV',
				icon: 'suv',
				kind: 'body',
				label: 'SUV',
				termGroup: 'bodyTypes'
			},
			{
				active: false,
				href: '/inventory?bodyType=Sedan',
				icon: 'sedan',
				kind: 'body',
				label: 'Sedan',
				termGroup: 'bodyTypes'
			},
			{
				active: false,
				href: '/inventory?bodyType=Coupe',
				icon: 'coupe',
				kind: 'body',
				label: 'Coupe',
				termGroup: 'bodyTypes'
			},
			{
				active: false,
				href: '/inventory?bodyType=Luxury',
				icon: 'luxury',
				kind: 'body',
				label: 'Luxury',
				termGroup: 'bodyTypes'
			},
			{
				active: false,
				href: '/inventory?transmission=Automatic',
				image: '/assets/icons/transmission.svg',
				kind: 'spec',
				label: 'Automatic',
				termGroup: 'transmissions'
			},
			{
				active: false,
				href: '/inventory?q=4x4',
				image: '/assets/icons/transmission.svg',
				kind: 'spec',
				label: '4x4'
			},
			{
				active: false,
				href: '/inventory?fuel=Petrol',
				image: '/assets/icons/gaspump.svg',
				kind: 'spec',
				label: 'Petrol',
				termGroup: 'fuels'
			},
			{
				active: false,
				href: '/inventory?minYear=2021',
				image: '/assets/icons/calendar.svg',
				kind: 'spec',
				label: '2021+'
			},
			{
				active: false,
				href: '/inventory?maxMileage=120000',
				image: '/assets/icons/mileage.svg',
				kind: 'spec',
				label: 'Under 120k',
				labels: { bg: 'до 120k' }
			},
			{
				active: false,
				href: '/inventory?brand=BMW',
				image: '/assets/images/brand/brand-1.webp',
				kind: 'brand',
				label: 'BMW'
			},
			{
				active: false,
				href: '/inventory?brand=Audi',
				image: '/assets/images/brand/brand-3.webp',
				kind: 'brand',
				label: 'Audi'
			},
			{
				active: false,
				href: '/inventory?brand=Mercedes-Benz',
				image: '/assets/images/brand/brand-2.webp',
				kind: 'brand',
				label: 'Mercedes'
			}
		]);
	});
});

describe('homeFiveBrandCardsForLocale', () => {
	it('keeps the Home 05 brand wall at the full 12-card coverage', () => {
		const cards = homeFiveBrandCardsForLocale('bg');

		expect(cards).toHaveLength(12);
		expect(cards.map((card) => card.name)).toEqual([
			'BMW',
			'Mercedes',
			'Audi',
			'Honda',
			'Toyota',
			'Volvo',
			'Ford',
			'Hyundai',
			'Kia',
			'Mazda',
			'Ferrari',
			'Tesla'
		]);
		expect(cards.find((card) => card.query === 'BMW')?.count).toBe('18 автомобила');
		expect(cards.find((card) => card.query === 'Audi')?.count).toBe('38 автомобила');
		expect(cards.find((card) => card.query === 'Kia')?.image).toBe(
			'/assets/bohemcars/brands/kia-transparent.webp'
		);
		expect(cards.find((card) => card.query === 'Tesla')?.count).toBe('27 автомобила');
	});
});

describe('homeFiveHeaderData', () => {
	it('keeps the white-header logo and cleaned-up homepage information architecture intact', () => {
		expect(homeFiveHeaderData.logo.src).toContain('bohemcars-logo-concept-light-template-clean');
		expect(homeFiveHeaderData.logo.mobileSrc).toContain(
			'bohemcars-logo-concept-light-template-clean'
		);
		expect(homeFiveHeaderData.navigation.map((item) => item.label)).toEqual([
			'Home',
			'Inventory',
			'Services',
			'About',
			'Contact'
		]);

		const inventory = homeFiveHeaderData.navigation.find((item) => item.label === 'Inventory');
		const services = homeFiveHeaderData.navigation.find((item) => item.label === 'Services');
		const about = homeFiveHeaderData.navigation.find((item) => item.label === 'About');

		expect(inventory?.megaMenu?.variant).toBe('inventory');
		if (!inventory?.megaMenu || inventory.megaMenu.variant !== 'inventory') {
			throw new Error('Expected inventory mega menu');
		}
		expect(inventory?.megaMenu?.sections.map((section) => section.title)).toEqual([
			'Browse Inventory',
			'Shop By Body Type',
			'Shop By Fuel Type',
			'Bohemcars Support'
		]);
		expect(inventory?.megaMenu?.sections[0]?.links[0]).toEqual({
			href: '/inventory',
			label: 'All Vehicles'
		});
		expect(inventory?.megaMenu?.vehicles).toHaveLength(4);
		expect(inventory?.megaMenu?.vehicles[0]).toMatchObject({
			href: '/inventory/21764342419542174',
			image: '/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.webp',
			label: 'BMW X5 40i'
		});
		expect(inventory?.megaMenu?.footer.ctaHref).toBe('/inventory');
		expect(inventory?.megaMenu?.footer.title).toContain('vehicles in the Bohemcars stock feed');

		expect(services?.megaMenu?.variant).toBe('container');
		if (!services?.megaMenu || services.megaMenu.variant !== 'container') {
			throw new Error('Expected services dropdown menu');
		}
		expect(services?.megaMenu?.links).toEqual(
			expect.arrayContaining([
				{ href: '/services', label: 'Services Overview' },
				{ href: '/sell-your-car', label: 'Sell Your Car' },
				{ href: '/compare', label: 'Compare Vehicles' }
			])
		);

		expect(about?.megaMenu?.variant).toBe('container');
		if (!about?.megaMenu || about.megaMenu.variant !== 'container') {
			throw new Error('Expected about dropdown menu');
		}
		expect(about?.megaMenu?.links).toEqual(
			expect.arrayContaining([
				{ href: '/about', label: 'About Us' },
				{ href: '/agents', label: 'Meet Our Consultants' },
				{ href: '/blog', label: 'Bohemcars Notes' }
			])
		);
	});

	it('marks the supplied public route active in the shared header data', () => {
		const inventoryHeader = homeFiveHeaderDataForLocale('bg', '/inventory');
		const activeLabels = inventoryHeader.navigation
			.filter((item) => item.active)
			.map((item) => item.label);

		expect(activeLabels).toEqual(['Автомобили']);
		expect(
			inventoryHeader.navigation.find((item) => item.href === '/inventory')?.megaMenu?.variant
		).toBe('inventory');
	});
});
