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
	<p class="h3 mb-12 capitalize">{form.title}</p>
	<p class="text-body-style-2 mb-32">{form.subtitle}</p>

	<InquiryForm
		{fields}
		formClass="bohemcars-contact-form"
		gridClass="md-grid-cols-1 mb-22 grid grid-cols-2 gap-x-20 gap-y-24"
		showEmptyStatus={false}
		statusMessage="Message queued for Bohemcars locally"
		submitLabel={form.submitLabel}
	/>
</div>
