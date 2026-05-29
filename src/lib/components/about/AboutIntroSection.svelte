<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutContent } from '$lib/auxero/about';

	let { about }: { about: AuxeroAboutContent } = $props();

	const externalHref = (href: string) => ({ href });
</script>

<div class="container">
	<div class="bohemcars-about-profile">
		<div class="bohemcars-about-profile__main wow fadeInUp" data-wow-delay="0.1s">
			<p class="bohemcars-about-profile__eyebrow">{about.profile.eyebrow}</p>
			<h2>{about.profile.heading}</h2>
			<p class="bohemcars-about-profile__description">{about.profile.description}</p>
			<p class="bohemcars-about-profile__statement">{about.profile.statement}</p>

			<ul class="bohemcars-about-profile__checks">
				{#each about.profile.highlights as item (item)}
					<li>
						<img src="/assets/icons/check.svg" alt="check" />
						<span>{item}</span>
					</li>
				{/each}
			</ul>

			<div class="bohemcars-about-profile__actions">
				<a href={resolve('/contact')} class="btn btn-primary btn-large font-weight-600">
					Свържи се с Bohemcars
				</a>
				<a {...externalHref(about.contact.primaryPhoneHref)} class="bohemcars-about-profile__phone">
					<img src="/assets/icons/PhoneCall-3.svg" alt="phone" />
					<span>
						<small>Имаш въпрос?</small>
						<strong>{about.contact.primaryPhoneLabel}</strong>
					</span>
				</a>
			</div>
		</div>

		<div class="bohemcars-about-profile__proof wow fadeInUp" data-wow-delay="0.2s">
			{#each about.stats as stat (stat.label)}
				<div class="bohemcars-about-profile__stat">
					<p>
						{stat.value}<span>{stat.suffix}</span>
					</p>
					<span>{stat.label}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="bohemcars-about-steps">
		{#each about.profile.steps as step, index (step.title)}
			<div class="bohemcars-about-step wow fadeInUp" data-wow-delay={`0.${(index % 4) + 1}s`}>
				<span>{String(index + 1).padStart(2, '0')}</span>
				<h3>{step.title}</h3>
				<p>{step.description}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.bohemcars-about-profile {
		display: grid;
		gap: 30px;
		grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
		align-items: stretch;
	}

	.bohemcars-about-profile__main {
		padding: 42px;
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 10px 28px rgb(54 95 104 / 0.05);
	}

	.bohemcars-about-profile__eyebrow {
		margin-bottom: 12px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-about-profile h2 {
		max-width: 760px;
		margin-bottom: 18px;
		font-size: 42px;
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.14;
	}

	.bohemcars-about-profile__description {
		max-width: 820px;
		margin-bottom: 18px;
		color: #3c3c3c;
		font-size: 18px;
		line-height: 1.65;
	}

	.bohemcars-about-profile__statement {
		max-width: 780px;
		margin-bottom: 26px;
		color: #1c1c1c;
		font-size: 20px;
		font-weight: 600;
		line-height: 1.45;
	}

	.bohemcars-about-profile__checks {
		display: grid;
		gap: 12px;
		margin-bottom: 30px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.bohemcars-about-profile__checks li {
		display: flex;
		min-height: 52px;
		align-items: center;
		gap: 10px;
		padding: 12px 14px;
		border: 1px solid #e1e5d9;
		border-radius: 8px;
		background: #f7f8f4;
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 700;
		line-height: 1.3;
	}

	.bohemcars-about-profile__checks img {
		flex: 0 0 auto;
		width: 20px;
		height: 20px;
	}

	.bohemcars-about-profile__actions {
		display: flex;
		gap: 28px;
		align-items: center;
		flex-wrap: wrap;
	}

	.bohemcars-about-profile__phone {
		display: inline-flex;
		gap: 14px;
		align-items: center;
		color: #1c1c1c;
	}

	.bohemcars-about-profile__phone img {
		width: 50px;
		height: 50px;
	}

	.bohemcars-about-profile__phone small,
	.bohemcars-about-profile__phone strong {
		display: block;
		letter-spacing: 0;
	}

	.bohemcars-about-profile__phone small {
		margin-bottom: 3px;
		color: #696665;
		font-size: 14px;
		line-height: 1.2;
	}

	.bohemcars-about-profile__phone strong {
		font-size: 24px;
		font-weight: 600;
		line-height: 1.2;
	}

	.bohemcars-about-profile__proof {
		display: grid;
		gap: 14px;
	}

	.bohemcars-about-profile__stat {
		display: flex;
		min-height: 118px;
		padding: 22px;
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		background: #f6f7f3;
		flex-direction: column;
		justify-content: center;
	}

	.bohemcars-about-profile__stat p {
		margin-bottom: 6px;
		color: #1c1c1c;
		font-size: 36px;
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1;
	}

	.bohemcars-about-profile__stat p span {
		font-size: 24px;
	}

	.bohemcars-about-profile__stat > span {
		color: #696665;
		font-size: 15px;
		font-weight: 600;
		line-height: 1.25;
	}

	.bohemcars-about-steps {
		display: grid;
		gap: 18px;
		margin-top: 30px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.bohemcars-about-step {
		min-height: 210px;
		padding: 24px;
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		background: #fff;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease;
	}

	.bohemcars-about-step:hover {
		border-color: #dfe8bd;
		background: #f8fbef;
	}

	.bohemcars-about-step span {
		display: inline-flex;
		margin-bottom: 24px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		line-height: 1;
	}

	.bohemcars-about-step h3 {
		margin-bottom: 10px;
		font-size: 24px;
		font-weight: 600;
		line-height: 1.15;
	}

	.bohemcars-about-step p {
		margin: 0;
		color: #696665;
		font-size: 15px;
		line-height: 1.55;
	}

	@media (max-width: 1199px) {
		.bohemcars-about-profile,
		.bohemcars-about-steps {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.bohemcars-about-profile__main {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 767px) {
		.bohemcars-about-profile,
		.bohemcars-about-steps,
		.bohemcars-about-profile__checks {
			grid-template-columns: 1fr;
		}

		.bohemcars-about-profile__main {
			padding: 28px;
		}

		.bohemcars-about-profile h2 {
			font-size: 32px;
		}

		.bohemcars-about-profile__description,
		.bohemcars-about-profile__statement {
			font-size: 16px;
		}
	}
</style>
