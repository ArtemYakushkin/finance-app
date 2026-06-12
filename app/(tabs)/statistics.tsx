import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { categoryGroups } from '@/constants/data';
import { BUTTON_GRADIENT, MAIN_GRADIENT } from '@/constants/gradient';
import { SHADOW_BLOCK } from '@/constants/shadow';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { fetchCategories, fetchMonthStats, fetchYearStats } from '@/services/transactionService';
import { globalStyles } from '@/styles/global';
import { CategoryType, TransactionType } from '@/types';
import { getCurrencySymbol } from '@/utils/common';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Shadow } from 'react-native-shadow-2';

const Statistics = () => {
	const { user } = useAuth();
	const [userCategories, setUserCategories] = useState<CategoryType[]>([]);
	const [activeIndex, setActiveIndex] = useState(1);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<{ stats: any[]; transactions: TransactionType[] }>({
		stats: [],
		transactions: [],
	});

	const currencySymbol = getCurrencySymbol(user?.currency);
	const btnRadius = 17;

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [activeIndex, selectedDate, user?.uid]),
	);

	useEffect(() => {
		loadData();
	}, [activeIndex, selectedDate, user?.uid]);

	useEffect(() => {
		if (user?.uid) {
			loadUserCategories();
		}
	}, [user?.uid]);

	const loadUserCategories = async () => {
		if (!user?.uid) return;
		const res = await fetchCategories(user.uid);
		if (res.success) {
			setUserCategories(res.data as CategoryType[]);
		}
	};

	const loadData = async () => {
		if (!user?.uid) return;
		setLoading(true);
		try {
			let res;
			if (activeIndex === 0) {
				res = await fetchMonthStats(user.uid, selectedDate);
			} else {
				res = await fetchYearStats(user.uid, selectedDate);
			}

			if (res?.success) {
				setData({
					stats: res.data.stats,
					transactions: res.data.transactions || [],
				});
			}
		} catch (error) {
			console.error('Error loading stats:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleMoveDate = (step: number) => {
		const newDate = new Date(selectedDate);
		if (activeIndex === 0) {
			newDate.setMonth(selectedDate.getMonth() + step);
		} else {
			newDate.setFullYear(selectedDate.getFullYear() + step);
		}
		setSelectedDate(newDate);
	};

	const getPeriodText = () => {
		if (activeIndex === 0) {
			return selectedDate.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
		}
		return selectedDate.getFullYear().toString();
	};

	const getPieChartData = () => {
		let totals = { needs: 0, desires: 0, saving: 0 };
		const transactions = data.transactions || [];

		transactions.forEach((item: TransactionType) => {
			if (item.type === 'expense') {
				const amount = Number(item.amount) || 0;
				const foundCat = userCategories.find((c) => c.name === item.category);
				const group = item.categoryGroup || foundCat?.group;

				if (group === 'needs') totals.needs += amount;
				else if (group === 'desires') totals.desires += amount;
				else if (group === 'saving') totals.saving += amount;
			}
		});

		const totalExpense = totals.needs + totals.desires + totals.saving;
		if (totalExpense === 0) return [];

		return [
			{ value: totals.needs, color: '#4a90e2', text: 'База', focused: true },
			{ value: totals.desires, color: '#ef4444', text: 'Хочу' },
			{ value: totals.saving, color: '#a3e635', text: 'Резерв' },
		].filter((i) => i.value > 0);
	};

	const getSubCategoryData = () => {
		const transactions = data.transactions || [];
		const grouped = transactions.reduce(
			(acc, item) => {
				if (item.type === 'expense') {
					const cat = item.category || 'Інше';
					acc[cat] = (acc[cat] || 0) + (Number(item.amount) || 0);
				}
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.keys(grouped)
			.map((catName) => {
				const userCat = userCategories.find((c) => c.name === catName);
				const groupKey = userCat?.group || transactions.find((t) => t.category === catName)?.categoryGroup;
				const mainGroup = categoryGroups.find((g) => g.value === groupKey);

				return {
					name: catName,
					amount: grouped[catName],
					icon: mainGroup?.icon || userCat?.icon,
					color: mainGroup?.color || colors.neutral500,
				};
			})
			.sort((a, b) => b.amount - a.amount);
	};

	const pieData = getPieChartData();
	const subCategories = getSubCategoryData();

	return (
		<ScreenWrapper>
			<View style={globalStyles.container}>
				<Header title="Статистика" />

				<ScrollView contentContainerStyle={globalStyles.statScrollContent} showsVerticalScrollIndicator={false}>
					<View>
						<Shadow {...SHADOW_BLOCK.light} style={{ borderRadius: btnRadius, alignSelf: 'stretch' }}>
							<Shadow {...SHADOW_BLOCK.dark} style={{ alignSelf: 'stretch' }}>
								<View style={globalStyles.statSegmentWrap}>
									{['Місяць', 'Рік'].map((label, index) => (
										<TouchableOpacity
											key={label}
											style={globalStyles.statSegmentBtn}
											onPress={() => setActiveIndex(index)}
										>
											{activeIndex === index ? (
												<View style={globalStyles.statSegmentActive}>
													<Text
														style={{ color: colors.white, fontWeight: '700', fontSize: 13 }}
													>
														{label}
													</Text>
												</View>
											) : (
												<Text
													style={{
														color: colors.neutral400,
														textAlign: 'center',
														fontSize: 13,
													}}
												>
													{label}
												</Text>
											)}
										</TouchableOpacity>
									))}
								</View>
							</Shadow>
						</Shadow>
					</View>

					<View style={globalStyles.statDateWrap}>
						<TouchableOpacity onPress={() => handleMoveDate(-1)}>
							<CaretLeft size={22} color={colors.neutral200} weight="bold" />
						</TouchableOpacity>
						<Typo size={18} fontWeight={'600'} style={{ textTransform: 'capitalize' }}>
							{getPeriodText()}
						</Typo>
						<TouchableOpacity onPress={() => handleMoveDate(1)}>
							<CaretRight size={22} color={colors.neutral200} weight="bold" />
						</TouchableOpacity>
					</View>

					<View>
						<Shadow {...SHADOW_BLOCK.light} style={{ borderRadius: btnRadius, alignSelf: 'stretch' }}>
							<Shadow {...SHADOW_BLOCK.dark} style={{ alignSelf: 'stretch' }}>
								<LinearGradient {...(MAIN_GRADIENT as any)} style={globalStyles.statPieInner}>
									<Typo size={18} fontWeight={'600'} style={{ marginBottom: 20 }}>
										Розподіл витрат
									</Typo>
									{pieData.length > 0 ? (
										<View style={globalStyles.statPieContainer}>
											<PieChart
												data={pieData}
												donut
												showGradient
												radius={100}
												innerRadius={70}
												innerCircleColor={colors.gradientMid}
												centerLabelComponent={() => (
													<View style={{ alignItems: 'center' }}>
														<Typo size={12} color={colors.neutral400}>
															Всього
														</Typo>
														<Typo size={16} fontWeight={'700'}>
															{currencySymbol}
															{pieData
																.reduce((acc, cur) => acc + cur.value, 0)
																.toLocaleString()}
														</Typo>
													</View>
												)}
											/>
											<View style={globalStyles.statPieLegend}>
												{pieData.map((item, idx) => (
													<View key={idx} style={globalStyles.statPieLegendItem}>
														<View
															style={[
																globalStyles.statPieLegendDot,
																{ backgroundColor: item.color },
															]}
														/>
														<Typo size={13} color={colors.neutral300}>
															{item.text}
														</Typo>
														<Typo size={13} fontWeight={'600'}>
															{(
																(item.value /
																	pieData.reduce((a, b) => a + b.value, 0)) *
																100
															).toFixed(1)}
															%
														</Typo>
													</View>
												))}
											</View>
										</View>
									) : (
										<View style={globalStyles.noDataContainer}>
											<Typo color={colors.neutral400}>Немає даних</Typo>
										</View>
									)}
								</LinearGradient>
							</Shadow>
						</Shadow>
					</View>

					<View style={{ gap: 15 }}>
						<Typo size={18} fontWeight={'600'} style={{ textAlign: 'center' }}>
							Деталі
						</Typo>
						{subCategories.map((item, index) => {
							const IconComponent = item.icon;
							return (
								<Shadow
									key={index}
									{...SHADOW_BLOCK.light}
									style={{ borderRadius: btnRadius, alignSelf: 'stretch' }}
								>
									<Shadow {...SHADOW_BLOCK.dark} style={{ alignSelf: 'stretch' }}>
										<LinearGradient
											{...(BUTTON_GRADIENT as any)}
											style={globalStyles.statCategoryCard}
										>
											<View style={globalStyles.statCategoryInfo}>
												<View
													style={[
														globalStyles.statIconWrapper,
														{ backgroundColor: item.color },
													]}
												>
													{IconComponent && (
														<IconComponent size={20} weight="fill" color={colors.white} />
													)}
												</View>
												<Typo size={16} fontWeight={'500'}>
													{item.name}
												</Typo>
											</View>
											<Typo size={16} fontWeight={'700'}>
												{currencySymbol}
												{item.amount.toLocaleString()}
											</Typo>
										</LinearGradient>
									</Shadow>
								</Shadow>
							);
						})}
					</View>
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};

export default Statistics;
