<script lang="ts">
	import type { AuxeroAccountProfileFormData } from '$lib/auxero/account-forms';

	let { profile }: { profile: AuxeroAccountProfileFormData } = $props();

	let primarySocialLinks = $derived(profile.socialLinks.slice(0, 3));
	let secondarySocialLinks = $derived(profile.socialLinks.slice(3));
</script>

<form action="#" class="bohemcars-profile-form" novalidate data-bohemcars-profile-form>
	<input type="hidden" name="role" value={profile.role} />
	<input type="hidden" name="actorRole" value={profile.role} />
	<div class="dashboard-box style-5 mb-38 bg-white">
		<p class="h4 mb-20">Account Role</p>

		<p class="hightlight-text text-primary mb-20 text-sm">{profile.roleNote}</p>

		<div class="mb-40 flex">
			<a href="#profile-information" class="btn btn-primary btn-large-3 font-weight-600">
				{profile.roleLabel}
			</a>
		</div>

		<p class="h4 mb-20" id="profile-information">Information</p>

		<p class="font-weight-600 mb-12">Upload Avatar*</p>
		<div class="upload-section mb-18">
			<div class="flex items-start gap-20">
				<div class="upload-preview upload-preview--avatar">
					<img id="avatarPreview" src={profile.avatarImage} alt="Avatar Preview" />
				</div>
				<div class="upload-content flex-1">
					<p class="font-weight-600 mb-6">Upload File</p>
					<p class="text-secondary mb-6 text-xs">
						PNG, JPG, SVG dimension (400 * 400) max file not more then size 4 mb.
					</p>
					<div class="flex">
						<div class="upload-action">
							<button type="button" class="upload-btn" data-target="avatarInput">
								Choose File
							</button>
							<input
								type="file"
								id="avatarInput"
								accept="image/png,image/jpeg,image/jpg,image/svg+xml"
								class="upload-input"
							/>
							<span class="text-muted file-name text-xs" data-target="avatarInput"
								>No file choose</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>

		<p class="font-weight-600 mb-12">Dealer Poster*</p>
		<div class="upload-section mb-20">
			<div class="upload-preview--poster-wrapper">
				<div class="upload-preview--poster">
					<img id="posterPreview" src={profile.posterImage} alt="Dealer Poster Preview" />
				</div>
				<div class="upload-content flex-1">
					<p class="font-weight-600 mb-4">Upload File</p>
					<p class="text-secondary mb-12 text-xs">
						PNG, JPG, SVG dimension (400 * 400) max file not more then size 4 mb.
					</p>

					<div class="flex">
						<div class="upload-action">
							<button type="button" class="upload-btn" data-target="posterInput">
								Choose File
							</button>
							<input
								type="file"
								id="posterInput"
								accept="image/png,image/jpeg,image/jpg,image/svg+xml"
								class="upload-input"
							/>
							<span class="text-muted file-name text-xs" data-target="posterInput"
								>No file choose</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-14 grid grid-cols-2 gap-20">
			<div class="md-col-span-2 padding-0">
				<p class="font-weight-600 mb-8">Fist Name*</p>
				<div class="input-clear-wrapper">
					<input
						class="input-large input-clear active"
						type="text"
						name="first_name"
						id="first_name"
						value={profile.firstName}
						placeholder="Fist Name*"
					/>
					<button type="button" class="input-clear-btn" data-target="first_name">
						<img src="/assets/icons/clear.svg" alt="Clear" />
					</button>
				</div>
			</div>

			<div class="md-col-span-2 padding-0">
				<p class="font-weight-600 mb-8">Last Name*</p>
				<div class="input-clear-wrapper">
					<input
						class="input-large input-clear"
						type="text"
						name="last_name"
						id="last_name"
						value={profile.lastName}
						placeholder="Last Name*"
					/>
					<button type="button" class="input-clear-btn" data-target="last_name">
						<img src="/assets/icons/clear.svg" alt="Clear" />
					</button>
				</div>
			</div>

			<div class="padding-0 col-span-2">
				<p class="font-weight-600 mb-8">Description*</p>
				<textarea
					placeholder="Profile notes"
					rows="4"
					name="message"
					class="message textarea-primary text-secondary"
					id="message"
					value={profile.description}
					required
				></textarea>
			</div>
		</div>

		<div class="lg-grid-cols-2 md-grid-cols-1 mb-22 grid grid-cols-4 gap-20">
			<div>
				<p class="font-weight-600 mb-8">Phone*</p>
				<div class="input-clear-wrapper">
					<input
						class="input-large"
						type="text"
						name="Phone"
						id="Phone"
						value={profile.phone}
						placeholder="Phone"
					/>
				</div>
			</div>

			<div>
				<p class="font-weight-600 mb-8">Sales Phone*</p>
				<div class="input-clear-wrapper">
					<input
						class="input-large"
						type="text"
						name="SalesPhone"
						id="SalesPhone"
						value={profile.marketplacePhone}
						placeholder="Marketplace Phone*"
					/>
				</div>
			</div>
			<div>
				<p class="font-weight-600 mb-8">Email Address*</p>
				<div class="input-clear-wrapper">
					<input
						class="input-large"
						type="text"
						name="EmailAddress"
						id="EmailAddress"
						value={profile.email}
						placeholder="Email Address*"
					/>
				</div>
			</div>
			<div>
				<p class="font-weight-600 mb-8">Company*</p>
				<div class="input-clear-wrapper">
					<input
						class="input-large"
						type="text"
						name="Company"
						id="Company"
						value={profile.company}
						placeholder="Company*"
					/>
				</div>
			</div>
		</div>

		<div class="md-grid-cols-1 grid grid-cols-2 gap-20">
			<div>
				<p class="font-weight-600 mb-8">Gender*</p>
				<select name="Gender" id="Gender" value={profile.gender}>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
				</select>
			</div>

			<div>
				<p class="font-weight-600 mb-8">Day of Birth*</p>
				<input type="date" name="DayofBirth" id="DayofBirth" value={profile.birthDate} />
			</div>
		</div>
	</div>

	<div class="dashboard-box style-5 mb-40 bg-white">
		<p class="h4 mb-20">Social Network</p>

		<div class="md-grid-cols-1 mb-20 grid grid-cols-3 gap-32">
			{#each primarySocialLinks as link (link.id)}
				<div class="input-clear-wrapper input-social-wrapper">
					<img class="prefix-icon" src={link.icon} alt="Clear" />
					<input
						class="input-large input-clear"
						type="text"
						name={link.name}
						id={link.id}
						value={link.value}
						placeholder="URL"
					/>
					<button type="button" class="input-clear-btn" data-target={link.id}>
						<img src="/assets/icons/clear.svg" alt="Clear" />
					</button>
				</div>
			{/each}
		</div>

		<div class="md-grid-cols-1 grid grid-cols-3 gap-32">
			{#each secondarySocialLinks as link (link.id)}
				<div class="input-clear-wrapper input-social-wrapper">
					<img class="prefix-icon" src={link.icon} alt="Clear" />
					<input
						class="input-large input-clear"
						type="text"
						name={link.name}
						id={link.id}
						value={link.value}
						placeholder="URL"
					/>
					<button type="button" class="input-clear-btn" data-target={link.id}>
						<img src="/assets/icons/clear.svg" alt="Clear" />
					</button>
				</div>
			{/each}
		</div>
	</div>

	<div class="dashboard-box style-3 bg-white">
		<p class="h4 mb-20">Location</p>

		<div class="md-grid-cols-1 mb-20 grid grid-cols-2 gap-20">
			<div>
				<p class="font-weight-600 mb-8">Full Address*</p>
				<input
					class="input-large"
					type="text"
					id="PriceListing"
					name="PriceListing"
					placeholder={profile.address}
					value={profile.address}
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
							{#each profile.mapOptions as option, index (option)}
								<label class="filter-checkbox">
									<input type="checkbox" name="type" value={option} checked={index === 0} />
									<span>{option}</span>
								</label>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="widget-gg-map radius-8 flex overflow-hidden">
			<iframe
				src={profile.mapEmbedUrl}
				height="281"
				style="border:0;width: 100%;"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				title="Bohemcars map"
			></iframe>
		</div>
	</div>

	<div class="mt-24 flex justify-end">
		<button type="submit" class="btn btn-primary btn-large-3 font-weight-600">
			Save Locally
		</button>
	</div>
</form>
