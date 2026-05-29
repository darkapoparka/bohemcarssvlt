<script lang="ts">
	import type { AuxeroPageBanner } from '$lib/auxero/page-banner';

	let { banner }: { banner: AuxeroPageBanner } = $props();
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
		</div>
	</div>
</section>

<style>
	.bohemcars-page-banner {
		display: flex;
		min-height: 176px;
		align-items: center;
		background-image:
			linear-gradient(90deg, rgb(9 10 10 / 0.78), rgb(9 10 10 / 0.42)), var(--page-banner-image);
		background-position: center;
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

	@media (max-width: 767px) {
		.bohemcars-page-banner {
			min-height: 142px;
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
