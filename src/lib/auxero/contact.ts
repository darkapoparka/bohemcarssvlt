import { bohemcarsContact } from '$lib/data/bohemcars';

export type AuxeroContactInputField = {
	active: boolean;
	id: string;
	label: string;
	name: string;
	placeholder?: string;
	type: 'email' | 'tel' | 'text';
};

export type AuxeroContactFormData = {
	fields: AuxeroContactInputField[];
	messageLabel: string;
	messagePlaceholder: string;
	submitLabel: string;
	subtitle: string;
	title: string;
};

export type AuxeroContactPageInfo = {
	description: string;
	emailHref: string;
	emailLabel: string;
	eyebrow: string;
	mapSrc: string;
	officeLabel: string;
	phoneHref: string;
	phoneLabel: string;
	secondaryPhoneHref: string;
	secondaryPhoneLabel: string;
	socials: Array<{
		href: string;
		icon: string;
		label: string;
	}>;
	title: string;
	workNote: string;
};

export const contactPageInfo: AuxeroContactPageInfo = {
	description:
		'Огледи, внос от Канада, документи и продажба на автомобил се уточняват с предварителна уговорка.',
	emailHref: bohemcarsContact.emailHref,
	emailLabel: bohemcarsContact.emailLabel,
	eyebrow: 'Контакт',
	mapSrc:
		'https://maps.google.com/maps?q=Plovdiv%20South%20Industrial%20Zone&t=&z=13&ie=UTF8&iwloc=&output=embed',
	officeLabel: 'Офис Bohemcars',
	phoneHref: bohemcarsContact.primaryPhoneHref,
	phoneLabel: bohemcarsContact.primaryPhoneLabel,
	secondaryPhoneHref: bohemcarsContact.marketplacePhoneHref,
	secondaryPhoneLabel: bohemcarsContact.marketplacePhoneLabel,
	socials: [
		{ href: bohemcarsContact.facebookHref, icon: 'input-facebook.svg', label: 'Facebook' },
		{ href: bohemcarsContact.viberHref, icon: 'ChatCircleDots.svg', label: 'Viber' },
		{ href: bohemcarsContact.youtubeHref, icon: 'input-youtube.svg', label: 'YouTube' }
	],
	title: 'Свържете се с Bohemcars',
	workNote: bohemcarsContact.appointmentNote
};

export const contactFormData: AuxeroContactFormData = {
	fields: [
		{
			active: true,
			id: 'Firstname',
			label: 'Име',
			name: 'Firstname',
			placeholder: 'Вашето име',
			type: 'text'
		},
		{
			active: false,
			id: 'Lastname',
			label: 'Фамилия',
			name: 'Lastname',
			placeholder: 'Вашата фамилия',
			type: 'text'
		},
		{
			active: false,
			id: 'SendInquiryemail',
			label: 'Имейл',
			name: 'SendInquiryemail',
			placeholder: 'Вашият имейл',
			type: 'email'
		},
		{
			active: false,
			id: 'SendInquiryphone',
			label: 'Телефон',
			name: 'SendInquiryphone',
			placeholder: 'Вашият телефон',
			type: 'tel'
		}
	],
	messageLabel: 'Съобщение',
	messagePlaceholder: 'Автомобил, VIN, линк към обява, бюджет или въпрос',
	submitLabel: 'Изпрати съобщение',
	subtitle: 'Огледи, внос от Канада, документи и продажба на автомобил - с уговорка.',
	title: 'Пишете ни за автомобил'
};
