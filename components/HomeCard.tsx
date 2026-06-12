import { colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import useFetchData from '@/hooks/useFetchData';
import { globalStyles } from '@/styles/global';
import { WalletType } from '@/types';
import { getCurrencySymbol } from '@/utils/common';
import { verticalScale } from '@/utils/styling';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { ImageBackground, View } from 'react-native';
import Typo from './Typo';

const HomeCard = () => {
	const { user } = useAuth();
	const currencySymbol = getCurrencySymbol(user?.currency);

	const {
		data: wallets,
		error,
		loading: walletLoading,
	} = useFetchData<WalletType>(
		'wallets',
		user?.uid ? [where('uid', '==', user?.uid), orderBy('created', 'desc')] : [],
	);

	const getTotals = () => {
		return wallets.reduce(
			(totals: any, item: WalletType) => {
				totals.balance = totals.balance + Number(item.amount);
				totals.income = totals.income + Number(item.totalIncome);
				totals.expenses = totals.expenses + Number(item.totalExpenses);
				return totals;
			},
			{
				balance: 0,
				income: 0,
				expenses: 0,
			},
		);
	};

	return (
		<ImageBackground
			source={require('../assets/images/Cards.png')}
			resizeMode="stretch"
			style={globalStyles.bgImageCard}
		>
			<View style={globalStyles.containerCard}>
				<View>
					<View style={globalStyles.totalBalanceCard}>
						<Typo size={17} fontWeight={500} color={colors.neutral300}>
							Загальний баланс
						</Typo>

						<Icons.DotsThreeOutline size={verticalScale(23)} color={colors.white} weight="fill" />
					</View>
					<Typo size={30} fontWeight={'bold'} color={colors.white}>
						{currencySymbol} {walletLoading ? '----' : getTotals()?.balance?.toFixed(2)}
					</Typo>
				</View>

				<View style={globalStyles.statsCard}>
					<View style={{ gap: 5 }}>
						<View style={globalStyles.incomeExpenseCard}>
							<View style={globalStyles.statsIconCard}>
								<Icons.ArrowUp size={15} color={colors.black} weight="bold" />
							</View>
							<Typo size={16} fontWeight={500} color={colors.neutral300}>
								Дохід
							</Typo>
						</View>
						<View>
							<Typo size={17} fontWeight={600} color={colors.green}>
								{currencySymbol} {walletLoading ? '----' : getTotals()?.income?.toFixed(2)}
							</Typo>
						</View>
					</View>

					<View style={{ gap: 5 }}>
						<View style={globalStyles.incomeExpenseCard}>
							<View style={globalStyles.statsIconCard}>
								<Icons.ArrowDown size={15} color={colors.black} weight="bold" />
							</View>
							<Typo size={16} fontWeight={500} color={colors.neutral300}>
								Витрати
							</Typo>
						</View>
						<View>
							<Typo size={17} fontWeight={600} color={colors.rose}>
								{currencySymbol} {walletLoading ? '----' : getTotals()?.expenses?.toFixed(2)}
							</Typo>
						</View>
					</View>
				</View>
			</View>
		</ImageBackground>
	);
};

export default HomeCard;
