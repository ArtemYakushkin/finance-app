import Header from '@/components/Header';
import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { categoryGroups, expenseCategories } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { fetchMonthStats, fetchWeekStats, fetchYearStats } from '@/services/transactionService';
import { TransactionType } from '@/types';
import { getCurrencySymbol } from '@/utils/common';
import { scale, verticalScale } from '@/utils/styling';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { Shadow } from 'react-native-shadow-2';

const Statistics = () => {
	const { user } = useAuth();
	const [activeIndex, setActiveIndex] = useState(0);
	const [chartData, setChartData] = useState([]);
	const [chartLoading, setChartLoading] = useState(false);
	const [transactions, setTransactions] = useState([]);

	const currencySymbol = getCurrencySymbol(user?.currency);

	const gradientColors: [string, string, ...string[]] = [colors.gradientStart, colors.gradientMid];
	const lightShadow = 'rgba(65, 71, 85, 0.5)';
	const darkShadow = colors.gradientEnd;
	const btnRadius = radius._17;

	useEffect(() => {
		if (!user?.uid) return;

		if (activeIndex == 0) getWeekStats();
		if (activeIndex == 1) getMonthStats();
		if (activeIndex == 2) getYearStats();
	}, [activeIndex, user?.uid]);

	const getWeekStats = async () => {
		setChartLoading(true);
		let res = await fetchWeekStats(user?.uid as string);
		if (res.success) {
			setTransactions(res?.data?.transactions || []);
			setChartData(res?.data?.stats || []);
		} else {
			Alert.alert('Error', res.msg);
		}
		setChartLoading(false);
	};

	const getMonthStats = async () => {
		setChartLoading(true);
		let res = await fetchMonthStats(user?.uid as string);
		if (res.success) {
			setTransactions(res?.data?.transactions || []);
			setChartData(res?.data?.stats || []);
		} else {
			Alert.alert('Error', res.msg);
		}
		setChartLoading(false);
	};

	const getYearStats = async () => {
		setChartLoading(true);
		let res = await fetchYearStats(user?.uid as string);
		if (res.success) {
			setTransactions(res?.data?.transactions || []);
			setChartData(res?.data?.stats || []);
		} else {
			Alert.alert('Error', res.msg);
		}
		setChartLoading(false);
	};

	const getPieChartData = () => {
		let totals = { needs: 0, desires: 0, saving: 0 };

		transactions.forEach((item: TransactionType) => {
			if (item.type === 'expense') {
				if (expenseCategories.needs.some((c) => c.value === item.category)) totals.needs += item.amount;
				else if (expenseCategories.desires.some((c) => c.value === item.category))
					totals.desires += item.amount;
				else if (expenseCategories.saving.some((c) => c.value === item.category)) totals.saving += item.amount;
			}
		});

		const totalExpense = totals.needs + totals.desires + totals.saving;
		if (totalExpense === 0) return [];

		return [
			{
				value: totals.needs,
				color: '#4a90e2',
				text: 'База',
			},
			{ value: totals.desires, color: '#ef4444', text: 'Хочу' },
			{ value: totals.saving, color: '#a3e635', text: 'Резерв' },
		];
	};

	const pieData = getPieChartData();

	const getSubCategoryData = () => {
		const grouped = transactions.reduce(
			(acc, item: TransactionType) => {
				if (item.type === 'expense') {
					const cat = item.category || 'Інше';
					acc[cat] = (acc[cat] || 0) + Number(item.amount);
				}
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.keys(grouped)
			.map((catName) => {
				let groupKey = '';
				let categoryLabel = catName; // По умолчанию, если не найдем перевод

				// 1. Ищем категорию во всех группах, чтобы достать её Label
				for (const key in expenseCategories) {
					const found = expenseCategories[key as keyof typeof expenseCategories].find(
						(c) => c.value === catName,
					);
					if (found) {
						groupKey = key;
						categoryLabel = found.label; // Берем украинское название
						break;
					}
				}

				// 2. Достаем иконку и цвет из основной группы (как и раньше)
				const mainGroup = categoryGroups.find((g) => g.value === groupKey);

				return {
					name: categoryLabel, // Теперь здесь будет украинский текст
					amount: grouped[catName],
					icon: mainGroup?.icon,
					color: mainGroup?.color || colors.neutral500,
				};
			})
			.sort((a, b) => b.amount - a.amount);
	};

	const subCategories = getSubCategoryData();

	return (
		<ScreenWrapper>
			<View style={styles.container}>
				<Header title="Статистика" style={{ marginBottom: spacingY._10 }} />

				<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
					<View style={styles.segmentedWrapper}>
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
								<View style={[styles.segmentedInner, { backgroundColor: colors.gradientMid }]}>
									{['Неділя', 'Місяць', 'Рік'].map((label, index) => (
										<TouchableOpacity
											key={label}
											style={styles.segmentBtn}
											onPress={() => setActiveIndex(index)}
										>
											{activeIndex === index ? (
												<View style={styles.activeSegment}>
													<Text style={styles.activeText}>{label}</Text>
												</View>
											) : (
												<Text style={styles.inactiveText}>{label}</Text>
											)}
										</TouchableOpacity>
									))}
								</View>
							</Shadow>
						</Shadow>
					</View>

					<View style={styles.chartWrapper}>
						<Shadow
							distance={6}
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
								<LinearGradient
									colors={[colors.gradientStart, colors.gradientMid]}
									style={styles.chartInner}
								>
									{chartData.length > 0 ? (
										<BarChart
											data={chartData}
											barWidth={scale(14)}
											spacing={scale(22)}
											roundedTop
											roundedBottom
											hideRules
											showGradient
											yAxisThickness={0}
											xAxisThickness={0}
											yAxisLabelPrefix="$"
											yAxisTextStyle={styles.axisText}
											xAxisLabelTextStyle={{
												...styles.axisText,
												marginBottom: verticalScale(8),
											}}
											initialSpacing={scale(20)}
											endSpacing={scale(20)}
											noOfSections={3}
										/>
									) : (
										<View style={styles.noDataContainer}>
											{!chartLoading && <Text style={styles.inactiveText}>Немає інформації</Text>}
										</View>
									)}
									{chartLoading && (
										<View style={styles.chartLoadingOverlay}>
											<Loading />
										</View>
									)}
								</LinearGradient>
							</Shadow>
						</Shadow>
					</View>

					<View style={styles.chartWrapper}>
						<Shadow
							distance={6}
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
								<LinearGradient
									colors={[colors.gradientStart, colors.gradientMid]}
									style={styles.pieInner}
								>
									<Typo size={18} fontWeight={'600'} style={{ marginBottom: 20 }}>
										Розподіл витрат
									</Typo>

									{pieData.length > 0 ? (
										<View style={styles.pieContainer}>
											<PieChart
												data={pieData}
												donut
												showGradient
												sectionAutoFocus
												radius={100}
												innerRadius={70}
												innerCircleColor={colors.gradientMid}
												centerLabelComponent={() => {
													return (
														<View
															style={{
																justifyContent: 'center',
																alignItems: 'center',
															}}
														>
															<Typo size={14} color={colors.neutral400}>
																Всього
															</Typo>
															<Typo size={18} fontWeight={'700'}>
																{currencySymbol}
																{pieData.reduce((acc, cur) => acc + cur.value, 0)}
															</Typo>
														</View>
													);
												}}
											/>

											<View style={styles.legendContainer}>
												{pieData.map((item, index) => (
													<View key={index} style={styles.legendItem}>
														<View
															style={[
																styles.dot,
																{
																	backgroundColor: item.color,
																},
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
										<View style={styles.noDataContainer}>
											<Typo color={colors.neutral400}>Немає даних для діаграми</Typo>
										</View>
									)}
								</LinearGradient>
							</Shadow>
						</Shadow>
					</View>

					<View style={{ gap: spacingY._15, paddingHorizontal: 10 }}>
						<Typo size={18} fontWeight={'600'} style={{ marginBottom: 5, textAlign: 'center' }}>
							Деталі за категоріями
						</Typo>

						{subCategories.length > 0 ? (
							subCategories.map((item, index) => {
								const IconComponent = item.icon;
								return (
									<Shadow
										key={index}
										distance={6}
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
											<LinearGradient
												colors={[colors.gradientStart, colors.gradientMid]}
												style={styles.categoryCard}
											>
												<View style={styles.categoryInfo}>
													<View style={[styles.iconWrapper, { backgroundColor: item.color }]}>
														{IconComponent && (
															<IconComponent
																size={verticalScale(20)}
																weight="fill"
																color={colors.white}
															/>
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
							})
						) : (
							<Typo color={colors.neutral400} style={{ textAlign: 'center' }}>
								Немає витрат для відображення
							</Typo>
						)}
					</View>
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};

export default Statistics;

const styles = StyleSheet.create({
	container: { flex: 1, paddingHorizontal: spacingX._20 },
	scrollContent: {
		gap: spacingY._30,
		paddingTop: spacingY._10,
		paddingBottom: verticalScale(30),
	},
	segmentedWrapper: { paddingHorizontal: 10 },
	segmentedInner: {
		flexDirection: 'row',
		height: verticalScale(46),
		borderRadius: radius._15,
		padding: 4,
	},
	segmentBtn: { flex: 1, justifyContent: 'center' },
	activeSegment: {
		flex: 1,
		backgroundColor: '#1c1f26',
		borderRadius: radius._12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	activeText: {
		color: colors.white,
		fontWeight: '700',
		fontSize: verticalScale(13),
	},
	inactiveText: {
		color: colors.neutral400,
		textAlign: 'center',
		fontSize: verticalScale(13),
	},
	chartWrapper: { paddingHorizontal: 10 },
	chartInner: {
		paddingTop: verticalScale(30),
		paddingBottom: verticalScale(15),
		paddingRight: scale(10),
		borderRadius: radius._20,
		height: verticalScale(270),
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.05)',
	},
	axisText: { color: colors.neutral400, fontSize: verticalScale(10) },
	chartLoadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(12, 13, 18, 0.8)',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: radius._20,
	},
	noDataContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	shadowWrapper: {
		alignSelf: 'stretch',
	},
	pieInner: {
		padding: spacingX._10,
		borderRadius: radius._20,
		minHeight: verticalScale(200),
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.05)',
		alignItems: 'center',
	},
	pieContainer: {
		alignItems: 'center',
		gap: 10,
	},
	legendContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 12,
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	categoryCard: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: spacingX._10,
		borderRadius: radius._15,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.05)',
	},
	categoryInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacingX._12,
	},
	iconWrapper: {
		width: verticalScale(40),
		height: verticalScale(40),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.03)',
		borderRadius: radius._10,
	},
});
