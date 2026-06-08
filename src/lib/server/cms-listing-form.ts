import type { AdminInventoryRow } from './admin-cms';
import { saveCmsUploadFiles } from './cms-persistence';
import type { InventoryListingInput } from './inventory';

export const inventoryStatusFromValue = (
	status: string | undefined
): InventoryListingInput['status'] =>
	status === 'published' || status === 'archived' || status === 'draft' ? status : 'draft';

const stringValue = (formData: FormData, ...keys: string[]) => {
	for (const key of keys) {
		const value = formData.get(key);

		if (typeof value === 'string' && value.trim()) return value.trim();
	}

	return '';
};

const numberValue = (formData: FormData, ...keys: string[]) => {
	const value = stringValue(formData, ...keys);
	const parsed = Number(value.replace(/[^\d.-]/g, ''));

	return Number.isFinite(parsed) ? parsed : undefined;
};

const stringList = (formData: FormData, key: string) =>
	formData
		.getAll(key)
		.filter((value): value is string => typeof value === 'string')
		.map((value) => value.trim())
		.filter(Boolean);

const splitList = (value: string) =>
	value
		.split(/\r?\n|,/)
		.map((item) => item.trim())
		.filter(Boolean);

export const readInventoryListingFields = (formData: FormData): InventoryListingInput => {
	const featureValues = [
		...stringList(formData, 'features'),
		...splitList(stringValue(formData, 'featureText', 'featuresText'))
	];
	const title = stringValue(formData, 'title', 'vehicleTitle');
	const priceLabel = stringValue(
		formData,
		'priceLabel',
		'PriceListing',
		'PriceListing2',
		'expectedPrice',
		'Enternumber'
	);

	return {
		bodyType: stringValue(formData, 'bodyType', 'type', 'Type'),
		brand: stringValue(formData, 'brand', 'Brand') || title.split(/\s+/)[0],
		color: stringValue(formData, 'color', 'Color'),
		description: stringValue(formData, 'description', 'Doorstextarea', 'message'),
		doors: numberValue(formData, 'doors', 'Doors'),
		engine: stringValue(formData, 'engine', 'Enterengine'),
		features: featureValues,
		fuel: stringValue(formData, 'fuel', 'FuelType'),
		location: stringValue(formData, 'location', 'SelectLocation', 'ListingAddress'),
		mileage: numberValue(formData, 'mileage'),
		model: stringValue(formData, 'model', 'Model'),
		price: numberValue(formData, 'price', 'PriceListing', 'PriceListing2'),
		priceLabel,
		routePath: stringValue(formData, 'routePath'),
		seats: numberValue(formData, 'seats', 'Seats'),
		slug: stringValue(formData, 'slug'),
		sourceUrl: stringValue(formData, 'sourceUrl', 'Yoururl'),
		status: inventoryStatusFromValue(stringValue(formData, 'status', 'listingStatus')),
		stockNumber: stringValue(formData, 'stockNumber', 'Enternumber'),
		title,
		transmission: stringValue(formData, 'transmission', 'Transmission'),
		vin: stringValue(formData, 'vin', 'VIN', 'EnterVIN'),
		year: numberValue(formData, 'year', 'Years')
	};
};

export const mergeListingUploads = async ({
	existing,
	formData,
	recordId
}: {
	existing?: AdminInventoryRow | InventoryListingInput | null;
	formData: FormData;
	recordId: string;
}): Promise<Pick<InventoryListingInput, 'documents' | 'galleryImages' | 'previewImage'>> => {
	const uploads = await saveCmsUploadFiles({ formData, recordId });
	const existingGallery = Array.isArray(existing?.galleryImages) ? existing.galleryImages : [];
	const existingDocuments = Array.isArray(existing?.documents) ? existing.documents : [];

	return {
		documents: [...existingDocuments, ...uploads.documents],
		galleryImages: [...existingGallery, ...uploads.galleryImages],
		previewImage: uploads.previewImage || existing?.previewImage
	};
};
