export type AuxeroCalculatorInputKey = 'dutyRate' | 'prep' | 'price' | 'transport' | 'vatRate';

export type AuxeroCalculatorOutputKey =
	| 'duty'
	| 'prep'
	| 'price'
	| 'total'
	| 'totalSmall'
	| 'transport'
	| 'vat';

export type AuxeroCalculatorField = {
	active: boolean;
	key: AuxeroCalculatorInputKey;
	label: string;
	min: number;
	mutedLabel?: string;
	name: string;
	step: number;
	value: number;
};

export type AuxeroCalculatorSummaryRow = {
	key: AuxeroCalculatorOutputKey;
	label: string;
	value: number;
};

export type AuxeroCalculatorData = {
	ctaHref: string;
	ctaLabel: string;
	fields: AuxeroCalculatorField[];
	summaryRows: AuxeroCalculatorSummaryRow[];
	subtitle: string;
	title: string;
	total: number;
	totalNote: string;
};

export const auxeroCalculatorInitial = {
	price: 25000,
	transport: 3200,
	dutyRate: 10,
	vatRate: 20,
	prep: 1800
} satisfies Record<AuxeroCalculatorInputKey, number>;

export const auxeroCalculatorFields: AuxeroCalculatorField[] = [
	{
		active: true,
		key: 'price',
		label: 'Vehicle Price',
		min: 0,
		name: 'price',
		step: 100,
		value: auxeroCalculatorInitial.price
	},
	{
		active: false,
		key: 'transport',
		label: 'Transport And Port Costs',
		min: 0,
		name: 'transport',
		step: 100,
		value: auxeroCalculatorInitial.transport
	},
	{
		active: false,
		key: 'dutyRate',
		label: 'Customs Duty',
		min: 0,
		mutedLabel: '(%)',
		name: 'dutyRate',
		step: 0.1,
		value: auxeroCalculatorInitial.dutyRate
	},
	{
		active: false,
		key: 'vatRate',
		label: 'VAT',
		min: 0,
		mutedLabel: '(%)',
		name: 'vatRate',
		step: 0.1,
		value: auxeroCalculatorInitial.vatRate
	},
	{
		active: false,
		key: 'prep',
		label: 'Preparation And Registration',
		min: 0,
		name: 'prep',
		step: 100,
		value: auxeroCalculatorInitial.prep
	}
];

export const formatEur = (value: number) =>
	`${Math.round(value)
		.toLocaleString('fr-FR')
		.replace(/\u202f/g, ' ')} EUR`;

export const calculateAuxeroCalculatorTotals = (
	values: Record<AuxeroCalculatorInputKey, number> = auxeroCalculatorInitial
) => {
	const duty = values.price * (values.dutyRate / 100);
	const vatBase = values.price + values.transport + duty;
	const vat = vatBase * (values.vatRate / 100);
	const total = vatBase + vat + values.prep;

	return { duty, total, vat };
};

export const createAuxeroCalculatorData = (): AuxeroCalculatorData => {
	const totals = calculateAuxeroCalculatorTotals();

	return {
		ctaHref: '/contact',
		ctaLabel: 'Request Exact Estimate',
		fields: auxeroCalculatorFields,
		summaryRows: [
			{ key: 'price', label: 'Vehicle Price', value: auxeroCalculatorInitial.price },
			{ key: 'transport', label: 'Transport', value: auxeroCalculatorInitial.transport },
			{ key: 'duty', label: 'Customs Duty', value: totals.duty },
			{ key: 'vat', label: 'VAT', value: totals.vat },
			{ key: 'prep', label: 'Preparation And Registration', value: auxeroCalculatorInitial.prep }
		],
		subtitle: 'Cost Summary',
		title: 'Estimated Landed Cost*',
		total: totals.total,
		totalNote: 'before vehicle-specific confirmation'
	};
};

export const auxeroCalculatorData = createAuxeroCalculatorData();
