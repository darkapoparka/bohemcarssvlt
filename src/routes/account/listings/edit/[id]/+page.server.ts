import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { readInventoryListingFields } from '$lib/server/cms-listing-form';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountListingFormData } from '$lib/server/account-listing-form-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';
import { saveCmsUploadFiles } from '$lib/server/cms-persistence';
import {
	listVehicleSubmissions,
	normalizeVehicleSubmissionStatus,
	updateVehicleSubmission
} from '$lib/server/inventory';

const mileageLabel = (value: string | number | undefined) => {
	const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));

	return Number.isFinite(parsed) && parsed > 0
		? `${parsed.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`
		: 'On request';
};

export const load: PageServerLoad = ({ params, request, url }) => {
	const routePath = `account/listings/edit/${params.id}`;
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
			templateError: 'Account vehicle edit template could not be rendered',
			slotError: 'Account vehicle edit form slot could not be located'
		}
	);

	return {
		afterFormHtml: formSlot.afterHtml,
		auxeroFullPage: true,
		beforeFormHtml: formSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('add-listings-2.html', renderOptions, {
			subtitle: 'Update a submitted vehicle from inside your account workspace.',
			title: 'Edit Submission'
		}),
		form: getAccountListingFormData('add-listings-2.html', renderOptions),
		formHtml: formSlot.sectionHtml,
		pageDocument
	};
};

export const actions: Actions = {
	default: async ({ params, request, url }) => {
		const routePath = `account/listings/edit/${params.id}`;
		requireBohemcarsPageSession(request, routePath, url.searchParams);
		const existing = listVehicleSubmissions().find((submission) => submission.id === params.id);
		const formData = await request.formData();
		const values = readInventoryListingFields(formData);
		const rawStatus = String(formData.get('status') ?? formData.get('listingStatus') ?? '').trim();

		if (!existing) {
			return fail(404, { error: 'Vehicle submission not found.', values });
		}
		if (!values.title) {
			return fail(400, { error: 'Vehicle title is required.', values });
		}

		const updated = updateVehicleSubmission({
			expectedPrice: values.priceLabel,
			id: existing.id,
			message: values.description,
			mileage: mileageLabel(values.mileage),
			status:
				normalizeVehicleSubmissionStatus(rawStatus === 'draft' ? 'draft' : 'submitted') ??
				existing.status,
			title: values.title,
			vin: values.vin
		});

		if (!updated) {
			return fail(404, { error: 'Vehicle submission not found.', values });
		}

		try {
			const media = await saveCmsUploadFiles({ formData, recordId: existing.id });
			updateVehicleSubmission({
				documents: [...(existing.documents ?? []), ...media.documents],
				galleryImages: [...(existing.galleryImages ?? []), ...media.galleryImages],
				id: existing.id,
				previewImage: media.previewImage || existing.previewImage
			});
		} catch (error) {
			return fail(400, {
				error: error instanceof Error ? error.message : 'Uploaded files could not be saved.',
				values
			});
		}

		redirect(303, '/account/listings?updated=1');
	}
};
