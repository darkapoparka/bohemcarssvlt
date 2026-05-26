import { describe, expect, it } from 'vitest';
import {
	bohemcarsBrand,
	bohemcarsContact,
	bohemcarsFetchedAt,
	bohemcarsVehicles,
	cleanBohemcarsDescription
} from './bohemcars';

describe('bohemcars data adapter', () => {
	it('loads the real listing feed snapshot', () => {
		expect(bohemcarsFetchedAt).toBe('2026-05-21');
		expect(bohemcarsVehicles).toHaveLength(42);
		expect(bohemcarsVehicles[0].model).toBe('BMW X5 40i M Sport Shadow Line');
		expect(bohemcarsVehicles[0].priceEur).toBe(36500);
	});

	it('normalizes the core brand and contact data', () => {
		expect(bohemcarsBrand.name).toBe('Bohemcars');
		expect(bohemcarsContact.primaryPhoneHref).toBe('tel:+359893588680');
		expect(bohemcarsContact.emailLabel).toBe('bohemcars@gmail.com');
	});

	it('cleans known source typos without changing the source JSON', () => {
		expect(cleanBohemcarsDescription('асистенти за шифоране и обудхване')).toBe(
			'асистенти за шофиране и обдухване'
		);
	});
});
