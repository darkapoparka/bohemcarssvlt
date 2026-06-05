<script lang="ts">
	import type { AuxeroAboutOffice } from '$lib/auxero/about';

	let { office }: { office: AuxeroAboutOffice } = $props();

	const externalHref = (href: string) => ({ href });
	const showSecondaryPhone = $derived(
		office.secondaryPhoneHref !== office.phoneHref || office.secondaryPhone !== office.phone
	);
</script>

<section class="bohemcars-about-location">
	<div class="container">
		<div class="bohemcars-about-location__shell">
			<div class="bohemcars-about-location__content wow fadeInLeft" data-wow-delay="0.1s">
				<p class="bohemcars-about-location__eyebrow">Офис и огледи</p>
				<h2>{office.heading}</h2>
				<p class="bohemcars-about-location__copy">{office.description}</p>

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
				<div class="bohemcars-about-location__map-fallback" aria-hidden="true">
					<span class="bohemcars-about-location__road road-a"></span>
					<span class="bohemcars-about-location__road road-b"></span>
					<span class="bohemcars-about-location__road road-c"></span>
					<span class="bohemcars-about-location__pin">
						<img src="/assets/icons/MapPin.svg" alt="" />
					</span>
					<div class="bohemcars-about-location__map-label">
						<strong>Bohemcars</strong>
						<small>{office.address}</small>
					</div>
				</div>
				<a
					class="btn btn-primary btn-small font-weight-600 bohemcars-about-location__map-link"
					{...externalHref(office.mapHref)}
					target="_blank"
					rel="noreferrer">Отвори карта</a
				>
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
		gap: 28px;
		grid-template-columns: minmax(420px, 0.8fr) minmax(0, 1.2fr);
		align-items: start;
	}

	.bohemcars-about-location__content {
		display: flex;
		min-width: 0;
		flex-direction: column;
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
		max-width: 560px;
		margin-top: 8px;
		color: #696665;
		font-size: 16px;
		line-height: 1.55;
	}

	.bohemcars-about-location h2 {
		max-width: 620px;
		margin-bottom: 8px;
		font-size: clamp(28px, 2vw, 34px);
		font-weight: 500;
		line-height: 1.12;
	}

	.bohemcars-about-location__cards {
		display: grid;
		margin-top: 24px;
		gap: 10px;
		grid-template-columns: 1fr;
	}

	.bohemcars-about-location-card {
		display: flex;
		min-height: 0;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		padding: 15px 16px;
		gap: 14px;
		align-items: flex-start;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.bohemcars-about-location-card:hover {
		border-color: var(--primary);
		background: var(--bc-surface);
	}

	.bohemcars-about-location-card span {
		flex: 0 0 auto;
		display: inline-flex;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #e8eee2;
		align-items: center;
		justify-content: center;
	}

	.bohemcars-about-location-card img {
		width: 19px;
		height: 19px;
		filter: brightness(0) saturate(100%);
		opacity: 0.82;
	}

	.bohemcars-about-location-card h3 {
		margin-bottom: 5px;
		font-size: 18px;
		font-weight: 600;
		line-height: 1.2;
	}

	.bohemcars-about-location-card p,
	.bohemcars-about-location-card a {
		display: block;
		margin: 0 0 4px;
		color: #696665;
		font-size: 15px;
		line-height: 1.42;
	}

	.bohemcars-about-location-card a:hover {
		color: var(--primary);
	}

	.bohemcars-about-location__map {
		position: relative;
		height: 388px;
		min-height: 0;
		border: 1px solid var(--bc-border);
		background: #eef2ec;
		isolation: isolate;
	}

	.bohemcars-about-location__map iframe {
		position: absolute;
		z-index: 0;
		inset: 0;
		opacity: 0.26;
		filter: grayscale(1) contrast(1.05);
	}

	.bohemcars-about-location__map-fallback {
		position: absolute;
		z-index: 1;
		inset: 0;
		overflow: hidden;
		background:
			linear-gradient(115deg, rgb(255 255 255 / 0.34), transparent 42%),
			repeating-linear-gradient(
				0deg,
				rgb(28 28 28 / 0.035) 0,
				rgb(28 28 28 / 0.035) 1px,
				transparent 1px,
				transparent 48px
			),
			repeating-linear-gradient(
				90deg,
				rgb(28 28 28 / 0.035) 0,
				rgb(28 28 28 / 0.035) 1px,
				transparent 1px,
				transparent 54px
			);
	}

	.bohemcars-about-location__road {
		position: absolute;
		height: 12px;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.86);
		box-shadow: inset 0 0 0 1px rgb(28 28 28 / 0.08);
	}

	.bohemcars-about-location__road.road-a {
		top: 48%;
		left: -8%;
		width: 74%;
		transform: rotate(-13deg);
	}

	.bohemcars-about-location__road.road-b {
		top: 21%;
		right: -10%;
		width: 70%;
		transform: rotate(28deg);
	}

	.bohemcars-about-location__road.road-c {
		right: 6%;
		bottom: 21%;
		width: 52%;
		transform: rotate(-33deg);
	}

	.bohemcars-about-location__pin {
		position: absolute;
		top: 46%;
		left: 48%;
		display: inline-flex;
		width: 54px;
		height: 54px;
		border: 2px solid #ffffff;
		border-radius: 50%;
		background: var(--primary);
		box-shadow: 0 16px 30px rgb(0 0 0 / 0.18);
		align-items: center;
		justify-content: center;
		transform: translate(-50%, -50%);
	}

	.bohemcars-about-location__pin img {
		width: 24px;
		height: 24px;
		filter: brightness(0) invert(1);
	}

	.bohemcars-about-location__map-label {
		position: absolute;
		right: 22px;
		bottom: 22px;
		display: flex;
		max-width: min(320px, calc(100% - 44px));
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: rgb(255 255 255 / 0.92);
		padding: 14px 16px;
		flex-direction: column;
		gap: 3px;
	}

	.bohemcars-about-location__map-label strong {
		color: #111111;
		font-size: 17px;
		font-weight: 700;
		line-height: 1.2;
	}

	.bohemcars-about-location__map-label small {
		color: #696665;
		font-size: 14px;
		line-height: 1.35;
	}

	.bohemcars-about-location__map-link {
		position: absolute;
		z-index: 2;
		left: 22px;
		bottom: 22px;
		min-height: 44px;
		border-radius: 8px;
	}

	@media (max-width: 991px) {
		.bohemcars-about-location__shell {
			grid-template-columns: 1fr;
		}

		.bohemcars-about-location__copy {
			max-width: 720px;
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
			height: 300px;
		}

		.bohemcars-about-location-card {
			padding: 14px;
		}

		.bohemcars-about-location h2 {
			font-size: 28px;
		}

		.bohemcars-about-location__map-label {
			right: 14px;
			bottom: 14px;
		}

		.bohemcars-about-location__map-link {
			left: 14px;
			bottom: 14px;
		}
	}
</style>
