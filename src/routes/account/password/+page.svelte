<script lang="ts">
	import AccountPasswordTemplatePage from '$lib/components/account/AccountPasswordTemplatePage.svelte';

	let { data } = $props();
</script>

<AccountPasswordTemplatePage
	afterPasswordHtml={data.afterPasswordHtml}
	beforePasswordHtml={data.beforePasswordHtml}
	pageDocument={data.pageDocument}
	password={data.password}
/>
