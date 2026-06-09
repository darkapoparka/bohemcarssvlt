<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import { importRequestSteps } from '$lib/auxero/services';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import ImportRequestMobilePage from './ImportRequestMobilePage.svelte';
	import ServiceFormCard from './ServiceFormCard.svelte';

	let {
		form,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		form: AuxeroServiceFormData;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();

	const banner = {
		description: 'Изпрати линк или VIN. Проверяваме автомобила преди да поемеш ангажимент.',
		eyebrow: 'Bohemcars внос',
		image: '/assets/bohemcars/services/import-canada-banner-generated.webp',
		title: 'Внос от Канада'
	};
</script>

<div class="bohemcars-import-desktop-route">
	<AuxeroPublicShell
		copy={shellCopy}
		footer={shellFooter}
		header={shellHeader}
		modals={shellModals}
		{pageDocument}
		runtimeHtml={shellRuntimeHtml}
		title="Внос от Канада — Bohemcars"
	>
		<div class="bohemcars-import-page" data-bohemcars-import>
			<PageBanner {banner} />

			<section class="background-light py-100">
				<div class="container">
					<div class="lg-grid-cols-1 grid grid-cols-2 gap-30">
						<div class="bohemcars-import-page__copy">
							<p class="bohemcars-import-page__eyebrow">Бърза проверка</p>
							<h2>Изпрати линк или VIN</h2>

							<div class="bohemcars-import-page__steps">
								{#each importRequestSteps as step, index (step.title)}
									<article>
										<span>Стъпка {index + 1}</span>
										<h3>{step.title}</h3>
										<p>{step.text}</p>
									</article>
								{/each}
							</div>
						</div>

						<ServiceFormCard {form} />
					</div>
				</div>
			</section>
		</div>
	</AuxeroPublicShell>
</div>

<div class="bohemcars-import-mobile-route">
	<ImportRequestMobilePage {form} />
</div>

<style>
	.bohemcars-import-mobile-route {
		display: none;
	}

	.bohemcars-import-page {
		background: var(--bc-bg);
	}

	.bohemcars-import-page :global(.background-light) {
		background: var(--bc-bg) !important;
	}

	.bohemcars-import-page__copy {
		align-self: start;
	}

	.bohemcars-import-page__eyebrow {
		margin: 0 0 8px;
		color: var(--primary);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-import-page__copy h2 {
		max-width: 620px;
		margin: 0 0 16px;
		color: #111111;
		font-size: clamp(34px, 4vw, 52px);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.08;
	}

	.bohemcars-import-page__steps {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.bohemcars-import-page__steps article {
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 18px;
	}

	.bohemcars-import-page__steps article:hover {
		background: var(--bc-surface-hover);
	}

	.bohemcars-import-page__steps span {
		display: block;
		margin-bottom: 8px;
		color: var(--primary);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-import-page__steps h3 {
		margin: 0 0 8px;
		color: #111111;
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 24px;
	}

	.bohemcars-import-page__steps p {
		margin: 0;
		color: #5f5f5f;
		font-size: 14px;
		line-height: 21px;
	}

	.bohemcars-import-page :global(.services-center-form) {
		align-self: start;
	}

	@media (max-width: 991px) {
		.bohemcars-import-page__steps {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 767.98px) {
		:global(body[class*='auxero-template-'] #wrapper) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		.bohemcars-import-desktop-route {
			display: none;
		}

		.bohemcars-import-mobile-route {
			display: block;
		}
	}
</style>
