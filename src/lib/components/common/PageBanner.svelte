<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroPageBanner } from '$lib/auxero/page-banner';

	type PageBannerCta = {
		className?: string;
		href: string;
		label: string;
	};

	let { banner, cta }: { banner: AuxeroPageBanner; cta?: PageBannerCta } = $props();
</script>

<section
	class="bohemcars-inventory-banner bohemcars-page-banner"
	style:--page-banner-image={`url("${banner.image}")`}
>
	<div class="container">
		<div class="bohemcars-inventory-banner__content bohemcars-page-banner__content">
			<p class="bohemcars-inventory-banner__eyebrow bohemcars-page-banner__eyebrow">
				{banner.eyebrow}
			</p>
			<h1>{banner.title}</h1>
			<p>{banner.description}</p>
			{#if banner.actions?.length}
				<div class="bohemcars-page-banner__actions">
					{#each banner.actions as action (action.href)}
						<a
							href={resolve(action.href as '/')}
							class={[
								'btn btn-large font-weight-600',
								action.variant === 'secondary'
									? 'btn-line-style-2 bohemcars-page-banner__secondary'
									: 'btn-primary'
							]}
						>
							{action.label}
						</a>
					{/each}
				</div>
			{:else if cta}
				<div class="bohemcars-page-banner__actions">
					<a
						href={resolve(cta.href as '/')}
						class={cta.className ?? 'btn btn-primary btn-large font-weight-600 max-w-min'}
						>{cta.label}</a
					>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.bohemcars-page-banner {
		display: flex;
		min-height: 218px;
		align-items: center;
		background-image:
			linear-gradient(
				90deg,
				rgb(9 10 10 / 0.7) 0%,
				rgb(9 10 10 / 0.36) 44%,
				rgb(9 10 10 / 0.06) 78%
			),
			var(--page-banner-image);
		background-position: center right;
		background-size: cover;
	}

	.bohemcars-page-banner__content {
		max-width: 640px;
		padding: 34px 0;
	}

	.bohemcars-page-banner__eyebrow {
		margin-bottom: 8px;
		color: #d9f275;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-page-banner h1 {
		margin: 0 0 8px;
		color: #fff;
		font-size: 44px;
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.08;
	}

	.bohemcars-page-banner p:not(.bohemcars-page-banner__eyebrow) {
		max-width: 620px;
		margin: 0;
		color: rgb(255 255 255 / 0.82);
		font-size: 16px;
		line-height: 24px;
	}

	.bohemcars-page-banner__actions {
		display: flex;
		margin-top: 22px;
		gap: 12px;
		flex-wrap: wrap;
	}

	.bohemcars-page-banner__actions :global(.btn) {
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease !important;
	}

	.bohemcars-page-banner__actions :global(.btn::before),
	.bohemcars-page-banner__actions :global(.btn::after) {
		display: none !important;
		content: none !important;
		transform: none !important;
		transition: none !important;
	}

	.bohemcars-page-banner__actions :global(.btn.btn-primary:hover) {
		border-color: #98bc2a !important;
		background: #98bc2a !important;
		color: #1c1c1c !important;
	}

	.bohemcars-page-banner__secondary {
		border-color: rgb(255 255 255 / 0.72) !important;
		color: #ffffff !important;
	}

	.bohemcars-page-banner__secondary:hover {
		border-color: #ffffff !important;
		background: #ffffff !important;
		color: #1c1c1c !important;
	}

	@media (max-width: 767px) {
		.bohemcars-page-banner {
			min-height: 164px;
			background-position: 62% center;
		}

		.bohemcars-page-banner__content {
			padding: 26px 0;
		}

		.bohemcars-page-banner h1 {
			font-size: 32px;
		}

		.bohemcars-page-banner p:not(.bohemcars-page-banner__eyebrow) {
			font-size: 14px;
			line-height: 21px;
		}
	}
</style>
