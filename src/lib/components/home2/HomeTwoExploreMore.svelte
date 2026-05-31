<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveBrandCard, HomeFiveTypeCard } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';

	let {
		brandCards,
		copy,
		typeCards
	}: {
		brandCards: HomeFiveBrandCard[];
		copy: HomePageCopy;
		typeCards: HomeFiveTypeCard[];
	} = $props();

	const featuredBrands = $derived(brandCards.slice(0, 8));
	const featuredTypes = $derived(typeCards.slice(0, 6));
</script>

<section class="home2-explore bg-white">
	<div class="container">
		<div class="home2-type-strip">
			<div class="home2-explore__header">
				<h3>{copy.typeTitle}</h3>
				<a href={resolve('/inventory?view=4')}>{copy.typeCta}</a>
			</div>
			<div class="home2-type-grid">
				{#each featuredTypes as typeCard (typeCard.href)}
					<a class="home2-type-card" href={resolve(typeCard.href)}>
						<span class="home2-type-card__image">
							<img src={typeCard.image} alt={typeCard.label} />
						</span>
						<span>{typeCard.label}</span>
					</a>
				{/each}
			</div>
		</div>

		<div class="home2-brand-strip">
			<div class="home2-explore__header">
				<h3>{copy.brandTitle}</h3>
				<a href={resolve('/inventory')}>{copy.brandCta}</a>
			</div>
			<div class="home2-brand-grid">
				{#each featuredBrands as brand (brand.name)}
					<a
						class="home2-brand-card out-brand-2"
						href={resolve(`/inventory?brand=${encodeURIComponent(brand.query)}`)}
					>
						<img class="out-brand--img" src={brand.image} alt={brand.name} />
						<span class="home2-brand-card__name">{brand.name}</span>
						<span class="home2-brand-card__count">{brand.count}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.home2-explore {
		padding: 18px 0 88px;
	}

	.home2-explore__header {
		align-items: center;
		display: flex;
		gap: 24px;
		justify-content: space-between;
		margin-bottom: 24px;
		text-align: left;
	}

	.home2-explore__header h3 {
		font-size: clamp(26px, 2.2vw, 34px);
		letter-spacing: 0;
		line-height: 1.08;
		margin-bottom: 0;
	}

	.home2-explore__header a {
		color: #1c1c1c;
		font-weight: 700;
		text-decoration: none;
	}

	.home2-explore__header a:hover {
		color: #98bc2a;
	}

	.home2-type-grid {
		display: grid;
		gap: 18px;
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}

	.home2-type-card {
		align-items: center;
		background: #f0f2ee;
		border-radius: 8px;
		color: #1c1c1c;
		display: flex;
		flex-direction: column;
		min-height: 158px;
		padding: 14px 10px 16px;
		text-align: center;
	}

	.home2-type-card:hover {
		background: #e5ebe2;
		color: #1c1c1c;
		transform: none;
	}

	.home2-type-card__image {
		align-items: flex-end;
		display: flex;
		flex: 1;
		justify-content: center;
		margin-bottom: 10px;
		width: 100%;
	}

	.home2-type-card img {
		max-height: 82px;
		max-width: 100%;
		object-fit: contain;
		transform: none !important;
	}

	.home2-type-card span:last-child {
		font-size: 17px;
		font-weight: 600;
		line-height: 24px;
	}

	.home2-brand-strip {
		margin-top: 58px;
	}

	.home2-brand-grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.home2-brand-card {
		align-items: center;
		background: #f1f3ee !important;
		border-radius: 8px;
		box-shadow: none !important;
		display: grid;
		min-height: 146px;
		padding: 22px 12px;
		text-align: center;
	}

	.home2-brand-card:hover {
		background: #e7ece4 !important;
		transform: none;
	}

	.home2-brand-card img {
		height: 34px;
		margin: 0 auto 12px;
		max-width: 96px;
		object-fit: contain;
	}

	.home2-brand-card__name {
		color: #1c1c1c;
		font-size: 20px;
		font-weight: 600;
		line-height: 26px;
	}

	.home2-brand-card__count {
		color: #777;
		font-size: 14px;
		line-height: 20px;
	}

	@media (max-width: 991px) {
		.home2-brand-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.home2-type-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 575px) {
		.home2-explore {
			padding: 18px 0 68px;
		}

		.home2-explore__header {
			align-items: flex-start;
			flex-direction: column;
		}

		.home2-brand-grid,
		.home2-type-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
