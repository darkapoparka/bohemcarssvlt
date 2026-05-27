<script lang="ts">
	import type {
		AuxeroAccountListingFormData,
		AuxeroListingFormDropdownField
	} from '$lib/auxero/account-listing-form';

	let { form }: { form: AuxeroAccountListingFormData } = $props();
</script>

{#snippet dropdown(field: AuxeroListingFormDropdownField)}
	<div class={field.wrapperClass}>
		<p class="font-weight-600 mb-8">{field.label}*</p>
		<div class="filter-select-dropdown style2 bg-white" data-name={field.id}>
			<input type="checkbox" id={field.id} class="filter-select-dropdown__toggle" />
			<label for={field.id} class="filter-select-dropdown__text">
				<span>Select</span>
			</label>
			<div class="filter-select-dropdown__menu">
				<div class="filter-select-dropdown__list">
					{#each field.options as option (field.id + option.value + option.label)}
						<label class="filter-checkbox">
							<input
								type="checkbox"
								name={option.name ?? field.name}
								value={option.value}
								checked={option.checked}
							/>
							<span>{option.label}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/snippet}

<form
	action="#"
	class="bohemcars-add-listing-form"
	novalidate
	data-bohemcars-admin-listing-mode={form.mode}
	data-bohemcars-add-listing-form
>
	{#each form.hiddenFields as field (field.name)}
		<input type="hidden" name={field.name} value={field.value} />
	{/each}

	<div class="dashboard-box style-3 mb-30 bg-white">
		<p class="h4 mb-20">Gallery</p>

		<div class="car-preview-upload mb-20">
			<p class="h4 mb-20">Car Preview</p>
			<div class="car-preview-upload__image-wrapper">
				<img
					id="carPreviewImage"
					src={form.previewImage.src}
					alt={form.previewImage.alt}
					class="car-preview-upload__image"
				/>
			</div>
			<div class="car-preview-upload__actions">
				<button
					type="button"
					class="btn btn-line-1 btn-large font-weight-600 car-preview-upload__btn"
				>
					Choose File
				</button>
				<input
					type="file"
					id="carPreviewInput"
					accept="image/jpeg,image/png,image/jpg"
					class="car-preview-upload__input"
				/>
				<span class="text-secondary text-sm">Upload file JPG, PNG</span>
			</div>
		</div>

		<div class="car-gallery-upload">
			<p class="h4 mb-20">Car Gallery</p>
			<div class="car-gallery-upload__grid">
				{#each form.galleryImages as image (image.src)}
					<div class="car-gallery-upload__item">
						<img src={image.src} alt={image.alt} class="car-gallery-upload__image" />
					</div>
				{/each}
			</div>
			<div class="car-gallery-upload__actions">
				<button
					type="button"
					class="btn btn-line-1 btn-large font-weight-600 car-gallery-upload__btn"
				>
					Choose File
				</button>
				<input
					type="file"
					id="carGalleryInput"
					accept="image/jpeg,image/png,image/jpg"
					multiple
					class="car-gallery-upload__input"
				/>
				<span class="text-secondary text-sm">Upload file JPG, PNG</span>
			</div>
		</div>
	</div>

	<div class="dashboard-box style-3 mb-30 bg-white">
		<p class="h4 mb-20">Car Details</p>

		<div class="sm-grid-cols-1 grid grid-cols-4 gap-20">
			{#each form.detailFields as field (field.id)}
				{#if field.type === 'input'}
					<div class={field.wrapperClass}>
						<p class="font-weight-600 mb-8">{field.label}*</p>
						<input
							class="input-large"
							type="text"
							id={field.id}
							name={field.name}
							placeholder={field.placeholder}
							value={field.value}
							required={field.required}
						/>
					</div>
				{:else if field.type === 'textarea'}
					<div class={field.wrapperClass}>
						<p class="font-weight-600 mb-8">{field.label}*</p>
						<textarea
							placeholder={field.placeholder}
							rows={field.rows}
							name={field.name}
							class="Doors"
							id={field.id}
							value={field.value}
							required={field.required}
						></textarea>
					</div>
				{:else}
					{@render dropdown(field)}
				{/if}
			{/each}
		</div>
	</div>

	<div class="dashboard-box style-3 mb-30 bg-white">
		<p class="h4 mb-20">Features</p>
		<div
			class="search-cars__features-grid xl-grid-cols-3 md-grid-cols-2 sm-grid-cols-1 grid grid-cols-5 gap-30"
		>
			{#each form.featureGroups as group (group.title)}
				<div class="flex flex-col gap-12">
					<div>
						<p class="h7 font-weight-500">{group.title}</p>
					</div>
					{#each group.features as feature (feature.id)}
						<div class="form-group">
							<input type="checkbox" id={feature.id} checked={feature.checked} />
							<label for={feature.id}>{feature.label}</label>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<div class="dashboard-box style-3 mb-30 bg-white">
		<p class="h4 mb-20">Car Price</p>

		<div class="md-grid-cols-2 sm-grid-cols-1 grid grid-cols-4 gap-20">
			<div class="padding-0 col-span-4">
				<p class="font-weight-600 mb-8">Price (EUR)*</p>
				<input
					class="input-large"
					type="text"
					id="PriceListing2"
					name="PriceListing"
					placeholder={form.priceLabel}
					value={form.priceLabel}
					required
				/>
			</div>
		</div>
	</div>

	<div class="dashboard-box style-3 mb-30 bg-white">
		<p class="h4 mb-20">Location</p>

		<div class="md-grid-cols-1 mb-20 grid grid-cols-2 gap-20">
			<div>
				<p class="font-weight-600 mb-8">Full Address*</p>
				<input
					class="input-large"
					type="text"
					id="PriceListing"
					name="PriceListing"
					placeholder={form.address}
					value={form.address}
					required
				/>
			</div>
			<div>
				<p class="font-weight-600 mb-8">Map Location*</p>
				<div class="filter-select-dropdown style2 bg-white" data-name="SelectLocation">
					<input type="checkbox" id="SelectLocation" class="filter-select-dropdown__toggle" />
					<label for="SelectLocation" class="filter-select-dropdown__text">
						<span>Select</span>
					</label>
					<div class="filter-select-dropdown__menu">
						<div class="filter-select-dropdown__list">
							{#each form.locationOptions as option (option.value + option.label)}
								<label class="filter-checkbox">
									<input
										type="checkbox"
										name="type"
										value={option.value}
										checked={option.checked}
									/>
									<span>{option.label}</span>
								</label>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="widget-gg-map radius-8 flex overflow-hidden">
			<iframe
				src={form.mapEmbedUrl}
				height="281"
				style="border:0;width: 100%;"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				title="Bohemcars listing location"
			></iframe>
		</div>
	</div>

	<div class="dashboard-box style-3 mb-30 bg-white">
		<p class="h4 mb-20">Video</p>

		<div class="md-grid-cols-1 grid grid-cols-4 gap-20">
			<div class="padding-0 col-span-4">
				<p class="font-weight-600 mb-8">Video URL*</p>
				<input
					class="input-large"
					type="text"
					id="Yoururl"
					name="Yoururl"
					placeholder={form.sourceUrl}
					value={form.sourceUrl}
					required
				/>
			</div>
		</div>
	</div>

	<div class="dashboard-box style-3 mb-30 bg-white" id="Attachments">
		<p class="h4 mb-20">Attachments</p>

		<div class="attachments-box mb-20 flex flex-wrap gap-20">
			{#each form.attachments as attachment (attachment.type)}
				<div class="flex">
					<a class="item" href="#Attachments">
						<img class="type-icon" src={attachment.icon} alt="" />
						<p class="text-secondary flex flex-col">
							{attachment.label}
							<span class="h7 font-weight-600 line-height-28 text-primary">
								{attachment.type}
							</span>
						</p>

						<p class="trash">
							<img class="type-icon" src="/assets/icons/trash.svg" alt="" />
						</p>
					</a>
				</div>
			{/each}
		</div>
		<div class="car-gallery-upload__actions">
			<button
				type="button"
				class="btn btn-line-1 btn-large font-weight-600 car-gallery-upload__btn"
				id="attachmentsChooseFileBtn"
			>
				Choose File
			</button>
			<input
				type="file"
				id="attachmentsInput"
				accept=".pdf,.doc,.docx"
				multiple
				class="car-gallery-upload__input"
				style="display: none;"
			/>
			<span class="text-secondary text-sm">Upload file PDF, Doc, Docx</span>
		</div>
	</div>
</form>
