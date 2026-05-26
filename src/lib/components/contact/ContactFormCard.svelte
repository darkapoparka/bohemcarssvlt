<script lang="ts">
	import type { AuxeroContactFormData } from '$lib/auxero/contact';

	let { form }: { form: AuxeroContactFormData } = $props();
</script>

<div class="radius-20 contact-page-form bg-white">
	<p class="h3 mb-12 capitalize">{form.title}</p>
	<p class="text-body-style-2 mb-32">{form.subtitle}</p>

	<form action="#" class="bohemcars-contact-form">
		<div class="md-grid-cols-1 mb-22 grid grid-cols-2 gap-x-20 gap-y-24">
			{#each form.fields as field (field.id)}
				<div class="md-col-span-2 padding-0">
					<p class="mb-8">{field.label}</p>
					<input
						class={`${field.active ? 'active ' : ''}input-large`}
						id={field.id}
						name={field.name}
						placeholder={field.placeholder}
						required
						type={field.type}
						value=""
					/>
				</div>
			{/each}

			<div class="padding-0 col-span-2">
				<p class="mb-8">{form.messageLabel}</p>
				<textarea
					placeholder={form.messagePlaceholder}
					rows="3"
					name="message"
					class="message"
					id="message"
					required
				></textarea>
			</div>
		</div>
		<button class="btn btn-primary btn-large font-weight-600 w-full">
			{form.submitLabel}
		</button>
	</form>
</div>
