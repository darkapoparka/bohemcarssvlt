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
	const directHref = (href: string) => ({ href });

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

		inquiryStatus = detail.copy.inquirySuccess;
		form.reset();
	};
</script>

<div class="listing-details--sidebar">
	<div class="listing-details--sidebar-box mb-40">
		<div class="flat-tabs">
			<div class="mb-15 overflow-x-auto">
				<ul class="menu-tab menu-tab-style5 grid-cols-2">
					<li class="active">{detail.copy.cash}</li>
					<li>{detail.copy.finance}</li>
				</ul>
			</div>

			<div class="content-tab visible">
				<div class="content-inner active">
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

					<div class="bohemcars-buybox-actions">
						<a
							href={resolve('/contact')}
							class="btn btn-primary btn-medium font-weight-600 bohemcars-buybox-action"
						>
							{detail.copy.subjectViewing}
						</a>
						<a
							{...directHref(detail.contact.primaryPhoneHref)}
							class="btn btn-primary btn-medium font-weight-600 bohemcars-buybox-action"
						>
							{detail.copy.callCta}
						</a>
					</div>
				</div>

				<div class="content-inner">
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
									<p class="text-secondary text-sm">Цена:</p>
									<p class="font-weight-600">$23.577</p>
								</li>
								<li class="core-dropdown__item">
									<p class="text-secondary text-sm">Специален данък върху МПС:</p>
									<p class="font-weight-600">$1.322</p>
								</li>
								<li class="core-dropdown__item">
									<p class="text-secondary text-sm">Цена със специален данък:</p>
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
		<p class="h5 mb-4">{detail.copy.carOverview}</p>
		<AuxeroVehicleOverview items={detail.overviewItems} />
	</div>

	<div class="listing-details--sidebar-box mb-40">
		<div class="listing-details--contact">
			<div class="listing-details--contact-dealer mb-28">
				<img
					src={detail.consultant.image}
					alt="dealer"
					width="96"
					height="96"
					loading="lazy"
					decoding="async"
				/>

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
				{...directHref(detail.contact.primaryPhoneHref)}
				class="btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5"
			>
				<img src="/assets/icons/PhoneCall-2.svg" alt="phone" />
				{detail.copy.callBohemcars}
			</a>

			<a
				{...directHref(detail.contact.viberHref)}
				class="btn btn-medium btn-primary-4 font-weight-600 gap-5"
				rel="noreferrer"
			>
				<img src="/assets/icons/ChatCircleDots.svg" alt="phone" />
				{detail.copy.chatOnViber}
			</a>
		</div>
	</div>

	<div class="listing-details--sidebar-box">
		<p class="h5 mb-16">{detail.copy.inquiryTitle}</p>

		<form action="#" class="send-inquiry" onsubmit={handleInquirySubmit}>
			<div class="mb-8 grid grid-cols-1 gap-18">
				<div>
					<p class="mb-8">{detail.copy.name}</p>
					<input
						aria-label={detail.copy.name}
						autocomplete="name"
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
						aria-label={detail.copy.email}
						autocomplete="email"
						class="input-large"
						name="SendInquiryemail"
						id="SendInquiryemail"
						type="email"
						value={detail.contact.email}
						required
					/>
				</div>
				<div>
					<p class="mb-8">{detail.copy.phone}</p>
					<input
						aria-label={detail.copy.phone}
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
					<select
						aria-label={detail.copy.subject}
						id="SendInquirysubject"
						name="SendInquirysubject"
					>
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

<style>
	.bohemcars-buybox-actions {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 10px;
		margin-top: 18px;
	}

	.bohemcars-buybox-action {
		min-height: 44px;
		padding-inline: 18px;
	}

	@media (max-width: 1199px) {
		.bohemcars-buybox-actions {
			grid-template-columns: 1fr;
		}
	}
</style>
