import { describe, expect, it } from 'vitest';
import { posts } from '$lib/data/blog';
import { bohemcarsBrand, bohemcarsFetchedAt } from '$lib/data/bohemcars';
import { agents } from '$lib/data/agents';
import { vehicles } from '$lib/data/vehicles';
import { GET } from './+server';

describe('Bohemcars sitemap', () => {
	it('publishes public Bohemcars routes and excludes blocked template commerce pages', async () => {
		const response = GET();
		const xml = await response.text();
		const baseUrl = `https://${bohemcarsBrand.domain}`;

		expect(response.headers.get('content-type')).toContain('application/xml');
		expect(xml).toContain(`<lastmod>${bohemcarsFetchedAt}</lastmod>`);
		expect(xml).toContain(`<loc>${baseUrl}/inventory</loc>`);
		expect(xml).toContain(`<loc>${baseUrl}/inventory?view=4</loc>`);
		expect(xml).toContain(`<loc>${baseUrl}/inventory?view=map</loc>`);
		expect(xml).toContain(`<loc>${baseUrl}/inventory/${vehicles[0].slug}</loc>`);
		expect(xml).toContain(`<loc>${baseUrl}/agents/${agents[0].slug}</loc>`);
		expect(xml).toContain(`<loc>${baseUrl}/blog/${posts[0].slug}</loc>`);
		expect(xml).not.toContain('/shop');
		expect(xml).not.toContain('/shopping-cart');
		expect(xml).not.toContain('/check-out');
		expect(xml).not.toContain('/coming-soon');
	});
});
