import { firestore } from '@/config/firebase';
import { ResponseType, TransactionType, WalletType } from '@/types';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from 'firebase/firestore';

export const createOrUpdateTransaction = async (
	transactionData: Partial<TransactionType>,
): Promise<ResponseType> => {
	try {
		const { id, type, walletId, amount } = transactionData;

		if (!amount || Number(amount) <= 0 || !walletId || !type) {
			return { success: false, msg: 'Invalid transaction data!' };
		}

		if (id) {
			// РЕДАКТИРОВАНИЕ СУЩЕСТВУЮЩЕЙ ТРАНЗАКЦИИ
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
			// СОЗДАНИЕ НОВОЙ ТРАНЗАКЦИИ
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
			return { success: false, msg: 'Wallet not found' };
		}

		const walletData = walletSnapshot.data() as WalletType;

		if (type === 'expense' && (walletData.amount || 0) - amount < 0) {
			return {
				success: false,
				msg: "Selected wallet doesn't have enough balance",
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
		// --- 1. ОТКАТ СТАРОЙ ТРАНЗАКЦИИ ---
		const originalWalletRef = doc(
			firestore,
			'wallets',
			oldTransaction.walletId,
		);
		const originalWalletSnapshot = await getDoc(originalWalletRef);
		const originalWallet = originalWalletSnapshot.data() as WalletType;

		const revertType =
			oldTransaction.type === 'income' ? 'totalIncome' : 'totalExpenses';

		// Возвращаем баланс и вычитаем сумму из общих итогов (totalIncome/totalExpenses)
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

		// --- 2. ПРИМЕНЕНИЕ НОВОЙ ТРАНЗАКЦИИ ---
		const newWalletRef = doc(firestore, 'wallets', newWalletId);
		const newWalletSnapshot = await getDoc(newWalletRef);
		const newWallet = newWalletSnapshot.data() as WalletType;

		if (
			newTransactionType === 'expense' &&
			(newWallet.amount || 0) < newTransactionAmount
		) {
			return {
				success: false,
				msg: "The selected wallet doesn't have enough balance",
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
		// 1. Получаем данные удаляемой транзакции
		const transactionRef = doc(firestore, 'transactions', transactionId);
		const transactionSnapshot = await getDoc(transactionRef);

		if (!transactionSnapshot.exists()) {
			return { success: false, msg: 'Transaction not found' };
		}

		const transactionData = transactionSnapshot.data() as TransactionType;
		const transactionType = transactionData.type;
		const transactionAmount = Number(transactionData.amount);

		// 2. Получаем данные кошелька
		const walletRef = doc(firestore, 'wallets', walletId);
		const walletSnapshot = await getDoc(walletRef);

		if (!walletSnapshot.exists()) {
			return { success: false, msg: 'Wallet not found' };
		}

		const walletData = walletSnapshot.data() as WalletType;

		// 3. РАССЧИТЫВАЕМ НОВЫЕ ЗНАЧЕНИЯ
		const updateType =
			transactionType === 'income' ? 'totalIncome' : 'totalExpenses';

		// Баланс: если удаляем доход — вычитаем, если удаляем расход — возвращаем деньги
		const newWalletAmount =
			transactionType === 'income'
				? Number(walletData.amount || 0) - transactionAmount
				: Number(walletData.amount || 0) + transactionAmount;

		// Общие итоги: всегда вычитаем сумму удаляемой транзакции из соответствующего итога
		const newTotalAmount =
			Number(walletData[updateType] || 0) - transactionAmount;

		// Проверка: нельзя удалить доход, если после этого баланс станет отрицательным (опционально)
		if (transactionType === 'income' && newWalletAmount < 0) {
			return {
				success: false,
				msg: 'Cannot delete transaction: wallet balance would become negative',
			};
		}

		// 4. ОБНОВЛЯЕМ КОШЕЛЕК (именно через updateDoc)
		await updateDoc(walletRef, {
			amount: newWalletAmount,
			[updateType]: newTotalAmount,
		});

		// 5. УДАЛЯЕМ ТРАНЗАКЦИЮ
		await deleteDoc(transactionRef);

		return { success: true };
	} catch (error: any) {
		console.error('Error deleting transaction:', error);
		return { success: false, msg: error.message };
	}
};
