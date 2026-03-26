import { CategoryType } from '@/types';

import * as Icons from 'phosphor-react-native';

export const categoryGroups = [
	{ label: 'Needs', value: 'needs', color: '#075985' },
	{ label: 'Desires', value: 'desires', color: '#be185d' },
	{ label: 'Saving', value: 'saving', color: '#065F46' },
];

export const expenseCategories = {
	needs: [
		{
			label: 'House',
			value: 'house',
			icon: Icons.House,
			bgColor: '#4B5563',
		},
		{
			label: 'Products',
			value: 'products',
			icon: Icons.ShoppingCart,
			bgColor: '#075985',
		},
		{
			label: 'Medicine',
			value: 'medicine',
			icon: Icons.FirstAid,
			bgColor: '#e11d48',
		},
		{
			label: 'Transport',
			value: 'transport',
			icon: Icons.Car,
			bgColor: '#b45309',
		},
	],
	desires: [
		{
			label: 'Cloth',
			value: 'cloth',
			icon: Icons.TShirt,
			bgColor: '#7c3aed',
		},
		{
			label: 'Entertainment',
			value: 'entertainment',
			icon: Icons.FilmStrip,
			bgColor: '#0f766e',
		},
		{
			label: 'Subscriptions',
			value: 'subscriptions',
			icon: Icons.Rss,
			bgColor: '#a21caf',
		},
	],
	saving: [
		{
			label: 'Deposit',
			value: 'deposit',
			icon: Icons.Bank,
			bgColor: '#065F46',
		},
		{
			label: 'Insurance',
			value: 'insurance',
			icon: Icons.ShieldCheck,
			bgColor: '#404040',
		},
		{
			label: 'Credit',
			value: 'credit',
			icon: Icons.CreditCard,
			bgColor: '#525252',
		},
	],
};

export const incomeCategory: CategoryType = {
	label: 'Income',
	value: 'income',
	icon: Icons.CurrencyDollarSimple,
	bgColor: '#16a34a', // Dark
};

export const transactionTypes = [
	{ label: 'Expense', value: 'expense' },
	{ label: 'Income', value: 'income' },
];
