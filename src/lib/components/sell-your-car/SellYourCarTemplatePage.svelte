<script lang="ts">
	import { Camera } from '@lucide/svelte';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroPageBanner } from '$lib/auxero/page-banner';
	import type {
		AuxeroSellCarFormData,
		AuxeroSellCarMobileCopy,
		AuxeroSellCarMobileStep,
		AuxeroSellCarStep
	} from '$lib/auxero/sell-your-car';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import SellCarForm from './SellCarForm.svelte';
	import SellCarWizard from './SellCarWizard.svelte';
	import SellYourCarMobilePage from './SellYourCarMobilePage.svelte';

	let {
		form,
		hero,
		mobileCopy,
		mobileSteps,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml,
		steps
	}: {
		form: AuxeroSellCarFormData;
		hero: AuxeroPageBanner;
		mobileCopy: AuxeroSellCarMobileCopy;
		mobileSteps: AuxeroSellCarMobileStep[];
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
		steps: AuxeroSellCarStep[];
	} = $props();

	let wizardOpen = $state(false);
</script>

<div class="bohemcars-sell-desktop-route">
	<AuxeroPublicShell
		copy={shellCopy}
		footer={shellFooter}
		header={shellHeader}
		modals={shellModals}
		{pageDocument}
		runtimeHtml={shellRuntimeHtml}
		title="Продай автомобила си — Bohemcars"
	>
		<PageBanner banner={hero} />
		<section class="bohemcars-sell-page background-light py-100">
			<div class="container">
				<div class="lg-grid-cols-1 grid grid-cols-2 gap-30">
					<div class="bohemcars-sell-page__steps">
						<p class="text-highlight font-weight-600 mb-8">Процес</p>
						<h2 class="mb-18">Как Bohemcars подготвя продажбата</h2>
						<div class="grid grid-cols-1 gap-16">
							{#each steps as step, index (step.title)}
								<div
									class={[
										'sell-your-car-box bohemcars-sell-step radius-16 bg-white',
										index === 0 && 'active-step'
									]}
								>
									<span>{index + 1}</span>
									<div>
										<p class="h6 mb-4">{step.title}</p>
										<p class="text-secondary">{step.text}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
					<div class="bohemcars-sell-page__form radius-20 bg-white">
						{#if wizardOpen}
							<SellCarWizard onclose={() => (wizardOpen = false)} />
						{:else}
							<p class="h3 mb-8">Заяви преглед</p>
							<p class="text-secondary mb-24">
								Данните остават локално в прототипа и подготвят разговор с екипа.
							</p>
							<SellCarForm {form} />
							<button
								class="bohemcars-sell-page__wizard-cta"
								type="button"
								onclick={() => (wizardOpen = true)}
							>
								<Camera size={17} strokeWidth={2.2} aria-hidden="true" />
								Добави снимки и детайли — по-точна оферта
							</button>
						{/if}
					</div>
				</div>
			</div>
		</section>
	</AuxeroPublicShell>
</div>

<div class="bohemcars-sell-mobile-route">
	<SellYourCarMobilePage copy={mobileCopy} {form} steps={mobileSteps} />
</div>

<style>
	.bohemcars-sell-mobile-route {
		display: none;
	}

	.bohemcars-sell-page {
		background: var(--bc-bg) !important;
	}

	.bohemcars-sell-page__form {
		height: fit-content;
		border: 1px solid var(--bc-border);
		padding: 28px;
	}

	@media (min-width: 768px) {
		/* The theme's #wrapper overflow:hidden kills position:sticky;
		   clip contains identically without creating a scroll container. */
		:global(body.auxero-template-sell-your-car-html #wrapper) {
			overflow: clip !important;
		}

		/* The form is shorter than the four step cards — sticky keeps it
		   beside them instead of leaving a void next to steps 3-4. */
		.bohemcars-sell-page__form {
			position: sticky;
			/* Clears the 94px fixed scroll-header with breathing room. */
			top: 110px;
		}
	}

	.bohemcars-sell-step {
		display: grid;
		grid-template-columns: 44px 1fr;
		gap: 14px;
		border: 1px solid var(--bc-border);
		padding: 18px;
	}

	.bohemcars-sell-step span {
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border-radius: 999px;
		background: #d9f275;
		color: #14210f;
		font-weight: 700;
	}

	/* Quiet "add" affordance — dashed border signals the optional deep path. */
	.bohemcars-sell-page__wizard-cta {
		display: flex;
		width: 100%;
		min-height: 46px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 14px;
		border: 1px dashed #c9d3c2;
		border-radius: 8px;
		background: transparent;
		color: #3a540e;
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		padding: 0 12px;
	}

	.bohemcars-sell-page__wizard-cta:hover,
	.bohemcars-sell-page__wizard-cta:focus-visible {
		background: rgba(143, 202, 26, 0.1);
		outline: 0;
	}

	.bohemcars-sell-page__wizard-cta :global(svg),
	.bohemcars-sell-page__wizard-cta :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	@media (max-width: 767.98px) {
		:global(body[class*='auxero-template-'] #wrapper) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		.bohemcars-sell-desktop-route {
			display: none;
		}

		.bohemcars-sell-mobile-route {
			display: block;
		}
	}
</style>
