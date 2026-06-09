<script lang="ts">
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroContactFormData, AuxeroContactPageInfo } from '$lib/auxero/contact';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import ContactFormCard from './ContactFormCard.svelte';

	let {
		form,
		info,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		form: AuxeroContactFormData;
		info: AuxeroContactPageInfo;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();

	const externalHref = (href: string) => ({ href });
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title="Контакти — Bohemcars"
>
	<section class="bg-white pb-84">
		<div class="contact-page container">
			<div class="grid grid-cols-2 gap-30">
				<div class="contact-page-info radius-20 bg-white">
					<p class="text-highlight font-weight-600 mb-8">{info.eyebrow}</p>
					<h1 class="h2 mb-12">{info.title}</h1>
					<p class="h7 line-height-28">{info.description}</p>

					<div class="contact mb-22 flex items-start gap-12">
						<div class="icon"><img src="/assets/icons/MapPin.svg" alt="office" /></div>
						<div>
							<p class="h5 mb-4">{info.officeLabel}</p>
							<span>{info.workNote}</span>
						</div>
					</div>
					<div class="contact mb-22 flex items-start gap-12">
						<div class="icon"><img src="/assets/icons/PhoneCall.svg" alt="phone" /></div>
						<div class="flex flex-col gap-4">
							<a {...externalHref(info.phoneHref)}>{info.phoneLabel}</a>
							<a {...externalHref(info.secondaryPhoneHref)}>{info.secondaryPhoneLabel}</a>
						</div>
					</div>
					<div class="contact mb-22 flex items-start gap-12">
						<div class="icon"><img src="/assets/icons/input-telegram.svg" alt="email" /></div>
						<a {...externalHref(info.emailHref)}>{info.emailLabel}</a>
					</div>

					<ul class="contact-page-info-social flex items-center gap-10">
						{#each info.socials as social (social.label)}
							<li>
								<a {...externalHref(social.href)} aria-label={social.label}>
									<img src={`/assets/icons/${social.icon}`} alt={social.label} />
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<ContactFormCard {form} />
			</div>

			<div class="widget-gg-map bohemcars-contact-map radius-16 mt-30 flex overflow-hidden">
				<iframe
					title="Bohemcars appointment area"
					src={info.mapSrc}
					height="420"
					style="border:0;width:100%;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</div>
	</section>
</AuxeroPublicShell>

<style>
	:global(.bohemcars-contact-map) {
		display: none !important;
	}

	:global(body.auxero-template-contact-us-html section.bg-white.pb-84) {
		position: relative;
		overflow: hidden;
		background: #111111 !important;
		min-height: calc(100vh - 94px);
		padding: 42px 0 !important;
	}

	:global(body.auxero-template-contact-us-html section.bg-white.pb-84::before) {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
		background:
			linear-gradient(90deg, rgb(0 0 0 / 0.78), rgb(0 0 0 / 0.46)),
			url('/assets/bohemcars/proof-studio-import-handoff.webp') center / cover;
	}

	:global(body.auxero-template-contact-us-html section.bg-white.pb-84 > .container) {
		position: relative;
		z-index: 2;
	}

	:global(body.auxero-template-contact-us-html section.bg-white.pb-84 .row) {
		align-items: flex-start;
	}

	:global(body.auxero-template-contact-us-html .container.contact-page > .grid) {
		align-items: start;
	}

	:global(body.auxero-template-contact-us-html .contact-page-info) {
		max-width: 640px;
		border: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: #ffffff;
		padding-top: 18px;
	}

	:global(body.auxero-template-contact-us-html .contact-page-info h1),
	:global(body.auxero-template-contact-us-html .contact-page-info h2),
	:global(body.auxero-template-contact-us-html .contact-page-info h3),
	:global(body.auxero-template-contact-us-html .contact-page-info h4),
	:global(body.auxero-template-contact-us-html .contact-page-info p),
	:global(body.auxero-template-contact-us-html .contact-page-info a),
	:global(body.auxero-template-contact-us-html .contact-page-info span) {
		color: #ffffff !important;
		text-transform: none !important;
	}

	:global(body.auxero-template-contact-us-html .contact-page-info > p) {
		max-width: 600px;
		margin-bottom: 24px !important;
		color: rgb(255 255 255 / 0.82) !important;
		font-weight: 500;
	}

	:global(body.auxero-template-contact-us-html .contact-page-info .contact .icon),
	:global(body.auxero-template-contact-us-html .contact-page-info-social a) {
		border-color: rgb(255 255 255 / 0.32) !important;
		background: rgb(255 255 255 / 0.12) !important;
	}

	:global(body.auxero-template-contact-us-html .contact-page-info .contact .icon) {
		width: 48px !important;
		min-width: 48px !important;
		height: 48px !important;
		flex: 0 0 48px !important;
	}

	:global(body.auxero-template-contact-us-html .contact-page-info .contact .icon img),
	:global(body.auxero-template-contact-us-html .contact-page-info-social img) {
		filter: brightness(0) invert(1);
	}

	:global(body.auxero-template-contact-us-html .contact-page-info-social svg path) {
		fill: #ffffff !important;
		stroke: #ffffff !important;
	}

	:global(body.auxero-template-contact-us-html .contact-page-info-social a:hover) {
		border-color: var(--primary) !important;
		background: var(--primary) !important;
	}

	:global(body.auxero-template-contact-us-html .contact-page-info .contact) {
		margin-bottom: 22px !important;
	}

	:global(body.auxero-template-contact-us-html .contact-page-info-social) {
		margin-top: 18px !important;
	}

	@media (max-width: 991px) {
		:global(body.auxero-template-contact-us-html section.bg-white.pb-84) {
			padding: 48px 0 64px !important;
		}

		:global(body.auxero-template-contact-us-html .container.contact-page > .grid) {
			grid-template-columns: minmax(0, 1fr) !important;
			gap: 22px !important;
		}

		:global(body.auxero-template-contact-us-html .contact-page-info) {
			margin-bottom: 28px;
		}
	}

	@media (max-width: 767px) {
		:global(body.auxero-template-contact-us-html #wrapper),
		:global(body.auxero-template-contact-us-html section.bg-white.pb-84) {
			background: #111111 !important;
			background-color: #111111 !important;
		}

		:global(body.auxero-template-contact-us-html section.bg-white.pb-84) {
			min-height: auto;
			overflow: hidden;
			padding: 34px 0 92px !important;
		}

		:global(body.auxero-template-contact-us-html section.bg-white.pb-84::before) {
			background:
				linear-gradient(180deg, rgb(0 0 0 / 0.76), rgb(0 0 0 / 0.58)),
				url('/assets/bohemcars/proof-studio-import-handoff.webp') 58% center / cover;
		}

		:global(body.auxero-template-contact-us-html section.bg-white.pb-84 > .container) {
			width: 100% !important;
			max-width: none !important;
			padding-right: 14px !important;
			padding-left: 14px !important;
		}

		:global(body.auxero-template-contact-us-html .container.contact-page > .grid) {
			width: 100%;
			min-width: 0;
			align-items: stretch !important;
			gap: 14px !important;
		}

		:global(body.auxero-template-contact-us-html .contact-page-info) {
			width: 100%;
			max-width: none;
			margin-bottom: 0;
			padding-top: 0;
		}

		:global(body.auxero-template-contact-us-html .contact-page-info .text-highlight) {
			margin-bottom: 7px !important;
			font-size: 12px !important;
			line-height: 16px !important;
		}

		:global(body.auxero-template-contact-us-html .contact-page-info h1) {
			max-width: 330px;
			margin-bottom: 10px !important;
			font-size: 30px !important;
			font-weight: 700 !important;
			line-height: 36px !important;
		}

		:global(body.auxero-template-contact-us-html .contact-page-info > p) {
			max-width: 330px;
			margin-bottom: 20px !important;
			font-size: 16px !important;
			line-height: 24px !important;
		}

		:global(body.auxero-template-contact-us-html .contact-page-info .contact) {
			gap: 10px !important;
			margin-bottom: 14px !important;
		}

		:global(body.auxero-template-contact-us-html .contact-page-info .contact .icon) {
			width: 42px !important;
			min-width: 42px !important;
			height: 42px !important;
			flex-basis: 42px !important;
		}

		:global(body.auxero-template-contact-us-html .contact-page-info .contact p),
		:global(body.auxero-template-contact-us-html .contact-page-info .contact a),
		:global(body.auxero-template-contact-us-html .contact-page-info .contact span) {
			font-size: 16px !important;
			line-height: 22px !important;
		}

		:global(body.auxero-template-contact-us-html .contact-page-info .contact a) {
			display: inline-flex;
			width: fit-content;
			align-items: center;
			min-height: 44px;
		}

		:global(body.auxero-template-contact-us-html .contact-page-info-social) {
			margin-top: 12px !important;
		}
	}
</style>
