<script lang="ts">
	import type { AuxeroAccountListingsData } from '$lib/auxero/account-listings';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AccountListingsTable from './AccountListingsTable.svelte';

	let {
		afterListingsHtml,
		beforeListingsHtml,
		listings,
		pageDocument
	}: {
		afterListingsHtml: string;
		beforeListingsHtml: string;
		listings: AuxeroAccountListingsData;
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeListingsHtml} afterHtml={afterListingsHtml}>
	<AccountListingsTable {listings} />
</AuxeroPageShell>

<style>
	@media (max-width: 767.98px) {
		:global(body.auxero-template-my-listings-html),
		:global(body.auxero-template-my-listings-html #wrapper),
		:global(body.auxero-template-my-listings-html .dashboard-container),
		:global(body.auxero-template-my-listings-html .dashboard-content) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		:global(body.auxero-template-my-listings-html .dashboard-content--inner) {
			padding: 18px 14px 92px !important;
		}

		:global(body.auxero-template-my-listings-html .dashboard-content--inner > .h3) {
			margin-bottom: 18px !important;
			font-size: 30px !important;
			font-weight: 800 !important;
			line-height: 36px !important;
		}

		:global(body.auxero-template-my-listings-html .dashboard-toggle-btn) {
			min-height: 46px !important;
			border: 1px solid var(--bc-border) !important;
			border-radius: 8px !important;
			background: var(--bc-control) !important;
			box-shadow: none !important;
			color: #1c1c1c !important;
			padding: 0 18px !important;
			font-size: 15px !important;
			line-height: 20px !important;
		}

		:global(body.auxero-template-my-listings-html .dashboard-toggle-btn:hover) {
			background: var(--bc-control-hover) !important;
		}

		:global(body.auxero-template-my-listings-html .dashboard-box) {
			border: 1px solid var(--bc-border) !important;
			border-radius: 8px !important;
			background: var(--bc-surface) !important;
			padding: 14px !important;
		}
	}
</style>
