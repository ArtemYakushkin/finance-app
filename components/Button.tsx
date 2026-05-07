import { colors, radius } from '@/constants/theme';
import { CustomButtonProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Loading from './Loading';

const Button = ({ style, onPress, loading = false, children }: CustomButtonProps) => {
	const btnRadius = radius._17;
	const gradientColors: [string, string, ...string[]] = [colors.gradientStart, colors.gradientMid];
	const lightShadow = 'rgba(65, 71, 85, 0.5)';
	const darkShadow = colors.gradientEnd;

	if (loading) {
		return (
			<View style={[styles.button, style, { backgroundColor: 'transparent' }]}>
				<Loading />
			</View>
		);
	}

	return (
		<View style={[styles.container, style]}>
			<Shadow
				distance={6}
				startColor={lightShadow}
				offset={[-1, -1]}
				stretch
				containerStyle={{ borderRadius: btnRadius }}
				style={[styles.shadowWrapper, { borderRadius: btnRadius }]}
			>
				<Shadow distance={8} startColor={darkShadow} offset={[2, 2]} stretch style={styles.shadowWrapper}>
					<TouchableOpacity
						onPress={onPress}
						activeOpacity={0.9}
						style={{ borderRadius: btnRadius, overflow: 'hidden' }}
					>
						<LinearGradient
							colors={gradientColors}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={[styles.button, { borderRadius: btnRadius }]}
						>
							{children}
						</LinearGradient>
					</TouchableOpacity>
				</Shadow>
			</Shadow>
		</View>
	);
};

export default Button;

const styles = StyleSheet.create({
	container: {
		alignSelf: 'stretch',
		margin: 5,
	},
	shadowWrapper: {
		alignSelf: 'stretch',
	},
	button: {
		height: verticalScale(52),
		width: '100%',
		paddingHorizontal: 16,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 0.8,
		borderColor: 'rgba(255, 255, 255, 0.08)',
	},
});
