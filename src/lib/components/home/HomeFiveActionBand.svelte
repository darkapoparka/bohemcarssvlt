<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';

	let { copy }: { copy: HomePageCopy } = $props();
</script>

<section class="bohemcars-action-band py-100" aria-label={copy.actionBand.importTitle}>
	<div class="container">
		<div class="bohemcars-action-grid wow fadeInUp" data-wow-delay="0.1s">
			<a class="bohemcars-action-card bohemcars-action-card--import" href={resolve('/services')}>
				<span class="bohemcars-action-card__copy">
					<strong>{copy.actionBand.importTitle}</strong>
					<span class="bohemcars-action-card__body">{copy.actionBand.importBody}</span>
					<em class="bohemcars-action-card__cta">
						{copy.actionBand.importCta}
						<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
					</em>
				</span>
				<img
					class="bohemcars-action-card__img"
					src="/assets/bohemcars/home2/home2-action-import.png"
					alt=""
					loading="lazy"
				/>
			</a>

			<a class="bohemcars-action-card bohemcars-action-card--buy" href={resolve('/inventory')}>
				<span class="bohemcars-action-card__copy">
					<strong>{copy.actionBand.buyTitle}</strong>
					<span class="bohemcars-action-card__body">{copy.actionBand.buyBody}</span>
					<em class="bohemcars-action-card__cta">
						{copy.actionBand.buyCta}
						<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
					</em>
				</span>
				<img
					class="bohemcars-action-card__img"
					src="/assets/bohemcars/home2/home2-action-buy.png"
					alt=""
					loading="lazy"
				/>
			</a>
		</div>
	</div>
</section>

<style>
	.bohemcars-action-band {
		background: #f6f7f3;
	}

	.bohemcars-action-grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.bohemcars-action-card {
		align-items: stretch;
		border-radius: 14px;
		display: grid;
		isolation: isolate;
		min-height: 232px;
		overflow: hidden;
		padding: 38px 42px;
		position: relative;
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.bohemcars-action-card:hover {
		box-shadow: 0 16px 40px rgba(26, 42, 22, 0.16);
		transform: none;
	}

	.bohemcars-action-card--import {
		background: #98bc2a;
		color: #1a2a16;
	}

	.bohemcars-action-card--import:hover {
		background: #8fb321;
		color: #1a2a16;
	}

	.bohemcars-action-card--buy {
		background: #1a2a16;
		color: #ffffff;
	}

	.bohemcars-action-card--buy:hover {
		background: #14210f;
		color: #ffffff;
	}

	.bohemcars-action-card__copy {
		color: inherit;
		display: grid;
		gap: 10px;
		max-width: 58%;
		position: relative;
		z-index: 2;
	}

	.bohemcars-action-card__copy strong {
		color: inherit;
		font-size: clamp(24px, 2vw, 32px);
		font-weight: 800;
		line-height: 1.08;
	}

	.bohemcars-action-card__body {
		color: inherit;
		font-size: 15px;
		font-weight: 600;
		line-height: 1.45;
		opacity: 0.82;
	}

	.bohemcars-action-card__cta {
		align-items: center;
		color: inherit;
		display: inline-flex;
		font-size: 15px;
		font-style: normal;
		font-weight: 800;
		gap: 8px;
		margin-top: 6px;
	}

	.bohemcars-action-card--buy .bohemcars-action-card__cta {
		color: #98bc2a;
	}

	.bohemcars-action-card__cta :global(svg) {
		flex: 0 0 auto;
		transition: transform 0.2s ease;
	}

	.bohemcars-action-card:hover .bohemcars-action-card__cta :global(svg) {
		transform: translateX(4px);
	}

	.bohemcars-action-card__img {
		bottom: -18px;
		height: auto;
		max-width: none;
		position: absolute;
		right: -38px;
		width: 326px;
		z-index: 1;
	}

	@media (max-width: 991px) {
		.bohemcars-action-grid {
			grid-template-columns: 1fr;
		}

		.bohemcars-action-card__copy {
			max-width: 62%;
		}
	}

	@media (max-width: 575px) {
		.bohemcars-action-card {
			min-height: 184px;
			padding: 26px 24px;
		}

		.bohemcars-action-card__copy {
			max-width: 100%;
		}

		.bohemcars-action-card__img {
			opacity: 0.4;
			right: -72px;
			width: 256px;
		}
	}
</style>
