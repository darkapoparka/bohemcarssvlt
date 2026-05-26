import { agents } from '$lib/data/agents';
import { bohemcarsConsultants } from '$lib/data/bohemcars';

export type AuxeroReviewCard = {
	avatar: string;
	id: string;
	name: string;
	role: string;
	stars: number;
	text: string;
};

const baseReviews = [
	{
		name: 'Aleksandar Vytev',
		role: 'Facebook recommendation',
		text: 'The purchase and delivery process followed the plan that was explained before we started.'
	},
	{
		name: 'Krasimir Georgiev',
		role: 'Client vehicle handoff',
		text: 'The car I bought through Bohemcars came exactly as discussed. I would choose them again.'
	},
	{
		name: 'Zhivko Zaimov',
		role: 'Canada import client',
		text: 'Every step was explained clearly: photos before purchase, Carfax context, and no hidden fees.'
	},
	{
		name: 'Asen Hristov',
		role: 'Verified buyer',
		text: 'What I ordered is what arrived. The important part was a vehicle without hidden issues.'
	},
	{
		name: 'Stanislav Stefanov Kyumyurdzhiev',
		role: 'Delivery review',
		text: 'I received the vehicle within the agreed timing and without surprise charges.'
	},
	{
		name: 'Bohemcars client',
		role: 'Appointment viewing',
		text: 'The documents, service context, and vehicle condition were ready when I came to view the car.'
	}
] as const;

const fallbackAvatar = agents[0]?.image ?? '/assets/images/avatar/user-1.jpg';

export const auxeroReviewCards: AuxeroReviewCard[] = baseReviews.map((review, index) => ({
	...review,
	avatar: bohemcarsConsultants[index % bohemcarsConsultants.length]?.image ?? fallbackAvatar,
	id: review.name
		.toLowerCase()
		.replaceAll(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, ''),
	stars: 5
}));
