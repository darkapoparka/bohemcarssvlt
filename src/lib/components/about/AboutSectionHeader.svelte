<script lang="ts">
	let { heading, description }: { heading: string; description?: string } = $props();
</script>

<div class="bohemcars-about-banner wow fadeInDown" data-wow-delay="0.1s">
	<h2>{heading}</h2>
	{#if description}<p>{description}</p>{/if}
</div>

<style>
	.bohemcars-about-banner {
		position: relative;
		overflow: hidden;
		margin-bottom: 26px;
		border: 1px solid rgb(255 255 255 / 0.1);
		border-radius: 8px;
		background: linear-gradient(135deg, #14210f 0%, #1f3318 58%, #0f190c 100%);
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.1);
		padding: 22px 28px;
	}

	.bohemcars-about-banner h2 {
		margin: 0;
		color: #ffffff;
		font-size: clamp(23px, 1.8vw, 29px);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.18;
	}

	.bohemcars-about-banner p {
		margin: 9px 0 0;
		max-width: 880px;
		color: rgb(255 255 255 / 0.76);
		font-size: 15px;
		font-weight: 500;
		line-height: 1.55;
	}

	@media (max-width: 767px) {
		.bohemcars-about-banner {
			margin-bottom: 18px;
			padding: 18px 18px;
		}

		.bohemcars-about-banner h2 {
			font-size: 22px;
		}

		.bohemcars-about-banner p {
			font-size: 14px;
		}
	}
</style>
