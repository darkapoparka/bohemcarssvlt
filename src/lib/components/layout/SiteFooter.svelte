<script lang="ts">
	import { resolve } from '$app/paths';
	import { bohemcarsAssets, bohemcarsBrand, bohemcarsContact } from '$lib/data/bohemcars';

	const buyingLinks = [
		{ href: '/inventory', label: 'Find a Vehicle' },
		{ href: '/inventory?view=map', label: 'Inventory Map' },
		{ href: '/compare', label: 'Compare Vehicles' },
		{ href: '/calculator', label: 'Import Calculator' }
	] as const;
	const supportLinks = [
		{ href: '/services', label: 'Services' },
		{ href: '/sell-your-car', label: 'Sell Your Car' },
		{ href: '/agents', label: 'Consultants' },
		{ href: '/contact', label: 'Contact Bohemcars' }
	] as const;
</script>

<footer class="site-footer">
	<div class="site-footer__top container">
		<div class="site-footer__brand">
			<img src={bohemcarsAssets.logoDark} alt="Bohemcars" />
			<p>
				{bohemcarsBrand.tagline}. Source checks, import guidance, vehicle sales, and viewings by
				appointment.
			</p>
		</div>
		<div>
			<p class="footer-title">Buying With Bohemcars</p>
			<ul>
				{#each buyingLinks as link (link)}
					<li><a href={resolve(link.href)}>{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">Support</p>
			<ul>
				{#each supportLinks as link (link)}
					<li><a href={resolve(link.href)}>{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">Bohemcars Online</p>
			<div class="app-buttons">
				<a href={resolve('/contact')}>{bohemcarsContact.primaryPhoneLabel}</a>
				<a href={resolve('/contact')}>Viber</a>
			</div>
		</div>
	</div>
	<div class="site-footer__bottom">
		<div class="container">
			<span>©2026 {bohemcarsBrand.name}. All Rights Reserved.</span>
			<div>
				<a href={resolve('/terms')}>Terms Of Services</a>
				<a href={resolve('/terms')}>Privacy Policy</a>
				<a href={resolve('/terms')}>Cookie Policy</a>
			</div>
		</div>
	</div>
</footer>
