<script lang="ts">
	import { resolve } from '$app/paths';
	import { bohemcarsAssets, bohemcarsBrand, bohemcarsContact } from '$lib/data/bohemcars';

	const buyingLinks = [
		{ href: '/inventory', label: 'Намери автомобил' },
		{ href: '/inventory?view=map', label: 'Карта на наличните' },
		{ href: '/compare', label: 'Сравни автомобили' },
		{ href: '/calculator', label: 'Калкулатор за внос' }
	] as const;
	const supportLinks = [
		{ href: '/services', label: 'Услуги' },
		{ href: '/sell-your-car', label: 'Продай автомобил' },
		{ href: '/agents', label: 'Консултанти' },
		{ href: '/contact', label: 'Контакт с Bohemcars' }
	] as const;
</script>

<footer class="site-footer">
	<div class="site-footer__top container">
		<div class="site-footer__brand">
			<img src={bohemcarsAssets.logoDark} alt="Bohemcars" />
			<p>
				{bohemcarsBrand.tagline}. Проверка на източник, съдействие при внос, продажба на автомобили
				и огледи с уговорка.
			</p>
		</div>
		<div>
			<p class="footer-title">Покупка с Bohemcars</p>
			<ul>
				{#each buyingLinks as link (link)}
					<li><a href={resolve(link.href)}>{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">Съдействие</p>
			<ul>
				{#each supportLinks as link (link)}
					<li><a href={resolve(link.href)}>{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">Bohemcars онлайн</p>
			<div class="app-buttons">
				<a href={resolve('/contact')}>{bohemcarsContact.primaryPhoneLabel}</a>
				<a href={resolve('/contact')}>Viber</a>
			</div>
		</div>
	</div>
	<div class="site-footer__bottom">
		<div class="container">
			<span>©2026 {bohemcarsBrand.name}. Всички права запазени.</span>
			<div>
				<a href={resolve('/terms')}>Общи условия</a>
				<a href={resolve('/terms')}>Поверителност</a>
				<a href={resolve('/terms')}>Бисквитки</a>
			</div>
		</div>
	</div>
</footer>
