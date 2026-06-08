import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
	readCmsCollection,
	resetCmsPersistenceForTests,
	saveCmsUploadFiles
} from './cms-persistence';
import {
	archiveInventoryListing,
	createInventoryListing,
	listInventoryForAdmin,
	updateInventoryListing
} from './inventory';
import { getPublicVehicleBySlug, listPublishedCmsVehicles } from './public-vehicles';

const testDataRoot = () =>
	path.join(process.cwd(), '.tmp', 'bohemcars-cms-vitest', String(process.pid));
const testUploadsRoot = () => path.join(process.cwd(), 'static', 'uploads', 'cms', 'spec-listing');

const resetCmsState = () => {
	resetCmsPersistenceForTests();
	rmSync(testUploadsRoot(), { force: true, recursive: true });
};

describe('CMS listing persistence', () => {
	beforeEach(resetCmsState);
	afterEach(resetCmsState);

	it('stores full admin listings in durable local JSON', () => {
		const listing = createInventoryListing({
			bodyType: 'SUV',
			brand: 'BMW',
			color: 'Sophisto Grey',
			description: 'Documented Canadian import with service history.',
			doors: 5,
			engine: '3.0 diesel',
			features: ['Head-up display', 'Adaptive cruise'],
			fuel: 'Diesel',
			galleryImages: ['/uploads/cms/spec-listing/gallery/front.webp'],
			location: 'Plovdiv, Bulgaria',
			mileage: '91000 km',
			model: 'X5',
			previewImage: '/uploads/cms/spec-listing/preview/front.webp',
			price: '42000',
			sourceUrl: 'https://example.com/source',
			status: 'published',
			stockNumber: 'BOH-X5-001',
			title: 'Spec BMW X5 xDrive',
			transmission: 'Automatic',
			vin: 'SPEC-BMW-X5',
			year: 2022
		});
		const records = readCmsCollection('inventory-listings');
		const filePath = path.join(testDataRoot(), 'inventory-listings.json');

		expect(existsSync(filePath)).toBe(true);
		expect(records).toHaveLength(1);
		expect(records[0]).toMatchObject({
			bodyType: 'SUV',
			brand: 'BMW',
			documents: [],
			features: ['Head-up display', 'Adaptive cruise'],
			id: listing.id,
			mileage: 91000,
			price: 42000,
			slug: 'spec-bmw-x5-xdrive',
			status: 'published',
			vin: 'SPEC-BMW-X5'
		});
	});

	it('updates and archives CMS listings without removing static inventory rows', () => {
		const listing = createInventoryListing({
			status: 'draft',
			title: 'Archive Test Audi Q7',
			vin: 'ARCHIVE-Q7'
		});
		const updated = updateInventoryListing(listing.id, {
			priceLabel: '51 000 EUR',
			status: 'published',
			title: 'Updated Archive Test Audi Q7'
		});
		const archived = archiveInventoryListing(listing.id);
		const visibleRows = listInventoryForAdmin();
		const archivedRows = listInventoryForAdmin({ includeArchived: true });

		expect(updated?.title).toBe('Updated Archive Test Audi Q7');
		expect(updated?.priceLabel).toBe('51 000 EUR');
		expect(archived?.status).toBe('archived');
		expect(visibleRows.some((row) => row.id === listing.id)).toBe(false);
		expect(archivedRows.some((row) => row.id === listing.id && row.status === 'archived')).toBe(
			true
		);
		expect(visibleRows.some((row) => row.source === 'static-vehicle')).toBe(true);
	});

	it('validates and stores listing media with safe public paths', async () => {
		const formData = new FormData();
		formData.append('previewImage', new File(['preview'], 'Hero Car.JPG', { type: 'image/jpeg' }));
		formData.append(
			'galleryImages',
			new File(['gallery'], 'left angle.webp', { type: 'image/webp' })
		);
		formData.append(
			'documents',
			new File(['pdf'], 'Service History.PDF', { type: 'application/pdf' })
		);

		const uploads = await saveCmsUploadFiles({ formData, recordId: 'spec-listing' });

		expect(uploads.previewImage).toMatch(
			/^\/uploads\/cms\/spec-listing\/preview\/[a-z0-9-]+-hero-car\.jpg$/
		);
		expect(uploads.galleryImages[0]).toMatch(
			/^\/uploads\/cms\/spec-listing\/gallery\/[a-z0-9-]+-left-angle\.webp$/
		);
		expect(uploads.documents[0]).toMatchObject({
			mimeType: 'application/pdf',
			originalName: 'Service History.PDF',
			url: expect.stringMatching(
				/^\/uploads\/cms\/spec-listing\/documents\/[a-z0-9-]+-service-history\.pdf$/
			)
		});
	});

	it('maps published CMS listings into public inventory while excluding drafts', () => {
		const published = createInventoryListing({
			brand: 'Porsche',
			model: 'Macan',
			priceLabel: '58 000 EUR',
			status: 'published',
			title: 'Public CMS Porsche Macan',
			vin: 'PUBLIC-MACAN',
			year: 2023
		});
		const draft = createInventoryListing({
			brand: 'Audi',
			model: 'A6',
			status: 'draft',
			title: 'Hidden Draft Audi A6',
			vin: 'DRAFT-A6'
		});
		const publicVehicle = getPublicVehicleBySlug(published.slug);

		expect(publicVehicle).toMatchObject({
			brand: 'Porsche',
			priceLabel: '58 000 EUR',
			slug: published.slug,
			title: 'Public CMS Porsche Macan',
			vin: 'PUBLIC-MACAN'
		});
		expect(getPublicVehicleBySlug(draft.slug)).toBeUndefined();
		expect(listPublishedCmsVehicles().some((vehicle) => vehicle.slug === published.slug)).toBe(
			true
		);
	});
});
