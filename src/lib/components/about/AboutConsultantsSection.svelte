<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAgentCard as AuxeroAgentCardData } from '$lib/auxero/agents';

	let { consultants }: { consultants: AuxeroAgentCardData[] } = $props();

	const externalHref = (href: string) => ({ href });
</script>

<section class="bohemcars-consultants">
	<div class="container">
		<div class="bohemcars-consultants__head wow fadeInDown" data-wow-delay="0.1s">
			<p class="bohemcars-consultants__eyebrow">Екип</p>
			<h2>Екипът зад процеса</h2>
			<p class="bohemcars-consultants__copy">
				Трите роли покриват най-честия път: наличен автомобил, внос от Канада, проверка, документи
				и предаване.
			</p>
		</div>

		<div class="bohemcars-consultants__grid">
			{#each consultants as consultant, index (consultant.slug)}
				<article class="bc-team-card wow fadeInUp" data-wow-delay={`0.${(index % 3) + 1}s`}>
					<a
						class="bc-team-card__media"
						href={resolve('/agents/[slug]', { slug: consultant.slug })}
						aria-label={consultant.name}
					>
						<img src={consultant.image} alt={consultant.name} loading="lazy" />
						<span class="bc-team-card__index">{String(index + 1).padStart(2, '0')}</span>
					</a>
					<div class="bc-team-card__body">
						<a
							class="bc-team-card__name"
							href={resolve('/agents/[slug]', { slug: consultant.slug })}
						>
							{consultant.name}
						</a>
						<p class="bc-team-card__role">{consultant.title}</p>
						<div class="bc-team-card__actions">
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

	.bohemcars-consultants__head {
		max-width: 760px;
		margin-bottom: 30px;
	}

	.bohemcars-consultants__eyebrow {
		margin-bottom: 8px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-consultants h2 {
		margin-bottom: 8px;
		font-size: clamp(28px, 2vw, 34px);
		font-weight: 500;
		line-height: 1.12;
	}

	.bohemcars-consultants__copy {
		max-width: 720px;
		margin-top: 10px;
		color: #696665;
		font-size: 16px;
		line-height: 1.55;
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
		border-radius: 16px;
		background: var(--bc-surface-soft);
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease,
			box-shadow 0.25s ease,
			transform 0.25s ease;
	}

	.bc-team-card:hover {
		border-color: #cbd8c1;
		background: #ffffff;
		box-shadow: 0 18px 42px rgb(20 33 15 / 0.09);
		transform: translateY(-3px);
	}

	.bc-team-card__media {
		position: relative;
		display: block;
		overflow: hidden;
		aspect-ratio: 1 / 1;
		background: var(--bc-surface);
	}

	.bc-team-card__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 18%;
		transition: transform 0.55s ease;
	}

	.bc-team-card:hover .bc-team-card__media img {
		transform: scale(1.035);
	}

	.bc-team-card__index {
		position: absolute;
		top: 14px;
		left: 14px;
		z-index: 1;
		display: inline-flex;
		min-width: 34px;
		height: 27px;
		padding: 0 10px;
		border-radius: 999px;
		background: rgb(20 33 15 / 0.72);
		color: #d9f275;
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.04em;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(6px);
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
		transition: color 0.2s ease;
	}

	.bc-team-card__name:hover {
		color: #5f7d18;
	}

	.bc-team-card__role {
		margin: 6px 0 0;
		color: #696665;
		font-size: 14px;
		line-height: 1.5;
	}

	.bc-team-card__actions {
		display: flex;
		margin-top: 16px;
		gap: 8px;
		flex-wrap: wrap;
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
	}
</style>
