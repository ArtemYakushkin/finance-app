import { colors, spacingX, spacingY } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import Typo from './Typo';

const HomeCard = () => {
	return (
		<ImageBackground
			source={require('../assets/images/Cards.png')}
			resizeMode="stretch"
			style={styles.bgImage}
		>
			<View style={styles.container}>
				<View>
					<View style={styles.totalBalanceRow}>
						<Typo
							size={17}
							fontWeight={500}
							color={colors.neutral300}
						>
							Total Balance
						</Typo>

						<Icons.DotsThreeOutline
							size={verticalScale(23)}
							color={colors.white}
							weight="fill"
						/>
					</View>
					<Typo size={30} fontWeight={'bold'} color={colors.white}>
						$256
					</Typo>
				</View>

				<View style={styles.stats}>
					<View style={{ gap: verticalScale(5) }}>
						<View style={styles.incomeExpense}>
							<View style={styles.statsIcon}>
								<Icons.ArrowDown
									size={verticalScale(15)}
									color={colors.black}
									weight="bold"
								/>
							</View>
							<Typo
								size={16}
								fontWeight={500}
								color={colors.neutral300}
							>
								Income
							</Typo>
						</View>
						<View style={{ alignSelf: 'center' }}>
							<Typo
								size={17}
								fontWeight={600}
								color={colors.green}
							>
								$ 651
							</Typo>
						</View>
					</View>

					<View style={{ gap: verticalScale(5) }}>
						<View style={styles.incomeExpense}>
							<View style={styles.statsIcon}>
								<Icons.ArrowUp
									size={verticalScale(15)}
									color={colors.black}
									weight="bold"
								/>
							</View>
							<Typo
								size={16}
								fontWeight={500}
								color={colors.neutral300}
							>
								Expense
							</Typo>
						</View>
						<View style={{ alignSelf: 'center' }}>
							<Typo
								size={17}
								fontWeight={600}
								color={colors.rose}
							>
								$ 651
							</Typo>
						</View>
					</View>
				</View>
			</View>
		</ImageBackground>
	);
};

export default HomeCard;

const styles = StyleSheet.create({
	bgImage: {
		height: scale(220),
		width: '100%',
	},
	container: {
		padding: spacingX._20,
		paddingHorizontal: scale(23),
		height: '87%',
		width: '100%',
		justifyContent: 'space-between',
	},
	totalBalanceRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacingY._5,
	},
	stats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	statsIcon: {
		backgroundColor: colors.neutral350,
		padding: spacingY._5,
		borderRadius: 50,
	},
	incomeExpense: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacingY._7,
	},
});
