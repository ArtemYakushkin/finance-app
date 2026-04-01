import { colors, radius } from '@/constants/theme';
import { BackButtonProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import { CaretLeftIcon } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { LinearGradient } from 'expo-linear-gradient';

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
	const router = useRouter();
	const bgColor = '#171717';
	const btnRadius = radius._12;
	const gradientColors: [string, string, ...string[]] = [
		colors.gradientStart,
		colors.gradientMid,
	];
	const lightShadow = 'rgba(65, 71, 85, 0.5)';
	const darkShadow = colors.gradientEnd;

	return (
		<View style={[styles.outerContainer, style]}>
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
					<TouchableOpacity
						onPress={(e) => {
							e.currentTarget.blur();

							if (router.canGoBack()) {
								router.back();
							}
						}}
						activeOpacity={0.9}
						style={{ borderRadius: btnRadius, overflow: 'hidden' }}
					>
						<LinearGradient
							colors={gradientColors}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={[styles.button, { borderRadius: btnRadius }]}
						>
							<CaretLeftIcon
								size={verticalScale(iconSize)}
								color={colors.primaryLight}
								weight="bold"
							/>
						</LinearGradient>
					</TouchableOpacity>
				</Shadow>
			</Shadow>
		</View>
	);
};

export default BackButton;

const styles = StyleSheet.create({
	outerContainer: {
		alignSelf: 'flex-start',
		zIndex: 99,
	},
	button: {
		width: verticalScale(45),
		height: verticalScale(45),
		borderRadius: radius._12,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 0.8,
		borderColor: 'rgba(255, 255, 255, 0.08)',
		zIndex: 100,
	},
	shadowWrapper: {
		alignSelf: 'stretch',
	},
});
