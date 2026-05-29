<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroServiceFormData, AuxeroServicesContent } from '$lib/auxero/services';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
	import ServiceFormCard from './ServiceFormCard.svelte';

	let {
		form,
		services
	}: {
		form: AuxeroServiceFormData;
		services: AuxeroServicesContent;
	} = $props();

	const externalHref = (href: string) => ({ href });
</script>

<div class="bohemcars-services-page" data-bohemcars-services>
	<PageBanner banner={services.hero} />

	<section class="background-light py-100">
		<div class="container">
			<div class="title-section mb-40">
				<div>
					<h2>{services.cardsTitle}</h2>
					<p class="bohemcars-services-page__lead text-secondary">{services.cardsDescription}</p>
				</div>
				<a
					href={resolve('/contact')}
					class="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">Свържи се</a
				>
			</div>
			<div class="lg-grid-cols-2 md-grid-cols-1 grid grid-cols-3 gap-30">
				{#each services.cards as service, index (service.title)}
					<div
						class="service-box bohemcars-service-card wow fadeInUp"
						data-wow-delay={`0.${(index % 3) + 1}s`}
					>
						<div class="bohemcars-service-card__media radius-16 mb-22 overflow-hidden">
							<img class="w-full" src={service.image} alt={service.title} />
						</div>
						<a href={resolve(service.href as '/')} class="h4 font-weight-600 mb-8 capitalize"
							>{service.title}</a
						>
						<p class="text-secondary">{service.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bohemcars-services-contact relative py-100">
		<div class="overlay-parallax"></div>
		<div class="overlay image">
			<img
				class="lazyload parallax"
				data-src="/assets/bohemcars/proof-studio-import-handoff.png"
				src="/assets/bohemcars/proof-studio-import-handoff.png"
				alt="Bohemcars service support"
			/>
		</div>
		<div class="index-10 relative container">
			<div class="lg-grid-cols-1 grid grid-cols-2 gap-30">
				<div class="services-center-info">
					<h2 class="mb-12 text-white">{services.contact.title}</h2>
					<p class="h7 line-height-28 font-weight-500 mb-28 text-white">
						{services.contact.description}
					</p>
					<ul class="list mb-32">
						{#each services.contact.checklist as item (item)}
							<li
								class="md-items-start font-weight-500 h7 mb-8 flex items-center gap-12 text-white"
							>
								<img src="/assets/icons/check-white.svg" alt="check" />
								{item}
							</li>
						{/each}
					</ul>
					<div class="divider-vertical-style4 mb-40"></div>
					<ul class="lg-grid-cols-1 grid grid-cols-2 gap-12">
						<li class="contact gap-12">
							<div class="icon"><img src="/assets/icons/PhoneCall-2.svg" alt="phone" /></div>
							<div class="flex flex-col gap-4">
								<p class="text-muted text-sm">Bohemcars</p>
								<a {...externalHref(services.contact.phoneHref)} class="text-sm text-white">
									{services.contact.phoneLabel}
								</a>
								<a
									{...externalHref(services.contact.secondaryPhoneHref)}
									class="text-sm text-white"
								>
									{services.contact.secondaryPhoneLabel}
								</a>
							</div>
						</li>
						<li class="contact gap-12">
							<div class="icon"><img src="/assets/icons/Alarm.svg" alt="hours" /></div>
							<div class="flex flex-col gap-4">
								<p class="text-muted text-sm">Работно време</p>
								<span class="text-sm text-white">{services.contact.workNote}</span>
								<span class="text-sm text-white">{services.contact.emailLabel}</span>
							</div>
						</li>
					</ul>
				</div>
				<ServiceFormCard {form} />
			</div>
		</div>
	</section>
</div>

<style>
	.bohemcars-services-page {
		background: #fff;
	}

	.bohemcars-services-page__lead {
		max-width: 620px;
		margin-top: 10px;
		line-height: 1.65;
	}

	.bohemcars-service-card {
		height: 100%;
	}

	.bohemcars-service-card:hover {
		background: #f8fbef;
		border-color: var(--primary);
	}

	.bohemcars-service-card__media {
		aspect-ratio: 16 / 9;
		background: #f7f7f7;
	}

	.bohemcars-service-card__media img {
		height: 100%;
		object-fit: cover;
	}

	.bohemcars-services-contact {
		overflow: hidden;
		background: #111;
	}

	.bohemcars-services-contact :global(.overlay-parallax) {
		background: rgb(0 0 0 / 0.62);
	}

	.bohemcars-services-contact :global(.services-center-form) {
		align-self: start;
	}

	@media (max-width: 767px) {
		.bohemcars-services-page :global(.title-section) {
			align-items: flex-start;
			flex-direction: column;
			gap: 18px;
		}
	}
</style>
