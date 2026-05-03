import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import WalletItem from '@/components/WalletItem';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import useFetchData from '@/hooks/useFetchData';
import { WalletType } from '@/types';
import { getCurrencySymbol } from '@/utils/common';
import { verticalScale } from '@/utils/styling';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

const Wallet = () => {
	const router = useRouter();
	const { user } = useAuth();
	const {
		data: wallets,
		error,
		loading,
	} = useFetchData<WalletType>(
		'wallets',
		user?.uid ? [where('uid', '==', user?.uid), orderBy('created', 'desc')] : [],
	);

	const currencySymbol = getCurrencySymbol(user?.currency);

	const getTotalBalance = () =>
		wallets.reduce((total, item) => {
			total = total + (item.amount || 0);
			return total;
		}, 0);

	return (
		<ScreenWrapper style={{ backgroundColor: colors.black }}>
			<View style={styles.container}>
				<View style={styles.balanceView}>
					<View style={{ alignItems: 'center' }}>
						<Typo size={45} fontWeight={'500'}>
							{currencySymbol}
							{getTotalBalance()?.toFixed(2)}
						</Typo>
						<Typo size={16} color={colors.neutral500}>
							Загальний баланс
						</Typo>
					</View>
				</View>

				<LinearGradient
					colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					locations={[0, 0.45, 1]}
					style={styles.wallets}
				>
					<View style={styles.flexRow}>
						<Typo size={20} fontWeight={'500'}>
							Мої гаманці
						</Typo>
						<TouchableOpacity onPress={() => router.push('/(modals)/walletModal')}>
							<Icons.PlusCircle weight="fill" color={colors.primaryLight} size={verticalScale(33)} />
						</TouchableOpacity>
					</View>

					<FlatList
						data={wallets}
						renderItem={({ item, index }) => <WalletItem item={item} index={index} router={router} />}
						contentContainerStyle={styles.listStyle}
					/>
				</LinearGradient>
			</View>
		</ScreenWrapper>
	);
};

export default Wallet;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},
	balanceView: {
		height: verticalScale(160),
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacingY._10,
	},
	wallets: {
		flex: 1,
		borderTopRightRadius: radius._30,
		borderTopLeftRadius: radius._30,
		padding: spacingX._20,
		paddingTop: spacingX._25,
		borderTopWidth: 2,
		borderTopColor: colors.gradientMid,
	},
	listStyle: {
		paddingVertical: spacingY._25,
		paddingTop: spacingY._15,
	},
});
