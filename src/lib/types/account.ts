export type BohemcarsRole = 'customer' | 'agent' | 'admin';

export type BohemcarsSession = {
	email: string;
	name: string;
	role: BohemcarsRole;
	token?: string;
};

export type BohemcarsUserStatus = 'active' | 'paused' | 'lead';

export type BohemcarsUser = {
	email: string;
	id: string;
	name: string;
	phone: string;
	role: BohemcarsRole;
	status: BohemcarsUserStatus;
};

export type BohemcarsSessionRecord = {
	createdAt: string;
	email: string;
	expiresAt: string;
	name: string;
	role: BohemcarsRole;
	token: string;
	userId: string;
};

export type BohemcarsInquiryStatus = 'new' | 'assigned' | 'contacted' | 'closed';

export type BohemcarsInquiryRecord = {
	assignedAgentSlug: string;
	contactEmail: string;
	contactName: string;
	contactPhone: string;
	createdAt: string;
	id: string;
	message: string;
	routePath: string;
	source: string;
	status: BohemcarsInquiryStatus;
	userRole: BohemcarsRole;
	vehicleSlug?: string;
	vehicleTitle?: string;
};

export type BohemcarsMessageStatus = 'open' | 'read' | 'closed';

export type BohemcarsMessageRecord = {
	authorEmail: string;
	authorName: string;
	createdAt: string;
	id: string;
	message: string;
	routePath: string;
	status: BohemcarsMessageStatus;
	threadId: string;
	vehicleSlug?: string;
};

export type BohemcarsVehicleSubmissionStatus = 'draft' | 'submitted' | 'reviewing' | 'published';

export type BohemcarsCmsDocument = {
	filename: string;
	id: string;
	mimeType: string;
	originalName: string;
	size: number;
	uploadedAt: string;
	url: string;
};

export type BohemcarsVehicleSubmissionRecord = {
	contactEmail: string;
	contactName: string;
	contactPhone: string;
	createdAt: string;
	documents?: BohemcarsCmsDocument[];
	expectedPrice: string;
	galleryImages?: string[];
	id: string;
	message: string;
	mileage: string;
	previewImage?: string;
	routePath: string;
	source: 'sell-your-car' | 'admin-listing' | 'customer-listing';
	status: BohemcarsVehicleSubmissionStatus;
	title: string;
	vin: string;
};

export type BohemcarsInventoryListingStatus =
	| 'draft'
	| 'intake'
	| 'media_ready'
	| 'published'
	| 'reserved'
	| 'sold'
	| 'archived';

export type BohemcarsInventoryListingRecord = {
	bodyType: string;
	brand: string;
	color: string;
	createdAt: string;
	description: string;
	documents: BohemcarsCmsDocument[];
	doors: number;
	engine: string;
	features: string[];
	fuel: string;
	galleryImages: string[];
	id: string;
	location: string;
	mileage: number;
	model: string;
	previewImage: string;
	price: number;
	priceLabel: string;
	routePath: string;
	seats: number;
	slug: string;
	source: 'admin-listing' | 'static-vehicle';
	sourceUrl: string;
	status: BohemcarsInventoryListingStatus;
	stockNumber: string;
	submissionId?: string;
	title: string;
	transmission: string;
	updatedAt: string;
	vin: string;
	year: number;
};

export type BohemcarsPasswordChangeRecord = {
	createdAt: string;
	email: string;
	id: string;
	role: BohemcarsRole;
	userId: string;
};
