<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import { importRequestSteps } from '$lib/auxero/services';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import ServiceFormCard from './ServiceFormCard.svelte';

	let {
		afterImportHtml,
		beforeImportHtml,
		form,
		pageDocument
	}: {
		afterImportHtml: string;
		beforeImportHtml: string;
		form: AuxeroServiceFormData;
		pageDocument: AuxeroPageDocument;
	} = $props();

	const banner = {
		description:
			'Изпрати конкретна обява, VIN или кратко описание. Bohemcars ще провери дали автомобилът си струва преди да поемеш ангажимент.',
		eyebrow: 'Bohemcars внос',
		image: '/assets/bohemcars/services/import-canada-banner-generated.png',
		title: 'Проверка за внос от Канада'
	};
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeImportHtml} afterHtml={afterImportHtml}>
	<div class="bohemcars-import-page" data-bohemcars-import>
		<PageBanner {banner} />

		<section class="background-light py-100">
			<div class="container">
				<div class="lg-grid-cols-1 grid grid-cols-2 gap-30">
					<div class="bohemcars-import-page__copy">
						<p class="bohemcars-import-page__eyebrow">Бърза проверка</p>
						<h2>Първо изпрати линка. После решаваме дали има смисъл.</h2>
						<p class="text-secondary">
							Този поток е за автомобили, които си намерил в канадска обява, търг, дилър или
							marketplace. Не е нужно да попълваш всичко веднага: линк или VIN са достатъчни за
							първи преглед.
						</p>

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
</AuxeroPageShell>

<style>
	.bohemcars-import-page {
		background: #ffffff;
	}

	.bohemcars-import-page__copy {
		align-self: start;
	}

	.bohemcars-import-page__eyebrow {
		margin: 0 0 8px;
		color: var(--primary);
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0;
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

	.bohemcars-import-page__copy > p:not(.bohemcars-import-page__eyebrow) {
		max-width: 650px;
		margin-bottom: 28px;
		font-size: 17px;
		line-height: 1.62;
	}

	.bohemcars-import-page__steps {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.bohemcars-import-page__steps article {
		border: 1px solid #dce3dc;
		border-radius: 8px;
		background: #ffffff;
		padding: 18px;
	}

	.bohemcars-import-page__steps article:hover {
		background: #f8fbef;
	}

	.bohemcars-import-page__steps span {
		display: block;
		margin-bottom: 8px;
		color: var(--primary);
		font-size: 11px;
		font-weight: 900;
		line-height: 14px;
		text-transform: uppercase;
	}

	.bohemcars-import-page__steps h3 {
		margin: 0 0 8px;
		color: #111111;
		font-size: 18px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 23px;
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

	@media (max-width: 767px) {
		.bohemcars-import-page__copy h2 {
			font-size: 30px;
		}

		.bohemcars-import-page__copy > p:not(.bohemcars-import-page__eyebrow) {
			font-size: 15px;
			line-height: 1.55;
		}
	}
</style>
