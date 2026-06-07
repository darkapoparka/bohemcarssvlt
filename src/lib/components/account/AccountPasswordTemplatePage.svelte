<script lang="ts">
	import type { AuxeroAccountPasswordFormData } from '$lib/auxero/account-forms';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AccountPasswordForm from './AccountPasswordForm.svelte';

	let {
		afterPasswordHtml,
		beforePasswordHtml,
		pageDocument,
		password,
		passwordHtml
	}: {
		afterPasswordHtml: string;
		beforePasswordHtml: string;
		pageDocument: AuxeroPageDocument;
		password: AuxeroAccountPasswordFormData;
		passwordHtml?: string;
	} = $props();
</script>

<AuxeroDashboardSlotShell
	{pageDocument}
	beforeHtml={beforePasswordHtml}
	afterHtml={afterPasswordHtml}
>
	{#if passwordHtml}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html passwordHtml}
	{:else}
		<AccountPasswordForm {password} />
	{/if}
</AuxeroDashboardSlotShell>
