import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { categoryGroups } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { fetchCategories, fetchMonthStats, fetchYearStats } from '@/services/transactionService';
import { CategoryType, TransactionType } from '@/types';
import { getCurrencySymbol } from '@/utils/common';
import { scale, verticalScale } from '@/utils/styling';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
	const lightShadow = 'rgba(65, 71, 85, 0.5)';
	const darkShadow = colors.gradientEnd;
	const btnRadius = radius._17;

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
									{['Місяць', 'Рік'].map((label, index) => (
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

					<View style={styles.dateNavigation}>
						<TouchableOpacity onPress={() => handleMoveDate(-1)}>
							<CaretLeft size={verticalScale(22)} color={colors.neutral200} weight="bold" />
						</TouchableOpacity>
						<Typo size={16} fontWeight={'600'} style={{ textTransform: 'capitalize' }}>
							{getPeriodText()}
						</Typo>
						<TouchableOpacity onPress={() => handleMoveDate(1)}>
							<CaretRight size={verticalScale(22)} color={colors.neutral200} weight="bold" />
						</TouchableOpacity>
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
											<View style={styles.legendContainer}>
												{pieData.map((item, idx) => (
													<View key={idx} style={styles.legendItem}>
														<View style={[styles.dot, { backgroundColor: item.color }]} />
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
											<Typo color={colors.neutral400}>Немає даних</Typo>
										</View>
									)}
								</LinearGradient>
							</Shadow>
						</Shadow>
					</View>

					<View style={{ gap: spacingY._15, paddingHorizontal: 10 }}>
						<Typo size={18} fontWeight={'600'} style={{ textAlign: 'center' }}>
							Деталі
						</Typo>
						{subCategories.map((item, index) => {
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
						})}
					</View>
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};

export default Statistics;

const styles = StyleSheet.create({
	container: { flex: 1, paddingHorizontal: spacingX._20 },
	scrollContent: { gap: spacingY._30, paddingTop: spacingY._10, paddingBottom: verticalScale(30) },
	segmentedWrapper: { paddingHorizontal: 10 },
	segmentedInner: { flexDirection: 'row', height: verticalScale(46), borderRadius: radius._15, padding: 4 },
	segmentBtn: { flex: 1, justifyContent: 'center' },
	activeSegment: {
		flex: 1,
		backgroundColor: '#1c1f26',
		borderRadius: radius._12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	activeText: { color: colors.white, fontWeight: '700', fontSize: verticalScale(13) },
	inactiveText: { color: colors.neutral400, textAlign: 'center', fontSize: verticalScale(13) },
	dateNavigation: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
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
	noDataContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 100 },
	shadowWrapper: { alignSelf: 'stretch' },
	pieInner: {
		padding: spacingX._15,
		borderRadius: radius._20,
		minHeight: verticalScale(200),
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.05)',
		alignItems: 'center',
	},
	pieContainer: { alignItems: 'center', gap: 15, width: '100%' },
	legendContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
	legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
	dot: { width: 8, height: 8, borderRadius: 4 },
	categoryCard: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: spacingX._12,
		borderRadius: radius._15,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.05)',
	},
	categoryInfo: { flexDirection: 'row', alignItems: 'center', gap: spacingX._12 },
	iconWrapper: {
		width: verticalScale(40),
		height: verticalScale(40),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: radius._10,
	},
});
