<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutOffice } from '$lib/auxero/about';

	let { office }: { office: AuxeroAboutOffice } = $props();

	const externalHref = (href: string) => ({ href });
</script>

<section class="bohemcars-about-location">
	<div class="container">
		<div class="title-section wow fadeInDown mb-28" data-wow-delay="0.1s">
			<div>
				<p class="bohemcars-about-location__eyebrow">Офис и огледи</p>
				<h2>{office.heading}</h2>
				<p class="bohemcars-about-location__copy">{office.description}</p>
			</div>
			<a href={resolve('/contact')} class="btn btn-line-style-2 btn-large font-weight-600">
				Пиши ни
			</a>
		</div>

		<div class="bohemcars-about-location__cards">
			<article class="bohemcars-about-location-card">
				<span><img src="/assets/icons/MapPin.svg" alt="" /></span>
				<h3>Адрес</h3>
				<p>{office.address}</p>
			</article>
			<article class="bohemcars-about-location-card">
				<span><img src="/assets/icons/PhoneCall.svg" alt="" /></span>
				<h3>Телефон</h3>
				<a {...externalHref(office.phoneHref)}>{office.phone}</a>
				<a {...externalHref(office.secondaryPhoneHref)}>{office.secondaryPhone}</a>
			</article>
			<article class="bohemcars-about-location-card">
				<span><img src="/assets/icons/Alarm.svg" alt="" /></span>
				<h3>Работно време</h3>
				<p>{office.hours}</p>
				<p>{office.appointment}</p>
				<a {...externalHref(office.emailHref)}>{office.email}</a>
			</article>
		</div>

		<div class="widget-gg-map bohemcars-about-location__map radius-16 flex overflow-hidden">
			<iframe
				src={office.mapEmbedUrl}
				width="100%"
				height="100%"
				style="border:0;"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				title="Bohemcars Plovdiv map"
			></iframe>
		</div>
	</div>
</section>

<style>
	.bohemcars-about-location {
		background: var(--bc-bg);
		padding: 48px 0 74px;
	}

	.bohemcars-about-location :global(.title-section) {
		align-items: flex-end;
	}

	.bohemcars-about-location__eyebrow {
		margin-bottom: 8px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-about-location__copy {
		max-width: 720px;
		margin-top: 10px;
		color: #696665;
		font-size: 16px;
		line-height: 1.55;
	}

	.bohemcars-about-location__cards {
		display: grid;
		margin-bottom: 16px;
		gap: 16px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.bohemcars-about-location-card {
		min-height: 146px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 20px;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.bohemcars-about-location-card:hover {
		border-color: var(--primary);
		background: var(--bc-surface-hover);
	}

	.bohemcars-about-location-card span {
		display: inline-flex;
		width: 38px;
		height: 38px;
		margin-bottom: 14px;
		border-radius: 50%;
		background: #e8eee2;
		align-items: center;
		justify-content: center;
	}

	.bohemcars-about-location-card img {
		width: 19px;
		height: 19px;
	}

	.bohemcars-about-location-card h3 {
		margin-bottom: 8px;
		font-size: 20px;
		font-weight: 600;
		line-height: 1.2;
	}

	.bohemcars-about-location-card p,
	.bohemcars-about-location-card a {
		display: block;
		margin: 0 0 4px;
		color: #696665;
		font-size: 15px;
		line-height: 1.5;
	}

	.bohemcars-about-location-card a:hover {
		color: var(--primary);
	}

	.bohemcars-about-location__map {
		height: 320px;
		border: 1px solid var(--bc-border);
		background: var(--bc-surface);
	}

	@media (max-width: 991px) {
		.bohemcars-about-location__cards {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 767px) {
		.bohemcars-about-location {
			padding: 42px 0 58px;
		}

		.bohemcars-about-location :global(.title-section) {
			align-items: flex-start;
			flex-direction: column;
			gap: 14px;
		}

		.bohemcars-about-location__map {
			height: 260px;
		}
	}
</style>
