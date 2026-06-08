import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { readInventoryListingFields } from '$lib/server/cms-listing-form';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountListingFormData } from '$lib/server/account-listing-form-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';
import { saveCmsUploadFiles } from '$lib/server/cms-persistence';
import { createVehicleSubmission, updateVehicleSubmission } from '$lib/server/inventory';

const mileageLabel = (value: string | number | undefined) => {
	const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));

	return Number.isFinite(parsed) && parsed > 0
		? `${parsed.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`
		: 'On request';
};

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/listings/new';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: formSlot } = renderAuxeroPageSlot(
		'add-listings-2.html',
		renderOptions,
		{
			marker: 'data-bohemcars-add-listing-form',
			tagName: 'form',
			templateError: 'Account vehicle submission template could not be rendered',
			slotError: 'Account vehicle submission form slot could not be located'
		}
	);

	return {
		afterFormHtml: formSlot.afterHtml,
		auxeroFullPage: true,
		beforeFormHtml: formSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('add-listings-2.html', renderOptions, {
			subtitle: 'Submit a vehicle for Bohemcars review without leaving your account workspace.',
			title: 'Submit Vehicle'
		}),
		form: getAccountListingFormData('add-listings-2.html', renderOptions),
		formHtml: formSlot.sectionHtml,
		pageDocument
	};
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const routePath = 'account/listings/new';
		const session = requireBohemcarsPageSession(request, routePath, url.searchParams);
		const formData = await request.formData();
		const values = readInventoryListingFields(formData);
		const rawStatus = String(formData.get('status') ?? formData.get('listingStatus') ?? '').trim();

		if (!values.title) {
			return fail(400, {
				error: 'Vehicle title is required.',
				values
			});
		}

		const submission = createVehicleSubmission({
			email: session.email,
			expectedPrice: values.priceLabel,
			message: values.description,
			mileage: mileageLabel(values.mileage),
			name: session.name,
			routePath: '/account/listings/new',
			source: 'customer-listing',
			status: rawStatus === 'draft' ? 'draft' : 'submitted',
			title: values.title,
			vin: values.vin
		});

		try {
			const media = await saveCmsUploadFiles({ formData, recordId: submission.id });
			updateVehicleSubmission({
				documents: media.documents,
				galleryImages: media.galleryImages,
				id: submission.id,
				previewImage: media.previewImage
			});
		} catch (error) {
			return fail(400, {
				error: error instanceof Error ? error.message : 'Uploaded files could not be saved.',
				values
			});
		}

		redirect(303, '/account/listings?submitted=1');
	}
};
