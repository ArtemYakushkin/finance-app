import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const currencies = [
	{ label: 'Гривня', value: 'UAH', symbol: '₴' },
	{ label: 'Долар', value: 'USD', symbol: '$' },
	{ label: 'Євро', value: 'EUR', symbol: '€' },
];

const SettingsModal = () => {
	const { user, updateUser } = useAuth();
	const [selectedCurrency, setSelectedCurrency] = useState(user?.currency || 'UAH');

	const handleCurrencyChange = async (currencyValue: string) => {
		if (!user?.uid) return;

		const res = await updateUser(user.uid, { currency: currencyValue });
		if (res.success) {
			console.log('Валюту успішно оновлено!');
		} else {
			Alert.alert('Помилка', 'не вдалося оновити валюту');
		}
	};

	return (
		<ModalWrapper>
			<View style={styles.container}>
				<Header title="Налаштування" leftIcon={<BackButton />} style={{ marginBottom: spacingY._10 }} />

				<ScrollView contentContainerStyle={styles.scrollContent}>
					{/* Секция Валюты */}
					<View style={styles.section}>
						<Typo size={18} fontWeight="600" style={styles.sectionTitle}>
							Валюта за замовчуванням
						</Typo>

						<View style={styles.optionsCard}>
							{currencies.map((item) => (
								<TouchableOpacity
									key={item.value}
									style={styles.optionItem}
									onPress={() => handleCurrencyChange(item.value)}
								>
									<View style={styles.optionInfo}>
										<Typo size={16}>
											{item.symbol} - {item.label}
										</Typo>
									</View>
									{selectedCurrency === item.value && (
										<Icons.CheckCircle size={24} color={colors.primary} weight="fill" />
									)}
								</TouchableOpacity>
							))}
						</View>
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
	sectionTitle: { marginBottom: spacingY._10, marginLeft: spacingX._5 },
	optionsCard: {
		backgroundColor: '#171921',
		borderRadius: radius._15,
		paddingHorizontal: spacingX._15,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.05)',
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
});
