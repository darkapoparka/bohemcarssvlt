<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import AuxeroVehicleOverview from './AuxeroVehicleOverview.svelte';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();
	let inquiryStatus = $state('');
	const showMarketplacePhone = $derived(
		detail.contact.marketplacePhoneHref !== detail.contact.primaryPhoneHref ||
			detail.contact.marketplacePhoneLabel !== detail.contact.primaryPhoneLabel
	);

	const handleInquirySubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const form = event.currentTarget as HTMLFormElement;
		const payload = Object.fromEntries(new FormData(form).entries());

		try {
			await fetch('/api/inquiries', {
				body: JSON.stringify({
					...payload,
					source: 'vehicle-detail',
					vehicleSlug: detail.slug
				}),
				headers: { 'content-type': 'application/json' },
				method: 'POST'
			});
		} catch {
			// The prototype still confirms local capture if the API is unavailable.
		}

		inquiryStatus = 'Inquiry sent to Bohemcars locally';
	};
</script>

<div class="listing-details--sidebar">
	<div class="listing-details--sidebar-box mb-40">
		<div class="flat-tabs">
			<div class="mb-15 overflow-x-auto">
				<ul class="menu-tab menu-tab-style5 grid-cols-2">
					<li>{detail.copy.cash}</li>
					<li class="active">{detail.copy.finance}</li>
				</ul>
			</div>

			<div class="content-tab visible">
				<div class="content-inner">
					<p class="h5 mb-4">{detail.copy.price}</p>
					<p class="h4 mb-4">{detail.priceLabel}</p>
					<p class="text-secondary mb-16">
						{detail.copy.priceIntro}
					</p>

					<p class="flex items-center gap-8">
						<img src="/assets/icons/Info.svg" alt="info" />
						<a href={resolve('/contact')} class="text-underline text-highlight">{detail.priceBgn}</a
						>
					</p>
				</div>

				<div class="content-inner active">
					<p class="h5 mb-4">{detail.copy.price}</p>
					<p class="h4 mb-4">{detail.monthlyLabel}</p>
					<p class="text-secondary mb-4">
						{detail.copy.financeIntro}
					</p>
					<p class="text-secondary mb-16">{detail.copy.financeTerms}</p>

					<div class="core-dropdown flex items-center gap-8">
						<img src="/assets/icons/Info.svg" alt="info" />
						<a
							href={resolve('/contact')}
							class="text-underline text-highlight"
							id="coreDropdownBtn"
						>
							{detail.priceBgn}
						</a>
						<div class="core-dropdown__menu" id="coreDropdownMenu">
							<ul class="core-dropdown__list">
								<li class="core-dropdown__item">
									<p class="text-secondary text-sm">Price:</p>
									<p class="font-weight-600">$23.577</p>
								</li>
								<li class="core-dropdown__item">
									<p class="text-secondary text-sm">Special tax on motor vehicles:</p>
									<p class="font-weight-600">$1.322</p>
								</li>
								<li class="core-dropdown__item">
									<p class="text-secondary text-sm">Price with special tax:</p>
									<p class="font-weight-600">$24.900</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="listing-details--sidebar-box mb-40">
		<p class="h5 mb-4 capitalize">{detail.copy.carOverview}</p>
		<AuxeroVehicleOverview items={detail.overviewItems} />
	</div>

	<div class="listing-details--sidebar-box mb-40">
		<div class="listing-details--contact">
			<div class="listing-details--contact-dealer mb-28">
				<img src={detail.consultant.image} alt="dealer" />

				<div class="content">
					<a href={resolve('/contact')} class="h4 font-weight-600 mb-8">{detail.consultant.name}</a>

					<div class="verify">
						<img src="/assets/icons/SealCheck.svg" alt="verified" />
						<p class="text-highlight text-sm">{detail.copy.consultantLabel}</p>
					</div>
				</div>
			</div>

			<ul class="contact-info mb-20">
				<li>
					<p class="icon"><img src="/assets/icons/MapPin.svg" alt="phone" /></p>
					<div class="flex flex-col gap-4">
						<a href={resolve('/contact')}>
							{detail.contact.address}
						</a>
						<a href={resolve('/contact')} class="text-underline text-highlight text-sm"
							>{detail.copy.directions}</a
						>
					</div>
				</li>
			</ul>
			<ul class="contact-info mb-28">
				<li class="items-center">
					<p class="icon"><img src="/assets/icons/PhoneCall.svg" alt="phone" /></p>
					<div class="flex flex-col">
						<a href={resolve('/contact')}>
							{detail.contact.primaryPhoneLabel}
						</a>
						{#if showMarketplacePhone}
							<a href={resolve('/contact')}>
								{detail.contact.marketplacePhoneLabel}
							</a>
						{/if}
					</div>
				</li>
			</ul>

			<a
				href={resolve('/agents/[slug]', { slug: detail.consultant.slug })}
				class="btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5"
			>
				<img src="/assets/icons/PhoneCall-2.svg" alt="phone" />
				{detail.copy.callBohemcars}
			</a>

			<a href={resolve('/contact')} class="btn btn-medium btn-primary-4 font-weight-600 gap-5">
				<img src="/assets/icons/ChatCircleDots.svg" alt="phone" />
				{detail.copy.chatOnViber}
			</a>
		</div>
	</div>

	<div class="listing-details--sidebar-box">
		<p class="h5 mb-16 capitalize">{detail.copy.inquiryTitle}</p>

		<form action="#" class="send-inquiry" onsubmit={handleInquirySubmit}>
			<div class="mb-8 grid grid-cols-1 gap-18">
				<div>
					<p class="mb-8">{detail.copy.name}</p>
					<input
						class="active input-large"
						id="SendInquiryname"
						name="SendInquiryname"
						type="text"
						value=""
						required
					/>
				</div>
				<div>
					<p class="mb-8">{detail.copy.email}</p>
					<input
						class="input-large"
						name="SendInquiryemail"
						id="SendInquiryemail"
						type="text"
						value={detail.contact.email}
						required
					/>
				</div>
				<div>
					<p class="mb-8">{detail.copy.phone}</p>
					<input
						placeholder={detail.copy.phone}
						class="input-large"
						name="SendInquiryphone"
						id="SendInquiryphone"
						type="number"
						value=""
						required
					/>
				</div>

				<div>
					<p class="mb-8">{detail.copy.subject}</p>
					<select>
						<option>{detail.copy.subjectAvailability}</option>
						<option>{detail.copy.subjectDocuments}</option>
						<option>{detail.copy.subjectViewing}</option>
					</select>
				</div>

				<div class="padding-0">
					<p class="mb-6">{detail.copy.message}</p>
					<textarea
						placeholder={detail.copy.messagePlaceholder}
						rows="3"
						name="message"
						class="message"
						id="message"
						required
					></textarea>
				</div>
			</div>
			<button class="btn btn-primary btn-large font-weight-600 mb-18 w-full"
				>{detail.copy.sendInquiry}</button
			>
			<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite">
				{inquiryStatus}
			</p>
			<label class="filter-checkbox style-2 mb-6">
				<input type="checkbox" name="features" value="touch-screen" />
				<span class="text-sm">
					{detail.copy.formConsent}
				</span>
			</label>

			<p class="text-secondary text-xs">
				{detail.copy.formTerms}
				<a href={resolve('/contact')} class="text-underline text-highlight text-xs">
					{detail.copy.formTermsLink}
				</a>
			</p>
		</form>
	</div>
</div>
