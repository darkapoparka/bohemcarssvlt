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
			url('/assets/bohemcars/proof-studio-import-handoff.png') center / cover;
	}

	:global(body.auxero-template-contact-us-html section.bg-white.pb-84 > .container) {
		position: relative;
		z-index: 2;
		margin-top: -94px !important;
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

		:global(body.auxero-template-contact-us-html .contact-page-info) {
			margin-bottom: 28px;
		}
	}
</style>
