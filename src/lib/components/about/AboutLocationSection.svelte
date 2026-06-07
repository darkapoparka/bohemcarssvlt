<script lang="ts">
	import type { AuxeroAboutOffice } from '$lib/auxero/about';
	import AboutSectionHeader from './AboutSectionHeader.svelte';

	let { office }: { office: AuxeroAboutOffice } = $props();

	const externalHref = (href: string) => ({ href });
	const showSecondaryPhone = $derived(
		office.secondaryPhoneHref !== office.phoneHref || office.secondaryPhone !== office.phone
	);
</script>

<section class="bohemcars-about-location">
	<div class="container">
		<AboutSectionHeader heading={office.heading} description={office.description} />
		<div class="bohemcars-about-location__shell">
			<div class="bohemcars-about-location__content wow fadeInLeft" data-wow-delay="0.1s">
				<div class="bohemcars-about-location__cards">
					<article class="bohemcars-about-location-card">
						<span><img src="/assets/icons/MapPin.svg" alt="" /></span>
						<div>
							<h3>Адрес</h3>
							<p>{office.address}</p>
						</div>
					</article>
					<article class="bohemcars-about-location-card">
						<span><img src="/assets/icons/PhoneCall.svg" alt="" /></span>
						<div>
							<h3>Телефон</h3>
							<a {...externalHref(office.phoneHref)}>{office.phone}</a>
							{#if showSecondaryPhone}
								<a {...externalHref(office.secondaryPhoneHref)}>{office.secondaryPhone}</a>
							{/if}
						</div>
					</article>
					<article class="bohemcars-about-location-card">
						<span><img src="/assets/icons/Alarm.svg" alt="" /></span>
						<div>
							<h3>Работно време</h3>
							<p>{office.hours}</p>
							<p>{office.appointment}</p>
							<a {...externalHref(office.emailHref)}>{office.email}</a>
						</div>
					</article>
				</div>
			</div>

			<div class="bohemcars-about-location__map wow fadeInRight" data-wow-delay="0.1s">
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

				<div class="bohemcars-about-location__map-info">
					<span class="bohemcars-about-location__map-pin">
						<img src="/assets/icons/MapPin.svg" alt="" />
					</span>
					<div>
						<strong>Bohemcars</strong>
						<small>{office.address}</small>
					</div>
				</div>

				<a
					class="bohemcars-about-location__map-link"
					{...externalHref(office.mapHref)}
					target="_blank"
					rel="noreferrer"
				>
					Отвори карта
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#ffffff"
						stroke-width="2.4"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M7 17L17 7" />
						<path d="M8 7h9v9" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.bohemcars-about-location {
		background: var(--bc-bg);
		padding: 50px 0 72px;
	}

	.bohemcars-about-location__shell {
		display: grid;
		gap: 24px;
		grid-template-columns: minmax(0, 1.22fr) minmax(340px, 0.78fr);
		align-items: stretch;
	}

	.bohemcars-about-location__content {
		display: flex;
		min-width: 0;
		flex-direction: column;
		grid-column: 2;
	}

	.bohemcars-about-location__cards {
		display: grid;
		min-height: 430px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		box-shadow: 0 12px 30px rgb(22 36 14 / 0.08);
		grid-template-columns: 1fr;
		grid-template-rows: repeat(3, minmax(0, 1fr));
	}

	.bohemcars-about-location-card {
		display: flex;
		min-height: 0;
		border-bottom: 1px solid #e4e8df;
		background: #ffffff;
		padding: 24px 22px;
		gap: 15px;
		align-items: flex-start;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.bohemcars-about-location-card:last-child {
		border-bottom: 0;
	}

	.bohemcars-about-location-card:hover {
		background: #f8faf5;
	}

	.bohemcars-about-location-card span {
		flex: 0 0 auto;
		display: inline-flex;
		width: 40px;
		height: 40px;
		border: 1px solid #dfe9d8;
		border-radius: 8px;
		background: #eef4e9;
		align-items: center;
		justify-content: center;
	}

	.bohemcars-about-location-card img {
		width: 19px;
		height: 19px;
		opacity: 0.82;
		filter: brightness(0) saturate(100%);
	}

	.bohemcars-about-location-card div {
		min-width: 0;
	}

	.bohemcars-about-location-card h3 {
		margin-bottom: 6px;
		color: #111111;
		font-size: 15px;
		font-weight: 800;
		line-height: 1.2;
	}

	.bohemcars-about-location-card p,
	.bohemcars-about-location-card a {
		display: block;
		margin: 0 0 4px;
		color: #696665;
		font-size: 14px;
		line-height: 1.45;
	}

	.bohemcars-about-location-card a:hover {
		color: #5f7d18;
	}

	.bohemcars-about-location__map {
		position: relative;
		min-height: 430px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #eef2ec;
		grid-column: 1;
		grid-row: 1;
		isolation: isolate;
	}

	.bohemcars-about-location__map iframe {
		position: absolute;
		z-index: 0;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.bohemcars-about-location__map-info {
		position: absolute;
		z-index: 2;
		top: 18px;
		left: 18px;
		display: flex;
		max-width: min(320px, calc(100% - 36px));
		border: 1px solid rgb(255 255 255 / 0.7);
		border-radius: 8px;
		background: rgb(255 255 255 / 0.92);
		padding: 11px 14px;
		gap: 12px;
		align-items: center;
		box-shadow: 0 8px 22px rgb(20 33 15 / 0.16);
		backdrop-filter: blur(10px);
	}

	.bohemcars-about-location__map-pin {
		flex: 0 0 auto;
		display: inline-flex;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(150deg, #2f4a1c, #16240e);
		align-items: center;
		justify-content: center;
		box-shadow: 0 6px 16px rgb(20 33 15 / 0.3);
	}

	.bohemcars-about-location__map-pin img {
		width: 20px;
		height: 20px;
		filter: brightness(0) invert(1);
	}

	.bohemcars-about-location__map-info strong {
		display: block;
		color: #111111;
		font-size: 16px;
		font-weight: 700;
		line-height: 1.2;
	}

	.bohemcars-about-location__map-info small {
		display: block;
		margin-top: 2px;
		color: #5a6356;
		font-size: 13.5px;
		line-height: 1.35;
	}

	.bohemcars-about-location__map-link {
		position: absolute;
		z-index: 2;
		right: 16px;
		bottom: 16px;
		display: inline-flex;
		min-height: 42px;
		align-items: center;
		gap: 9px;
		border-radius: 8px;
		background: #16240e;
		padding: 0 18px;
		color: #ffffff;
		font-size: 14px;
		font-weight: 700;
		box-shadow: 0 6px 18px rgb(20 33 15 / 0.24);
		transition: background-color 0.18s ease;
	}

	.bohemcars-about-location__map-link:hover {
		color: #ffffff;
		background: #20330f;
	}

	@media (max-width: 991px) {
		.bohemcars-about-location__shell {
			grid-template-columns: 1fr;
		}

		.bohemcars-about-location__content,
		.bohemcars-about-location__map {
			grid-column: auto;
			grid-row: auto;
		}

		.bohemcars-about-location__cards {
			min-height: 0;
			grid-template-rows: auto;
		}

		.bohemcars-about-location__map {
			min-height: 340px;
		}
	}

	@media (max-width: 767px) {
		.bohemcars-about-location {
			padding: 38px 0 54px;
		}

		.bohemcars-about-location__cards {
			margin-top: 18px;
		}

		.bohemcars-about-location__map {
			min-height: 300px;
		}

		.bohemcars-about-location__map-info {
			top: 14px;
			left: 14px;
			padding: 10px 13px;
		}

		.bohemcars-about-location__map-link {
			right: 14px;
			bottom: 14px;
		}
	}
</style>
