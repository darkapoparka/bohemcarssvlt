<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
</script>

<section class="bohemcars-promo-band" aria-labelledby="bohemcars-promo-title">
	<div class="container">
		<div class="bohemcars-promo">
			<div class="bohemcars-promo__copy">
				<span class="bohemcars-promo__eyebrow">Внос от Канада</span>
				<h2 class="bohemcars-promo__title" id="bohemcars-promo-title">
					Премиум автомобили <span class="bohemcars-promo__accent">с изрядна история</span>
				</h2>
				<p class="bohemcars-promo__text">
					Карфакс, сервизна история и личен оглед — потвърдени преди да платиш.
				</p>

				<div class="bohemcars-promo__actions">
					<a href={resolve('/inventory')} class="bohemcars-promo__cta">
						Виж наличните
						<ArrowRight size={17} aria-hidden="true" />
					</a>
					<a href={resolve('/calculator')} class="bohemcars-promo__ghost">Калкулатор за внос</a>
				</div>
			</div>

			<div class="bohemcars-promo__visual">
				<img
					class="bohemcars-promo__car"
					src="/assets/bohemcars/megamenu/inventory-audi-a7-cutout.webp"
					alt="Audi A7 от наличността на Bohemcars"
					width="1180"
					height="560"
					loading="lazy"
					decoding="async"
				/>
			</div>
		</div>
	</div>
</section>

<style>
	/* Desktop-only feature banner. Light premium card so it CONTRASTS with the
	   dark section-header cards (Newest/Browse/…) instead of duplicating them.
	   Hidden under 768px — the mobile home is untouched. */
	.bohemcars-promo-band {
		display: none;
	}

	@media (min-width: 768px) {
		.bohemcars-promo-band {
			display: block;
			background: var(--bc-bg);
			padding: 16px 0;
		}
	}

	.bohemcars-promo {
		position: relative;
		overflow: hidden;
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		align-items: center;
		gap: 16px;
		min-height: 210px;
		border-radius: 8px;
		border: 1px solid #e3e8d6;
		box-shadow: 0 12px 32px rgba(20, 33, 15, 0.07);
		background:
			radial-gradient(120% 150% at 84% 60%, rgba(152, 188, 42, 0.16), rgba(152, 188, 42, 0) 52%),
			linear-gradient(115deg, #f3f8e5 0%, #ffffff 56%),
			#ffffff;
	}

	.bohemcars-promo__copy {
		position: relative;
		z-index: 1;
		padding: 28px 0 28px 38px;
		min-width: 0;
	}

	.bohemcars-promo__eyebrow {
		display: block;
		margin-bottom: 9px;
		color: #5a7a16;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.bohemcars-promo__title {
		margin: 0 0 9px;
		max-width: 520px;
		color: #14210f;
		font-size: clamp(24px, 2.3vw, 33px);
		font-weight: 800;
		line-height: 1.12;
		letter-spacing: -0.01em;
	}

	.bohemcars-promo__accent {
		color: #4f7012;
	}

	.bohemcars-promo__text {
		margin: 0 0 18px;
		max-width: 400px;
		color: #4b4b4b;
		font-size: 14.5px;
		line-height: 1.5;
	}

	.bohemcars-promo__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	.bohemcars-promo__cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 46px;
		padding: 0 22px;
		border-radius: 8px;
		background: #98bc2a;
		color: #14210f !important;
		font-size: 15px;
		font-weight: 700;
		transition:
			background-color 0.18s ease,
			transform 0.18s ease,
			color 0.18s ease;
	}

	.bohemcars-promo__cta:hover,
	.bohemcars-promo__cta:focus-visible {
		background: #14210f;
		color: #ffffff !important;
		transform: translateY(-1px);
	}

	.bohemcars-promo__ghost {
		display: inline-flex;
		align-items: center;
		min-height: 46px;
		padding: 0 16px;
		border-radius: 8px;
		border: 1px solid #cdd6bd;
		color: #14210f !important;
		font-size: 14px;
		font-weight: 600;
		transition:
			border-color 0.18s ease,
			background-color 0.18s ease;
	}

	.bohemcars-promo__ghost:hover,
	.bohemcars-promo__ghost:focus-visible {
		border-color: #98bc2a;
		background: rgba(152, 188, 42, 0.1);
	}

	.bohemcars-promo__visual {
		position: relative;
		align-self: stretch;
		min-width: 0;
	}

	.bohemcars-promo__car {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 112%;
		max-width: none;
		height: auto;
		filter: drop-shadow(0 24px 26px rgba(20, 33, 15, 0.32));
	}

	@media (prefers-reduced-motion: reduce) {
		.bohemcars-promo__cta {
			transition: none;
		}
	}
</style>
