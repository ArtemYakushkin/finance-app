import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import TransactionList from '@/components/TransactionList';
import {
	categoryGroups,
	expenseCategories,
	incomeCategory,
} from '@/constants/data';
import { spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import useFetchData from '@/hooks/useFetchData';
import { TransactionType } from '@/types';
import { useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const SearchModal = () => {
	const { user } = useAuth();
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const constrains = [where('uid', '==', user?.uid), orderBy('date', 'desc')];

	const {
		data: allTransactions,
		error,
		loading: transactionsLoading,
	} = useFetchData<TransactionType>('transactions', constrains);

	// const filteredTransactions = allTransactions.filter((item) => {
	// 	if (search.length > 1) {
	// 		if (
	// 			item.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
	// 			item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
	// 			item.description?.toLowerCase()?.includes(search?.toLowerCase())
	// 		) {
	// 			return true;
	// 		}
	// 		return false;
	// 	}
	// 	return true;
	// });
	const filteredTransactions = allTransactions.filter((item) => {
		if (search.length > 1) {
			const searchLower = search.toLowerCase();

			let ukrCategory = '';
			if (item.type === 'income') {
				ukrCategory = incomeCategory.label.toLowerCase();
			} else {
				Object.values(expenseCategories)
					.flat()
					.forEach((cat) => {
						if (cat.value === item.category)
							ukrCategory = cat.label.toLowerCase();
					});
			}

			let ukrGroup = '';
			if (item.type !== 'income') {
				const groupKey = Object.keys(expenseCategories).find((key) =>
					expenseCategories[
						key as keyof typeof expenseCategories
					].some((c) => c.value === item.category),
				);
				ukrGroup =
					categoryGroups
						.find((g) => g.value === groupKey)
						?.label.toLowerCase() || '';
			}

			const ukrType = item.type === 'income' ? 'дохід' : 'витрати';

			return (
				item.description?.toLowerCase()?.includes(searchLower) ||
				ukrCategory.includes(searchLower) ||
				ukrGroup.includes(searchLower) ||
				ukrType.includes(searchLower)
			);
		}
		return true;
	});

	return (
		<ModalWrapper>
			<View style={styles.container}>
				<Header
					title={'Пошук'}
					leftIcon={<BackButton />}
					style={{ marginBottom: spacingY._10 }}
				/>
				<ScrollView contentContainerStyle={styles.form}>
					<View style={styles.inputContainer}>
						<Input
							placeholder="Знайти..."
							value={search}
							onChangeText={(value) => setSearch(value)}
						/>
					</View>

					<View>
						<TransactionList
							data={filteredTransactions}
							loading={transactionsLoading}
							emptyListMessage="Немає транзакцій, що відповідають вашим ключовим словам пошуку"
						/>
					</View>
				</ScrollView>
			</View>
		</ModalWrapper>
	);
};

export default SearchModal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: spacingY._20,
	},
	form: {
		gap: spacingY._30,
		marginTop: spacingY._15,
	},
	inputContainer: {
		gap: spacingY._10,
	},
});
