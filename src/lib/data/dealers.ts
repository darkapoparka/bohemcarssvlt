import { bohemcarsAssets, bohemcarsContact } from './bohemcars';
import { vehicles } from './vehicles';

export interface Dealer {
	slug: string;
	name: string;
	location: string;
	address: string;
	phone: string;
	logo: string;
	cover: string;
	inventory: number;
	rating: number;
	specialties: string[];
}

export const dealers: Dealer[] = [
	{
		slug: 'bohemcars-plovdiv',
		name: 'Bohemcars',
		location: bohemcarsContact.addressLabel,
		address: `${bohemcarsContact.addressLabel}. ${bohemcarsContact.appointmentNote}.`,
		phone: bohemcarsContact.primaryPhoneLabel,
		logo: bohemcarsAssets.logoDark,
		cover: bohemcarsAssets.hero,
		inventory: vehicles.length,
		rating: 4.9,
		specialties: ['Canada imports', 'Verified history', 'Documents', 'Client vehicles']
	}
];

export function getDealerBySlug(slug: string) {
	return dealers.find((dealer) => dealer.slug === slug);
}
