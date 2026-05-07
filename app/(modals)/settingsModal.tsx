import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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

	const lightShadow = 'rgba(65, 71, 85, 0.5)';
	const darkShadow = colors.gradientEnd;
	const btnRadius = radius._17;

	return (
		<ModalWrapper>
			<View style={styles.container}>
				<Header title="Налаштування" leftIcon={<BackButton />} style={{ marginBottom: spacingY._10 }} />

				<ScrollView contentContainerStyle={styles.scrollContent}>
					<View style={styles.section}>
						<Typo size={18} fontWeight="400" style={styles.sectionTitle}>
							Валюта за замовчуванням
						</Typo>

						<View style={{ marginHorizontal: spacingX._5 }}>
							<Shadow
								distance={8}
								startColor={lightShadow}
								offset={[-1, -1]}
								stretch
								containerStyle={{ borderRadius: btnRadius }}
								style={[styles.shadowWrapper, { borderRadius: btnRadius }]}
							>
								<Shadow
									distance={8}
									startColor={darkShadow}
									offset={[3, 3]}
									stretch
									style={styles.shadowWrapper}
								>
									<View style={styles.optionsCard}>
										{currencies.map((item) => (
											<TouchableOpacity
												key={item.value}
												style={styles.optionItem}
												onPress={() => handleCurrencyChange(item.value)}
											>
												<View style={styles.optionInfo}>
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

					<View style={[styles.section, { marginTop: spacingY._20 }]}>
						<Typo size={18} fontWeight="400" style={styles.sectionTitle}>
							Початок фінансового місяця
						</Typo>

						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.daysScroll}
						>
							{days.map((day) => {
								const isSelected = user?.startOfMonth === day || (!user?.startOfMonth && day === 1);

								return (
									<TouchableOpacity
										key={day}
										onPress={() => handleStartDayChange(day)}
										style={[
											styles.dayButton,
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

						{/* Информационный текст */}
						<Typo size={13} color={colors.neutral400} style={{ marginTop: 10, paddingHorizontal: 5 }}>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: spacingY._20,
	},
	scrollContent: { paddingVertical: spacingY._20 },
	section: { marginBottom: spacingY._25 },
	sectionTitle: { marginBottom: spacingY._20, textAlign: 'center' },
	optionsCard: {
		backgroundColor: '#171921',
		borderRadius: radius._20,
		paddingHorizontal: spacingX._15,
	},
	optionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: verticalScale(15),
		borderBottomWidth: 0.5,
		borderBottomColor: 'rgba(255,255,255,0.05)',
	},
	optionInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
	daysScroll: {
		gap: 10,
		paddingVertical: spacingY._10,
	},
	dayButton: {
		width: verticalScale(45),
		height: verticalScale(45),
		backgroundColor: '#171921',
		borderRadius: radius._12,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.05)',
	},
	shadowWrapper: { alignSelf: 'stretch' },
});
