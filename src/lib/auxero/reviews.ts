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
		role: 'Препоръка във Facebook',
		text: 'Процесът по покупка и доставка следваше плана, който беше обяснен преди да започнем.'
	},
	{
		name: 'Krasimir Georgiev',
		role: 'Предаване на клиентски автомобил',
		text: 'Колата, която купих чрез Bohemcars, дойде точно както беше уговорено. Бих ги избрал отново.'
	},
	{
		name: 'Zhivko Zaimov',
		role: 'Клиент с внос от Канада',
		text: 'Всяка стъпка беше обяснена ясно: снимки преди покупка, Carfax контекст и без скрити такси.'
	},
	{
		name: 'Asen Hristov',
		role: 'Потвърден купувач',
		text: 'Това, което поръчах, е това, което пристигна. Важното беше автомобил без скрити проблеми.'
	},
	{
		name: 'Stanislav Stefanov Kyumyurdzhiev',
		role: 'Отзив за доставка',
		text: 'Получих автомобила в уговорения срок и без изненадващи такси.'
	},
	{
		name: 'Bohemcars client',
		role: 'Оглед по уговорка',
		text: 'Документите, сервизният контекст и състоянието на автомобила бяха готови, когато дойдох да видя колата.'
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
