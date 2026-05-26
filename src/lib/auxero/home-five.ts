export type HomeFiveBrandCard = {
	count: string;
	image: string;
	name: string;
	query: string;
};

export type HomeFiveTypeCard = {
	bodyType: string;
	image: string;
	label: string;
};

export const homeFiveBrandCards: HomeFiveBrandCard[] = [
	{ name: 'BMW', image: '/assets/images/brand/brand-1.png', count: '18 Vehicles', query: 'BMW' },
	{
		name: 'Mercedes',
		image: '/assets/images/brand/brand-2.png',
		count: '22 Vehicles',
		query: 'Mercedes-Benz'
	},
	{ name: 'Audi', image: '/assets/images/brand/brand-3.png', count: '38 Vehicles', query: 'Audi' },
	{
		name: 'Honda',
		image: '/assets/images/brand/brand-4.png',
		count: '29 Vehicles',
		query: 'Honda'
	},
	{
		name: 'Toyota',
		image: '/assets/images/brand/brand-5.png',
		count: '23 Vehicles',
		query: 'Toyota'
	},
	{
		name: 'Volvo',
		image: '/assets/images/brand/brand-6.png',
		count: '32 Vehicles',
		query: 'Volvo'
	},
	{ name: 'Ford', image: '/assets/images/brand/brand-7.png', count: '24 Vehicles', query: 'Ford' },
	{
		name: 'Hyundai',
		image: '/assets/images/brand/brand-8.png',
		count: '22 Vehicles',
		query: 'Hyundai'
	},
	{ name: 'Kia', image: '/assets/images/brand/brand-9.png', count: '14 Vehicles', query: 'Kia' },
	{
		name: 'Mazda',
		image: '/assets/images/brand/brand-10.png',
		count: '32 Vehicles',
		query: 'Mazda'
	},
	{
		name: 'Ferrari',
		image: '/assets/images/brand/brand-11.png',
		count: '24 Vehicles',
		query: 'Ferrari'
	},
	{
		name: 'Tesla',
		image: '/assets/images/brand/brand-12.png',
		count: '27 Vehicles',
		query: 'Tesla'
	}
];

export const homeFiveTypeCards: HomeFiveTypeCard[] = [
	{ label: 'SUV', image: '/assets/images/card/card-37.jpg', bodyType: 'SUV' },
	{ label: 'SUV', image: '/assets/images/card/card-38.jpg', bodyType: 'SUV' },
	{ label: 'Pickup Truck', image: '/assets/images/card/card-39.jpg', bodyType: 'Pickup Truck' },
	{ label: 'Sedan', image: '/assets/images/card/card-40.jpg', bodyType: 'Sedan' },
	{ label: 'Hatchback', image: '/assets/images/card/card-41.jpg', bodyType: 'Hatchback' },
	{ label: 'Crossover', image: '/assets/images/card/card-42.jpg', bodyType: 'Crossover' }
];
