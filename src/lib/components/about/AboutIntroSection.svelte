<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<div class="container">
	<section class="bohemcars-about-story wow fadeInUp" data-wow-delay="0.1s">
		<div class="title-section bohemcars-about-story__header mb-28">
			<div class="bohemcars-about-story__copy">
				<p class="bohemcars-about-eyebrow">Услуги и фокус</p>
				<h2>{about.intro.heading}</h2>
				<p>{about.intro.description}</p>
			</div>
		</div>

		<div class="bohemcars-about-highlights" aria-label="Bohemcars focus">
			{#each about.profile.highlights as item (item)}
				<div class="bohemcars-about-highlight car-box">
					<img src="/assets/icons/check.svg" alt="" />
					<span>{item}</span>
				</div>
			{/each}
		</div>

		<div class="bohemcars-about-services__grid" aria-label={about.intro.heading}>
			{#each about.profile.steps as step, index (step.title)}
				<article
					class="bohemcars-about-service wow fadeInUp"
					data-wow-delay={`0.${(index % 4) + 1}s`}
				>
					<span class="bohemcars-about-service__number">{String(index + 1).padStart(2, '0')}</span>
					<h3>{step.title}</h3>
					<p>{step.description}</p>
				</article>
			{/each}
		</div>
	</section>
</div>

<style>
	.bohemcars-about-story {
		display: grid;
		gap: 16px;
	}

	.bohemcars-about-story__header {
		align-items: flex-end;
	}

	.bohemcars-about-story__copy {
		max-width: 900px;
	}

	.bohemcars-about-eyebrow {
		margin-bottom: 8px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-about-story h2 {
		max-width: 760px;
		margin-bottom: 10px;
		font-size: clamp(28px, 2vw, 34px);
		font-weight: 500;
		letter-spacing: 0;
		line-height: 1.12;
	}

	.bohemcars-about-story__copy p {
		max-width: 820px;
		margin-bottom: 8px;
		color: #696665;
		font-size: 16px;
		line-height: 1.55;
	}

	.bohemcars-about-highlights {
		display: flex;
		margin-top: -4px;
		margin-bottom: 4px;
		gap: 12px;
		flex-wrap: wrap;
	}

	.bohemcars-about-highlight {
		display: flex;
		min-height: 44px;
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 10px 16px;
		gap: 10px;
		align-items: center;
		justify-content: center;
	}

	.bohemcars-about-highlight img {
		width: 18px;
		height: 18px;
		flex: 0 0 auto;
	}

	.bohemcars-about-highlight span {
		color: #1c1c1c;
		font-size: 14px;
		font-weight: 700;
		line-height: 20px;
	}

	.bohemcars-about-services__grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.bohemcars-about-service {
		position: relative;
		min-height: 150px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 20px 20px 18px;
		color: #1c1c1c;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.bohemcars-about-service:hover {
		border-color: #cbd8c1;
		background: var(--bc-surface-hover);
	}

	.bohemcars-about-service__number {
		display: inline-flex;
		margin-bottom: 12px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		line-height: 1;
	}

	.bohemcars-about-service h3 {
		margin-bottom: 8px;
		font-size: 19px;
		font-weight: 700;
		line-height: 1.22;
	}

	.bohemcars-about-service p {
		margin: 0;
		color: #696665;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.48;
	}

	@media (max-width: 1199px) {
		.bohemcars-about-services__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.bohemcars-about-story__header {
			align-items: flex-start;
			flex-direction: column;
			gap: 14px;
		}

		.bohemcars-about-story h2 {
			font-size: 28px;
		}

		.bohemcars-about-services__grid {
			grid-template-columns: 1fr;
		}

		.bohemcars-about-highlight {
			width: 100%;
			justify-content: flex-start;
		}
	}
</style>
