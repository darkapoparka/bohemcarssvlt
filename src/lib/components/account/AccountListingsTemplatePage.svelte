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
