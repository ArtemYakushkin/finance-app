import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import CalculatorModal from '@/components/CalculatorModal';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import {
	categoryGroups,
	expenseCategories,
	transactionTypes,
} from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import useFetchData from '@/hooks/useFetchData';
import {
	createOrUpdateTransaction,
	deleteTransaction,
} from '@/services/transactionService';
import { TransactionType, WalletType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Shadow } from 'react-native-shadow-2';

const TransactionModal = () => {
	const { user } = useAuth();
	const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
	const [transaction, setTransaction] = useState<TransactionType>({
		type: 'expense',
		amount: 0,
		description: '',
		category: '',
		date: new Date(),
		walletId: '',
		image: null,
	});
	const [loading, setLoading] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showCalculator, setShowCalculator] = useState(false);
	const router = useRouter();

	const {
		data: wallets,
		error: walletError,
		loading: walletLoading,
	} = useFetchData<WalletType>(
		'wallets',
		user?.uid
			? [where('uid', '==', user?.uid), orderBy('created', 'desc')]
			: [],
	);

	type paramType = {
		id: string;
		type: string;
		amount: string;
		category?: string;
		date: string;
		description?: string;
		uid?: string;
		walletId: string;
	};

	const oldTransaction: paramType = useLocalSearchParams();

	useEffect(() => {
		if (oldTransaction?.id) {
			const group = Object.keys(expenseCategories).find((key) =>
				expenseCategories[key as keyof typeof expenseCategories].some(
					(cat) => cat.value === oldTransaction.category,
				),
			);
			if (group) setSelectedGroup(group);

			setTransaction({
				type: oldTransaction?.type,
				amount: Number(oldTransaction.amount),
				description: oldTransaction.description || '',
				category: oldTransaction.category || '',
				date: new Date(oldTransaction.date),
				walletId: oldTransaction.walletId,
			});
		}
	}, []);

	const onDateChange = (event: any, selectedDate: any) => {
		const currentDate = selectedDate || transaction.date;
		setTransaction({ ...transaction, date: currentDate });
		setShowDatePicker(false);
	};

	const onDelete = async () => {
		if (!oldTransaction?.id) return;
		setLoading(true);
		const res = await deleteTransaction(
			oldTransaction?.id,
			oldTransaction.walletId,
		);
		setLoading(false);
		if (res.success) {
			router.back();
		} else {
			Alert.alert('Transaction', res.msg);
		}
	};

	const showDeleteAlert = () => {
		Alert.alert(
			'Confirm',
			'Are you sure you want to delete this transaction',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('cancel delete'),
					style: 'cancel',
				},
				{
					text: 'Delete',
					onPress: () => onDelete(),
					style: 'destructive',
				},
			],
		);
	};

	const onSubmit = async () => {
		const { type, description, amount, category, date, walletId } =
			transaction;

		if (!walletId || !date || !amount || (type == 'expense' && !category)) {
			Alert.alert('Transaction', 'Please fill all the fields!');
			return;
		}

		// --- ЛОГИКА ОПРЕДЕЛЕНИЯ ГРУППЫ ---
		let categoryGroup = 'income'; // По умолчанию для доходов

		if (type === 'expense' && category) {
			// Ищем, к какой группе относится выбранная категория в константах
			for (const group in expenseCategories) {
				const found = expenseCategories[
					group as keyof typeof expenseCategories
				].find((cat) => cat.value === category);
				if (found) {
					categoryGroup = group; // 'needs', 'desires' или 'saving'
					break;
				}
			}
		}

		let transactionData: TransactionType = {
			type,
			description,
			amount,
			category,
			categoryGroup, // Сохраняем группу в объект
			date,
			walletId,
			uid: user?.uid,
		};

		if (oldTransaction?.id) {
			transactionData.id = oldTransaction.id;
		}

		setLoading(true);
		const res = await createOrUpdateTransaction(transactionData);

		setLoading(false);
		if (res.success) {
			router.back();
		} else {
			Alert.alert('Transaction', res.msg);
		}
	};

	return (
		<ModalWrapper>
			<View style={styles.container}>
				<Header
					title={
						oldTransaction?.id
							? 'Update Transaction'
							: 'New Transaction'
					}
					leftIcon={<BackButton />}
					style={{ marginBottom: spacingY._10 }}
				/>
				<ScrollView
					contentContainerStyle={styles.form}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.inputContainer}>
						<Typo color={colors.neutral200} size={16}>
							Type
						</Typo>
						<View style={styles.typeContainer}>
							{transactionTypes.map((item) => {
								const isActive =
									transaction.type === item.value;
								const activeTextColor =
									item.value === 'income'
										? colors.primary
										: colors.rose;

								return (
									<Button
										key={item.value}
										onPress={() =>
											setTransaction({
												...transaction,
												type: item.value,
											})
										}
										style={{ flex: 1 }}
									>
										<Typo
											size={16}
											fontWeight={
												isActive ? '700' : '500'
											}
											color={
												isActive
													? activeTextColor
													: colors.neutral400
											}
										>
											{item.label}
										</Typo>
									</Button>
								);
							})}
						</View>
					</View>

					<View style={styles.inputContainer}>
						<Typo color={colors.neutral200} size={16}>
							Wallet
						</Typo>
						<View style={styles.dropdownShadowHolder}>
							<Shadow
								distance={7}
								startColor={'#262626'}
								offset={[-2, -2]}
								stretch
								style={{ borderRadius: radius._17 }}
							>
								<Shadow
									distance={7}
									startColor={'#101010'}
									offset={[2, 2]}
									stretch
									style={{ borderRadius: radius._17 }}
								>
									<Dropdown
										style={styles.dropdownContainer}
										activeColor={colors.neutral700}
										placeholderStyle={
											styles.dropdownPlaceholder
										}
										selectedTextStyle={
											styles.dropdownSelectedText
										}
										iconStyle={styles.dropdownIcon}
										data={wallets.map((wallet) => ({
											label: `${wallet?.name} ($${wallet?.amount})`,
											value: wallet?.id,
										}))}
										maxHeight={300}
										labelField="label"
										valueField="value"
										itemTextStyle={styles.dropdownItemText}
										itemContainerStyle={
											styles.dropdownItemContainer
										}
										containerStyle={
											styles.dropdownListContainer
										}
										placeholder={'Select wallet'}
										value={transaction.walletId}
										onChange={(item) => {
											setTransaction({
												...transaction,
												walletId: item.value || '',
											});
										}}
									/>
								</Shadow>
							</Shadow>
						</View>
					</View>

					{transaction.type === 'expense' && (
						<View style={styles.inputContainer}>
							<Typo color={colors.neutral200} size={16}>
								Category Group
							</Typo>
							<View
								style={[
									styles.typeContainer,
									{ marginBottom: 20 },
								]}
							>
								{categoryGroups.map((group) => {
									const isActive =
										selectedGroup === group.value;
									return (
										<Button
											key={group.value}
											onPress={() => {
												setSelectedGroup(group.value);
												setTransaction({
													...transaction,
													category: '',
												}); // сброс подкатегории при смене группы
											}}
											style={{
												flex: 1,
											}}
										>
											<Typo
												size={14}
												fontWeight={
													isActive ? '700' : '500'
												}
												color={
													isActive
														? group.color
														: colors.neutral400
												}
											>
												{group.label}
											</Typo>
										</Button>
									);
								})}
							</View>

							{selectedGroup && (
								<View style={styles.inputContainer}>
									<Typo color={colors.neutral200} size={16}>
										Subcategory
									</Typo>
									<View style={styles.dropdownShadowHolder}>
										<Shadow
											distance={7}
											startColor={'#262626'}
											offset={[-2, -2]}
											stretch
											style={{ borderRadius: radius._17 }}
										>
											<Shadow
												distance={7}
												startColor={'#101010'}
												offset={[2, 2]}
												stretch
												style={{
													borderRadius: radius._17,
												}}
											>
												<Dropdown
													style={
														styles.dropdownContainer
													}
													activeColor={
														colors.neutral700
													}
													placeholderStyle={
														styles.dropdownPlaceholder
													}
													selectedTextStyle={
														styles.dropdownSelectedText
													}
													iconStyle={
														styles.dropdownIcon
													}
													data={
														expenseCategories[
															selectedGroup as keyof typeof expenseCategories
														]
													}
													maxHeight={300}
													labelField="label"
													valueField="value"
													itemTextStyle={
														styles.dropdownItemText
													}
													itemContainerStyle={
														styles.dropdownItemContainer
													}
													containerStyle={
														styles.dropdownListContainer
													}
													placeholder={
														'Select subcategory'
													}
													value={transaction.category}
													onChange={(item) => {
														setTransaction({
															...transaction,
															category:
																item.value,
														});
													}}
												/>
											</Shadow>
										</Shadow>
									</View>
								</View>
							)}
						</View>
					)}

					<View style={styles.inputContainer}>
						<Typo color={colors.neutral200} size={16}>
							Date
						</Typo>
						{!showDatePicker && (
							<View
								style={[
									styles.innerShadowWrapper,
									{
										borderRadius: radius._17,
										backgroundColor: colors.neutral900,
										marginHorizontal: spacingX._5,
									},
								]}
							>
								<Shadow
									distance={8}
									startColor={'rgba(0, 0, 0, 0.7)'}
									offset={[4, 4]}
									stretch
									style={{ alignSelf: 'stretch' }}
								>
									<Shadow
										distance={8}
										startColor={'rgba(45, 45, 45, 0.4)'}
										offset={[-3, -3]}
										stretch
										style={{ alignSelf: 'stretch' }}
									>
										<Pressable
											style={styles.dateInput}
											onPress={() =>
												setShowDatePicker(true)
											}
										>
											<Typo size={14}>
												{(
													transaction.date as Date
												).toLocaleDateString()}
											</Typo>
										</Pressable>
									</Shadow>
								</Shadow>
							</View>
						)}

						{showDatePicker && (
							<View
								style={
									Platform.OS == 'ios' && styles.iosDatePicker
								}
							>
								<DateTimePicker
									themeVariant="dark"
									value={transaction.date as Date}
									textColor={colors.white}
									mode="date"
									display="spinner"
									onChange={onDateChange}
								/>

								{Platform.OS == 'ios' && (
									<TouchableOpacity
										onPress={() => setShowDatePicker(false)}
									>
										<Typo size={15} fontWeight={500}>
											Ok
										</Typo>
									</TouchableOpacity>
								)}
							</View>
						)}
					</View>

					{/* <View style={styles.inputContainer}>
						<Typo color={colors.neutral200} size={16}>
							Amount
						</Typo>
						<View style={{ marginHorizontal: spacingX._5 }}>
							<Input
								keyboardType="numeric"
								value={transaction.amount?.toString()}
								onChangeText={(value) =>
									setTransaction({
										...transaction,
										amount: Number(
											value.replace(/[^0-9]/g, ''),
										),
									})
								}
							/>
						</View>
					</View> */}

					<View style={styles.inputContainer}>
						<Typo color={colors.neutral200} size={16}>
							Amount
						</Typo>
						<Pressable
							onPress={() => setShowCalculator(true)} // Открываем по нажатию на область
							style={{ marginHorizontal: spacingX._5 }}
						>
							<View pointerEvents="none">
								<Input
									placeholder="0"
									value={transaction.amount?.toString()}
									editable={false} // Чтобы системная клавиатура не мешала
								/>
							</View>
						</Pressable>
					</View>

					<View style={[styles.inputContainer, { marginBottom: 30 }]}>
						<Typo color={colors.neutral200}>Description</Typo>
						<Input
							value={transaction.description}
							onChangeText={(value) =>
								setTransaction({
									...transaction,
									description: value,
								})
							}
						/>
					</View>
				</ScrollView>
			</View>

			<View style={styles.footer}>
				{oldTransaction?.id && (
					<Button
						style={{ marginRight: 5 }}
						onPress={showDeleteAlert}
					>
						<Icons.Trash
							color={colors.rose}
							size={verticalScale(24)}
							weight="bold"
						/>
					</Button>
				)}
				<Button
					onPress={onSubmit}
					loading={loading}
					style={{ flex: 1 }}
				>
					<Typo
						fontWeight={'700'}
						color={colors.primaryLight}
						size={21}
					>
						{oldTransaction?.id ? 'Update' : 'Submit'}
					</Typo>
				</Button>
			</View>

			<CalculatorModal
				isVisible={showCalculator}
				initialValue={transaction.amount?.toString() || ''}
				onClose={(val) => {
					const numericValue = Number(val.replace(/[^0-9.]/g, ''));
					setTransaction({ ...transaction, amount: numericValue });
					setShowCalculator(false);
				}}
			/>
		</ModalWrapper>
	);
};

export default TransactionModal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: spacingY._20,
	},
	typeContainer: {
		flexDirection: 'row',
		gap: scale(12),
		paddingHorizontal: spacingX._10,
		marginTop: spacingX._10,
	},
	dropdownShadowHolder: {
		marginHorizontal: spacingX._10,
		marginTop: spacingY._10,
	},
	dropdownContainer: {
		height: verticalScale(54),
		borderWidth: 1,
		paddingHorizontal: spacingX._15,
		borderCurve: 'continuous',
		backgroundColor: '#171717',
		borderRadius: radius._17,
		borderColor: '#1B1B1B',
	},
	dropdownPlaceholder: {
		color: colors.white,
	},
	dropdownSelectedText: {
		color: colors.white,
		fontSize: verticalScale(14),
	},
	dropdownIcon: {
		height: verticalScale(30),
		tintColor: colors.neutral300,
	},
	dropdownItemText: {
		color: colors.white,
	},
	dropdownItemContainer: {
		borderRadius: radius._15,
		marginHorizontal: spacingX._7,
	},
	dropdownListContainer: {
		backgroundColor: colors.neutral900,
		borderRadius: radius._15,
		borderCurve: 'continuous',
		paddingVertical: spacingY._7,
		top: 5,
		borderColor: colors.neutral500,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 1,
		shadowRadius: 15,
		elevation: 5,
	},
	innerShadowWrapper: {
		overflow: 'hidden',
		borderWidth: 1,
	},
	dateInput: {
		height: verticalScale(54),
		justifyContent: 'center',
		paddingHorizontal: spacingX._15,
	},
	iosDatePicker: {},
	footer: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		paddingHorizontal: spacingY._20,
		gap: scale(24),
		paddingTop: spacingY._15,
		borderTopColor: colors.neutral700,
		borderTopWidth: 1,
		marginBottom: spacingY._60,
	},
	form: {
		gap: spacingY._30,
		marginTop: spacingY._15,
	},
	avatarContainer: {
		position: 'relative',
		alignSelf: 'center',
	},
	avatar: {
		alignSelf: 'center',
		backgroundColor: colors.neutral300,
		height: verticalScale(135),
		width: verticalScale(135),
		borderRadius: 200,
		borderWidth: 1,
		borderColor: colors.neutral500,
	},
	editIcon: {
		position: 'absolute',
		bottom: spacingY._5,
		right: spacingY._7,
		borderRadius: 100,
		backgroundColor: colors.neutral300,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 10,
		elevation: 4,
		padding: spacingY._7,
	},
	inputContainer: {
		gap: spacingY._10,
	},
});
