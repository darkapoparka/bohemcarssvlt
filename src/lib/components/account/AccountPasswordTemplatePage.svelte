<script lang="ts">
	import type { AuxeroAccountPasswordFormData } from '$lib/auxero/account-forms';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AccountPasswordForm from './AccountPasswordForm.svelte';

	let {
		afterPasswordHtml,
		beforePasswordHtml,
		pageDocument,
		password
	}: {
		afterPasswordHtml: string;
		beforePasswordHtml: string;
		pageDocument: AuxeroPageDocument;
		password: AuxeroAccountPasswordFormData;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforePasswordHtml} afterHtml={afterPasswordHtml}>
	<AccountPasswordForm {password} />
</AuxeroPageShell>
