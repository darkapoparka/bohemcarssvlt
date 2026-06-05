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
					src="/assets/bohemcars/home2/home2-action-import.webp"
					alt=""
					loading="lazy"
				/>
			</a>

			<a
				class="bohemcars-action-card bohemcars-action-card--consultation"
				href={resolve('/contact')}
			>
				<span class="bohemcars-action-card__copy">
					<strong>{copy.actionBand.buyTitle}</strong>
					<span class="bohemcars-action-card__body">{copy.actionBand.buyBody}</span>
					<em class="bohemcars-action-card__cta">
						{copy.actionBand.buyCta}
						<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
					</em>
				</span>
				<img
					class="bohemcars-action-card__img bohemcars-action-card__img--consultant"
					src="/assets/bohemcars/home2/home2-action-consultant.webp"
					alt=""
					loading="lazy"
				/>
			</a>
		</div>
	</div>
</section>

<style>
	.bohemcars-action-band {
		background: var(--bc-bg);
		padding-top: 38px;
		padding-bottom: 30px;
	}

	.bohemcars-action-grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.bohemcars-action-card {
		align-items: stretch;
		border-radius: 8px;
		display: grid;
		isolation: isolate;
		min-height: 188px;
		overflow: hidden;
		padding: 30px 34px;
		position: relative;
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.bohemcars-action-card:hover {
		box-shadow: none;
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

	.bohemcars-action-card--consultation {
		background: #1a2a16;
		color: #ffffff;
	}

	.bohemcars-action-card--consultation:hover {
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

	.bohemcars-action-card--consultation .bohemcars-action-card__copy {
		width: min(68%, 440px);
		max-width: none;
	}

	.bohemcars-action-card__copy strong {
		color: inherit;
		font-size: clamp(24px, 2vw, 32px);
		font-weight: 700;
		line-height: 1.08;
	}

	.bohemcars-action-card--consultation .bohemcars-action-card__copy strong {
		white-space: nowrap;
	}

	.bohemcars-action-card__body {
		color: inherit;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.45;
		opacity: 0.82;
	}

	@media (min-width: 576px) {
		.bohemcars-action-card--import .bohemcars-action-card__body {
			max-width: min(52%, 320px);
		}
	}

	.bohemcars-action-card__cta {
		align-items: center;
		display: inline-flex;
		justify-content: center;
		width: 168px;
		height: 40px;
		min-height: 40px;
		margin-top: 12px;
		padding: 0 18px;
		border-radius: 999px;
		font-size: 14px;
		font-style: normal;
		font-weight: 600;
		gap: 8px;
		line-height: 1;
		transition: background-color 0.18s ease;
		white-space: nowrap;
	}

	.bohemcars-action-card--import .bohemcars-action-card__cta {
		background: #14210f;
		color: #ffffff;
	}

	.bohemcars-action-card--import:hover .bohemcars-action-card__cta {
		background: #0d160a;
	}

	.bohemcars-action-card--consultation .bohemcars-action-card__cta {
		background: #d9f275;
		color: #14210f;
	}

	.bohemcars-action-card--consultation:hover .bohemcars-action-card__cta {
		background: #c8e85a;
	}

	.bohemcars-action-card__cta :global(svg) {
		display: block;
		width: 18px;
		height: 18px;
		flex: 0 0 18px;
		transition: transform 0.2s ease;
	}

	.bohemcars-action-card--import .bohemcars-action-card__cta :global(svg),
	.bohemcars-action-card--import .bohemcars-action-card__cta :global(path),
	.bohemcars-action-card--import .bohemcars-action-card__cta :global(line),
	.bohemcars-action-card--import .bohemcars-action-card__cta :global(polyline) {
		color: #ffffff !important;
		stroke: #ffffff !important;
	}

	.bohemcars-action-card--consultation .bohemcars-action-card__cta :global(svg),
	.bohemcars-action-card--consultation .bohemcars-action-card__cta :global(path),
	.bohemcars-action-card--consultation .bohemcars-action-card__cta :global(line),
	.bohemcars-action-card--consultation .bohemcars-action-card__cta :global(polyline) {
		color: #14210f !important;
		stroke: #14210f !important;
	}

	.bohemcars-action-card:hover .bohemcars-action-card__cta :global(svg) {
		transform: none;
	}

	.bohemcars-action-card__img {
		bottom: -44px;
		height: auto;
		max-width: none;
		position: absolute;
		right: -70px;
		width: 540px;
		z-index: 1;
	}

	.bohemcars-action-card__img--consultant {
		bottom: auto;
		right: -8px;
		top: -4px;
		width: 188px;
	}

	@media (max-width: 991px) {
		.bohemcars-action-grid {
			grid-template-columns: 1fr;
		}

		.bohemcars-action-card__copy {
			max-width: 58%;
		}

		.bohemcars-action-card--consultation .bohemcars-action-card__copy {
			width: min(72%, 440px);
			max-width: none;
		}
	}

	@media (max-width: 767px) {
		.bohemcars-action-band {
			padding-top: 18px;
			padding-bottom: 22px;
		}

		.bohemcars-action-grid {
			gap: 14px;
		}
	}

	@media (max-width: 575px) {
		.bohemcars-action-card {
			min-height: 184px;
			padding: 20px 22px;
			border-radius: 8px;
		}

		/* Title runs full width across the top; only the sub-copy sits in a
		   left column so the car can take the whole right side of the card. */
		.bohemcars-action-card__copy {
			width: auto;
			max-width: 100%;
			gap: 7px;
		}

		.bohemcars-action-card--consultation .bohemcars-action-card__copy {
			width: auto;
			max-width: 100%;
		}

		.bohemcars-action-card__copy strong {
			font-size: 24px;
		}

		.bohemcars-action-card--consultation .bohemcars-action-card__copy strong {
			white-space: normal;
		}

		.bohemcars-action-card__body {
			max-width: 52%;
			font-size: 13.5px;
		}

		.bohemcars-action-card__cta {
			width: 164px;
			height: 40px;
			min-height: 40px;
			margin-top: 14px;
			padding: 0 16px;
			font-size: 14px;
		}

		/* Large cutout anchored into the bottom-right corner (clipped by the
		   card's rounded overflow) so it fills the side, no empty gap, no FX. */
		.bohemcars-action-card__img {
			opacity: 1;
			right: -90px;
			bottom: -24px;
			width: 340px;
			filter: none;
		}

		.bohemcars-action-card__img--consultant {
			right: -16px;
			top: 15px;
			width: 172px;
		}
	}
</style>
