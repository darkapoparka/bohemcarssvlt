<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, CheckCircle2, ClipboardCheck, Heart, UserRound } from '@lucide/svelte';
	import { bohemcarsContact } from '$lib/data/bohemcars';

	const features = [
		{
			icon: ClipboardCheck,
			title: 'История на запитвания',
			text: 'Клиентът вижда изпратени VIN номера, заявки за внос и отговори от екипа.'
		},
		{
			icon: Heart,
			title: 'Запазени автомобили',
			text: 'Любимите автомобили и сравненията остават подредени за следващ разговор.'
		},
		{
			icon: UserRound,
			title: 'Данни за контакт',
			text: 'Телефон, имейл и предпочитания за оглед се поддържат на едно място.'
		}
	] as const;
</script>

<svelte:head>
	<title>Клиентски портал | Bohemcars</title>
</svelte:head>

<main class="account-entry">
	<section class="account-entry__hero">
		<div class="account-entry__inner">
			<div class="account-entry__copy">
				<p class="account-entry__eyebrow">Клиентски портал</p>
				<h1>Частна зона за запитвания, любими автомобили и огледи</h1>
				<p>
					Този вход е подготвен като демо зона за бъдещ клиентски портал на Bohemcars. След
					активиране може да показва реални запитвания, любими автомобили, документи и статуси по
					внос.
				</p>
				<div class="account-entry__actions">
					<a class="btn btn-primary btn-large font-weight-600" href={resolve('/contact')}>
						Заяви достъп
						<ArrowRight size={18} />
					</a>
					<a
						class="btn btn-line-hover effect-line-primary hover-fill-white btn-large font-weight-600"
						href={resolve('/account?demo=dashboard')}
					>
						Виж демо табло
					</a>
				</div>
			</div>
			<div class="account-entry__panel" aria-label="Преглед на клиентски портал">
				<div class="account-entry__panel-top">
					<span></span>
					<span></span>
					<span></span>
				</div>
				<div class="account-entry__panel-body">
					<div class="account-entry__profile">
						<div>
							<p>Bohemcars клиент</p>
							<span>{bohemcarsContact.appointmentNote}</span>
						</div>
						<CheckCircle2 size={22} />
					</div>
					<ul>
						<li>
							<span>Запитване за внос</span>
							<strong>Подготвя се</strong>
						</li>
						<li>
							<span>Любими автомобили</span>
							<strong>3</strong>
						</li>
						<li>
							<span>Следващ оглед</span>
							<strong>По уговорка</strong>
						</li>
					</ul>
					<a href={resolve('/inventory')}>Разгледай автомобили</a>
				</div>
			</div>
		</div>
	</section>

	<section class="account-entry__features">
		<div class="account-entry__inner">
			{#each features as feature (feature.title)}
				{@const Icon = feature.icon}
				<article>
					<Icon size={26} />
					<h2>{feature.title}</h2>
					<p>{feature.text}</p>
				</article>
			{/each}
		</div>
	</section>
</main>

<style>
	.account-entry {
		background: #f7f7f5;
		color: #1c1c1c;
	}

	.account-entry__hero {
		padding: 148px 0 96px;
		background: linear-gradient(180deg, #ffffff 0%, #f7f7f5 100%);
	}

	.account-entry__inner {
		width: min(1220px, calc(100% - 40px));
		margin: 0 auto;
	}

	.account-entry__hero .account-entry__inner {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr);
		align-items: center;
		gap: 60px;
	}

	.account-entry__eyebrow {
		margin-bottom: 14px;
		color: #6f7c59;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	.account-entry h1 {
		max-width: 760px;
		margin-bottom: 20px;
		font-size: 56px;
		line-height: 1.04;
		font-weight: 700;
		letter-spacing: 0;
	}

	.account-entry__copy > p:not(.account-entry__eyebrow) {
		max-width: 660px;
		margin-bottom: 32px;
		color: #5f6265;
		font-size: 18px;
		line-height: 1.65;
	}

	.account-entry__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		align-items: center;
	}

	.account-entry__actions a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.account-entry__panel {
		border: 1px solid rgba(28, 28, 28, 0.08);
		border-radius: 8px;
		background: #ffffff;
		box-shadow: 0 24px 80px rgba(28, 28, 28, 0.08);
		overflow: hidden;
	}

	.account-entry__panel-top {
		display: flex;
		gap: 7px;
		padding: 16px 18px;
		border-bottom: 1px solid rgba(28, 28, 28, 0.08);
		background: #f2f3ef;
	}

	.account-entry__panel-top span {
		width: 10px;
		height: 10px;
		border-radius: 999px;
		background: #c7c9c0;
	}

	.account-entry__panel-body {
		padding: 28px;
	}

	.account-entry__profile {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 24px;
		padding-bottom: 22px;
		border-bottom: 1px solid rgba(28, 28, 28, 0.08);
	}

	.account-entry__profile p {
		margin-bottom: 4px;
		font-size: 22px;
		font-weight: 700;
	}

	.account-entry__profile span,
	.account-entry__panel-body li span {
		color: #686b6e;
	}

	.account-entry__panel-body ul {
		display: grid;
		gap: 12px;
		margin: 0 0 24px;
		padding: 0;
		list-style: none;
	}

	.account-entry__panel-body li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 16px;
		border: 1px solid rgba(28, 28, 28, 0.08);
		border-radius: 8px;
	}

	.account-entry__panel-body strong {
		font-weight: 700;
		white-space: nowrap;
	}

	.account-entry__panel-body > a {
		color: #1c1c1c;
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.account-entry__features {
		padding: 0 0 96px;
	}

	.account-entry__features .account-entry__inner {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 22px;
	}

	.account-entry__features article {
		min-height: 210px;
		padding: 28px;
		border: 1px solid rgba(28, 28, 28, 0.08);
		border-radius: 8px;
		background: #ffffff;
	}

	.account-entry__features :global(svg) {
		margin-bottom: 24px;
		color: #6f7c59;
	}

	.account-entry__features h2 {
		margin-bottom: 10px;
		font-size: 22px;
		font-weight: 700;
	}

	.account-entry__features p {
		margin: 0;
		color: #606366;
		line-height: 1.62;
	}

	@media (max-width: 991px) {
		.account-entry__hero .account-entry__inner,
		.account-entry__features .account-entry__inner {
			grid-template-columns: 1fr;
		}

		.account-entry__hero {
			padding-top: 124px;
		}

		.account-entry h1 {
			font-size: 42px;
		}
	}
</style>
