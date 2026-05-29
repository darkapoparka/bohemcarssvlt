<script lang="ts">
	import type { AuxeroContactFormData } from '$lib/auxero/contact';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import ContactFormCard from './ContactFormCard.svelte';

	let {
		afterContactFormHtml,
		beforeContactFormHtml,
		form,
		pageDocument
	}: {
		afterContactFormHtml: string;
		beforeContactFormHtml: string;
		form: AuxeroContactFormData;
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeContactFormHtml} afterHtml={afterContactFormHtml}>
	<ContactFormCard {form} />
</AuxeroPageShell>

<style>
	:global(.bohemcars-contact-map) {
		position: relative;
		min-height: 520px;
		background:
			linear-gradient(90deg, rgb(0 0 0 / 0.72), rgb(0 0 0 / 0.34)),
			url('/assets/bohemcars/hero/home-05-showroom-exterior.webp') center / cover;
	}

	:global(.bohemcars-contact-map iframe) {
		position: absolute;
		inset: 0;
		z-index: 1;
		height: 100%;
		opacity: 0.5;
	}

	:global(.bohemcars-contact-map__overlay) {
		position: relative;
		z-index: 2;
		display: flex;
		width: min(100% - 30px, 1245px);
		margin: 0 auto;
		padding: 84px 0;
		color: #fff;
		flex-direction: column;
		justify-content: center;
		pointer-events: none;
	}

	:global(.bohemcars-contact-map__overlay h1) {
		max-width: 650px;
		margin-bottom: 16px;
		color: #fff;
		font-size: 56px;
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.05;
	}

	:global(.bohemcars-contact-map__overlay p) {
		max-width: 560px;
		color: rgb(255 255 255 / 0.84);
		font-size: 18px;
		line-height: 1.55;
	}

	:global(.bohemcars-contact-map__eyebrow) {
		margin-bottom: 12px;
		color: var(--primary) !important;
		font-size: 14px !important;
		font-weight: 700;
		line-height: 1.2 !important;
		text-transform: uppercase;
	}

	:global(.bohemcars-contact-map__actions) {
		display: flex;
		margin-top: 26px;
		gap: 12px;
		flex-wrap: wrap;
		pointer-events: auto;
	}

	@media (max-width: 991px) {
		:global(.bohemcars-contact-map__overlay h1) {
			font-size: 44px;
		}
	}

	@media (max-width: 575px) {
		:global(.bohemcars-contact-map),
		:global(.bohemcars-contact-map__overlay) {
			min-height: 460px;
		}

		:global(.bohemcars-contact-map__overlay h1) {
			font-size: 36px;
		}

		:global(.bohemcars-contact-map__overlay p) {
			font-size: 16px;
		}
	}
</style>
