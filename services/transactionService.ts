import { firestore } from '@/config/firebase';
import { colors } from '@/constants/theme';
import { ResponseType, TransactionType, WalletType } from '@/types';
import { scale } from '@/utils/styling';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	Timestamp,
	updateDoc,
	where,
} from 'firebase/firestore';

export const createOrUpdateTransaction = async (transactionData: Partial<TransactionType>): Promise<ResponseType> => {
	try {
		const { id, type, walletId, amount } = transactionData;

		if (!amount || Number(amount) <= 0 || !walletId || !type) {
			return { success: false, msg: 'Недійсні дані транзакції!' };
		}

		if (id) {
			const oldTransactionSnapshot = await getDoc(doc(firestore, 'transactions', id));
			const oldTransaction = oldTransactionSnapshot.data() as TransactionType;

			const shouldRevertOriginal =
				oldTransaction.type !== type ||
				Number(oldTransaction.amount) !== Number(amount) ||
				oldTransaction.walletId !== walletId;

			if (shouldRevertOriginal) {
				const res = await revertAndUpdateWallets(oldTransaction, Number(amount), type, walletId);
				if (!res.success) return res;
			}
		} else {
			const res = await updateWalletForNewTransaction(walletId!, Number(amount), type);
			if (!res.success) return res;
		}

		const transactionRef = id ? doc(firestore, 'transactions', id) : doc(collection(firestore, 'transactions'));

		await setDoc(transactionRef, transactionData, { merge: true });

		return {
			success: true,
			data: { ...transactionData, id: transactionRef.id },
		};
	} catch (error: any) {
		console.error('Error creating or updating transaction:', error);
		return { success: false, msg: error.message };
	}
};

export const updateWalletForNewTransaction = async (walletId: string, amount: number, type: string) => {
	try {
		const walletRef = doc(firestore, 'wallets', walletId);
		const walletSnapshot = await getDoc(walletRef);

		if (!walletSnapshot.exists()) {
			return { success: false, msg: 'Гаманець не знайдено' };
		}

		const walletData = walletSnapshot.data() as WalletType;

		if (type === 'expense' && (walletData.amount || 0) - amount < 0) {
			return {
				success: false,
				msg: 'Вибраний гаманець не має достатнього балансу',
			};
		}

		const updatedType = type === 'income' ? 'totalIncome' : 'totalExpenses';
		const updatedWalletAmount =
			type === 'income' ? Number(walletData.amount || 0) + amount : Number(walletData.amount || 0) - amount;

		const updatedTotals = Number(walletData[updatedType] || 0) + amount;

		await updateDoc(walletRef, {
			amount: updatedWalletAmount,
			[updatedType]: updatedTotals,
		});

		return { success: true };
	} catch (error: any) {
		console.error('Error updating wallet:', error);
		return { success: false, msg: error.message };
	}
};

const revertAndUpdateWallets = async (
	oldTransaction: TransactionType,
	newTransactionAmount: number,
	newTransactionType: string,
	newWalletId: string,
) => {
	try {
		const originalWalletRef = doc(firestore, 'wallets', oldTransaction.walletId);
		const originalWalletSnapshot = await getDoc(originalWalletRef);
		const originalWallet = originalWalletSnapshot.data() as WalletType;

		const revertType = oldTransaction.type === 'income' ? 'totalIncome' : 'totalExpenses';

		const revertedBalance =
			oldTransaction.type === 'income'
				? Number(originalWallet.amount || 0) - Number(oldTransaction.amount)
				: Number(originalWallet.amount || 0) + Number(oldTransaction.amount);

		const revertedTotal = Number(originalWallet[revertType] || 0) - Number(oldTransaction.amount);

		await updateDoc(originalWalletRef, {
			amount: revertedBalance,
			[revertType]: revertedTotal,
		});

		const newWalletRef = doc(firestore, 'wallets', newWalletId);
		const newWalletSnapshot = await getDoc(newWalletRef);
		const newWallet = newWalletSnapshot.data() as WalletType;

		if (newTransactionType === 'expense' && (newWallet.amount || 0) < newTransactionAmount) {
			return {
				success: false,
				msg: 'Вибраний гаманець не має достатнього балансу',
			};
		}

		const updateType = newTransactionType === 'income' ? 'totalIncome' : 'totalExpenses';

		const finalBalance =
			newTransactionType === 'income'
				? Number(newWallet.amount || 0) + newTransactionAmount
				: Number(newWallet.amount || 0) - newTransactionAmount;

		const finalTotal = Number(newWallet[updateType] || 0) + newTransactionAmount;

		await updateDoc(newWalletRef, {
			amount: finalBalance,
			[updateType]: finalTotal,
		});

		return { success: true };
	} catch (error: any) {
		console.error('Error in revertAndUpdateWallets:', error);
		return { success: false, msg: error.message };
	}
};

export const deleteTransaction = async (transactionId: string, walletId: string) => {
	try {
		const transactionRef = doc(firestore, 'transactions', transactionId);
		const transactionSnapshot = await getDoc(transactionRef);

		if (!transactionSnapshot.exists()) {
			return { success: false, msg: 'Transaction not found' };
		}

		const transactionData = transactionSnapshot.data() as TransactionType;
		const transactionType = transactionData.type;
		const transactionAmount = Number(transactionData.amount);

		const walletRef = doc(firestore, 'wallets', walletId);
		const walletSnapshot = await getDoc(walletRef);

		if (!walletSnapshot.exists()) {
			return { success: false, msg: 'Гаманець не знайдено' };
		}

		const walletData = walletSnapshot.data() as WalletType;

		const updateType = transactionType === 'income' ? 'totalIncome' : 'totalExpenses';

		const newWalletAmount =
			transactionType === 'income'
				? Number(walletData.amount || 0) - transactionAmount
				: Number(walletData.amount || 0) + transactionAmount;

		const newTotalAmount = Number(walletData[updateType] || 0) - transactionAmount;

		if (transactionType === 'income' && newWalletAmount < 0) {
			return {
				success: false,
				msg: "Неможливо видалити транзакцію: баланс гаманця стане від'ємним",
			};
		}

		await updateDoc(walletRef, {
			amount: newWalletAmount,
			[updateType]: newTotalAmount,
		});

		await deleteDoc(transactionRef);

		return { success: true };
	} catch (error: any) {
		console.error('Error deleting transaction:', error);
		return { success: false, msg: error.message };
	}
};

export const fetchMonthStats = async (uid: string, selectedDate: Date): Promise<ResponseType> => {
	try {
		const db = firestore;
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth();

		const startOfMonth = new Date(year, month, 1);
		const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

		const transactionsQuery = query(
			collection(db, 'transactions'),
			where('uid', '==', uid),
			where('date', '>=', Timestamp.fromDate(startOfMonth)),
			where('date', '<=', Timestamp.fromDate(endOfMonth)),
			orderBy('date', 'desc'),
		);

		const querySnapshot = await getDocs(transactionsQuery);

		const monthsOfYear = [
			'Січ',
			'Лют',
			'Бер',
			'Квіт',
			'Трав',
			'Черв',
			'Лип',
			'Серп',
			'Вер',
			'Жовт',
			'Лист',
			'Груд',
		];

		// ЯВНАЯ ТИПИЗАЦИЯ МАССИВА
		const monthlyData: { month: string; key: string; income: number; expense: number }[] = [];

		for (let i = 0; i < 12; i++) {
			monthlyData.push({
				month: `${monthsOfYear[i]} ${year.toString().slice(-2)}`,
				key: `${year}-${i}`,
				income: 0,
				expense: 0,
			});
		}

		const transactions: TransactionType[] = [];
		querySnapshot.forEach((doc) => {
			const transaction = doc.data() as TransactionType;
			transaction.id = doc.id;
			transactions.push(transaction);

			const date = (transaction.date as Timestamp).toDate();
			const transactionKey = `${date.getFullYear()}-${date.getMonth()}`;
			const monthData = monthlyData.find((m) => m.key === transactionKey);

			if (monthData) {
				if (transaction.type === 'income') monthData.income += Number(transaction.amount);
				else monthData.expense += Number(transaction.amount);
			}
		});

		const stats = monthlyData
			.filter((m) => m.income > 0 || m.expense > 0 || m.key === `${year}-${month}`)
			.flatMap((month) => [
				{
					value: month.income,
					label: month.month,
					spacing: scale(4),
					labelWidth: scale(46),
					frontColor: colors.primaryLight,
				},
				{ value: month.expense, frontColor: colors.rose },
			]);

		return { success: true, data: { stats, transactions } };
	} catch (error: any) {
		return { success: false, msg: error.message };
	}
};

export const fetchYearStats = async (uid: string, selectedDate: Date): Promise<ResponseType> => {
	try {
		const db = firestore;
		const year = selectedDate.getFullYear();
		const startOfYear = new Date(year, 0, 1);
		const endOfYear = new Date(year, 11, 31, 23, 59, 59);

		const transactionsQuery = query(
			collection(db, 'transactions'),
			where('uid', '==', uid),
			where('date', '>=', Timestamp.fromDate(startOfYear)),
			where('date', '<=', Timestamp.fromDate(endOfYear)),
			orderBy('date', 'desc'),
		);

		const querySnapshot = await getDocs(transactionsQuery);
		const transactions: TransactionType[] = [];

		// Группируем по годам (можно расширить диапазон, если нужно сравнение)
		const yearlyData = [
			{
				year: year.toString(),
				income: 0,
				expense: 0,
			},
		];

		querySnapshot.forEach((doc) => {
			const transaction = doc.data() as TransactionType;
			transaction.id = doc.id;
			transactions.push(transaction);

			if (transaction.type === 'income') yearlyData[0].income += Number(transaction.amount);
			else yearlyData[0].expense += Number(transaction.amount);
		});

		const stats = yearlyData.flatMap((y) => [
			{
				value: y.income,
				label: y.year,
				spacing: scale(4),
				labelWidth: scale(46),
				frontColor: colors.primaryLight,
			},
			{ value: y.expense, frontColor: colors.rose },
		]);

		return { success: true, data: { stats, transactions } };
	} catch (error: any) {
		return { success: false, msg: error.message };
	}
};

export const fetchCategories = async (uid: string) => {
	try {
		const categoriesRef = collection(firestore, 'categories');

		const q = query(categoriesRef, where('uid', '==', uid));
		const querySnapshot = await getDocs(q);

		let categories: any[] = [];
		querySnapshot.forEach((doc) => {
			categories.push({ id: doc.id, ...doc.data() });
		});

		return { success: true, data: categories };
	} catch (error: any) {
		console.error('Error fetching categories: ', error);
		return { success: false, msg: error.message };
	}
};
