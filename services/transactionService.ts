import { firestore } from '@/config/firebase';
import { colors } from '@/constants/theme';
import { ResponseType, TransactionType, WalletType } from '@/types';
import { getLast12Months, getLast7Days, getYearsRange } from '@/utils/common';
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

export const createOrUpdateTransaction = async (
	transactionData: Partial<TransactionType>,
): Promise<ResponseType> => {
	try {
		const { id, type, walletId, amount } = transactionData;

		if (!amount || Number(amount) <= 0 || !walletId || !type) {
			return { success: false, msg: 'Недійсні дані транзакції!' };
		}

		if (id) {
			const oldTransactionSnapshot = await getDoc(
				doc(firestore, 'transactions', id),
			);
			const oldTransaction =
				oldTransactionSnapshot.data() as TransactionType;

			const shouldRevertOriginal =
				oldTransaction.type !== type ||
				Number(oldTransaction.amount) !== Number(amount) ||
				oldTransaction.walletId !== walletId;

			if (shouldRevertOriginal) {
				const res = await revertAndUpdateWallets(
					oldTransaction,
					Number(amount),
					type,
					walletId,
				);
				if (!res.success) return res;
			}
		} else {
			const res = await updateWalletForNewTransaction(
				walletId!,
				Number(amount),
				type,
			);
			if (!res.success) return res;
		}

		const transactionRef = id
			? doc(firestore, 'transactions', id)
			: doc(collection(firestore, 'transactions'));

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

export const updateWalletForNewTransaction = async (
	walletId: string,
	amount: number,
	type: string,
) => {
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
			type === 'income'
				? Number(walletData.amount || 0) + amount
				: Number(walletData.amount || 0) - amount;

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
		const originalWalletRef = doc(
			firestore,
			'wallets',
			oldTransaction.walletId,
		);
		const originalWalletSnapshot = await getDoc(originalWalletRef);
		const originalWallet = originalWalletSnapshot.data() as WalletType;

		const revertType =
			oldTransaction.type === 'income' ? 'totalIncome' : 'totalExpenses';

		const revertedBalance =
			oldTransaction.type === 'income'
				? Number(originalWallet.amount || 0) -
					Number(oldTransaction.amount)
				: Number(originalWallet.amount || 0) +
					Number(oldTransaction.amount);

		const revertedTotal =
			Number(originalWallet[revertType] || 0) -
			Number(oldTransaction.amount);

		await updateDoc(originalWalletRef, {
			amount: revertedBalance,
			[revertType]: revertedTotal,
		});

		const newWalletRef = doc(firestore, 'wallets', newWalletId);
		const newWalletSnapshot = await getDoc(newWalletRef);
		const newWallet = newWalletSnapshot.data() as WalletType;

		if (
			newTransactionType === 'expense' &&
			(newWallet.amount || 0) < newTransactionAmount
		) {
			return {
				success: false,
				msg: 'Вибраний гаманець не має достатнього балансу',
			};
		}

		const updateType =
			newTransactionType === 'income' ? 'totalIncome' : 'totalExpenses';

		const finalBalance =
			newTransactionType === 'income'
				? Number(newWallet.amount || 0) + newTransactionAmount
				: Number(newWallet.amount || 0) - newTransactionAmount;

		const finalTotal =
			Number(newWallet[updateType] || 0) + newTransactionAmount;

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

export const deleteTransaction = async (
	transactionId: string,
	walletId: string,
) => {
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

		const updateType =
			transactionType === 'income' ? 'totalIncome' : 'totalExpenses';

		const newWalletAmount =
			transactionType === 'income'
				? Number(walletData.amount || 0) - transactionAmount
				: Number(walletData.amount || 0) + transactionAmount;

		const newTotalAmount =
			Number(walletData[updateType] || 0) - transactionAmount;

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

export const fetchWeekStats = async (uid: string): Promise<ResponseType> => {
	try {
		const db = firestore;
		const today = new Date();
		const sevenDaysAgo = new Date(today);
		sevenDaysAgo.setDate(today.getDate() - 7);

		const transactionsQuery = query(
			collection(db, 'transactions'),
			where('date', '>=', Timestamp.fromDate(sevenDaysAgo)),
			where('date', '<=', Timestamp.fromDate(today)),
			orderBy('date', 'desc'),
			where('uid', '==', uid),
		);

		const querySnapshot = await getDocs(transactionsQuery);
		const weeklyData = getLast7Days();
		const transactions: TransactionType[] = [];

		querySnapshot.forEach((doc) => {
			const transaction = doc.data() as TransactionType;
			transaction.id = doc.id;
			transactions.push(transaction);

			const transactionDate = (transaction.date as Timestamp)
				.toDate()
				.toISOString()
				.split('T')[0];

			const dayData = weeklyData.find(
				(day) => day.date == transactionDate,
			);

			if (dayData) {
				if (transaction.type == 'income') {
					dayData.income += transaction.amount;
				} else if (transaction.type == 'expense') {
					dayData.expense += transaction.amount;
				}
			}
		});

		const stats = weeklyData.flatMap((day) => [
			{
				value: day.income,
				label: day.day,
				spacing: scale(4),
				labelWidth: scale(30),
				frontColor: colors.primaryLight,
			},
			{
				value: day.expense,
				frontColor: colors.rose,
			},
		]);

		return { success: true, data: { stats, transactions } };
	} catch (error: any) {
		console.error('Error fetching weekly stats:', error);
		return { success: false, msg: error.message };
	}
};

export const fetchMonthStats = async (uid: string): Promise<ResponseType> => {
	try {
		const db = firestore;
		const today = new Date();
		const twelveMonthAgo = new Date(today);
		twelveMonthAgo.setMonth(today.getMonth() - 12);

		const transactionsQuery = query(
			collection(db, 'transactions'),
			where('date', '>=', Timestamp.fromDate(twelveMonthAgo)),
			where('date', '<=', Timestamp.fromDate(today)),
			orderBy('date', 'desc'),
			where('uid', '==', uid),
		);

		const querySnapshot = await getDocs(transactionsQuery);
		const monthlyData = getLast12Months();
		const transactions: TransactionType[] = [];

		querySnapshot.forEach((doc) => {
			const transaction = doc.data() as TransactionType;
			transaction.id = doc.id;
			transactions.push(transaction);

			const date = (transaction.date as Timestamp).toDate();
			const transactionKey = `${date.getFullYear()}-${date.getMonth()}`;

			const monthData = monthlyData.find((m) => {
				return m.key === transactionKey;
			});

			if (monthData) {
				if (transaction.type === 'income') {
					monthData.income += Number(transaction.amount);
				} else {
					monthData.expense += Number(transaction.amount);
				}
			}
		});

		const stats = monthlyData.flatMap((month) => [
			{
				value: month.income,
				label: month.month,
				spacing: scale(4),
				labelWidth: scale(46),
				frontColor: colors.primaryLight,
			},
			{
				value: month.expense,
				frontColor: colors.rose,
			},
		]);

		return { success: true, data: { stats, transactions } };
	} catch (error: any) {
		console.error('Error fetching monthly stats:', error);
		return { success: false, msg: error.message };
	}
};

export const fetchYearStats = async (uid: string): Promise<ResponseType> => {
	try {
		const db = firestore;

		const transactionsQuery = query(
			collection(db, 'transactions'),
			orderBy('date', 'desc'),
			where('uid', '==', uid),
		);

		const querySnapshot = await getDocs(transactionsQuery);
		const transactions: TransactionType[] = [];

		const firstTransaction = querySnapshot.docs.reduce((earliest, doc) => {
			const transactionDate = doc.data().date.toDate();
			return transactionDate < earliest ? transactionDate : earliest;
		}, new Date());

		const firstYear = firstTransaction.getFullYear();
		const currentYear = new Date().getFullYear();

		const yearlyData = getYearsRange(firstYear, currentYear);

		querySnapshot.forEach((doc) => {
			const transaction = doc.data() as TransactionType;
			transaction.id = doc.id;
			transactions.push(transaction);

			const transactionYear = (transaction.date as Timestamp)
				.toDate()
				.getFullYear();

			const yearData = yearlyData.find(
				(item: any) => item.year === transactionYear.toString(),
			);

			if (yearData) {
				if (transaction.type === 'income') {
					yearData.income += Number(transaction.amount);
				} else {
					yearData.expense += Number(transaction.amount);
				}
			}
		});

		const stats = yearlyData.flatMap((year: any) => [
			{
				value: year.income,
				label: year.year,
				spacing: scale(4),
				labelWidth: scale(46),
				frontColor: colors.primaryLight,
			},
			{
				value: year.expense,
				frontColor: colors.rose,
			},
		]);

		return { success: true, data: { stats, transactions } };
	} catch (error: any) {
		console.error('Error fetching yearly stats:', error);
		return { success: false, msg: error.message };
	}
};
