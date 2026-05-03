export const getLast7Days = () => {
	const daysOfWeek = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
	const result = [];

	for (let i = 6; i >= 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		result.push({
			day: daysOfWeek[date.getDay()],
			date: date.toISOString().split('T')[0],
			income: 0,
			expense: 0,
		});
	}
	return result.reverse();
};
export const getLast12Months = () => {
	const monthsOfYear = ['Січ', 'Лют', 'Бер', 'Квіт', 'Трав', 'Черв', 'Лип', 'Серп', 'Вер', 'Жовт', 'Лист', 'Груд'];
	const result = [];

	for (let i = 11; i >= 0; i--) {
		const date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - i);

		result.push({
			month: `${monthsOfYear[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`,
			key: `${date.getFullYear()}-${date.getMonth()}`,
			income: 0,
			expense: 0,
		});
	}
	return result.reverse();
};

export const getYearsRange = (startYear: number, endYear: number): any => {
	const result = [];
	for (let year = startYear; year <= endYear; year++) {
		result.push({
			year: year.toString(),
			fullDate: `01-01-${year}`,
			income: 0,
			expense: 0,
		});
	}

	return result.reverse();
};

export const getCurrencySymbol = (currency: string = 'UAH') => {
	switch (currency) {
		case 'USD':
			return '$';
		case 'EUR':
			return '€';
		case 'UAH':
			return '₴';
		default:
			return '₴';
	}
};
