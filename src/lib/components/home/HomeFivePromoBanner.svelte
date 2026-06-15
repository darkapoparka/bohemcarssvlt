<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
</script>

<section class="bohemcars-promo-band" aria-labelledby="bohemcars-promo-title">
	<div class="container">
		<div class="bohemcars-promo">
			<img
				class="bohemcars-promo__background"
				src="/assets/bohemcars/promo/premium-history-banner-v1.png"
				alt=""
				width="1672"
				height="941"
				loading="lazy"
				decoding="async"
				aria-hidden="true"
			/>
			<div class="bohemcars-promo__copy">
				<span class="bohemcars-promo__eyebrow">Внос от Канада</span>
				<h2 class="bohemcars-promo__title" id="bohemcars-promo-title">
					Премиум автомобили с изрядна история
				</h2>
				<p class="bohemcars-promo__text">
					Карфакс, сервизна история и личен оглед — потвърдени преди да платиш.
				</p>

				<div class="bohemcars-promo__actions">
					<a href={resolve('/inventory')} class="btn btn-small btn-primary-3 bohemcars-promo__cta">
						Виж наличните
						<ArrowRight size={17} aria-hidden="true" />
					</a>
					<a
						href={resolve('/calculator')}
						class="btn btn-small btn-line-style-2 bohemcars-promo__ghost">Калкулатор за внос</a
					>
				</div>
				<ul class="bohemcars-promo__proof" aria-label="Bohemcars предимства">
					<li><strong>4.8</strong> · 157 отзива</li>
					<li>Карфакс + история</li>
					<li>Оглед в Пловдив</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<style>
	/* Desktop-only image-backed feature banner. The generated asset contains no
	   text or UI; all copy remains real DOM for crisp Bulgarian typography. */
	.bohemcars-promo-band {
		display: none;
	}

	@media (min-width: 768px) {
		.bohemcars-promo-band {
			display: block;
			background: var(--bc-bg);
			padding: 18px 0;
		}
	}

	.bohemcars-promo {
		position: relative;
		overflow: hidden;
		min-height: 360px;
		border-radius: 8px;
		border: 1px solid rgba(208, 238, 117, 0.13);
		box-shadow: 0 18px 44px rgba(6, 18, 8, 0.16);
		background: #081307;
	}

	.bohemcars-promo::before {
		position: absolute;
		inset: 0;
		z-index: 1;
		content: '';
		background:
			linear-gradient(
				90deg,
				rgba(5, 13, 5, 0.98) 0%,
				rgba(5, 13, 5, 0.9) 34%,
				rgba(5, 13, 5, 0.28) 62%,
				rgba(5, 13, 5, 0.06) 100%
			),
			linear-gradient(180deg, rgba(5, 13, 5, 0.08), rgba(5, 13, 5, 0.18));
		pointer-events: none;
	}

	.bohemcars-promo__background {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.bohemcars-promo__copy {
		position: relative;
		z-index: 2;
		display: flex;
		min-height: 360px;
		width: min(48%, 560px);
		flex-direction: column;
		justify-content: center;
		padding: 34px 0 34px 40px;
		min-width: 0;
	}

	.bohemcars-promo__eyebrow {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		min-height: 31px;
		margin-bottom: 20px;
		padding: 0 15px;
		border: 1px solid rgba(208, 238, 117, 0.34);
		border-radius: 999px;
		color: #d8ff45;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.bohemcars-promo__title {
		margin: 0 0 16px;
		max-width: 540px;
		color: #ffffff;
		font-size: clamp(34px, 4.4vw, 55px);
		font-weight: 800;
		line-height: 1.04;
		letter-spacing: 0;
	}

	.bohemcars-promo__text {
		margin: 0 0 28px;
		max-width: 440px;
		color: rgba(255, 255, 255, 0.82);
		font-size: 17px;
		line-height: 1.48;
	}

	.bohemcars-promo__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	.bohemcars-promo__cta {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
		gap: 9px;
		min-height: 52px;
		padding: 0 25px !important;
		border-radius: 8px !important;
		background: #d8ff45 !important;
		color: #071206 !important;
		font-size: 15px !important;
		font-weight: 700 !important;
		line-height: 1 !important;
	}

	.bohemcars-promo__cta:hover,
	.bohemcars-promo__cta:focus-visible {
		background: #ffffff !important;
		color: #071206 !important;
	}

	.bohemcars-promo__ghost {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
		min-height: 52px;
		padding: 0 20px !important;
		border-color: rgba(255, 255, 255, 0.26) !important;
		border-radius: 8px !important;
		background: rgba(255, 255, 255, 0.03) !important;
		color: #ffffff !important;
		font-size: 15px !important;
		font-weight: 700 !important;
		line-height: 1 !important;
	}

	.bohemcars-promo__ghost:hover,
	.bohemcars-promo__ghost:focus-visible {
		border-color: rgba(216, 255, 69, 0.5) !important;
		background: rgba(216, 255, 69, 0.11) !important;
	}

	/* Tactile press feedback (instant translateY, matching the hero/PDP idiom). */
	.bohemcars-promo__cta:active,
	.bohemcars-promo__ghost:active {
		transform: translateY(1px);
	}

	.bohemcars-promo__proof {
		display: flex;
		flex-wrap: wrap;
		max-width: 430px;
		column-gap: 14px;
		row-gap: 9px;
		margin: 28px 0 0;
		padding: 0;
		color: rgba(255, 255, 255, 0.9);
		font-size: 13px;
		font-weight: 600;
		list-style: none;
	}

	.bohemcars-promo__proof li {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: rgba(255, 255, 255, 0.9);
	}

	.bohemcars-promo__proof li::before {
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: #d8ff45;
		content: '';
	}

	.bohemcars-promo__proof strong {
		color: #ffffff;
	}

	@media (prefers-reduced-motion: reduce) {
		.bohemcars-promo__cta {
			transition: none;
		}
	}

	@media (max-width: 1199px) {
		.bohemcars-promo__copy {
			width: min(52%, 520px);
			padding-left: 32px;
		}
	}

	@media (max-width: 991px) {
		.bohemcars-promo {
			min-height: 330px;
		}

		.bohemcars-promo::before {
			background:
				linear-gradient(
					90deg,
					rgba(5, 13, 5, 0.98) 0%,
					rgba(5, 13, 5, 0.88) 42%,
					rgba(5, 13, 5, 0.26) 72%,
					rgba(5, 13, 5, 0.08) 100%
				),
				linear-gradient(180deg, rgba(5, 13, 5, 0.06), rgba(5, 13, 5, 0.2));
		}

		.bohemcars-promo__background {
			object-position: 61% center;
		}

		.bohemcars-promo__copy {
			min-height: 330px;
			width: min(62%, 500px);
		}

		.bohemcars-promo__text {
			max-width: 390px;
		}
	}
</style>
