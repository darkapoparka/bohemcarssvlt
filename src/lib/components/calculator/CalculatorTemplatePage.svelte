<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroCalculatorBudgetLink, AuxeroCalculatorData } from '$lib/auxero/calculator';
	import type { AuxeroFaq } from '$lib/auxero/faqs';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import FaqAccordion from '$lib/components/faqs/FaqAccordion.svelte';
	import CalculatorEstimator from './CalculatorEstimator.svelte';

	let {
		budgetLinks,
		calculator,
		faqs,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		budgetLinks: AuxeroCalculatorBudgetLink[];
		calculator: AuxeroCalculatorData;
		faqs: AuxeroFaq[];
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title="Калкулатор за внос — Bohemcars"
>
	<div data-bohemcars-calculator-page>
		<section class="pb-100">
			<div class="tf-spacing-style3"></div>
			<div class="container">
				<h1 class="h2 mb-12 text-center">Калкулатор за внос</h1>
				<p class="h7 line-height-28 text-secondary mb-40 text-center">
					Изчисли ориентировъчна крайна цена за автомобил от Канада преди точна разбивка от
					Bohemcars.
				</p>
				<CalculatorEstimator {calculator} />
			</div>
			<div class="tf-spacing"></div>
			<h2 class="mb-40 text-center capitalize">Разгледай по бюджет</h2>
			<div class="container">
				<div
					class="lg-grid-cols-3 md-grid-cols-2 smb-grid-cols-1 padding-box-20 mb-40 grid grid-cols-5 gap-20"
				>
					{#each budgetLinks as link (`${link.href}-${link.label}-${link.price}`)}
						<div class="price-box">
							<a
								href={resolve(link.href as '/inventory')}
								class="h7 font-weight-500 text-underline mb-8"
							>
								{link.label}
							</a>
							<p class="h4">{link.price}</p>
						</div>
					{/each}
				</div>
				<div class="flex justify-center">
					<a
						href={resolve('/inventory')}
						class="btn btn-line-hover effect-line-primary btn-large font-weight-600 hover-fill-white"
					>
						Виж наличните
					</a>
				</div>
			</div>
		</section>
		<section class="background-light py-100">
			<div class="container">
				<h2 class="mb-40 text-center">Въпроси за калкулатора</h2>
				<div class="max-width-930 mx-auto w-full">
					<FaqAccordion items={faqs} forceWhite />
				</div>
			</div>
		</section>
	</div>
</AuxeroPublicShell>

<style>
	@media (max-width: 767.98px) {
		:global(body.auxero-template-calculator-html #wrapper),
		:global(body.auxero-template-calculator-html [data-bohemcars-calculator-page]) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		:global(body.auxero-template-calculator-html [data-bohemcars-calculator-page] > section) {
			padding-top: 26px !important;
			padding-bottom: 92px !important;
		}

		:global(
			body.auxero-template-calculator-html
				[data-bohemcars-calculator-page]
				> section.background-light
		) {
			padding-top: 34px !important;
			padding-bottom: 92px !important;
		}

		:global(body.auxero-template-calculator-html [data-bohemcars-calculator-page] .tf-spacing),
		:global(
			body.auxero-template-calculator-html [data-bohemcars-calculator-page] .tf-spacing-style3
		) {
			display: none !important;
		}

		:global(body.auxero-template-calculator-html [data-bohemcars-calculator-page] .container) {
			width: 100% !important;
			max-width: none !important;
			padding-right: 14px !important;
			padding-left: 14px !important;
		}

		:global(body.auxero-template-calculator-html [data-bohemcars-calculator-page] h1) {
			margin-bottom: 8px !important;
			color: #111111 !important;
			font-size: 28px !important;
			font-weight: 700 !important;
			line-height: 34px !important;
			text-align: left !important;
		}

		:global(body.auxero-template-calculator-html [data-bohemcars-calculator-page] h1 + p) {
			margin-bottom: 18px !important;
			font-size: 16px !important;
			font-weight: 500 !important;
			line-height: 24px !important;
			text-align: left !important;
		}

		:global(body.auxero-template-calculator-html [data-bohemcars-calculator-page] h2) {
			margin: 28px 14px 14px !important;
			color: #111111 !important;
			font-size: 24px !important;
			font-weight: 700 !important;
			line-height: 30px !important;
			text-align: left !important;
		}

		:global(body.auxero-template-calculator-html [data-bohemcars-calculator-page] .price-box) {
			position: relative !important;
			border-radius: 8px !important;
			background: #ffffff !important;
			padding: 14px !important;
		}

		:global(
			body.auxero-template-calculator-html
				[data-bohemcars-calculator-page]
				.lg-grid-cols-3.md-grid-cols-2.smb-grid-cols-1
		) {
			display: grid !important;
			grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
			gap: 10px !important;
			margin-bottom: 18px !important;
			padding: 0 !important;
		}

		:global(body.auxero-template-calculator-html [data-bohemcars-calculator-page] .price-box a) {
			font-size: 14px !important;
			line-height: 18px !important;
		}

		/* Stretch the budget-link hit area to the whole card (was a 17px-tall tap target). */
		:global(
			body.auxero-template-calculator-html [data-bohemcars-calculator-page] .price-box a
		)::after {
			content: '';
			position: absolute;
			inset: 0;
		}

		:global(body.auxero-template-calculator-html [data-bohemcars-calculator-page] .price-box p) {
			font-size: 18px !important;
			line-height: 23px !important;
		}

		:global(
			body.auxero-template-calculator-html [data-bohemcars-calculator-page] .flex.justify-center
		) {
			justify-content: stretch !important;
		}

		:global(
			body.auxero-template-calculator-html
				[data-bohemcars-calculator-page]
				.flex.justify-center
				.btn
		) {
			width: 100%;
			border-radius: 8px !important;
		}
	}
</style>
