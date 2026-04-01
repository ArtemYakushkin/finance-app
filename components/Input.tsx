import { colors, radius, spacingX } from '@/constants/theme';
import { InputProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const Input = (props: InputProps) => {
	const btnRadius = radius._17;
	const innerLightShadow = 'rgba(65, 71, 85, 0.4)';
	const innerDarkShadow = 'rgba(0, 0, 0, 0.8)';

	const concavedGradientColors: [string, string] = [
		colors.gradientMid as string,
		colors.gradientEnd as string,
	];

	return (
		<View style={[styles.outerContainer, props.containerStyle]}>
			<View
				style={[
					styles.baseBackground,
					{
						borderRadius: btnRadius,
					},
				]}
			>
				<Shadow
					distance={10}
					startColor={innerDarkShadow}
					offset={[3, 3]}
					stretch
					style={styles.fullWidth}
				>
					<Shadow
						distance={8}
						startColor={innerLightShadow}
						offset={[-3, -3]}
						stretch
						style={styles.fullWidth}
					>
						<LinearGradient
							colors={concavedGradientColors}
							start={{ x: 0.5, y: 0 }}
							end={{ x: 0.5, y: 1 }}
							style={[
								styles.container,
								{ borderRadius: btnRadius },
							]}
						>
							<View style={styles.inputContent}>
								{props.icon && props.icon}
								<TextInput
									style={[styles.input, props.inputStyle]}
									placeholderTextColor={colors.neutral400}
									cursorColor={colors.primary}
									{...props}
								/>
							</View>
						</LinearGradient>
					</Shadow>
				</Shadow>
			</View>
		</View>
	);
};

export default Input;

const styles = StyleSheet.create({
	outerContainer: {
		alignSelf: 'stretch',
	},
	baseBackground: {
		alignSelf: 'stretch',
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.03)',
	},
	fullWidth: {
		alignSelf: 'stretch',
	},
	container: {
		flexDirection: 'row',
		height: verticalScale(54),
		alignItems: 'center',
		gap: spacingX._10,
	},
	inputContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: spacingX._15,
		gap: spacingX._10,
	},
	input: {
		flex: 1,
		color: colors.white,
		fontSize: verticalScale(14),
		paddingVertical: 0,
	},
});
