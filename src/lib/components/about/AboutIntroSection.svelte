<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<div class="container">
	<div class="bohemcars-about-stack">
		<section class="bohemcars-about-story wow fadeInUp" data-wow-delay="0.1s">
			<p class="bohemcars-about-eyebrow">{about.profile.eyebrow}</p>
			<h2>{about.profile.heading}</h2>
			<p class="bohemcars-about-story__copy">{about.profile.description}</p>
			<p class="bohemcars-about-story__statement">{about.profile.statement}</p>

			<div class="bohemcars-about-highlights" aria-label="Bohemcars focus">
				{#each about.profile.highlights as item (item)}
					<div class="bohemcars-about-highlight">
						<img src="/assets/icons/check.svg" alt="" />
						<span>{item}</span>
					</div>
				{/each}
			</div>
		</section>

		<section class="bohemcars-about-services" aria-labelledby="bohemcars-about-services-title">
			<div class="bohemcars-about-section-title">
				<p class="bohemcars-about-eyebrow">Услуги и фокус</p>
				<h2 id="bohemcars-about-services-title">{about.intro.heading}</h2>
				<p>{about.intro.description}</p>
			</div>
			<div class="bohemcars-about-services__grid">
				{#each about.profile.steps as step, index (step.title)}
					<article
						class="bohemcars-about-service service-box wow fadeInUp"
						data-wow-delay={`0.${(index % 4) + 1}s`}
					>
						<span>{String(index + 1).padStart(2, '0')}</span>
						<h3>{step.title}</h3>
						<p>{step.description}</p>
					</article>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	.bohemcars-about-stack {
		display: grid;
		gap: 36px;
	}

	.bohemcars-about-story {
		max-width: 780px;
		margin: 0 auto;
		text-align: center;
	}

	.bohemcars-about-eyebrow {
		margin-bottom: 10px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-about-story h2,
	.bohemcars-about-section-title h2 {
		margin-bottom: 14px;
		font-size: 34px;
		font-weight: 600;
		line-height: 1.15;
	}

	.bohemcars-about-story__copy,
	.bohemcars-about-section-title p {
		max-width: 760px;
		margin-right: auto;
		margin-bottom: 12px;
		margin-left: auto;
		color: #696665;
		font-size: 16px;
		line-height: 1.62;
	}

	.bohemcars-about-story__statement {
		max-width: 760px;
		margin-right: auto;
		margin-bottom: 20px;
		margin-left: auto;
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 600;
		line-height: 1.45;
	}

	.bohemcars-about-highlights {
		display: grid;
		gap: 14px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.bohemcars-about-highlight {
		display: flex;
		min-height: 52px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 12px 14px;
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
		line-height: 1.35;
	}

	.bohemcars-about-section-title {
		max-width: 820px;
		margin-right: auto;
		margin-bottom: 24px;
		margin-left: auto;
		text-align: center;
	}

	.bohemcars-about-section-title h2 {
		margin-bottom: 12px;
	}

	.bohemcars-about-section-title p {
		margin-bottom: 0;
	}

	.bohemcars-about-services__grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.bohemcars-about-service {
		min-height: 164px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 20px;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.bohemcars-about-service:hover {
		border-color: var(--primary);
		background: var(--bc-surface-hover);
	}

	.bohemcars-about-service span {
		display: inline-flex;
		margin-bottom: 14px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		line-height: 1;
	}

	.bohemcars-about-service h3 {
		margin-bottom: 10px;
		font-size: 21px;
		font-weight: 600;
		line-height: 1.15;
	}

	.bohemcars-about-service p {
		margin: 0;
		color: #696665;
		font-size: 15px;
		line-height: 1.5;
	}

	@media (max-width: 1199px) {
		.bohemcars-about-services__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.bohemcars-about-story h2,
		.bohemcars-about-section-title h2 {
			font-size: 28px;
		}

		.bohemcars-about-highlights,
		.bohemcars-about-services__grid {
			grid-template-columns: 1fr;
		}

		.bohemcars-about-story__statement {
			font-size: 16px;
		}
	}
</style>
