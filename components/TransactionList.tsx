import { categoryGroups, incomeCategory } from '@/constants/data';
import { colors, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { globalStyles } from '@/styles/global';
import { TransactionItemProps, TransactionListType, TransactionType } from '@/types';
import { getCurrencySymbol } from '@/utils/common';
import { verticalScale } from '@/utils/styling';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Pressable, View } from 'react-native';
import Loading from './Loading';
import Typo from './Typo';

const TransactionList = ({ data, loading, emptyListMessage, filterByMonth = false }: TransactionListType) => {
	const router = useRouter();

	const finalData = filterByMonth
		? data.filter((item) => {
				const transactionDate = (item.date as Timestamp)?.toDate();
				const now = new Date();
				return (
					transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
				);
			})
		: data;

	const handleClick = (item: TransactionType) => {
		router.push({
			pathname: '/(modals)/transactionModal',
			params: {
				id: item?.id,
				type: item?.type,
				amount: item?.amount.toString(),
				category: item?.category,
				date: (item.date as Timestamp)?.toDate()?.toISOString(),
				description: item?.description,
				uid: item?.uid,
				walletId: item?.walletId,
			},
		});
	};

	return (
		<View>
			<FlashList
				data={finalData}
				renderItem={({ item, index }) => (
					<TransactionItem item={item} index={index} handleClick={handleClick} />
				)}
			/>

			{!loading && finalData.length == 0 && (
				<Typo size={15} color={colors.neutral400} style={{ textAlign: 'center', marginTop: spacingY._15 }}>
					{emptyListMessage}
				</Typo>
			)}

			{loading && (
				<View style={{ top: verticalScale(100) }}>
					<Loading />
				</View>
			)}
		</View>
	);
};

const TransactionItem = ({ item, handleClick }: TransactionItemProps) => {
	const { user } = useAuth();
	const currencySymbol = getCurrencySymbol(user?.currency);

	const getCategoryInfo = () => {
		if (item?.type === 'income') return { groupLabel: 'Дохід', data: incomeCategory };

		const mainGroup = categoryGroups.find((g) => g.value === item.categoryGroup);

		if (mainGroup) {
			return {
				groupLabel: mainGroup.label,
				data: {
					label: item.category,
					icon: mainGroup.icon,
					bgColor: mainGroup.color,
				},
			};
		}

		return {
			groupLabel: 'Інше',
			data: {
				label: item.category || 'Невідомо',
				icon: null,
				bgColor: colors.neutral500,
			},
		};
	};

	const { groupLabel, data: category } = getCategoryInfo();
	const IconComponent = category.icon;

	const date = (item?.date as Timestamp)?.toDate()?.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });

	return (
		<View style={{ marginBottom: spacingY._12 }}>
			<Pressable onPress={() => handleClick(item)}>
				<BlurView intensity={25} tint="dark" style={globalStyles.transRow}>
					<View style={[globalStyles.transIcon, { backgroundColor: category.bgColor }]}>
						{IconComponent && <IconComponent size={verticalScale(25)} weight="fill" color={colors.white} />}
					</View>

					<View style={globalStyles.transCategoryDes}>
						<Typo size={17} fontWeight={'600'}>
							{item?.type === 'income' ? category.label : `${groupLabel} / ${category.label}`}
						</Typo>
						<Typo size={12} color={colors.neutral400} textProps={{ numberOfLines: 1 }}>
							{item?.description}
						</Typo>
					</View>

					<View style={globalStyles.transAmountDate}>
						<Typo fontWeight={'700'} color={item?.type == 'income' ? colors.primary : colors.rose}>
							{`${item?.type == 'income' ? `+${currencySymbol}` : `-${currencySymbol}`} ${item?.amount}`}
						</Typo>
						<Typo size={13} color={colors.neutral400}>
							{date}
						</Typo>
					</View>
				</BlurView>
			</Pressable>
		</View>
	);
};

export default TransactionList;
