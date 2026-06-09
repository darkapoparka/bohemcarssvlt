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
	<p class="h3 mb-8">{form.title}</p>
	<p class="text-body-style-2 mb-22">{form.subtitle}</p>

	<InquiryForm
		{fields}
		formClass="bohemcars-contact-form"
		gridClass="md-grid-cols-1 mb-16 grid grid-cols-2 gap-x-18 gap-y-16"
		showEmptyStatus={false}
		statusMessage="Съобщението е подготвено локално за Bohemcars"
		submitLabel={form.submitLabel}
	/>
</div>

<style>
	.contact-page-form {
		width: 100%;
		min-width: 0;
		height: fit-content;
		border: 1px solid var(--bc-border);
		background: var(--bc-surface) !important;
		padding: 24px;
		align-self: start;
	}

	.contact-page-form > :global(.h3) {
		font-size: 30px;
		line-height: 1.16;
	}

	.contact-page-form :global(input),
	.contact-page-form :global(textarea) {
		border: 0 !important;
		background: #ffffff !important;
		box-shadow: 0 0 0 1px var(--bc-border) !important;
	}

	.contact-page-form :global(input) {
		height: 44px;
		border-radius: 12px;
		padding: 8px 16px;
	}

	.contact-page-form :global(textarea) {
		height: 104px !important;
		min-height: 104px;
		border-radius: 8px;
		padding: 12px 16px;
		resize: vertical;
	}

	.contact-page-form :global(.bohemcars-contact-form p) {
		margin-bottom: 6px !important;
	}

	.contact-page-form :global(.bohemcars-contact-form button) {
		height: 48px;
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
			border-radius: 8px;
			padding: 17px;
		}

		.contact-page-form > :global(.h3) {
			font-size: 24px;
			line-height: 30px;
		}

		.contact-page-form > :global(.text-body-style-2) {
			margin-bottom: 16px !important;
			font-size: 14px !important;
			line-height: 22px !important;
		}

		.contact-page-form :global(.bohemcars-contact-form > div) {
			grid-template-columns: minmax(0, 1fr) !important;
			gap: 12px !important;
		}

		.contact-page-form :global(.bohemcars-contact-form > div > div) {
			grid-column: auto !important;
			min-width: 0;
		}

		.contact-page-form :global(.bohemcars-contact-form p) {
			font-size: 14px !important;
			font-weight: 600 !important;
			line-height: 18px !important;
		}

		.contact-page-form :global(input),
		.contact-page-form :global(textarea) {
			width: 100%;
			font-size: 16px !important;
			line-height: 22px !important;
		}

		.contact-page-form :global(input) {
			height: 48px;
			border-radius: 8px;
		}

		.contact-page-form :global(textarea) {
			min-height: 96px;
			border-radius: 8px;
		}

		.contact-page-form :global(.bohemcars-contact-form button) {
			min-height: 50px;
			border-radius: 8px;
		}
	}
</style>
