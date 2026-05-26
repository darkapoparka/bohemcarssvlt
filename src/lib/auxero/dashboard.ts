export type AuxeroDashboardRecentItem = {
	avatar: string;
	body: string;
	dateLabel: string;
	id: string;
	name: string;
	title: string;
};

export type AuxeroDashboardRecentData = {
	heading: string;
	items: AuxeroDashboardRecentItem[];
};
