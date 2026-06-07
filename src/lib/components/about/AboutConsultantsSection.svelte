<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAgentCard as AuxeroAgentCardData } from '$lib/auxero/agents';
	import AboutSectionHeader from './AboutSectionHeader.svelte';

	let { consultants }: { consultants: AuxeroAgentCardData[] } = $props();

	const externalHref = (href: string) => ({ href });
</script>

<section class="bohemcars-consultants">
	<div class="container">
		<AboutSectionHeader
			heading="Екипът зад процеса"
			description="Трите роли покриват най-честия път: наличен автомобил, внос от Канада, проверка, документи и предаване."
		/>

		<div class="bohemcars-consultants__grid">
			{#each consultants as consultant, index (consultant.slug)}
				<article
					class={['bc-team-card sale-agent-box wow fadeInUp', index === 0 && 'active']}
					data-wow-delay={`0.${(index % 3) + 1}s`}
				>
					<div class="bc-team-card__media">
						<a
							class="bc-team-card__image-link"
							href={resolve('/agents/[slug]', { slug: consultant.slug })}
							aria-label={consultant.name}
						>
							<img src={consultant.image} alt={consultant.name} loading="lazy" />
						</a>
						<div class="bc-team-card__actions sale-agent-social">
							<a
								class="bc-team-card__chip"
								{...externalHref(consultant.phoneHref)}
								aria-label={`Обади се — ${consultant.name}`}
							>
								<img src="/assets/icons/PhoneCall.svg" alt="" />
							</a>
							<a
								class="bc-team-card__chip"
								{...externalHref(consultant.emailHref)}
								aria-label={`Имейл — ${consultant.name}`}
							>
								<img src="/assets/icons/input-telegram.svg" alt="" />
							</a>
							{#each consultant.socials.slice(0, 2) as social (social.label)}
								<a
									class="bc-team-card__chip"
									{...externalHref(social.href)}
									target="_blank"
									rel="noreferrer"
									aria-label={social.label}
								>
									<img src={`/assets/icons/${social.icon}`} alt="" />
								</a>
							{/each}
						</div>
					</div>
					<div class="bc-team-card__body">
						<a
							class="bc-team-card__name sale-agent-title"
							href={resolve('/agents/[slug]', { slug: consultant.slug })}
						>
							{consultant.name}
						</a>
						<p class="bc-team-card__role">{consultant.title}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.bohemcars-consultants {
		background: var(--bc-bg);
		padding: 54px 0 62px;
	}

	.bohemcars-consultants__grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.bc-team-card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.bc-team-card:hover {
		border-color: #cbd8c1;
		background: #ffffff;
	}

	.bc-team-card__media {
		position: relative;
		display: block;
		overflow: hidden;
		aspect-ratio: 1 / 1;
		background: var(--bc-surface);
	}

	.bc-team-card__media::after {
		position: absolute;
		inset: auto 0 0;
		z-index: 1;
		height: 42%;
		background: linear-gradient(180deg, rgb(13 20 10 / 0), rgb(13 20 10 / 0.72));
		content: '';
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.16s ease;
	}

	.bc-team-card:hover .bc-team-card__media::after,
	.bc-team-card:focus-within .bc-team-card__media::after {
		opacity: 1;
	}

	.bc-team-card__image-link {
		display: block;
		width: 100%;
		height: 100%;
	}

	.bc-team-card__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 18%;
	}

	.bc-team-card__body {
		display: flex;
		min-width: 0;
		flex: 1 1 auto;
		flex-direction: column;
		padding: 18px 20px 20px;
	}

	.bc-team-card__name {
		color: #1c1c1c;
		font-size: 18px;
		font-weight: 700;
		line-height: 1.25;
		text-decoration: none !important;
		transition: color 0.2s ease;
	}

	.bc-team-card__name:hover,
	.bc-team-card__name:focus-visible {
		color: #5f7d18;
		text-decoration: none !important;
	}

	.bc-team-card__role {
		margin: 6px 0 0;
		color: #696665;
		font-size: 14px;
		line-height: 1.5;
	}

	.bc-team-card__actions {
		position: absolute;
		z-index: 2;
		right: 16px;
		bottom: 16px;
		left: 16px;
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		justify-content: center;
		opacity: 0;
		pointer-events: none;
		transform: translateY(8px);
		transition:
			opacity 0.16s ease,
			transform 0.16s ease;
	}

	.bc-team-card:hover .bc-team-card__actions,
	.bc-team-card:focus-within .bc-team-card__actions {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
	}

	.bc-team-card__chip {
		display: inline-flex;
		width: 40px;
		height: 40px;
		border: 1px solid var(--bc-border);
		border-radius: 50%;
		background: #ffffff;
		align-items: center;
		justify-content: center;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.bc-team-card__chip img {
		width: 18px;
		height: 18px;
		opacity: 0.78;
		filter: brightness(0) saturate(100%);
		transition: opacity 0.2s ease;
	}

	.bc-team-card__chip:hover {
		border-color: #84a928;
		background: #eef4e2;
	}

	.bc-team-card__chip:hover img {
		opacity: 1;
	}

	@media (max-width: 991px) {
		.bohemcars-consultants__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.bohemcars-consultants {
			padding: 38px 0 50px;
		}

		.bohemcars-consultants__head {
			margin-bottom: 22px;
		}

		.bohemcars-consultants__grid {
			gap: 18px;
			grid-template-columns: 1fr;
			max-width: 460px;
		}

		.bc-team-card__actions {
			right: 14px;
			bottom: 14px;
			left: 14px;
			justify-content: center;
			opacity: 1;
			pointer-events: auto;
			transform: none;
		}

		.bc-team-card__media::after {
			opacity: 1;
		}
	}
</style>
