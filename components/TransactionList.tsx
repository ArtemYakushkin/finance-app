import {
	categoryGroups,
	expenseCategories,
	incomeCategory,
} from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import {
	TransactionItemProps,
	TransactionListType,
	TransactionType,
} from '@/types';
import { verticalScale } from '@/utils/styling';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Loading from './Loading';
import Typo from './Typo';

const TransactionList = ({
	data,
	title,
	loading,
	emptyListMessage,
}: TransactionListType) => {
	const router = useRouter();

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
		<View style={styles.container}>
			{title && (
				<Typo size={20} fontWeight={500}>
					{title}
				</Typo>
			)}

			<View style={styles.list}>
				<FlashList
					data={data}
					renderItem={({ item, index }) => (
						<TransactionItem
							item={item}
							index={index}
							handleClick={handleClick}
						/>
					)}
				/>
			</View>

			{!loading && data.length == 0 && (
				<Typo
					size={15}
					color={colors.neutral400}
					style={{ textAlign: 'center', marginTop: spacingY._15 }}
				>
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

const TransactionItem = ({
	item,
	index,
	handleClick,
}: TransactionItemProps) => {
	// const getCategoryInfo = () => {
	// 	if (item?.type === 'income')
	// 		return { groupLabel: 'Дохід', data: incomeCategory };

	// 	const groupNames: Record<string, string> = {
	// 		needs: 'База',
	// 		desires: 'Хочу',
	// 		saving: 'Резерв',
	// 	};

	// 	for (const group in expenseCategories) {
	// 		const found = expenseCategories[
	// 			group as keyof typeof expenseCategories
	// 		].find((cat) => cat.value === item.category);
	// 		if (found) {
	// 			return {
	// 				groupLabel: groupNames[group] || group,
	// 				data: found,
	// 			};
	// 		}
	// 	}

	// 	return {
	// 		groupLabel: 'Інше',
	// 		data: {
	// 			label: item.category || 'Невідомо',
	// 			icon: null,
	// 			bgColor: colors.neutral500,
	// 		},
	// 	};
	// };
	const getCategoryInfo = () => {
		if (item?.type === 'income')
			return { groupLabel: 'Дохід', data: incomeCategory };

		// 1. Находим, к какой группе относится подкатегория транзакции
		let groupKey = '';
		let subCategory: any = null;

		for (const key in expenseCategories) {
			const found = expenseCategories[
				key as keyof typeof expenseCategories
			].find((cat) => cat.value === item.category);

			if (found) {
				groupKey = key;
				subCategory = found;
				break;
			}
		}

		// 2. Находим данные основной группы (иконку и основной цвет)
		const mainGroup = categoryGroups.find((g) => g.value === groupKey);

		if (mainGroup) {
			return {
				groupLabel: mainGroup.label,
				data: {
					label: subCategory?.label || item.category,
					icon: mainGroup.icon, // БЕРЕМ ИКОНКУ ГРУППЫ (HouseLine, Star, PiggyBank)
					bgColor: mainGroup.color, // БЕРЕМ ЦВЕТ ГРУППЫ
				},
			};
		}

		// Фоллбек, если ничего не найдено
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

	const date = (item?.date as Timestamp)
		?.toDate()
		?.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });

	return (
		<View style={{ marginBottom: spacingY._12 }}>
			<Pressable onPress={() => handleClick(item)}>
				<BlurView intensity={25} tint="dark" style={styles.row}>
					<View
						style={[
							styles.icon,
							{ backgroundColor: category.bgColor },
						]}
					>
						{IconComponent && (
							<IconComponent
								size={verticalScale(25)}
								weight="fill"
								color={colors.white}
							/>
						)}
					</View>

					<View style={styles.categoryDes}>
						<Typo size={17} fontWeight={'600'}>
							{item?.type === 'income'
								? category.label
								: `${groupLabel} / ${category.label}`}
						</Typo>
						<Typo
							size={12}
							color={colors.neutral400}
							textProps={{ numberOfLines: 1 }}
						>
							{item?.description}
						</Typo>
					</View>

					<View style={styles.amountDate}>
						<Typo
							fontWeight={'700'}
							color={
								item?.type == 'income'
									? colors.primary
									: colors.rose
							}
						>
							{`${item?.type == 'income' ? '+₴' : '-₴'} ${item?.amount}`}
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

const styles = StyleSheet.create({
	container: {
		gap: spacingY._17,
	},
	list: {
		minHeight: 3,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: spacingX._12,
		backgroundColor: 'rgba(41, 46, 58, 0.07)',
		padding: spacingY._12,
		borderRadius: radius._17,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
	},
	icon: {
		height: verticalScale(44),
		aspectRatio: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: radius._12,
		borderCurve: 'continuous',
	},
	categoryDes: {
		flex: 1,
		gap: 2.5,
	},
	amountDate: {
		alignItems: 'flex-end',
		gap: 3,
	},
});
