import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { SHADOW_OPTIONS } from '@/constants/shadow';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { globalStyles } from '@/styles/global';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const currencies = [
	{ label: 'Гривня', value: 'UAH', symbol: '₴' },
	{ label: 'Долар', value: 'USD', symbol: '$' },
	{ label: 'Євро', value: 'EUR', symbol: '€' },
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const SettingsModal = () => {
	const { user, updateUser } = useAuth();

	const handleCurrencyChange = async (currencyValue: string) => {
		if (!user?.uid) return;
		const res = await updateUser(user.uid, { currency: currencyValue });
		if (res.success) {
			console.log('Валюту успішно оновлено!');
		} else {
			Alert.alert('Помилка', 'не вдалося оновити валюту');
		}
	};

	const handleStartDayChange = async (day: number) => {
		if (!user?.uid) return;
		await updateUser(user.uid, { startOfMonth: day });
	};

	return (
		<ModalWrapper>
			<View style={[globalStyles.container, { justifyContent: 'space-between' }]}>
				<Header title="Налаштування" leftIcon={<BackButton />} />

				<ScrollView contentContainerStyle={globalStyles.modalForm}>
					<View style={{ gap: 15 }}>
						<Typo size={18} color={colors.neutral200} style={{ textAlign: 'center' }}>
							Валюта за замовчуванням
						</Typo>

						<View style={{ paddingHorizontal: 10 }}>
							<Shadow {...SHADOW_OPTIONS.light} style={{ borderRadius: 20 }}>
								<Shadow {...SHADOW_OPTIONS.dark} style={{ borderRadius: 20 }}>
									<View style={globalStyles.profileOptions}>
										{currencies.map((item) => (
											<TouchableOpacity
												key={item.value}
												style={globalStyles.settingsItem}
												onPress={() => handleCurrencyChange(item.value)}
											>
												<View style={globalStyles.settingsInfo}>
													<Typo size={18} fontWeight="600">
														{item.symbol} - {item.label}
													</Typo>
												</View>
												{user?.currency === item.value && (
													<Icons.CheckCircle
														size={28}
														color={colors.primaryLight}
														weight="fill"
													/>
												)}
											</TouchableOpacity>
										))}
									</View>
								</Shadow>
							</Shadow>
						</View>
					</View>

					<View style={{ gap: 15 }}>
						<Typo size={18} color={colors.neutral200} style={{ textAlign: 'center' }}>
							Початок фінансового місяця
						</Typo>

						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={globalStyles.settingsDaysScroll}
						>
							{days.map((day) => {
								const isSelected = user?.startOfMonth === day || (!user?.startOfMonth && day === 1);

								return (
									<TouchableOpacity
										key={day}
										onPress={() => handleStartDayChange(day)}
										style={[
											globalStyles.settingsDayButton,
											isSelected && { backgroundColor: colors.primaryLight },
										]}
									>
										<Typo
											fontWeight={isSelected ? '700' : '400'}
											color={isSelected ? colors.black : colors.neutral200}
										>
											{day}
										</Typo>
									</TouchableOpacity>
								);
							})}
						</ScrollView>

						<Typo size={13} color={colors.neutral400}>
							Ваш місячний бюджет та статистика будуть розраховуватися з {user?.startOfMonth || 1}-го
							числа по {user?.startOfMonth ? user.startOfMonth - 1 : 31}-е число наступного місяця.
						</Typo>
					</View>
				</ScrollView>
			</View>
		</ModalWrapper>
	);
};

export default SettingsModal;
