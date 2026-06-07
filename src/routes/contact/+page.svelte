<script lang="ts">
	import ContactTemplatePage from '$lib/components/contact/ContactTemplatePage.svelte';

	let { data } = $props();
</script>

<ContactTemplatePage
	form={data.form}
	info={data.info}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
