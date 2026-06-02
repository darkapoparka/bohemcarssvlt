<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';

	let {
		copy,
		vehicles
	}: {
		copy: HomePageCopy;
		vehicles: HomeFiveVehicleCardData[];
	} = $props();
</script>

{#if vehicles.length}
	<section class="home2-inventory">
		<div class="container">
			<div class="home2-inventory__header">
				<div>
					<p>Популярни в момента</p>
					<h2>Избрани автомобили</h2>
				</div>
				<a href={resolve('/inventory?view=4')} class="home2-inventory__link">
					{copy.commonCta}
				</a>
			</div>

			<div class="home2-inventory__rail" aria-label="Избрани автомобили">
				{#each vehicles.slice(0, 6) as vehicle (vehicle.slug)}
					<a
						class="home2-compact-car"
						href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
					>
						<span class="home2-compact-car__image">
							<img src={vehicle.image} alt={vehicle.title} loading="lazy" />
						</span>
						<span class="home2-compact-car__content">
							<span class="home2-compact-car__title">{vehicle.title}</span>
							<span class="home2-compact-car__meta">
								{vehicle.year} · {vehicle.fuel} · {vehicle.transmission}
							</span>
							<span class="home2-compact-car__price">{vehicle.priceLabel}</span>
						</span>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.home2-inventory {
		background: #f5f7f5;
		padding: 54px 0 72px;
	}

	.home2-inventory__header {
		align-items: center;
		display: grid;
		gap: 24px;
		grid-template-columns: minmax(0, 1fr) auto;
		margin-bottom: 24px;
		text-align: left;
	}

	.home2-inventory__header p {
		color: #66706a;
		font-size: 14px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 18px;
		margin: 0 0 8px;
		text-transform: uppercase;
	}

	.home2-inventory__header h2 {
		font-size: clamp(30px, 2.7vw, 42px);
		line-height: 1.08;
		margin: 0;
	}

	.home2-inventory__link {
		color: #121715;
		font-size: 15px;
		font-weight: 800;
		line-height: 20px;
		text-decoration: none;
	}

	.home2-inventory__link:hover {
		color: #7ca017;
	}

	.home2-inventory__rail {
		display: flex;
		gap: 16px;
		margin-left: -4px;
		margin-right: -4px;
		overflow-x: auto;
		padding: 4px 4px 10px;
	}

	.home2-compact-car {
		background: #ffffff;
		border-radius: 8px;
		color: #121715;
		display: grid;
		flex: 0 0 min(330px, 78vw);
		grid-template-rows: 176px 1fr;
		overflow: hidden;
		text-decoration: none;
	}

	.home2-compact-car:hover {
		background: #ffffff;
		box-shadow: 0 8px 20px rgba(28, 28, 28, 0.06);
		color: #121715;
		transform: none;
	}

	.home2-compact-car__image {
		align-items: center;
		background: #eef2f0;
		display: flex;
		justify-content: center;
		overflow: hidden;
		padding: 18px;
	}

	.home2-compact-car__image img {
		height: 100%;
		max-width: 100%;
		object-fit: contain;
		transform: none !important;
	}

	.home2-compact-car__content {
		display: grid;
		gap: 7px;
		padding: 18px;
	}

	.home2-compact-car__title {
		color: inherit;
		display: -webkit-box;
		font-size: 20px;
		font-weight: 800;
		line-clamp: 2;
		line-height: 25px;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.home2-compact-car__meta {
		color: #66706a;
		font-size: 14px;
		font-weight: 700;
		line-height: 19px;
		white-space: nowrap;
	}

	.home2-compact-car__price {
		color: #121715;
		font-size: 18px;
		font-weight: 800;
		line-height: 24px;
		margin-top: 3px;
	}

	@media (max-width: 991px) {
		.home2-inventory__header {
			align-items: flex-start;
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 575px) {
		.home2-inventory {
			padding: 46px 0 60px;
		}

		.home2-compact-car {
			flex-basis: 286px;
			grid-template-rows: 150px 1fr;
		}
	}
</style>
