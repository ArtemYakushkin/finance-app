import Header from '@/components/Header';
import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { scale, verticalScale } from '@/utils/styling';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const barData = [
	{
		value: 40,
		label: 'Mon',
		spacing: scale(4),
		labelWidth: scale(30),
		frontColor: colors.primaryLight,
	},
	{
		value: 20,
		frontColor: colors.rose,
	},
	{
		value: 50,
		label: 'Tue',
		spacing: scale(4),
		labelWidth: scale(30),
		frontColor: colors.primaryLight,
	},
	{
		value: 40,
		frontColor: colors.rose,
	},
	{
		value: 75,
		label: 'Wed',
		spacing: scale(4),
		labelWidth: scale(30),
		frontColor: colors.primaryLight,
	},
	{
		value: 20,
		frontColor: colors.rose,
	},
	{
		value: 60,
		label: 'Fri',
		spacing: scale(4),
		labelWidth: scale(30),
		frontColor: colors.primaryLight,
	},
	{
		value: 40,
		frontColor: colors.rose,
	},
	{
		value: 65,
		label: 'Sat',
		spacing: scale(4),
		labelWidth: scale(30),
		frontColor: colors.primaryLight,
	},
	{
		value: 30,
		frontColor: colors.rose,
	},
	{
		value: 65,
		label: 'Sun',
		spacing: scale(4),
		labelWidth: scale(30),
		frontColor: colors.primaryLight,
	},
	{
		value: 45,
		frontColor: colors.rose,
	},
];

const Statistics = () => {
	const { user } = useAuth();
	const [activeIndex, setActiveIndex] = useState(0);
	const [chartData, setChartData] = useState(barData);
	const [chartLoading, setChartLoading] = useState(false);

	useEffect(() => {
		if (activeIndex == 0) {
			getWeekStats();
		}
		if (activeIndex == 0) {
			getMonthStats();
		}
		if (activeIndex == 0) {
			getYearStats();
		}
	}, [activeIndex]);

	const getWeekStats = async () => {};

	const getMonthStats = async () => {};

	const getYearStats = async () => {};

	return (
		<ScreenWrapper>
			<View style={styles.container}>
				<View style={styles.header}>
					<Header title="Statistics" />
				</View>

				<ScrollView
					contentContainerStyle={{
						gap: spacingY._20,
						paddingTop: spacingY._5,
						paddingBottom: verticalScale(100),
					}}
					showsVerticalScrollIndicator={false}
				>
					<SegmentedControl
						values={['Week', 'Month', 'Year']}
						selectedIndex={activeIndex}
						onChange={(event) => {
							setActiveIndex(
								event.nativeEvent.selectedSegmentIndex,
							);
						}}
						tintColor={colors.neutral200}
						backgroundColor={colors.neutral800}
						appearance="dark"
						activeFontStyle={styles.segmentFontStyle}
						style={styles.segmentStyle}
					/>

					<View style={styles.chartContainer}>
						{chartData.length > 0 ? (
							<BarChart
								data={chartData}
								barWidth={scale(12)}
								spacing={scale(25)}
								roundedTop
								roundedBottom
								hideRules
								yAxisLabelPrefix="$"
								yAxisThickness={0}
								xAxisThickness={0}
								yAxisLabelWidth={scale(25)}
								yAxisTextStyle={{ color: colors.neutral350 }}
								xAxisLabelTextStyle={{
									color: colors.neutral350,
									fontSize: verticalScale(12),
								}}
								noOfSections={3}
							/>
						) : (
							<View style={styles.noChart} />
						)}

						{chartLoading && (
							<View style={styles.chartLoadingContainer}>
								<Loading />
							</View>
						)}
					</View>
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
};

export default Statistics;

const styles = StyleSheet.create({
	chartContainer: {
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
	},
	chartLoadingContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		borderRadius: radius._12,
		backgroundColor: 'rgba(0,0,0,0.6)',
	},
	header: {},
	noChart: {
		backgroundColor: 'rgba(0,0,0,0.6)',
		height: verticalScale(210),
	},
	searchIcon: {
		backgroundColor: colors.neutral700,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 100,
		width: verticalScale(35),
		height: verticalScale(35),
		borderCurve: 'continuous',
	},
	segmentStyle: {
		height: scale(37),
	},
	segmentFontStyle: {
		fontSize: verticalScale(13),
		fontWeight: 'bold',
		color: colors.black,
	},
	container: {
		paddingHorizontal: spacingX._20,
		paddingVertical: spacingY._5,
		gap: spacingY._10,
	},
});
