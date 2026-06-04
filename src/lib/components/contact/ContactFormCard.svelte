<script lang="ts">
	import type { AuxeroContactFormData } from '$lib/auxero/contact';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';

	let { form }: { form: AuxeroContactFormData } = $props();

	const fields: InquiryFormField[] = $derived([
		...form.fields.map((field) => ({
			...field,
			kind: 'input' as const,
			required: true,
			wrapperClass: 'md-col-span-2 padding-0'
		})),
		{
			className: 'message',
			id: 'message',
			kind: 'textarea',
			label: form.messageLabel,
			name: 'message',
			placeholder: form.messagePlaceholder,
			required: true,
			rows: 3,
			wrapperClass: 'padding-0 col-span-2'
		}
	]);
</script>

<div class="radius-20 contact-page-form bg-white">
	<p class="h3 mb-12">{form.title}</p>
	<p class="text-body-style-2 mb-32">{form.subtitle}</p>

	<InquiryForm
		{fields}
		formClass="bohemcars-contact-form"
		gridClass="md-grid-cols-1 mb-22 grid grid-cols-2 gap-x-20 gap-y-24"
		showEmptyStatus={false}
		statusMessage="Съобщението е подготвено локално за Bohemcars"
		submitLabel={form.submitLabel}
	/>
</div>

<style>
	.contact-page-form {
		padding: 30px;
		border: 1px solid var(--bc-border);
		background: var(--bc-surface) !important;
	}

	.contact-page-form :global(input),
	.contact-page-form :global(textarea) {
		border: 0 !important;
		background: #ffffff !important;
		box-shadow: 0 0 0 1px var(--bc-border) !important;
	}

	.contact-page-form :global(input) {
		height: 50px;
		border-radius: 12px;
		padding: 10px 16px;
	}

	.contact-page-form :global(textarea) {
		min-height: 172px;
		border-radius: 8px;
		padding: 14px 16px;
		resize: vertical;
	}

	.contact-page-form :global(input:focus),
	.contact-page-form :global(input.active),
	.contact-page-form :global(textarea:focus),
	.contact-page-form :global(textarea.active) {
		background: #ffffff !important;
		box-shadow: 0 0 0 2px #50611d !important;
	}

	@media (max-width: 767px) {
		.contact-page-form {
			padding: 24px 18px;
		}
	}
</style>
