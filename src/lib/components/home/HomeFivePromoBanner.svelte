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
	/* Light section + contained dark rounded card, matching the ActionBand /
	   Browse card rhythm. Compact height (~ActionBand scale), not a hero block. */
	.bohemcars-promo-band {
		background: var(--bc-bg);
		padding: 16px 0;
	}

	.bohemcars-promo {
		position: relative;
		overflow: hidden;
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		align-items: center;
		gap: 16px;
		min-height: 200px;
		border-radius: 8px;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
		background:
			radial-gradient(120% 150% at 84% 52%, rgba(217, 242, 117, 0.22), rgba(217, 242, 117, 0) 50%),
			linear-gradient(118deg, #16240f 0%, #101c0b 58%, #0c160a 100%),
			#0c160a;
	}

	.bohemcars-promo::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, rgba(8, 14, 6, 0.74) 0%, rgba(8, 14, 6, 0) 56%);
		pointer-events: none;
	}

	.bohemcars-promo__copy {
		position: relative;
		z-index: 1;
		padding: 26px 0 26px 36px;
		min-width: 0;
	}

	.bohemcars-promo__eyebrow {
		display: block;
		margin-bottom: 9px;
		color: #c9ee4e !important;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.bohemcars-promo__title {
		margin: 0 0 9px;
		max-width: 540px;
		color: #ffffff !important;
		font-size: clamp(22px, 2.3vw, 32px);
		font-weight: 800;
		line-height: 1.12;
		letter-spacing: -0.01em;
	}

	.bohemcars-promo__accent {
		color: #c9ee4e !important;
	}

	.bohemcars-promo__text {
		margin: 0 0 18px;
		max-width: 400px;
		color: rgba(255, 255, 255, 0.82) !important;
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
		background: #c9ee4e;
		color: #14210f !important;
		font-size: 15px;
		font-weight: 700;
		transition:
			background-color 0.18s ease,
			transform 0.18s ease;
	}

	.bohemcars-promo__cta:hover,
	.bohemcars-promo__cta:focus-visible {
		background: #ffffff;
		transform: translateY(-1px);
	}

	.bohemcars-promo__ghost {
		display: inline-flex;
		align-items: center;
		min-height: 46px;
		padding: 0 16px;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.24);
		color: rgba(255, 255, 255, 0.9) !important;
		font-size: 14px;
		font-weight: 600;
		transition:
			border-color 0.18s ease,
			background-color 0.18s ease;
	}

	.bohemcars-promo__ghost:hover,
	.bohemcars-promo__ghost:focus-visible {
		border-color: rgba(217, 242, 117, 0.6);
		background: rgba(217, 242, 117, 0.08);
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
		filter: drop-shadow(0 22px 30px rgba(0, 0, 0, 0.5));
	}

	@media (max-width: 991px) {
		.bohemcars-promo {
			grid-template-columns: 1fr;
			gap: 0;
			min-height: 0;
		}

		.bohemcars-promo__copy {
			padding: 26px 24px 0;
		}

		.bohemcars-promo__title,
		.bohemcars-promo__text {
			max-width: none;
		}

		.bohemcars-promo__visual {
			height: 188px;
		}

		.bohemcars-promo__car {
			right: 50%;
			width: 124%;
			transform: translate(50%, -50%);
		}
	}

	@media (max-width: 575px) {
		.bohemcars-promo__visual {
			height: 150px;
		}

		.bohemcars-promo__car {
			width: 146%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bohemcars-promo__cta {
			transition: none;
		}
	}
</style>
