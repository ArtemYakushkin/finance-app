import { CategoryType } from '@/types';

import * as Icons from 'phosphor-react-native';

export const categoryGroups = [
	{ label: 'База', value: 'needs', color: '#4a90e2', icon: Icons.HouseLine },
	{ label: 'Хочу', value: 'desires', color: '#ef4444', icon: Icons.Star },
	{
		label: 'Резерв',
		value: 'saving',
		color: '#a3e635',
		icon: Icons.PiggyBank,
	},
];

export const expenseCategories = {
	needs: [
		{
			label: 'Житло',
			value: 'house',
			icon: Icons.House,
			bgColor: '#4B5563',
		},
		{
			label: 'Продукти',
			value: 'products',
			icon: Icons.ShoppingCart,
			bgColor: '#075985',
		},
		{
			label: 'Медицина',
			value: 'medicine',
			icon: Icons.FirstAid,
			bgColor: '#e11d48',
		},
		{
			label: 'Транспорт',
			value: 'transport',
			icon: Icons.Car,
			bgColor: '#b45309',
		},
	],
	desires: [
		{
			label: 'Одяг',
			value: 'cloth',
			icon: Icons.TShirt,
			bgColor: '#7c3aed',
		},
		{
			label: 'Розваги',
			value: 'entertainment',
			icon: Icons.FilmStrip,
			bgColor: '#0f766e',
		},
		{
			label: 'Підписки',
			value: 'subscriptions',
			icon: Icons.Rss,
			bgColor: '#a21caf',
		},
	],
	saving: [
		{
			label: 'Депозит',
			value: 'deposit',
			icon: Icons.Bank,
			bgColor: '#065F46',
		},
		{
			label: 'Страхування',
			value: 'insurance',
			icon: Icons.ShieldCheck,
			bgColor: '#404040',
		},
		{
			label: 'Кредит',
			value: 'credit',
			icon: Icons.CreditCard,
			bgColor: '#525252',
		},
	],
};

export const incomeCategory: CategoryType = {
	label: 'Дохід',
	value: 'income',
	icon: Icons.CurrencyDollarSimple,
	bgColor: '#16a34a',
};

export const transactionTypes = [
	{ label: 'Витрати', value: 'expense' },
	{ label: 'Дохід', value: 'income' },
];
