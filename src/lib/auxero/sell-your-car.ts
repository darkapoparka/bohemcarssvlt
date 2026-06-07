import type { AuxeroPageBanner } from './page-banner';

export type AuxeroSellCarInputField = {
	active: boolean;
	id: string;
	label: string;
	name: string;
	placeholder?: string;
	required?: boolean;
	type: 'tel' | 'text';
	value?: string;
};

export type AuxeroSellCarFormData = {
	fields: AuxeroSellCarInputField[];
	submitLabel: string;
};

export type AuxeroSellCarStep = {
	text: string;
	title: string;
};

export const sellYourCarHero: AuxeroPageBanner = {
	description:
		'Изпрати VIN, пробег, очаквана цена и телефон. Bohemcars ще прегледа автомобила и ще предложи реалистичен следващ ход.',
	eyebrow: 'Bohemcars оценка',
	image: '/assets/bohemcars/services/sell-car-service.webp',
	title: 'Продай автомобила си с Bohemcars'
};

export const auxeroSellSteps: AuxeroSellCarStep[] = [
	{
		title: 'Изпрати данни за автомобила',
		text: 'Сподели VIN, пробег, снимки, оборудване, документи и очаквана цена.'
	},
	{
		title: 'Проверка на история и състояние',
		text: 'Bohemcars преглежда информацията и уточнява липсващите детайли преди препоръка.'
	},
	{
		title: 'Избор на път за продажба',
		text: 'Обсъждаме директна оферта, съдействие при продажба или публикуване като клиентски автомобил.'
	},
	{
		title: 'Финализиране и предаване',
		text: 'Уточняваме документи, час за оглед, плащане и реалното предаване на автомобила.'
	}
];

export const sellCarFormData: AuxeroSellCarFormData = {
	fields: [
		{
			active: true,
			id: 'sellVIN',
			label: 'VIN номер',
			name: 'vin',
			placeholder: 'Въведете VIN',
			required: true,
			type: 'text'
		},
		{
			active: false,
			id: 'sellMileage',
			label: 'Пробег',
			name: 'mileage',
			placeholder: 'Пробег в км',
			required: true,
			type: 'text'
		},
		{
			active: false,
			id: 'sellPrice',
			label: 'Очаквана цена',
			name: 'price',
			placeholder: 'Очаквана цена в EUR',
			type: 'text'
		},
		{
			active: false,
			id: 'sellPhone',
			label: 'Телефон за контакт',
			name: 'phone',
			placeholder: 'Вашият телефон',
			required: true,
			type: 'tel'
		}
	],
	submitLabel: 'Заяви преглед'
};

export const sellCarFormDataWithPrefill = (vin = ''): AuxeroSellCarFormData => ({
	...sellCarFormData,
	fields: sellCarFormData.fields.map((field) =>
		field.name === 'vin' ? { ...field, value: vin } : { ...field }
	)
});
