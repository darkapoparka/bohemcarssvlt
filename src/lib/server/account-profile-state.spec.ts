import { describe, expect, it } from 'vitest';
import { bohemcarsAssets, bohemcarsBrand, bohemcarsContact } from '$lib/data/bohemcars';
import {
	accountPasswordFormData,
	accountProfileFormData,
	getAccountPasswordFormData,
	getAccountProfileFormData
} from './account-profile-state';
import { accountAvatarByRole, accountContext } from './account-dashboard-state';

describe('account-profile-state', () => {
	it('builds customer profile data without template demo values', () => {
		const profile = getAccountProfileFormData('my-profile.html', {
			routePath: 'account/profile',
			searchParams: new URLSearchParams('role=customer')
		});

		expect(profile).toMatchObject({
			address: bohemcarsContact.addressLabel,
			avatarImage: accountAvatarByRole.customer,
			company: bohemcarsBrand.name,
			email: 'customer@bohemcars.local',
			firstName: 'Bohemcars',
			lastName: 'Customer',
			posterImage: bohemcarsAssets.footerImage,
			role: 'customer',
			roleLabel: 'Customer'
		});
		expect(profile.description).toContain(bohemcarsBrand.tagline);
		expect(profile.roleNote).toContain('Customer');
		expect(profile.mapOptions).toEqual([
			bohemcarsContact.addressLabel,
			`${bohemcarsContact.addressLabel} - appointment area`,
			`${bohemcarsContact.addressLabel} - import handoff`
		]);
		expect(profile.socialLinks.map((link) => link.id)).toEqual([
			'Facebook',
			'skype',
			'xUrl',
			'telegram',
			'instagram',
			'youtube'
		]);
		expect(profile.socialLinks[0]?.value).toBe(bohemcarsContact.facebookHref);
		expect(profile.socialLinks[5]?.value).toBe(bohemcarsContact.youtubeHref);
		expect(JSON.stringify(profile)).not.toContain('themesflat');
		expect(JSON.stringify(profile)).not.toContain('John');
		expect(JSON.stringify(profile)).not.toContain('Smith');
	});

	it('returns role-aware password form data without carrying password values', () => {
		const password = getAccountPasswordFormData('change-password.html', {
			routePath: 'account/password',
			searchParams: new URLSearchParams('role=agent')
		});

		expect(password).toEqual({
			email: 'agent@bohemcars.local',
			role: 'agent'
		});
		expect(password).not.toHaveProperty('password');
		expect(JSON.stringify(password)).not.toContain('themesflat@2026');
	});

	it('keeps direct helpers aligned with route-friendly accessors', () => {
		const options = {
			routePath: 'account/profile',
			searchParams: new URLSearchParams('role=admin')
		};

		expect(accountProfileFormData(accountContext('my-profile.html', options))).toEqual(
			getAccountProfileFormData('my-profile.html', options)
		);
		expect(accountPasswordFormData(accountContext('change-password.html', options))).toEqual(
			getAccountPasswordFormData('change-password.html', options)
		);
	});
});
