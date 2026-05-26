<script lang="ts">
	import ContactTemplatePage from '$lib/components/contact/ContactTemplatePage.svelte';

	let { data } = $props();
</script>

<ContactTemplatePage
	afterContactFormHtml={data.afterContactFormHtml}
	beforeContactFormHtml={data.beforeContactFormHtml}
	form={data.form}
	pageDocument={data.pageDocument}
/>
