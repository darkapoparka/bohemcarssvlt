<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveVehiclePill } from '$lib/auxero/home-five';
	import { ArrowRight } from '@lucide/svelte';

	let { pills }: { pills: HomeFiveVehiclePill[] } = $props();

	const primaryPills = $derived(pills.slice(0, 9));

	const actionCards = [
		{
			body: 'Налични автомобили с ясен произход и оглед преди сделка.',
			href: '/inventory',
			image: '/assets/bohemcars/home2/home2-action-buy.webp',
			kicker: 'Купи автомобил',
			label: 'Виж наличните',
			tone: 'buy'
		},
		{
			body: 'Подбор, проверка, документи и доставка от Канада.',
			href: '/services',
			image: '/assets/bohemcars/home2/home2-action-import.webp',
			kicker: 'Внос от Канада',
			label: 'Виж процеса',
			tone: 'import'
		}
	] as const;

	const budgetCards = [
		{
			href: '/inventory?maxPrice=30000',
			image: '/assets/bohemcars/home2/home2-budget-entry.webp',
			label: 'до 30 000 €',
			meta: 'Градски и практични',
			tone: 'entry'
		},
		{
			href: '/inventory?minPrice=30000&maxPrice=50000',
			image: '/assets/bohemcars/home2/home2-budget-mid.webp',
			label: '30 000 - 50 000 €',
			meta: 'Семейни SUV и седани',
			tone: 'mid'
		},
		{
			href: '/inventory?minPrice=50000&maxPrice=80000',
			image: '/assets/bohemcars/home2/home2-budget-premium.webp',
			label: '50 000 - 80 000 €',
			meta: 'Премиум избор',
			tone: 'premium'
		},
		{
			href: '/inventory?minPrice=80000',
			image: '/assets/bohemcars/home2/home2-budget-luxury.webp',
			label: '80 000+ €',
			meta: 'Луксозни модели',
			tone: 'luxury'
		}
	] as const;
</script>

<section class="home2-browse bg-white">
	<div class="container">
		<nav class="home2-chip-row" aria-label="Популярни търсения">
			{#each primaryPills as pill (pill.href)}
				<a href={resolve(pill.href)} class="home2-chip car-box">
					{#if pill.image}
						<img src={pill.image} alt="" />
					{/if}
					<span>{pill.label}</span>
				</a>
			{/each}
		</nav>

		<div class="home2-action-grid" aria-label="Основни услуги">
			{#each actionCards as card (card.href)}
				<a class={`home2-action-card home2-action-card--${card.tone}`} href={resolve(card.href)}>
					<span class="home2-action-card__copy">
						<strong>{card.kicker}</strong>
						<span>{card.body}</span>
						<em>
							{card.label}
							<ArrowRight size={17} strokeWidth={2.4} />
						</em>
					</span>
					<img src={card.image} alt="" loading="lazy" />
				</a>
			{/each}
		</div>

		<div class="home2-budget" id="home2-budget">
			<div class="home2-section-heading">
				<h3>Разгледай по бюджет</h3>
			</div>
			<div class="home2-budget-grid">
				{#each budgetCards as card (card.href)}
					<a class={`home2-budget-card home2-budget-card--${card.tone}`} href={resolve(card.href)}>
						<span class="home2-budget-card__copy">
							<span class="home2-budget-card__label">{card.label}</span>
							<span class="home2-budget-card__meta">{card.meta}</span>
						</span>
						<img src={card.image} alt="" loading="lazy" />
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.home2-browse {
		padding: 22px 0 34px;
	}

	.home2-chip-row {
		display: flex;
		gap: 12px;
		justify-content: center;
		margin: 0 auto 24px;
		max-width: 100%;
		overflow-x: auto;
		padding: 0 4px 4px;
	}

	.home2-chip {
		align-items: center;
		background: #edf2ef;
		border-radius: 8px;
		color: #101514;
		display: flex;
		flex: 0 0 auto;
		gap: 8px;
		min-height: 44px;
		padding: 10px 16px;
	}

	.home2-chip:hover {
		background: #dfe9e3;
		color: #101514;
		transform: none;
	}

	.home2-chip img {
		height: 20px;
		object-fit: contain;
		width: 30px;
	}

	.home2-chip span {
		color: inherit !important;
		font-size: 15px;
		font-weight: 700;
		line-height: 20px;
		white-space: nowrap;
	}

	.home2-action-grid {
		display: grid;
		gap: 14px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		margin-bottom: 42px;
	}

	.home2-action-card {
		align-items: stretch;
		border-radius: 8px;
		color: #ffffff;
		display: grid;
		isolation: isolate;
		min-height: 146px;
		overflow: hidden;
		padding: 18px;
		position: relative;
	}

	.home2-action-card:hover {
		color: #ffffff;
		transform: none;
	}

	.home2-action-card--buy {
		background: #151a18;
	}

	.home2-action-card--sell {
		background: #f0f3ee;
		color: #121715;
	}

	.home2-action-card--sell:hover {
		color: #121715;
	}

	.home2-action-card--import {
		background: #55d8cf;
		color: #121715;
	}

	.home2-action-card--import:hover {
		background: #49cbc2;
		color: #121715;
	}

	.home2-action-card__copy {
		color: inherit;
		display: grid;
		gap: 6px;
		position: relative;
		z-index: 2;
	}

	.home2-action-card__copy strong {
		color: inherit;
		font-size: clamp(19px, 1.55vw, 24px);
		line-height: 1.1;
		max-width: 260px;
	}

	.home2-action-card__copy > span {
		color: inherit;
		font-size: 14px;
		font-weight: 600;
		line-height: 19px;
		max-width: 290px;
		opacity: 0.78;
	}

	.home2-action-card__copy em {
		align-items: center;
		color: inherit;
		display: flex;
		font-size: 15px;
		font-style: normal;
		font-weight: 800;
		gap: 7px;
		line-height: 20px;
		margin-top: 0;
	}

	.home2-action-card img {
		bottom: -26px;
		height: auto;
		max-width: none;
		position: absolute;
		right: -44px;
		width: 282px;
		z-index: 1;
	}

	.home2-action-card--sell img {
		bottom: -22px;
		right: -114px;
		width: 300px;
	}

	.home2-action-card--import img {
		bottom: -28px;
		right: -74px;
		width: 334px;
	}

	.home2-budget {
		margin-bottom: 0;
	}

	.home2-section-heading {
		text-align: center;
	}

	.home2-section-heading h3 {
		font-size: clamp(26px, 2.3vw, 34px);
		line-height: 1.08;
		margin-bottom: 24px;
	}

	.home2-budget-grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.home2-budget-card {
		align-items: flex-start;
		background: #edf2ed;
		border-radius: 8px;
		color: #1c1c1c;
		display: flex;
		isolation: isolate;
		min-height: 164px;
		overflow: hidden;
		padding: 20px;
		position: relative;
	}

	.home2-budget-card:hover {
		color: #1c1c1c;
		transform: none;
	}

	.home2-budget-card--entry {
		background: #eef4ef;
	}

	.home2-budget-card--mid {
		background: #edf3f6;
	}

	.home2-budget-card--premium {
		background: #f4f0e8;
	}

	.home2-budget-card--luxury {
		background: #ebeef1;
	}

	.home2-budget-card:hover.home2-budget-card--entry {
		background: #e2efe3;
	}

	.home2-budget-card:hover.home2-budget-card--mid {
		background: #e1eef3;
	}

	.home2-budget-card:hover.home2-budget-card--premium {
		background: #eee8dc;
	}

	.home2-budget-card:hover.home2-budget-card--luxury {
		background: #dfe5ea;
	}

	.home2-budget-card__copy {
		display: grid;
		gap: 6px;
		position: relative;
		z-index: 2;
	}

	.home2-budget-card__label {
		font-size: 19px;
		font-weight: 800;
		line-height: 25px;
		max-width: 180px;
	}

	.home2-budget-card__meta {
		color: #66706a;
		font-size: 14px;
		font-weight: 700;
		line-height: 19px;
		max-width: 145px;
	}

	.home2-budget-card img {
		bottom: -4px;
		height: auto;
		max-width: none;
		position: absolute;
		right: -54px;
		width: 226px;
		z-index: 1;
	}

	@media (max-width: 1199px) {
		.home2-action-grid {
			grid-template-columns: 1fr;
		}

		.home2-action-card {
			min-height: 160px;
		}

		.home2-action-card img {
			right: -44px;
		}
	}

	@media (max-width: 991px) {
		.home2-budget-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 575px) {
		.home2-browse {
			padding: 22px 0 28px;
		}

		.home2-chip-row {
			justify-content: flex-start;
			margin-left: -15px;
			margin-right: -15px;
			padding-left: 15px;
			padding-right: 15px;
		}

		.home2-action-card {
			min-height: 156px;
			padding: 20px;
		}

		.home2-action-card img {
			opacity: 0.44;
			right: -104px;
			width: 290px;
		}

		.home2-budget-grid {
			grid-template-columns: 1fr;
		}

		.home2-budget-card {
			min-height: 148px;
		}

		.home2-budget-card img {
			right: -48px;
			width: 224px;
		}
	}
</style>
