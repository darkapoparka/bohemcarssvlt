<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveHeroData } from '$lib/auxero/home-five';

	let {
		hero
	}: {
		hero?: HomeFiveHeroData;
	} = $props();

	const serviceTabs = [
		{ href: '/inventory', label: 'Купи' },
		{ href: '/sell-your-car', label: 'Продай' },
		{ href: '/services', label: 'Внос' }
	] as const;
</script>

{#if hero}
	<section class="home2-hero">
		<img
			class="home2-hero__car home2-hero__car--left"
			src="/assets/bohemcars/home2/home2-hero-suv.png"
			alt=""
			loading="eager"
		/>
		<img
			class="home2-hero__car home2-hero__car--right"
			src="/assets/bohemcars/home2/home2-hero-sedan.png"
			alt=""
			loading="eager"
		/>

		<div class="container">
			<div class="home2-hero__content">
				<h1>Купи. Продай. Внеси.</h1>

				<form
					class="home2-search"
					action={resolve('/inventory')}
					method="get"
					data-bohemcars-search-form="inventory"
				>
					<div class="home2-search__tabs" aria-label="Основни действия">
						{#each serviceTabs as tab (tab.href)}
							<a href={resolve(tab.href)} class:active={tab.label === 'Купи'}>
								{tab.label}
							</a>
						{/each}
					</div>

					<div class="home2-search__surface">
						<div class="home2-search__bar">
							<input
								name="q"
								type="search"
								placeholder="Търси по марка, модел или тип"
								autocomplete="off"
							/>
							<button
								type="submit"
								aria-label={`${hero.searchSubmitPrefix} ${hero.totalMatches} ${hero.searchSubmitSuffix}`}
							>
								<img src="/assets/icons/search.svg" alt="" />
							</button>
						</div>
					</div>

					<p>
						или <a href={resolve('/inventory')}
							>{hero.searchSubmitPrefix.toLowerCase()}
							{hero.totalMatches}
							{hero.searchSubmitSuffix}</a
						>
					</p>
				</form>
			</div>
		</div>
	</section>
{/if}

<style>
	.home2-hero {
		background:
			radial-gradient(circle at 28% 75%, rgba(255, 255, 255, 0.24), transparent 24%),
			radial-gradient(circle at 78% 28%, rgba(255, 255, 255, 0.2), transparent 22%),
			linear-gradient(180deg, #55d8cf 0%, #55d8cf 70%, #4fd0c6 100%);
		min-height: 390px;
		overflow: hidden;
		padding-bottom: 0;
		position: relative;
	}

	.home2-hero__content {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 390px;
		padding: 0;
		position: relative;
		z-index: 2;
	}

	.home2-hero h1 {
		color: #101514;
		font-size: clamp(40px, 4.05vw, 58px);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.03;
		margin: 0 0 18px;
		max-width: 960px;
		text-align: center;
	}

	.home2-hero__car {
		filter: drop-shadow(0 26px 34px rgba(0, 0, 0, 0.16));
		height: auto;
		max-width: none;
		opacity: 0.96;
		position: absolute;
		user-select: none;
		width: min(26vw, 374px);
	}

	.home2-hero__car--left {
		bottom: 14px;
		left: max(16px, calc((100vw - 1320px) / 2 - 70px));
	}

	.home2-hero__car--right {
		bottom: 14px;
		right: max(16px, calc((100vw - 1320px) / 2 - 86px));
		width: min(28vw, 404px);
	}

	.home2-search {
		background: #ffffff;
		border-radius: 8px;
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.16);
		max-width: 640px;
		padding: 8px;
		width: min(640px, 100%);
	}

	.home2-search__tabs {
		align-items: center;
		border-bottom: 1px solid #e2e7e3;
		display: flex;
		gap: 30px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		justify-content: center;
		padding: 4px 8px 0;
	}

	.home2-search__tabs a {
		align-items: center;
		color: #1b1f1d;
		display: flex;
		font-size: 16px;
		font-weight: 800;
		justify-content: center;
		line-height: 20px;
		min-width: 44px;
		min-height: 44px;
		padding: 8px 2px 12px;
		position: relative;
		text-align: center;
	}

	.home2-search__tabs a.active,
	.home2-search__tabs a:hover {
		background: transparent;
		color: #101514;
	}

	.home2-search__tabs a::after {
		background: transparent;
		border-radius: 999px 999px 0 0;
		bottom: -1px;
		content: '';
		height: 3px;
		left: 0;
		position: absolute;
		right: 0;
	}

	.home2-search__tabs a.active::after,
	.home2-search__tabs a:hover::after {
		background: #101514;
	}

	.home2-search__surface {
		padding: 14px 10px 2px;
	}

	.home2-search__bar {
		align-items: center;
		background: #f5f6f3;
		border-radius: 999px;
		display: grid;
		grid-template-columns: 1fr 54px;
		margin: 0 auto 7px;
		min-height: 54px;
		overflow: hidden;
		width: min(520px, 100%);
	}

	.home2-search__bar input {
		border: 0;
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 500;
		height: 54px;
		min-width: 0;
		padding: 0 4px 0 22px;
	}

	.home2-search__bar input:focus {
		outline: 0;
	}

	.home2-search__bar button {
		align-items: center;
		background: #98bc2a;
		border: 0;
		border-radius: 50%;
		display: flex;
		height: 44px;
		justify-content: center;
		margin-right: 5px;
		width: 44px;
	}

	.home2-search__bar button img {
		filter: brightness(0) invert(1);
		height: 20px;
		width: 20px;
	}

	.home2-search p {
		align-items: center;
		color: #4c5652;
		display: flex;
		font-size: 14px;
		font-weight: 600;
		gap: 8px;
		justify-content: center;
		line-height: 20px;
		margin: 2px 0 4px;
	}

	.home2-search p a {
		align-items: center;
		border: 0;
		color: #101514;
		display: inline-flex;
		font-weight: 800;
		min-height: 44px;
		margin-block: -12px;
		padding: 0;
	}

	.home2-search p a:hover {
		color: #7ca017;
	}

	@media (max-width: 991px) {
		.home2-hero__car {
			opacity: 0.16;
			width: 430px;
		}

		.home2-hero__car--left {
			left: -250px;
		}

		.home2-hero__car--right {
			right: -270px;
		}
	}

	@media (max-width: 575px) {
		.home2-hero,
		.home2-hero__content {
			min-height: auto;
		}

		.home2-hero__content {
			padding: 24px 0 30px;
		}

		.home2-hero h1 {
			font-size: 36px;
		}

		.home2-search__bar {
			width: 100%;
		}

		.home2-search p {
			flex-wrap: wrap;
			padding: 0 14px;
		}
	}
</style>
