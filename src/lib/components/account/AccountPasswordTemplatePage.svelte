<script lang="ts">
	import type { AuxeroAccountPasswordFormData } from '$lib/auxero/account-forms';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
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

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforePasswordHtml}
<AccountPasswordForm {password} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterPasswordHtml}
