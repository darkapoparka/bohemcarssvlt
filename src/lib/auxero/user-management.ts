export type AuxeroUserManagementAction = {
	ariaLabel: string;
	icon: string;
	kind: 'message' | 'review';
	label: string;
};

export type AuxeroUserManagementRow = {
	actions: AuxeroUserManagementAction[];
	columns: string[];
	description: string;
	id: string;
	image: string;
	kind: string;
	name: string;
	role: string;
};

export type AuxeroUserManagementData = {
	footerText: string;
	headers: string[];
	rows: AuxeroUserManagementRow[];
};
