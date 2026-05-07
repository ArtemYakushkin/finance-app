import Button from '@/components/Button';
import HomeCard from '@/components/HomeCard';
import ScreenWrapper from '@/components/ScreenWrapper';
import TransactionList from '@/components/TransactionList';
import Typo from '@/components/Typo';
import { colors, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import useFetchData from '@/hooks/useFetchData';
import { globalStyles } from '@/styles/global';
import { TransactionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import { limit, orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const Home = () => {
	const { user } = useAuth();
	const router = useRouter();

	const constrains = [where('uid', '==', user?.uid), orderBy('date', 'desc'), limit(30)];

	const {
		data: recentTransactions,
		error,
		loading: transactionsLoading,
	} = useFetchData<TransactionType>('transactions', constrains);

	return (
		<ScreenWrapper>
			<View style={[globalStyles.container, { marginTop: verticalScale(8) }]}>
				<View style={globalStyles.header}>
					<View style={{ gap: 4 }}>
						<Typo size={16} color={colors.neutral400}>
							Привіт,
						</Typo>
						<Typo size={20} fontWeight={500}>
							{user?.name}
						</Typo>
					</View>

					<TouchableOpacity
						onPress={() => router.push('/(modals)/searchModal')}
						style={globalStyles.searchIcon}
					>
						<Icons.MagnifyingGlass size={verticalScale(27)} color={colors.neutral200} weight="bold" />
					</TouchableOpacity>
				</View>

				<ScrollView contentContainerStyle={globalStyles.scrollViewStyle} showsVerticalScrollIndicator={false}>
					<View>
						<HomeCard />
					</View>
					<TransactionList
						data={recentTransactions}
						loading={transactionsLoading}
						filterByMonth={true}
						emptyListMessage="В цьому місяці ще немає тразакцій"
					/>
				</ScrollView>

				<Button style={globalStyles.addButton} onPress={() => router.push('/(modals)/transactionModal')}>
					<Icons.Plus color={colors.primaryLight} weight="bold" size={verticalScale(24)} />
				</Button>
			</View>
		</ScreenWrapper>
	);
};

export default Home;
