import Header from '@/components/Header';
import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import TransactionList from '@/components/TransactionList';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import {
	fetchMonthStats,
	fetchWeekStats,
	fetchYearStats,
} from '@/services/transactionService';
import { scale, verticalScale } from '@/utils/styling';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Shadow } from 'react-native-shadow-2';

const Statistics = () => {
	const { user } = useAuth();
	const [activeIndex, setActiveIndex] = useState(0);
	const [chartData, setChartData] = useState([]);
	const [chartLoading, setChartLoading] = useState(false);
	const [transactions, setTransactions] = useState([]);

	const gradientColors: [string, string, ...string[]] = [
		colors.gradientStart,
		colors.gradientMid,
	];
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

	return (
		<ScreenWrapper>
			<View style={styles.container}>
				<Header
					title="Статистика"
					style={{ marginBottom: spacingY._10 }}
				/>

				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.segmentedWrapper}>
						<Shadow
							distance={8}
							startColor={lightShadow}
							offset={[-1, -1]}
							stretch
							containerStyle={{ borderRadius: btnRadius }}
							style={[
								styles.shadowWrapper,
								{ borderRadius: btnRadius },
							]}
						>
							<Shadow
								distance={8}
								startColor={darkShadow}
								offset={[3, 3]}
								stretch
								style={styles.shadowWrapper}
							>
								<View
									style={[
										styles.segmentedInner,
										{ backgroundColor: colors.gradientMid },
									]}
								>
									{['Неділя', 'Місяць', 'Рік'].map(
										(label, index) => (
											<TouchableOpacity
												key={label}
												style={styles.segmentBtn}
												onPress={() =>
													setActiveIndex(index)
												}
											>
												{activeIndex === index ? (
													<View
														style={
															styles.activeSegment
														}
													>
														<Text
															style={
																styles.activeText
															}
														>
															{label}
														</Text>
													</View>
												) : (
													<Text
														style={
															styles.inactiveText
														}
													>
														{label}
													</Text>
												)}
											</TouchableOpacity>
										),
									)}
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
							style={[
								styles.shadowWrapper,
								{ borderRadius: btnRadius },
							]}
						>
							<Shadow
								distance={8}
								startColor={darkShadow}
								offset={[3, 3]}
								stretch
								style={styles.shadowWrapper}
							>
								<LinearGradient
									colors={[
										colors.gradientStart,
										colors.gradientMid,
									]}
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
											{!chartLoading && (
												<Text
													style={styles.inactiveText}
												>
													Немає інформації
												</Text>
											)}
										</View>
									)}
									{chartLoading && (
										<View
											style={styles.chartLoadingOverlay}
										>
											<Loading />
										</View>
									)}
								</LinearGradient>
							</Shadow>
						</Shadow>
					</View>

					<TransactionList
						title="Транзакції"
						emptyListMessage="Транзакцій не знайдено"
						data={transactions}
					/>
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
		paddingBottom: verticalScale(120),
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
});
