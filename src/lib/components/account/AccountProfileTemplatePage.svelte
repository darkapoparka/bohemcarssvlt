<script lang="ts">
	import type { AuxeroAccountProfileFormData } from '$lib/auxero/account-forms';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AccountProfileForm from './AccountProfileForm.svelte';

	let {
		afterProfileHtml,
		beforeProfileHtml,
		pageDocument,
		profile
	}: {
		afterProfileHtml: string;
		beforeProfileHtml: string;
		pageDocument: AuxeroPageDocument;
		profile: AuxeroAccountProfileFormData;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeProfileHtml} afterHtml={afterProfileHtml}>
	<AccountProfileForm {profile} />
</AuxeroPageShell>
