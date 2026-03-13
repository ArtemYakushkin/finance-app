import { colors, radius, spacingX } from '@/constants/theme';
import { InputProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const Input = (props: InputProps) => {
	const bgColor = 'rgb(23, 23, 23)';
	const btnRadius = radius._17;

	return (
		<View style={[styles.outerContainer, props.containerStyle]}>
			<View
				style={[
					styles.innerShadowWrapper,
					{ borderRadius: btnRadius, backgroundColor: bgColor },
				]}
			>
				<Shadow
					distance={8}
					startColor={'rgba(0, 0, 0, 0.7)'}
					offset={[4, 4]}
					stretch
					style={styles.fullWidth}
				>
					<Shadow
						distance={8}
						startColor={'rgba(45, 45, 45, 0.4)'}
						offset={[-3, -3]}
						stretch
						style={styles.fullWidth}
					>
						<View style={styles.container}>
							{props.icon && props.icon}
							<TextInput
								style={[styles.input, props.inputStyle]}
								placeholderTextColor={colors.neutral400}
								{...props}
							/>
						</View>
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
	innerShadowWrapper: {
		overflow: 'hidden',
		borderWidth: 1,
	},
	fullWidth: {
		alignSelf: 'stretch',
	},
	container: {
		flexDirection: 'row',
		height: verticalScale(54),
		alignItems: 'center',
		paddingHorizontal: spacingX._15,
		gap: spacingX._10,
	},
	input: {
		flex: 1,
		color: colors.white,
		fontSize: verticalScale(14),
	},
});
