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

export type BohemcarsVehicleSubmissionRecord = {
	contactEmail: string;
	contactName: string;
	contactPhone: string;
	createdAt: string;
	expectedPrice: string;
	id: string;
	message: string;
	mileage: string;
	routePath: string;
	source: 'sell-your-car' | 'admin-listing' | 'customer-listing';
	status: BohemcarsVehicleSubmissionStatus;
	title: string;
	vin: string;
};

export type BohemcarsInventoryListingStatus = 'draft' | 'published' | 'archived';

export type BohemcarsInventoryListingRecord = {
	createdAt: string;
	id: string;
	mileage: string;
	priceLabel: string;
	routePath: string;
	slug: string;
	source: 'admin-listing';
	status: BohemcarsInventoryListingStatus;
	submissionId?: string;
	title: string;
	updatedAt: string;
	vin: string;
};

export type BohemcarsPasswordChangeRecord = {
	createdAt: string;
	email: string;
	id: string;
	role: BohemcarsRole;
	userId: string;
};
