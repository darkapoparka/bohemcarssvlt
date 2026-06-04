<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import AboutStatsGrid from './AboutStatsGrid.svelte';

	let { about }: { about: AuxeroAboutContent } = $props();

	const externalHref = (href: string) => ({ href });
</script>

<div class="container">
	<div class="bohemcars-about-stack">
		<div class="bohemcars-about-story wow fadeInUp" data-wow-delay="0.1s">
			<p class="bohemcars-about-story__eyebrow">{about.profile.eyebrow}</p>
			<h2>{about.profile.heading}</h2>
			<p class="bohemcars-about-story__copy">{about.profile.description}</p>
			<p class="bohemcars-about-story__statement">{about.profile.statement}</p>

			<div class="bohemcars-about-highlights">
				{#each about.profile.highlights as item (item)}
					<div class="bohemcars-about-highlight">
						<img src="/assets/icons/check.svg" alt="check" />
						<span>{item}</span>
					</div>
				{/each}
			</div>

			<div class="bohemcars-about-story__actions">
				<a href={resolve('/contact')} class="btn btn-primary btn-large font-weight-600">
					Свържи се с Bohemcars
				</a>
				<a {...externalHref(about.contact.primaryPhoneHref)} class="bohemcars-about-phone">
					<img src="/assets/icons/PhoneCall-3.svg" alt="PhoneCall" />
					<span>{about.contact.primaryPhoneLabel}</span>
				</a>
			</div>
		</div>

		<div class="bohemcars-about-proof-strip">
			<div class="bohemcars-about-proof-strip__media">
				<img src={about.assets.hero} alt={about.intro.mainImageAlt} />
			</div>
			<div class="bohemcars-about-proof-strip__content">
				<p class="bohemcars-about-story__eyebrow">{about.intro.title}</p>
				<h3>{about.intro.heading}</h3>
				<div class="bohemcars-about-proof-list">
					{#each about.intro.checklist as item (item)}
						<div>
							<img src="/assets/icons/check.svg" alt="check" />
							<span>{item}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="bohemcars-about-services">
			<div class="bohemcars-about-section-title">
				<p class="bohemcars-about-story__eyebrow">{about.intro.title}</p>
				<h2>{about.intro.heading}</h2>
				<p>{about.intro.description}</p>
			</div>
			<div class="bohemcars-about-services__grid">
				{#each about.profile.steps as step, index (step.title)}
					<div
						class="bohemcars-about-service wow fadeInUp"
						data-wow-delay={`0.${(index % 4) + 1}s`}
					>
						<span>{String(index + 1).padStart(2, '0')}</span>
						<h3>{step.title}</h3>
						<p>{step.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<AboutStatsGrid stats={about.stats} />
	</div>
</div>

<style>
	.bohemcars-about-stack {
		max-width: 1120px;
		margin: 0 auto;
	}

	.bohemcars-about-story {
		max-width: 920px;
		margin: 0 auto;
		text-align: center;
	}

	.bohemcars-about-story__eyebrow {
		margin-bottom: 12px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-about-story h2,
	.bohemcars-about-section-title h2 {
		max-width: 820px;
		margin-right: auto;
		margin-bottom: 14px;
		margin-left: auto;
		font-size: 36px;
		font-weight: 600;
		line-height: 1.15;
	}

	.bohemcars-about-story__copy,
	.bohemcars-about-section-title p {
		max-width: 760px;
		margin-right: auto;
		margin-bottom: 16px;
		margin-left: auto;
		color: #696665;
		font-size: 16px;
		line-height: 1.65;
	}

	.bohemcars-about-story__statement {
		max-width: 760px;
		margin-right: auto;
		margin-bottom: 22px;
		margin-left: auto;
		color: #1c1c1c;
		font-size: 18px;
		font-weight: 600;
		line-height: 1.45;
	}

	.bohemcars-about-highlights {
		display: grid;
		margin-bottom: 28px;
		gap: 10px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.bohemcars-about-highlight {
		display: flex;
		min-height: 46px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		padding: 10px 12px;
		gap: 8px;
		align-items: center;
	}

	.bohemcars-about-highlight img {
		width: 18px;
		height: 18px;
		flex: 0 0 auto;
	}

	.bohemcars-about-highlight span {
		color: #1c1c1c;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.35;
	}

	.bohemcars-about-story__actions {
		display: flex;
		gap: 18px;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}

	.bohemcars-about-phone {
		display: inline-flex;
		color: #1c1c1c;
		font-weight: 700;
		gap: 10px;
		align-items: center;
	}

	.bohemcars-about-phone img {
		width: 40px;
		height: 40px;
	}

	.bohemcars-about-proof-strip {
		display: grid;
		overflow: hidden;
		margin-top: 44px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		grid-template-columns: minmax(0, 0.82fr) minmax(0, 1fr);
		align-items: stretch;
	}

	.bohemcars-about-proof-strip__media {
		min-height: 250px;
		background: var(--bc-surface-soft);
	}

	.bohemcars-about-proof-strip__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.bohemcars-about-proof-strip__content {
		padding: 28px;
	}

	.bohemcars-about-proof-strip__content h3 {
		margin-bottom: 18px;
		font-size: 26px;
		font-weight: 600;
		line-height: 1.2;
	}

	.bohemcars-about-proof-list {
		display: grid;
		gap: 10px;
	}

	.bohemcars-about-proof-list div {
		display: flex;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		padding: 10px 12px;
		gap: 8px;
		align-items: center;
	}

	.bohemcars-about-proof-list img {
		width: 18px;
		height: 18px;
		flex: 0 0 auto;
	}

	.bohemcars-about-proof-list span {
		font-size: 14px;
		font-weight: 600;
		line-height: 1.35;
	}

	.bohemcars-about-services {
		margin-top: 56px;
	}

	.bohemcars-about-section-title {
		margin-bottom: 26px;
		text-align: center;
	}

	.bohemcars-about-section-title h2,
	.bohemcars-about-section-title p {
		margin-right: auto;
		margin-left: auto;
	}

	.bohemcars-about-services__grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.bohemcars-about-service {
		min-height: 176px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 22px;
	}

	.bohemcars-about-service span {
		display: inline-flex;
		margin-bottom: 18px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		line-height: 1;
	}

	.bohemcars-about-service h3 {
		margin-bottom: 10px;
		font-size: 22px;
		font-weight: 600;
		line-height: 1.15;
	}

	.bohemcars-about-service p {
		margin: 0;
		color: #696665;
		font-size: 15px;
		line-height: 1.55;
	}

	@media (max-width: 1199px) {
		.bohemcars-about-story h2,
		.bohemcars-about-section-title h2 {
			font-size: 32px;
		}
	}

	@media (max-width: 767px) {
		.bohemcars-about-story h2,
		.bohemcars-about-section-title h2 {
			font-size: 28px;
		}

		.bohemcars-about-proof-strip,
		.bohemcars-about-highlights,
		.bohemcars-about-services__grid {
			grid-template-columns: 1fr;
		}

		.bohemcars-about-proof-strip__media {
			min-height: 210px;
		}

		.bohemcars-about-proof-strip__content {
			padding: 22px;
		}

		.bohemcars-about-story__statement {
			font-size: 16px;
		}
	}
</style>
