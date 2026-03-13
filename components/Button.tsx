import { radius } from '@/constants/theme';
import { CustomButtonProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Loading from './Loading';

const Button = ({
	style,
	onPress,
	loading = false,
	children,
}: CustomButtonProps) => {
	const bgColor = '#171717';
	const btnRadius = radius._17;

	if (loading) {
		return (
			<View
				style={[
					styles.button,
					style,
					{ backgroundColor: 'transparent' },
				]}
			>
				<Loading />
			</View>
		);
	}

	return (
		<View style={[styles.container, style]}>
			<Shadow
				distance={7}
				startColor={'#262626'}
				offset={[-2, -2]}
				stretch
				style={[styles.shadowWrapper, { borderRadius: btnRadius }]}
			>
				<Shadow
					distance={7}
					startColor={'#101010'}
					offset={[2, 2]}
					stretch
					style={styles.shadowWrapper}
				>
					<TouchableOpacity
						onPress={onPress}
						activeOpacity={0.8}
						style={[
							styles.button,
							{
								backgroundColor: bgColor,
								borderRadius: btnRadius,
								pointerEvents: 'box-none',
							},
						]}
					>
						{children}
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
	},
	shadowWrapper: {
		alignSelf: 'stretch',
	},
	button: {
		borderRadius: radius._17,
		borderCurve: 'continuous',
		height: verticalScale(52),
		width: '100%',
		paddingHorizontal: 16,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#1B1B1B',
	},
});
