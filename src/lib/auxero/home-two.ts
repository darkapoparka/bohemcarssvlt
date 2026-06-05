type HomeTwoDealRoute =
	| {
			kind: 'vehicle';
			slug: string;
	  }
	| {
			kind: 'service';
	  };

export type HomeTwoDealCard = HomeTwoDealRoute & {
	badge: string;
	description: string;
	flip?: boolean;
	image: string;
	imageMax: string;
	meta: string;
	monthly: string;
	price: string;
	priceLabel: string;
	saving: string;
	stock: string;
	title: string;
};

export const homeTwoDealCards: HomeTwoDealCard[] = [
	{
		badge: 'Наличен',
		description: 'Премиум SUV, наличен за оглед',
		image: '/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.webp',
		imageMax: '124%',
		kind: 'vehicle',
		meta: '2019 · Бензин · Автоматик',
		monthly: 'от 690 €/месец',
		price: '36 500 EUR',
		priceLabel: 'Цена от',
		saving: 'Проверена история',
		slug: '21764342419542174',
		stock: 'София · Наличен',
		title: 'BMW X5 M Sport'
	},
	{
		badge: 'Премиум',
		description: 'M Competition, наличен в България',
		image: '/assets/bohemcars/megamenu/inventory-bmw-x4m-cutout-v2.webp',
		imageMax: '124%',
		kind: 'vehicle',
		meta: '2020 · Бензин · Автоматик',
		monthly: 'от 830 €/месец',
		price: '43 500 EUR',
		priceLabel: 'Цена от',
		saving: 'Готов за регистрация',
		slug: '21778068579001193',
		stock: 'BOHEMCARS · Проверен',
		title: 'BMW X4 M Competition'
	},
	{
		badge: 'Нов внос',
		description: 'Technik Black Optic от Канада',
		image: '/assets/bohemcars/megamenu/inventory-audi-a7-cutout.webp',
		imageMax: '124%',
		kind: 'vehicle',
		meta: '2021 · Хибрид · Автоматик',
		monthly: 'от 720 €/месец',
		price: '35 000 EUR',
		priceLabel: 'Цена от',
		saving: 'Финансиране',
		slug: '11774283016080050',
		stock: 'Нов внос · Оглед',
		title: 'Audi A7 55TFSI'
	},
	{
		badge: 'Канада',
		description: 'Подбор, проверка и доставка',
		flip: true,
		image: '/assets/bohemcars/megamenu/inventory-audi-sq5-cutout.webp',
		imageMax: '124%',
		kind: 'service',
		meta: 'Подбор · Проверка · Доставка',
		monthly: 'оферта по заявка',
		price: 'по заявка',
		priceLabel: 'Оферта',
		saving: 'Внос от Канада',
		stock: 'Канада · По заявка',
		title: 'SUV по поръчка'
	}
];
