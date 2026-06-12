import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import CalculatorModal from '@/components/CalculatorModal';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { categoryGroups, expenseCategories, transactionTypes } from '@/constants/data';
import { BUTTON_GRADIENT, INPUT_GRADIENT } from '@/constants/gradient';
import { SHADOW_DROPDOWN, SHADOW_INPUT } from '@/constants/shadow';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import useFetchData from '@/hooks/useFetchData';
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService';
import { globalStyles } from '@/styles/global';
import { TransactionType, WalletType } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
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

	const filteredSubCategories = userCategories
		.filter((cat) => cat.group === selectedGroup && cat.type === transaction.type)
		.map((cat) => ({ label: cat.name, value: cat.name }));

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
				<View style={[globalStyles.container, { justifyContent: 'space-between' }]}>
					<Header
						title={oldTransaction?.id ? 'Оновити транзакцію' : 'Нова транзакція'}
						leftIcon={<BackButton />}
					/>

					<ScrollView
						contentContainerStyle={globalStyles.modalForm}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					>
						<View style={{ gap: 10 }}>
							<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 10 }}>
								Тип
							</Typo>
							<View style={globalStyles.modalBtnWrap}>
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

						<View style={{ gap: 10 }}>
							<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 10 }}>
								Гаманець
							</Typo>
							<View style={globalStyles.modalDropdownShadowHolder}>
								<Shadow {...SHADOW_DROPDOWN.light} style={{ borderRadius: 17, alignSelf: 'stretch' }}>
									<Shadow {...SHADOW_DROPDOWN.dark} style={{ alignSelf: 'stretch' }}>
										<LinearGradient
											{...(BUTTON_GRADIENT as any)}
											style={{
												borderRadius: 17,
												overflow: 'hidden',
												height: 56,
												justifyContent: 'center',
											}}
										>
											<Dropdown
												style={[
													globalStyles.modalDropdownContainer,
													{ backgroundColor: 'transparent', borderWidth: 0 },
												]}
												activeColor={colors.gradientStart}
												placeholderStyle={{ color: colors.white }}
												selectedTextStyle={{ color: colors.white, fontSize: 14 }}
												iconStyle={{ height: 30, tintColor: colors.neutral300 }}
												maxHeight={300}
												itemTextStyle={{ color: colors.white }}
												itemContainerStyle={{ borderRadius: 15, marginHorizontal: 7 }}
												containerStyle={{
													backgroundColor: colors.gradientEnd,
													borderRadius: 15,
													borderCurve: 'continuous',
													paddingVertical: 7,
													top: 5,
													borderColor: colors.gradientStart,
													shadowColor: colors.black,
													shadowOffset: { width: 0, height: 5 },
													shadowOpacity: 1,
													shadowRadius: 15,
													elevation: 5,
												}}
												data={wallets.map((wallet) => ({
													label: `${wallet?.name} ($${wallet?.amount})`,
													value: wallet?.id,
												}))}
												labelField="label"
												valueField="value"
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
							<View style={{ gap: 10 }}>
								<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 10 }}>
									Група категорій
								</Typo>
								<View style={globalStyles.modalBtnWrap}>
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
									<View style={{ gap: 10 }}>
										<Typo
											color={colors.neutral200}
											size={16}
											style={{ paddingLeft: 10, marginTop: 10 }}
										>
											Підкатегорія
										</Typo>

										{filteredSubCategories.length > 0 ? (
											<View style={globalStyles.modalDropdownShadowHolder}>
												<Shadow
													{...SHADOW_DROPDOWN.light}
													style={{ borderRadius: 17, alignSelf: 'stretch' }}
												>
													<Shadow {...SHADOW_DROPDOWN.dark} style={{ alignSelf: 'stretch' }}>
														<LinearGradient
															{...(BUTTON_GRADIENT as any)}
															style={{
																borderRadius: 17,
																overflow: 'hidden',
																height: 56,
																justifyContent: 'center',
															}}
														>
															<Dropdown
																style={[
																	globalStyles.modalDropdownContainer,
																	{ backgroundColor: 'transparent', borderWidth: 0 },
																]}
																activeColor={colors.gradientStart}
																placeholderStyle={{ color: colors.white }}
																selectedTextStyle={{
																	color: colors.white,
																	fontSize: 14,
																}}
																iconStyle={{ height: 30, tintColor: colors.neutral300 }}
																maxHeight={300}
																itemTextStyle={{ color: colors.white }}
																itemContainerStyle={{
																	borderRadius: 15,
																	marginHorizontal: 7,
																}}
																containerStyle={{
																	backgroundColor: colors.gradientEnd,
																	borderRadius: 15,
																	borderCurve: 'continuous',
																	paddingVertical: 7,
																	top: 5,
																	borderColor: colors.gradientStart,
																	shadowColor: colors.black,
																	shadowOffset: { width: 0, height: 5 },
																	shadowOpacity: 1,
																	shadowRadius: 15,
																	elevation: 5,
																}}
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
												color={colors.rose}
												size={14}
												style={{ marginTop: 10, paddingLeft: 10 }}
											>
												У цій групі ще немає категорій. Додати?
											</Typo>
										)}

										<TouchableOpacity
											style={globalStyles.modalAddCategory}
											onPress={() => router.push('/(modals)/categoriesModal')}
										>
											<Icons.PlusCircle weight="fill" color={colors.primaryLight} size={33} />
											<Typo color={colors.neutral500} size={16}>
												Додати підкатегорію витрат
											</Typo>
										</TouchableOpacity>
									</View>
								)}
							</View>
						)}

						<View style={{ gap: 10, paddingHorizontal: 5 }}>
							<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 5 }}>
								Дата
							</Typo>

							{!showDatePicker && (
								<View style={globalStyles.modalInputContainer}>
									<Shadow {...SHADOW_INPUT.light} style={{ alignSelf: 'stretch' }}>
										<Shadow {...SHADOW_INPUT.dark} style={{ alignSelf: 'stretch' }}>
											<LinearGradient {...INPUT_GRADIENT} style={globalStyles.modalInputInner}>
												<Pressable
													style={globalStyles.modalInput}
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
								<View>
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

						<View style={{ gap: 10, paddingHorizontal: 5 }}>
							<Typo color={colors.neutral200} size={16} style={{ paddingLeft: 5 }}>
								Сума
							</Typo>
							<Pressable onPress={() => setShowCalculator(true)}>
								<View pointerEvents="none">
									<Input placeholder="0" value={transaction.amount?.toString()} editable={false} />
								</View>
							</Pressable>
						</View>

						<View style={{ gap: 10, paddingHorizontal: 5, marginBottom: 50 }}>
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

				<View style={globalStyles.modalFooter}>
					{oldTransaction?.id && (
						<Button style={{ marginRight: 5 }} onPress={showDeleteAlert}>
							<Icons.Trash color={colors.rose} size={24} weight="bold" />
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
