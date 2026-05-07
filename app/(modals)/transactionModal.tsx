import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import CalculatorModal from '@/components/CalculatorModal';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { categoryGroups, expenseCategories, transactionTypes } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import useFetchData from '@/hooks/useFetchData';
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService';
import { TransactionType, WalletType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
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

	const btnRadius = radius._17;
	const lightShadow = 'rgba(65, 71, 85, 0.5)';
	const darkShadow = colors.gradientEnd;
	const concavedGradientColors: [string, string] = [colors.gradientMid as string, colors.gradientEnd as string];
	const gradientColors: [string, string, ...string[]] = [colors.gradientStart, colors.gradientMid];

	const { data: userCategories, loading: categoriesLoading } = useFetchData<any>(
		'categories',
		user?.uid ? [where('uid', '==', user?.uid)] : [],
	);

	const {
		data: wallets,
		error: walletError,
		loading: walletLoading,
	} = useFetchData<WalletType>(
		'wallets',
		user?.uid ? [where('uid', '==', user?.uid), orderBy('created', 'desc')] : [],
	);

	// 2. Фильтруем категории по выбранной группе (для выпадающего списка)
	const filteredSubCategories = userCategories
		.filter((cat) => cat.group === selectedGroup && cat.type === transaction.type)
		.map((cat) => ({ label: cat.name, value: cat.name }));

	// 3. Эффект для автоматического открытия модалки создания категорий
	const handleCategorySelectPress = () => {
		if (filteredSubCategories.length === 0) {
			// Если подкатегорий в этой группе нет, сразу отправляем на создание
			router.push('/(modals)/categoriesModal');
		}
	};

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
		const res = await deleteTransaction(oldTransaction?.id, oldTransaction.walletId);
		setLoading(false);
		if (res.success) {
			router.back();
		} else {
			Alert.alert('Транзакція', res.msg);
		}
	};

	const showDeleteAlert = () => {
		Alert.alert('Підтвердити', 'Ви впевнені, що хочете видалити цю транзакцію?', [
			{
				text: 'Скасувати',
				onPress: () => console.log('cancel delete'),
				style: 'cancel',
			},
			{
				text: 'Видалити',
				onPress: () => onDelete(),
				style: 'destructive',
			},
		]);
	};

	const onSubmit = async () => {
		const { type, description, amount, category, date, walletId } = transaction;

		if (!walletId || !date || !amount || (type == 'expense' && !category)) {
			Alert.alert('Транзакція', 'Будь ласка, заповніть усі поля!');
			return;
		}

		// Находим группу категории из загруженных данных
		const categoryData = userCategories.find((c) => c.name === category);
		const categoryGroup = categoryData ? categoryData.group : type === 'income' ? 'income' : 'other';

		let transactionData: TransactionType = {
			type,
			description,
			amount,
			category,
			categoryGroup,
			date,
			walletId,
			uid: user?.uid,
		};

		if (oldTransaction?.id) transactionData.id = oldTransaction.id;

		setLoading(true);
		const res = await createOrUpdateTransaction(transactionData);
		setLoading(false);
		if (res.success) router.back();
		else Alert.alert('Помилка', res.msg);
	};

	return (
		<ModalWrapper>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
				<View style={styles.container}>
					<Header
						title={oldTransaction?.id ? 'Оновити транзакцію' : 'Нова транзакція'}
						leftIcon={<BackButton />}
						style={{ marginBottom: spacingY._10 }}
					/>
					<ScrollView
						contentContainerStyle={styles.form}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					>
						<View style={styles.inputContainer}>
							<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 5 }}>
								Тип
							</Typo>
							<View style={styles.typeContainer}>
								{transactionTypes.map((item) => {
									const isActive = transaction.type === item.value;
									const activeTextColor = item.value === 'income' ? colors.primary : colors.rose;

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
												fontWeight={isActive ? '700' : '500'}
												color={isActive ? activeTextColor : colors.neutral400}
											>
												{item.label}
											</Typo>
										</Button>
									);
								})}
							</View>
						</View>

						<View style={styles.inputContainer}>
							<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 5 }}>
								Гаманець
							</Typo>
							<View style={styles.dropdownShadowHolder}>
								<Shadow
									distance={6}
									startColor={lightShadow}
									offset={[-1, -1]}
									stretch
									containerStyle={{ borderRadius: btnRadius }}
									style={[styles.shadowWrapper, { borderRadius: btnRadius }]}
								>
									<Shadow
										distance={8}
										startColor={darkShadow}
										offset={[2, 2]}
										stretch
										style={styles.shadowWrapper}
									>
										<LinearGradient
											colors={gradientColors}
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 1 }}
											style={[styles.dropdownGradientWrapper, { borderRadius: btnRadius }]}
										>
											<Dropdown
												style={[
													styles.dropdownContainer,
													{ backgroundColor: 'transparent', borderWidth: 0 },
												]}
												activeColor={colors.gradientStart}
												placeholderStyle={styles.dropdownPlaceholder}
												selectedTextStyle={styles.dropdownSelectedText}
												iconStyle={styles.dropdownIcon}
												data={wallets.map((wallet) => ({
													label: `${wallet?.name} ($${wallet?.amount})`,
													value: wallet?.id,
												}))}
												maxHeight={300}
												labelField="label"
												valueField="value"
												itemTextStyle={styles.dropdownItemText}
												itemContainerStyle={styles.dropdownItemContainer}
												containerStyle={styles.dropdownListContainer}
												placeholder={'Вибрати гаманець'}
												value={transaction.walletId}
												onChange={(item) => {
													setTransaction({
														...transaction,
														walletId: item.value || '',
													});
												}}
											/>
										</LinearGradient>
									</Shadow>
								</Shadow>
							</View>
						</View>

						{transaction.type === 'expense' && (
							<View style={styles.inputContainer}>
								<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 5 }}>
									Група категорій
								</Typo>
								<View style={styles.typeContainer}>
									{categoryGroups.map((group) => {
										const isActive = selectedGroup === group.value;
										return (
											<Button
												key={group.value}
												onPress={() => {
													setSelectedGroup(group.value);
													setTransaction((prev) => ({ ...prev, category: '' }));
												}}
												style={{ flex: 1 }}
											>
												<Typo
													size={14}
													fontWeight={isActive ? '700' : '500'}
													color={isActive ? group.color : colors.neutral400}
												>
													{group.label}
												</Typo>
											</Button>
										);
									})}
								</View>

								{selectedGroup && (
									<View style={styles.inputContainer}>
										<Typo
											color={colors.neutral200}
											size={16}
											style={{ paddingLeft: 5, marginTop: 10 }}
										>
											Підкатегорія
										</Typo>

										{filteredSubCategories.length > 0 ? (
											<View style={styles.dropdownShadowHolder}>
												<Shadow
													distance={6}
													startColor={lightShadow}
													offset={[-1, -1]}
													stretch
													containerStyle={{ borderRadius: btnRadius }}
													style={[styles.shadowWrapper, { borderRadius: btnRadius }]}
												>
													<Shadow
														distance={8}
														startColor={darkShadow}
														offset={[2, 2]}
														stretch
														style={styles.shadowWrapper}
													>
														<LinearGradient
															colors={gradientColors}
															start={{ x: 0, y: 0 }}
															end={{ x: 1, y: 1 }}
															style={[
																styles.dropdownGradientWrapper,
																{ borderRadius: btnRadius },
															]}
														>
															<Dropdown
																style={[
																	styles.dropdownContainer,
																	{ backgroundColor: 'transparent', borderWidth: 0 },
																]}
																activeColor={colors.gradientStart}
																placeholderStyle={styles.dropdownPlaceholder}
																selectedTextStyle={styles.dropdownSelectedText}
																iconStyle={styles.dropdownIcon}
																maxHeight={300}
																itemTextStyle={styles.dropdownItemText}
																itemContainerStyle={styles.dropdownItemContainer}
																containerStyle={styles.dropdownListContainer}
																data={filteredSubCategories}
																labelField="label"
																valueField="value"
																placeholder={
																	categoriesLoading
																		? 'Завантаження...'
																		: 'Вибрати підкатегорію'
																}
																value={transaction.category}
																onFocus={handleCategorySelectPress}
																onChange={(item) => {
																	setTransaction({
																		...transaction,
																		category: item.value,
																	});
																}}
															/>
														</LinearGradient>
													</Shadow>
												</Shadow>
											</View>
										) : (
											<Typo
												color={colors.neutral400}
												size={14}
												style={{ marginTop: 10, marginLeft: 7 }}
											>
												У цій групі ще немає категорій. Додати?
											</Typo>
										)}

										<TouchableOpacity
											style={styles.flexRow}
											onPress={() => router.push('/(modals)/categoriesModal')}
										>
											<Icons.PlusCircle
												weight="fill"
												color={colors.primaryLight}
												size={verticalScale(33)}
											/>
											<Typo color={colors.neutral500} size={16}>
												Додати підкатегорію витрат
											</Typo>
										</TouchableOpacity>
									</View>
								)}
							</View>
						)}

						<View style={styles.inputContainer}>
							<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 5 }}>
								Дата
							</Typo>

							{!showDatePicker && (
								<View style={[styles.baseBackground, { borderRadius: btnRadius }]}>
									<Shadow
										distance={10}
										startColor={'rgba(0, 0, 0, 0.8)'}
										offset={[3, 3]}
										stretch
										style={styles.fullWidth}
									>
										<Shadow
											distance={8}
											startColor={'rgba(65, 71, 85, 0.4)'}
											offset={[-3, -3]}
											stretch
											style={styles.fullWidth}
										>
											<LinearGradient
												colors={concavedGradientColors}
												start={{ x: 0.5, y: 0 }}
												end={{ x: 0.5, y: 1 }}
												style={[styles.containerDate, { borderRadius: btnRadius }]}
											>
												<Pressable
													style={styles.dateInput}
													onPress={() => setShowDatePicker(true)}
												>
													<Typo size={14}>
														{(transaction.date as Date).toLocaleDateString()}
													</Typo>
												</Pressable>
											</LinearGradient>
										</Shadow>
									</Shadow>
								</View>
							)}

							{showDatePicker && (
								<View style={Platform.OS == 'ios' && styles.iosDatePicker}>
									<DateTimePicker
										themeVariant="dark"
										value={transaction.date as Date}
										textColor={colors.white}
										mode="date"
										display="spinner"
										onChange={onDateChange}
									/>
									{Platform.OS == 'ios' && (
										<TouchableOpacity onPress={() => setShowDatePicker(false)}>
											<Typo size={15} fontWeight={500} color={colors.primary}>
												Ok
											</Typo>
										</TouchableOpacity>
									)}
								</View>
							)}
						</View>

						<View style={styles.inputContainer}>
							<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 5 }}>
								Сума
							</Typo>
							<Pressable onPress={() => setShowCalculator(true)}>
								<View pointerEvents="none">
									<Input placeholder="0" value={transaction.amount?.toString()} editable={false} />
								</View>
							</Pressable>
						</View>

						<View style={[styles.inputContainer, { marginBottom: 30 }]}>
							<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 5 }}>
								Опис
							</Typo>
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
						<Button style={{ marginRight: 5 }} onPress={showDeleteAlert}>
							<Icons.Trash color={colors.rose} size={verticalScale(24)} weight="bold" />
						</Button>
					)}
					<Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
						<Typo fontWeight={'700'} color={colors.primaryLight} size={21}>
							{oldTransaction?.id ? 'Оновити' : 'Створити'}
						</Typo>
					</Button>
				</View>

				<CalculatorModal
					isVisible={showCalculator}
					initialValue={transaction.amount?.toString() || ''}
					onClose={(val) => {
						const numericValue = Number(val.replace(/[^0-9.]/g, ''));
						setTransaction({
							...transaction,
							amount: numericValue,
						});
						setShowCalculator(false);
					}}
				/>
			</KeyboardAvoidingView>
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
	form: {
		gap: spacingY._20,
		marginTop: spacingY._15,
	},
	inputContainer: {
		gap: spacingY._10,
	},
	typeContainer: {
		flexDirection: 'row',
		gap: scale(8),
		paddingHorizontal: 5,
	},
	shadowWrapper: {
		alignSelf: 'stretch',
	},

	dropdownGradientWrapper: {
		overflow: 'hidden',
		height: 56,
		justifyContent: 'center',
	},
	dropdownShadowHolder: {
		paddingHorizontal: 8,
		paddingVertical: 5,
	},
	dropdownContainer: {
		height: verticalScale(54),
		borderWidth: 1,
		paddingHorizontal: spacingX._15,
		borderCurve: 'continuous',
		backgroundColor: '#292e3a',
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
		backgroundColor: colors.gradientEnd,
		borderRadius: radius._15,
		borderCurve: 'continuous',
		paddingVertical: spacingY._7,
		top: 5,
		borderColor: colors.gradientStart,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 1,
		shadowRadius: 15,
		elevation: 5,
	},

	flexRow: {
		flexDirection: 'row',
		gap: 15,
		alignItems: 'center',
		marginTop: 10,
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
	baseBackground: {
		alignSelf: 'stretch',
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.03)',
	},
	fullWidth: {
		alignSelf: 'stretch',
	},
	containerDate: {
		flexDirection: 'row',
		height: verticalScale(54),
		alignItems: 'center',
		gap: spacingX._10,
	},
});
