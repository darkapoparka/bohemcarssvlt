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
		gap: 28px;
		grid-template-columns: minmax(400px, 0.85fr) minmax(0, 1.15fr);
		align-items: stretch;
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
		gap: 12px;
		grid-template-columns: 1fr;
	}

	.bohemcars-about-location-card {
		display: flex;
		min-height: 0;
		border: 1px solid var(--bc-border);
		border-radius: 14px;
		background: var(--bc-surface-soft);
		padding: 16px 18px;
		gap: 14px;
		align-items: flex-start;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.25s ease;
	}

	.bohemcars-about-location-card:hover {
		border-color: #cbd8c1;
		background: #ffffff;
		box-shadow: 0 14px 32px rgb(20 33 15 / 0.07);
	}

	.bohemcars-about-location-card span {
		flex: 0 0 auto;
		display: inline-flex;
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: #e8eee2;
		align-items: center;
		justify-content: center;
	}

	.bohemcars-about-location-card img {
		width: 19px;
		height: 19px;
		opacity: 0.82;
		filter: brightness(0) saturate(100%);
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
		color: #5f7d18;
	}

	.bohemcars-about-location__map {
		position: relative;
		min-height: 420px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 16px;
		background: #eef2ec;
		box-shadow: 0 22px 54px rgb(20 33 15 / 0.12);
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
		border: 1px solid rgb(255 255 255 / 0.65);
		border-radius: 14px;
		background: rgb(255 255 255 / 0.9);
		padding: 12px 15px;
		gap: 12px;
		align-items: center;
		box-shadow: 0 12px 30px rgb(20 33 15 / 0.18);
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
		right: 18px;
		bottom: 18px;
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 9px;
		border-radius: 999px;
		background: linear-gradient(150deg, #24380f, #16240e);
		padding: 0 20px;
		color: #ffffff;
		font-size: 14px;
		font-weight: 700;
		box-shadow: 0 12px 28px rgb(20 33 15 / 0.32);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.bohemcars-about-location__map-link:hover {
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 16px 34px rgb(20 33 15 / 0.4);
	}

	@media (max-width: 991px) {
		.bohemcars-about-location__shell {
			grid-template-columns: 1fr;
		}

		.bohemcars-about-location__copy {
			max-width: 720px;
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

		.bohemcars-about-location h2 {
			font-size: 28px;
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
